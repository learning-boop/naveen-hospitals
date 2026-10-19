import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { EASE } from '../lib/motion.jsx'

export default function Sos() {
  const { scrollY } = useScroll()
  const [show, setShow] = useState(false)
  useMotionValueEvent(scrollY, 'change', y => setShow(y > window.innerHeight * 0.6))
  return (
    <motion.a
      href="tel:9493438552" className="sos"
      initial={false} animate={{ y: show ? 0 : 120 }} transition={{ duration: 0.7, ease: EASE }}
    >
      <i>☎</i>24×7 Emergency
    </motion.a>
  )
}
