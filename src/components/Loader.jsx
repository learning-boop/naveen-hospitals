import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE, isReducedMotion } from '../lib/motion.jsx'
import Brand from './Brand.jsx'

export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const tick = setInterval(() => setPct(p => Math.min(100, p + Math.ceil(Math.random() * 9))), 60)
    let t
    const finish = () => { clearInterval(tick); setDone(true); onDone() }
    const onLoad = () => { t = setTimeout(finish, isReducedMotion() ? 0 : 1500) }
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })
    const fallback = setTimeout(finish, 4000)
    return () => { clearInterval(tick); clearTimeout(t); clearTimeout(fallback); window.removeEventListener('load', onLoad) }
  }, [onDone])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loader"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <div>
            <motion.div className="logo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}>
              <Brand as="div" />
            </motion.div>
            <svg viewBox="0 0 420 90">
              <motion.path
                d="M0 45 H120 L135 45 L145 20 L158 75 L172 5 L186 85 L198 45 L215 45 L225 35 L235 45 H420"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: EASE }}
              />
            </svg>
            <div className="pct">{pct}%</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
