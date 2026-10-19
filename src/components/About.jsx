import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Counter, EASE, MaskReveal, Reveal } from '../lib/motion.jsx'
import { ABOUT_IMAGES } from '../data.js'

function Founder() {
  const inView = { once: true, amount: 0.15 }
  return (
    <motion.article className="founder" initial="hidden" whileInView="shown" viewport={inView}>
      <div className="f-portrait">
        <span className="f-ring" />
        <span className="f-chip">DM · Neurology</span>
        <span className="f-chip two">Founder &amp; CEO</span>
        <motion.div
          className="f-arch"
          variants={{ hidden: { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 28px 28px)' }, shown: { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 28px 28px)' } }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <motion.img
            src={ABOUT_IMAGES.founder} alt="Dr. Naveen Vandanapu, Neurologist and CEO of Naveen Hospitals"
            variants={{ hidden: { scale: 1.15 }, shown: { scale: 1 } }} transition={{ duration: 2.4, ease: EASE }}
          />
        </motion.div>
        <motion.div
          className="f-sig"
          variants={{ hidden: { clipPath: 'inset(0% 100% 0% 0%)' }, shown: { clipPath: 'inset(0% 0% 0% 0%)' } }}
          transition={{ duration: 1.8, ease: EASE, delay: 0.9 }}
        >
          Naveen V.
        </motion.div>
      </div>
      <div className="f-body">
        <Reveal as="span" className="tag">A note from our founder</Reveal>
        <Reveal as="p" delay={1} className="f-quote">
          We strive to give every patient <em>best‑in‑class</em> neurological treatment — with utmost care, compassion and commitment, at a very reasonable price.
        </Reveal>
        <Reveal delay={2} className="f-meta">
          <div><b>Dr. Naveen Vandanapu</b><small>Founder &amp; CEO · Neurologist</small></div>
          <div><span className="cred">MBBS, MD (General Medicine), DM (Neurology)</span><small>Qualifications</small></div>
        </Reveal>
      </div>
    </motion.article>
  )
}

export default function About() {
  const p1 = useRef(null)
  const stack = useRef(null)
  const shown = useInView(stack, { once: true, amount: 0.1 })
  const { scrollYProgress } = useScroll({ target: p1, offset: ['start end', 'end start'] })
  const parallax = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section className="about" id="about">
      <div className="wrap about-grid">
        <div className="photo-stack" ref={stack}>
          <MaskReveal className="p1" ref={p1} show={shown}>
            <motion.img style={{ y: parallax }} src={ABOUT_IMAGES.main} alt="Naveen Hospitals building, Guntur" />
          </MaskReveal>
          <MaskReveal className="p2" show={shown} delay={0.08}>
            <img src={ABOUT_IMAGES.side} alt="Hospital facility" />
          </MaskReveal>
          <div className="stamp"><b><Counter to={24709} /></b><small>HAPPY PATIENTS</small></div>
        </div>
        <div>
          <Reveal as="span" className="tag">Welcome to Naveen Hospitals</Reveal>
          <Reveal as="h2" delay={1} className="serif">Clinical excellence, <em>delivered</em> with a human touch.</Reveal>
          <Reveal as="p" delay={2}>Naveen Hospitals is a multispecialty hospital located in the heart of Guntur city, built to serve people with utmost care, compassion and commitment.</Reveal>
          <Reveal as="p" delay={2}>Our hospital is an epitome of clinical excellence — we strive to provide patients with the best-in-class neurological treatment possible, at a very reasonable price.</Reveal>
        </div>
      </div>
      <div className="wrap"><Founder /></div>
    </section>
  )
}
