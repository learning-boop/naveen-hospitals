import { motion } from 'framer-motion'
import { MARQUEE } from '../data.js'

export default function Marquee() {
  return (
    <div className="marquee">
      <motion.div className="track" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 30, ease: 'linear', repeat: Infinity }}>
        {[...MARQUEE, ...MARQUEE].map((t, i) => <span key={i} aria-hidden={i >= MARQUEE.length || undefined}>{t}</span>)}
      </motion.div>
    </div>
  )
}
