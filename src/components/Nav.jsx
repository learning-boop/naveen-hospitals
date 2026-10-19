import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { EASE, Magnetic } from '../lib/motion.jsx'
import { NAV_LINKS } from '../data.js'
import Brand from './Brand.jsx'

const CIRCLE = r => `circle(${r} at calc(100% - 40px) 40px)`

export default function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [light, setLight] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', y => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 400 && !open)
    // The nav turns light whenever it sits over a light section.
    const onDark = [...document.querySelectorAll('[data-dark]')].some(s => {
      const r = s.getBoundingClientRect()
      return r.top <= 40 && r.bottom >= 40
    })
    setLight(!onDark)
  })

  return (
    <>
      <motion.nav
        className={`nav${light ? ' light' : ''}`}
        initial={false}
        animate={{ x: '-50%', y: hidden ? '-140%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <Brand />
        <div className="links">
          {NAV_LINKS.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
        </div>
        <Magnetic href="#contact" className="btn btn-red">Book Appointment <span className="arrow">→</span></Magnetic>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>{open ? '✕' : '☰'}</button>
      </motion.nav>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mnav"
            initial={{ clipPath: CIRCLE('0%') }}
            animate={{ clipPath: CIRCLE('150%') }}
            exit={{ clipPath: CIRCLE('0%') }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {NAV_LINKS.map((l, i) => (
              <motion.a
                key={l.href} href={l.href} onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.06 }}
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
