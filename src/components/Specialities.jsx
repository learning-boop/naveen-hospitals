import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { EASE, Reveal, isReducedMotion } from '../lib/motion.jsx'
import { DEPARTMENTS } from '../data.js'

const PANEL_MS = 6000

const FEATURES = [
  { title: 'Day‑care surgeries', sub: 'Home the same day', icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></> },
  { title: 'Modern theatres', sub: 'Trained support staff', icon: <><path d="M4 20h16M6 20V9l6-5 6 5v11" /><path d="M12 11v6M9 14h6" /></> },
  { title: 'NABL‑accredited lab', sub: 'Reliable diagnostics', icon: <><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" /><path d="M7.5 15h9" /></> },
  { title: 'NABH blood bank', sub: 'Safe, on‑site supply', icon: <><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" /><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5" /></> },
]

function useWide() {
  const [wide, setWide] = useState(true)
  useEffect(() => {
    const m = window.matchMedia('(min-width: 900px)')
    const f = () => setWide(m.matches)
    f(); m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return wide
}

/** Headline whose words rise out of a mask, one after another, with a soft blur. */
function SplitHeading({ lines }) {
  const ref = useRef(null)
  const shown = useInView(ref, { once: true, amount: 0.4 })
  let n = 0
  return (
    <h2 ref={ref} className="sp-title">
      {lines.map((line, li) => (
        <span key={li} className="sp-line">
          {line.map(([word, accent], wi) => {
            const i = n++
            return (
              <span key={wi} className="sp-word">
                <motion.span
                  className={accent ? 'sp-accent' : undefined}
                  initial={{ y: '105%', rotate: 4, filter: 'blur(8px)' }}
                  animate={shown ? { y: '0%', rotate: 0, filter: 'blur(0px)' } : undefined}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.08 * i }}
                >
                  {word}
                </motion.span>
              </span>
            )
          })}
        </span>
      ))}
    </h2>
  )
}

/** Content inside an open panel — each piece arrives in sequence. */
const bodyV = {
  hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
}
const itemV = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)', transition: { duration: 0.25 } },
  shown: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
}
const tagsV = { hidden: {}, shown: { transition: { staggerChildren: 0.05 } } }
const tagV = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  shown: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 22 } },
}

function Panel({ d, i, active, onOpen, autoplay, onDone }) {
  const hoverT = useRef()
  // Cursor-driven spotlight and image drift.
  const mx = useMotionValue(0.5), my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 120, damping: 20 }), sy = useSpring(my, { stiffness: 120, damping: 20 })
  const imgX = useTransform(sx, [0, 1], ['2.5%', '-2.5%'])
  const imgY = useTransform(sy, [0, 1], ['2.5%', '-2.5%'])
  const gx = useTransform(sx, v => `${v * 100}%`), gy = useTransform(sy, v => `${v * 100}%`)
  const glow = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, rgba(95,227,211,.28), transparent 60%)`

  return (
    <motion.article
      className={`panel${active ? ' active' : ''}`}
      tabIndex={0}
      aria-label={d.name}
      aria-expanded={active}
      initial={false}
      animate={{ flexGrow: active ? 3.4 : 1 }}
      transition={{ duration: 0.9, ease: EASE }}
      onMouseEnter={() => { clearTimeout(hoverT.current); hoverT.current = setTimeout(() => !active && onOpen(i), 120) }}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height)
      }}
      onMouseLeave={() => { clearTimeout(hoverT.current); mx.set(0.5); my.set(0.5) }}
      onClick={() => !active && onOpen(i)}
      onFocus={() => !active && onOpen(i)}
    >
      <motion.img className="bg" src={d.img} alt="" style={{ x: imgX, y: imgY, objectPosition: d.imgPos }} loading="lazy" />
      <div className="shade" /><div className="shade on" />
      <motion.div className="p-glow" style={{ background: glow }} />
      {active && <motion.span key="shine" className="p-shine" initial={{ x: '-120%' }} animate={{ x: '220%' }} transition={{ duration: 1.4, ease: EASE, delay: 0.2 }} />}
      {active && autoplay && (
        <motion.span
          className="p-bar"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: PANEL_MS / 1000, ease: 'linear' }}
          onAnimationComplete={onDone}
        />
      )}
      <span className="p-num">{String(i + 1).padStart(2, '0')}<em>/{String(DEPARTMENTS.length).padStart(2, '0')}</em></span>
      <span className="p-plus" aria-hidden="true">+</span>
      <h3 className="p-vert">{d.name}<small>{d.sub}</small></h3>
      <motion.div className="p-body" initial={false} animate={active ? 'shown' : 'hidden'} variants={bodyV} style={{ pointerEvents: active ? 'auto' : 'none' }}>
        <motion.span variants={itemV} className="p-kicker">{d.kicker}</motion.span>
        <motion.h3 variants={itemV} className="p-title">{d.name}</motion.h3>
        <motion.p variants={itemV}>{d.body}</motion.p>
        <motion.ul variants={tagsV} className="p-tags">{d.tags.map(t => <motion.li key={t} variants={tagV}>{t}</motion.li>)}</motion.ul>
        <motion.div variants={itemV} className="p-foot">
          <div className="doc"><img src={d.doc.img} alt={d.doc.name} /><div><b>{d.doc.name}</b><small>{d.doc.role}</small></div></div>
          <a href="#contact" className="btn btn-red">Book a visit <span className="arrow">→</span></a>
        </motion.div>
      </motion.div>
    </motion.article>
  )
}

function Feature({ f, i }) {
  const ref = useRef(null)
  const shown = useInView(ref, { once: true, amount: 0.6 })
  return (
    <Reveal delay={i} className="feat" whileHover={{ y: -6, transition: { duration: 0.5, ease: EASE } }}>
      <i ref={ref}>
        <svg viewBox="0 0 24 24">
          {/* each stroke draws itself in when the card comes into view */}
          {[].concat(f.icon.props.children).map((el, k) => (
            <motion.path
              key={k}
              {...(el.type === 'circle' ? { d: circlePath(el.props) } : el.props)}
              initial={{ pathLength: 0 }}
              animate={shown ? { pathLength: 1 } : undefined}
              transition={{ duration: 1.2, ease: EASE, delay: 0.3 + i * 0.1 + k * 0.15 }}
            />
          ))}
        </svg>
      </i>
      <div><b>{f.title}</b><small>{f.sub}</small></div>
    </Reveal>
  )
}

const circlePath = ({ cx, cy, r }) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`

export default function Specialities() {
  const [pi, setPi] = useState(0)
  const [paused, setPaused] = useState(false)
  const wrap = useRef(null)
  const section = useRef(null)
  const inView = useInView(wrap, { amount: 0.4 })
  const wide = useWide()
  const autoplay = inView && !paused && wide && !isReducedMotion()

  // The oversized outline word drifts sideways as the section scrolls by.
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] })
  const ghostX = useTransform(scrollYProgress, [0, 1], ['8%', '-28%'])

  return (
    <section className="spec" id="specialities" ref={section}>
      <motion.div className="sp-ghost" aria-hidden="true" style={{ x: ghostX }}>Specialities</motion.div>
      <div className="wrap spec-head">
        <div>
          <Reveal as="span" className="tag">Our Specialities</Reveal>
          <SplitHeading lines={[[['Dedicated'], ['departments,', true]], [['one'], ['standard'], ['of'], ['care.']]]} />
        </div>
        <Reveal delay={3} className="sp-lead">
          <p>Experienced specialists, modern operation theatres and trained support staff — from the simplest procedures to the most complex advanced surgeries.</p>
          <div className="sp-dots" aria-hidden="true">
            {DEPARTMENTS.map((d, i) => (
              <button key={d.name} tabIndex={-1} className={i === pi ? 'on' : ''} onClick={() => setPi(i)}>
                <span>{String(i + 1).padStart(2, '0')}</span>{d.name}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
      <div className="wrap">
        <Reveal delay={2} className="panels" ref={wrap} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {DEPARTMENTS.map((d, i) => (
            <Panel
              key={d.name} d={d} i={i}
              active={i === pi || !wide}
              onOpen={setPi}
              autoplay={autoplay && i === pi}
              onDone={() => setPi(p => (p + 1) % DEPARTMENTS.length)}
            />
          ))}
        </Reveal>
        <div className="spec-feats">
          {FEATURES.map((f, i) => <Feature key={f.title} f={f} i={i} />)}
        </div>
        <Reveal className="spec-cta">
          <div><b>Not sure which department you need?</b><span>Our care team will guide you to the right specialist.</span></div>
          <a href="#contact" className="btn">Talk to our care team <span className="arrow">→</span></a>
        </Reveal>
      </div>
    </section>
  )
}
