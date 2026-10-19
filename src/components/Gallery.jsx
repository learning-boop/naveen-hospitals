import { useRef } from 'react'
import { motion, useInView, useSpring } from 'framer-motion'
import { CurveSection, EASE, Reveal } from '../lib/motion.jsx'
import { GALLERY } from '../data.js'

function Tile({ g, i, shown }) {
  const cfg = { stiffness: 160, damping: 18 }
  const rx = useSpring(0, cfg)
  const ry = useSpring(0, cfg)
  return (
    <motion.div
      className="gi"
      data-label={g.label}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      animate={shown ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
      transition={{ duration: 1.4, ease: EASE, delay: i * 0.08 }}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect()
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 10)
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10)
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0) }}
    >
      <img src={g.src} alt={g.alt} style={g.pos ? { objectPosition: g.pos } : undefined} loading="lazy" />
    </motion.div>
  )
}

export default function Gallery() {
  const grid = useRef(null)
  const shown = useInView(grid, { once: true, amount: 0.1 })
  return (
    <CurveSection className="gallery" id="gallery" data-dark>
      <div className="wrap">
        <div className="g-head">
          <div>
            <Reveal as="span" className="tag">Our Photo Gallery</Reveal>
            <Reveal as="h2" delay={1} className="serif">Moments &amp; <em>milestones</em>,<br />beyond the ward.</Reveal>
          </div>
        </div>
        <div className="ggrid" ref={grid}>
          {GALLERY.map((g, i) => <Tile key={g.label} g={g} i={i} shown={shown} />)}
        </div>
      </div>
    </CurveSection>
  )
}
