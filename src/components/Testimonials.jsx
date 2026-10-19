import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE, Reveal } from '../lib/motion.jsx'
import { TESTIMONIALS } from '../data.js'

const QUOTE_MS = 7000

export default function Testimonials() {
  const [qi, setQi] = useState(0)
  const go = d => setQi(i => (i + d + TESTIMONIALS.length) % TESTIMONIALS.length)
  const q = TESTIMONIALS[qi]

  return (
    <section className="voices">
      <div className="wrap voices-grid">
        <div>
          <Reveal as="span" className="tag">Patient Voices</Reveal>
          <Reveal as="h2" delay={1} className="serif">Healing, in <em>their</em> words.</Reveal>
          <Reveal delay={2} className="qnav">
            <button aria-label="Previous" onClick={() => go(-1)}>←</button>
            <button aria-label="Next" onClick={() => go(1)}>→</button>
            <div className="qbar">
              <motion.i
                key={qi}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: QUOTE_MS / 1000, ease: 'linear' }}
                onAnimationComplete={() => go(1)}
              />
            </div>
          </Reveal>
        </div>
        <div className="qwrap" aria-live="polite">
          <AnimatePresence initial={false}>
            <motion.div key={qi} className="quote" exit={{ opacity: 0, transition: { duration: 0.4 } }}>
              <div className="stars">★★★★★</div>
              <blockquote>
                {q.text.split(' ').map((w, i) => (
                  <span key={i}>
                    <motion.span
                      className="w"
                      initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.8, ease: EASE, delay: i * 0.025 }}
                    >
                      {w}
                    </motion.span>{' '}
                  </span>
                ))}
              </blockquote>
              <motion.cite initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
                <i>{q.name[0]}</i><span>{q.name}<small>{q.role}</small></span>
              </motion.cite>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
