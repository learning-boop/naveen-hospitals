import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Counter, CurveSection, EASE } from '../lib/motion.jsx'
import { STATS } from '../data.js'

const ECG = 'M0 80 H260 L280 80 L295 40 L312 130 L330 10 L348 150 L365 80 L395 80 L410 65 L425 80 H760 L780 80 L795 40 L812 130 L830 10 L848 150 L865 80 L895 80 L910 65 L925 80 H1260 L1280 80 L1295 40 L1312 130 L1330 10 L1348 150 L1365 80 L1395 80 L1410 65 L1425 80 H1600'

export default function Stats() {
  const ref = useRef(null)
  // The ECG trace draws itself as the section scrolls past.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const pathLength = useTransform(scrollYProgress, [0, 1 / 1.4], [0, 1])

  return (
    <CurveSection className="stats curve-b" data-dark>
      <svg ref={ref} className="ecg-line" viewBox="0 0 1600 160" preserveAspectRatio="none">
        <motion.path d={ECG} style={{ pathLength }} />
      </svg>
      <div className="wrap stats-grid">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label} className="stat"
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -8, transition: { duration: 0.6, ease: EASE } }}
            transition={{ duration: 1.1, ease: EASE, delay: i * 0.1 }}
          >
            <div className="num"><Counter to={s.value} />{s.plus && <sup>+</sup>}</div>
            <p>{s.label}</p>
          </motion.div>
        ))}
      </div>
    </CurveSection>
  )
}
