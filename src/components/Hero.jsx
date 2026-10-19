import { useEffect, useRef } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { EASE, Line, Magnetic, isReducedMotion, useReady } from '../lib/motion.jsx'
import { HERO_VIDEO } from '../data.js'

export default function Hero() {
  const ready = useReady()
  const ref = useRef(null)
  const video = useRef(null)

  const { scrollY } = useScroll()
  const innerY = useTransform(scrollY, y => y * 0.25)
  const innerO = useTransform(scrollY, y => Math.max(0, 1 - y / ((ref.current?.offsetHeight || 800) * 0.8)))

  useEffect(() => {
    if (!isReducedMotion()) video.current?.play().catch(() => {})
  }, [])

  // Pause the video once the hero is off screen.
  useMotionValueEvent(scrollY, 'change', y => {
    const v = video.current, h = ref.current?.offsetHeight || 0
    if (!v) return
    if (y > h && !v.paused) v.pause()
    else if (y <= h && v.paused && !isReducedMotion()) v.play().catch(() => {})
  })

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: { duration: 1.2, ease: EASE, delay: 0.5 },
  }

  return (
    <header className="hero" id="top" ref={ref} data-dark>
      <div className="hero-video" aria-hidden="true">
        <motion.video
          ref={video}
          src={HERO_VIDEO}
          muted loop playsInline preload="auto"
          initial={{ opacity: 0, scale: 1.14 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ opacity: { duration: 1.6, ease: EASE }, scale: { duration: 10, ease: 'linear' } }}
        />
      </div>

      <div className="hero-badge">
        <svg viewBox="0 0 150 150">
          <defs><path id="circ" d="M75,75 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0" /></defs>
          <text><textPath href="#circ">24×7 Emergency · Neuro Care · Guntur ·</textPath></text>
        </svg>
        <div className="core">✚</div>
      </div>

      <motion.div className="wrap hero-inner" style={{ y: innerY, opacity: innerO }}>
        <motion.span className="eyebrow" {...fadeUp}><span className="pulse" />Centre for Neurosciences · Guntur</motion.span>
        <h1>
          <Line show={ready}>Where every</Line>
          <Line show={ready} delay={0.12}><em>neuron</em> is met</Line>
          <Line show={ready} delay={0.24}>with care.</Line>
        </h1>
        <motion.div className="hero-row" {...fadeUp}>
          <p>A multispecialty hospital in the heart of Guntur — delivering best‑in‑class neurological treatment, comprehensive epilepsy care and advanced surgery with compassion and commitment, at a reasonable price.</p>
          <div className="hero-cta">
            <Magnetic href="#contact" className="btn btn-red">Book an Appointment <span className="arrow">→</span></Magnetic>
            <Magnetic href="tel:9493438552" className="btn btn-ghost">☎ Emergency</Magnetic>
          </div>
        </motion.div>
      </motion.div>
    </header>
  )
}
