import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { EASE } from '../lib/motion.jsx'

const HOVERABLE = 'a,button,.panel,.gi'

export default function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 })
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const move = e => { x.set(e.clientX); y.set(e.clientY) }
    const over = e => setHover(!!e.target.closest?.(HOVERABLE))
    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over) }
  }, [x, y])

  return (
    <>
      <motion.div
        className="cursor"
        style={{ x: sx, y: sy }}
        animate={{ scale: hover ? 2.05 : 1, backgroundColor: hover ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)' }}
        transition={{ duration: 0.35, ease: EASE }}
      />
      <motion.div className="cursor-dot" style={{ x, y }} />
    </>
  )
}
