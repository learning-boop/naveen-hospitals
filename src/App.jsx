import { useCallback, useEffect, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Lenis from 'lenis'
import { ReadyContext, isReducedMotion } from './lib/motion.jsx'
import Loader from './components/Loader.jsx'
import Cursor from './components/Cursor.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import About from './components/About.jsx'
import Stats from './components/Stats.jsx'
import Specialities from './components/Specialities.jsx'
import Neuro from './components/Neuro.jsx'
import Testimonials from './components/Testimonials.jsx'
import Gallery from './components/Gallery.jsx'
import Emergency from './components/Emergency.jsx'
import Footer from './components/Footer.jsx'
import Sos from './components/Sos.jsx'

export default function App() {
  const [ready, setReady] = useState(false)
  const onLoaded = useCallback(() => setReady(true), [])
  const lenis = useRef(null)

  // Smooth wheel scrolling; touch devices keep native scrolling.
  useEffect(() => {
    if (isReducedMotion()) return
    const l = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenis.current = l
    let id = requestAnimationFrame(function raf(t) { l.raf(t); id = requestAnimationFrame(raf) })
    return () => { cancelAnimationFrame(id); l.destroy(); lenis.current = null }
  }, [])

  // In-page anchors glide instead of jumping.
  useEffect(() => {
    const onClick = e => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      const el = id.length > 1 ? document.querySelector(id) : document.getElementById('top')
      if (!el) return
      e.preventDefault()
      if (lenis.current) lenis.current.scrollTo(el, { offset: id === '#top' ? 0 : -20, duration: 1.6 })
      else el.scrollIntoView({ behavior: isReducedMotion() ? 'auto' : 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <ReadyContext.Provider value={ready}>
        <Loader onDone={onLoaded} />
        <Cursor />
        <Nav />
        <Hero />
        <Marquee />
        <About />
        <Stats />
        <Specialities />
        <Neuro />
        <Testimonials />
        <Gallery />
        <Emergency />
        <Footer />
        <Sos />
      </ReadyContext.Provider>
    </MotionConfig>
  )
}
