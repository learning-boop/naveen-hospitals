import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionTemplate, useScroll, useSpring, useTransform } from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1]

/** True once the preloader has lifted — hero entrance effects wait for it. */
export const ReadyContext = createContext(false)
export const useReady = () => useContext(ReadyContext)

export const isReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const VIEWPORT = { once: true, amount: 0.15, margin: '0px 0px -60px 0px' }

/** Fade-and-rise on scroll. `delay` is in steps of 0.1s, like the old .d1/.d2/.d3 classes. */
export function Reveal({ as = 'div', delay = 0, y = 50, children, ...rest }) {
  const M = motion[as]
  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.1, ease: EASE, delay: delay * 0.1 }}
      {...rest}
    >
      {children}
    </M>
  )
}

/**
 * Clip-path wipe from the bottom, for images. A fully clipped element never
 * registers as in view, so the caller decides when to `show` (usually from
 * useInView on a parent).
 */
export function MaskReveal({ as = 'div', show, delay = 0, children, ...rest }) {
  const M = motion[as]
  return (
    <M
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      animate={show ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
      transition={{ duration: 1.4, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </M>
  )
}

/** One line of a headline that slides up out of an overflow mask once `show` is true. */
export function Line({ children, show, delay = 0 }) {
  return (
    <span className="line">
      <motion.span initial={{ y: '110%' }} animate={{ y: show ? 0 : '110%' }} transition={{ duration: 1.3, ease: EASE, delay }}>
        {children}
      </motion.span>
    </span>
  )
}

/** Buttons that lean toward the cursor. */
export function Magnetic({ as = 'a', children, style, ...rest }) {
  const M = motion[as]
  const cfg = { stiffness: 260, damping: 18, mass: 0.4 }
  const x = useSpring(0, cfg)
  const y = useSpring(0, cfg)
  return (
    <M
      style={{ ...style, x, y }}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * 0.25)
        y.set((e.clientY - r.top - r.height / 2) * 0.35)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      {...rest}
    >
      {children}
    </M>
  )
}

/** Counts up to `to` the first time it scrolls into view. */
export function Counter({ to }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, {
      duration: 2.2,
      ease: t => 1 - Math.pow(1 - t, 4),
      onUpdate: v => { if (ref.current) ref.current.textContent = Math.round(v).toLocaleString('en-IN') },
    })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>0</span>
}

/** Section whose curved top edge flattens as it scrolls into place. */
export function CurveSection({ className = '', children, style, ...rest }) {
  const ref = useRef(null)
  const [max, setMax] = useState(140)
  useEffect(() => {
    const f = () => setMax(window.innerWidth < 700 ? 60 : 140)
    f()
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const depth = useTransform(scrollYProgress, [0, 1], [max, 0])
  const ct = useMotionTemplate`${depth}px`
  return (
    <motion.section ref={ref} className={`curve ${className}`} style={{ ...style, '--ct': ct }} {...rest}>
      {children}
    </motion.section>
  )
}
