import { Suspense, lazy, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { CurveSection, EASE, Magnetic, Reveal } from '../lib/motion.jsx'
import { Arrow } from './Icons.jsx'
import SafeBoundary from './SafeBoundary.jsx'

const Brain3D = lazy(() => import('./Brain3D.jsx'))

const SPARKS = [
  ['38%', '22%', '0s'], ['57%', '19%', '-.7s'], ['46%', '36%', '-1.4s'], ['63%', '31%', '-2.1s'],
  ['33%', '34%', '-2.8s'], ['47%', '58%', '-1s'], ['52%', '26%', '-3.3s'], ['41%', '46%', '-.3s'],
]

const LINKS = [
  { d: 'M118 128 C118 160 150 178 205 182', dot: [205, 182] },
  { d: 'M540 84 C540 120 470 140 394 140', dot: [394, 140] },
  { d: 'M214 458 C258 452 290 400 297 332', dot: [297, 332] },
]

const CHIPS = [
  { cls: 'c1', label: 'EEG Monitoring', icon: <path d="M2 12h4l2-5 4 10 2-5h8" /> },
  { cls: 'c2', label: 'Neuro Imaging', icon: <><path d="M12 3a7 7 0 0 0-7 7v3l-2 3h3v3a2 2 0 0 0 2 2h3" /><path d="M12 3a7 7 0 0 1 7 7v3l2 3h-3v3a2 2 0 0 1-2 2h-3" /><circle cx="12" cy="11" r="3" /></> },
  { cls: 'c3', label: 'Personalised Care', icon: <><circle cx="12" cy="8" r="3" /><circle cx="5.5" cy="10" r="2.2" /><circle cx="18.5" cy="10" r="2.2" /><path d="M6.5 20a5.5 5.5 0 0 1 11 0" /><path d="M2 19a3.8 3.8 0 0 1 4.3-3.7M22 19a3.8 3.8 0 0 0-4.3-3.7" /></> },
]

const CARDS = [
  { title: 'Accurate Diagnosis', body: 'Detailed evaluation to identify seizure type and underlying causes using advanced tests.', icon: <><path d="M10 6H8v10a8 8 0 0 0 16 0V6h-2" /><path d="M16 24v4a7 7 0 0 0 14 0v-4" /><circle cx="30" cy="21" r="3" /></> },
  { title: 'Advanced Treatment', body: 'Personalised medication plans, surgical options where needed, and the latest therapies.', icon: <><path d="M20 7v26" /><path d="M20 9a5 5 0 0 0-9 1 5 5 0 0 0-3 8 5 5 0 0 0 1 8 5 5 0 0 0 6 5 4 4 0 0 0 5 2" /><path d="M20 9a5 5 0 0 1 9 1 5 5 0 0 1 3 8 5 5 0 0 1-1 8 5 5 0 0 1-6 5 4 4 0 0 1-5 2" /><path d="M14 16c2 0 3 1 3 3M26 16c-2 0-3 1-3 3M13 25c2-1 4 0 4 2M27 25c-2-1-4 0-4 2" /></> },
  { title: 'Lifelong Support', body: 'Continuous follow‑up, lifestyle guidance and support for patients and families.', icon: <><path d="M20 19s-7-4.5-7-9a3.8 3.8 0 0 1 7-2 3.8 3.8 0 0 1 7 2c0 4.5-7 9-7 9z" /><path d="M5 27h6l7 3h7a2 2 0 0 0 0-4h-5" /><path d="M11 25l4-2h4" /><path d="M25 29l8-4a2 2 0 0 0-2-3.5L25 24" /></> },
]

function Illustration({ shown }) {
  const state = shown ? 'shown' : 'hidden'
  return (
    <motion.div className="ns-illustration" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <div className="ns-head">
        <motion.img
          src="/img/brain-head.webp" srcSet="/img/brain-head-640.webp 640w, /img/brain-head.webp 1024w" sizes="(max-width:900px) 90vw, 560px"
          alt="Illustration of a woman in profile with a glowing, translucent brain and spine" width="1024" height="1024"
          initial="hidden" animate={state}
          variants={{ hidden: { opacity: 0, scale: 1.06, filter: 'blur(6px)' }, shown: { opacity: 1, scale: 1, filter: 'blur(0px)' } }}
          transition={{ duration: 1.6, ease: EASE }}
        />
        <span className="ns-core" />
        {SPARKS.map(([x, y, d], i) => <span key={i} className="ns-spark" style={{ '--x': x, '--y': y, '--d': d }} />)}
      </div>
      <svg className="ns-top" viewBox="0 0 640 560" aria-hidden="true">
        {LINKS.map(l => (
          <motion.path key={l.d} className="ns-link" d={l.d} initial="hidden" animate={state} variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1 } }} transition={{ duration: 1.4, ease: EASE, delay: 0.8 }} />
        ))}
        {LINKS.map(({ dot: [cx, cy] }) => (
          <g key={cx}><circle className="ns-dot-ring" cx={cx} cy={cy} r="7" /><circle className="ns-dot" cx={cx} cy={cy} r="6" /></g>
        ))}
      </svg>
    </motion.div>
  )
}

function Stage() {
  const [mode, setMode] = useState('art')
  const ref = useRef(null)
  const shown = useInView(ref, { once: true, amount: 0.25 })
  const state = shown ? 'shown' : 'hidden'
  return (
    <Reveal className="neuro-stage" ref={ref}>
      <svg viewBox="0 0 640 560" aria-hidden="true">
        <defs>
          <radialGradient id="sphereFill" cx="42%" cy="38%" r="65%"><stop offset="0" stopColor="#ffffff" /><stop offset=".55" stopColor="#e6f5f7" /><stop offset="1" stopColor="#bfe2ea" /></radialGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14" /></filter>
        </defs>
        <circle cx="320" cy="280" r="262" fill="none" stroke="#7fc6cf" strokeOpacity=".35" />
        <g className="ns-orbit"><circle cx="320" cy="280" r="236" fill="none" stroke="#5fb8c4" strokeOpacity=".45" strokeDasharray="2 7" /><circle cx="320" cy="44" r="5" fill="#3fb0be" /><circle cx="556" cy="280" r="3.5" fill="#3fb0be" opacity=".7" /></g>
        <g className="ns-orbit rev"><circle cx="84" cy="280" r="4" fill="#9fd8f0" /><circle cx="320" cy="516" r="3" fill="#3fb0be" opacity=".6" /></g>
        <path className="ns-wave" d="M8 280 H70 L82 262 L94 300 L106 220 L118 336 L130 268 L142 290 L154 280 H196" />
        <path className="ns-wave r" d="M444 280 H486 L498 268 L510 296 L522 230 L534 326 L546 262 L558 292 L570 280 H632" />
        <g className="ns-sphere">
          <circle cx="320" cy="290" r="212" fill="#5fe3d3" opacity=".18" filter="url(#soft)" />
          <circle cx="320" cy="280" r="200" fill="url(#sphereFill)" stroke="#fff" strokeWidth="3" />
          <ellipse cx="250" cy="170" rx="110" ry="54" fill="#fff" opacity=".55" transform="rotate(-30 250 170)" />
        </g>
      </svg>

      <AnimatePresence mode="wait" initial={false}>
        {mode === 'art' ? <Illustration key="art" shown={shown} /> : (
          <motion.div key="3d" className="ns-3d" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE }}>
            <SafeBoundary fallback={<p className="ns-3d-hint">3D view isn't supported on this device</p>}>
              <Suspense fallback={<p className="ns-3d-hint">Loading 3D…</p>}>
                <Brain3D variant="interactive" />
              </Suspense>
            </SafeBoundary>
            <span className="ns-3d-hint">Drag to rotate</span>
          </motion.div>
        )}
      </AnimatePresence>

      {CHIPS.map((c, i) => (
        <motion.span
          key={c.cls} className={`ns-chip ${c.cls}`}
          initial="hidden" animate={state}
          variants={{ hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8, ease: EASE, delay: 1 + i * 0.15 }}
        >
          <span style={{ animationDelay: `${-2 * i}s` }}><i><svg viewBox="0 0 24 24">{c.icon}</svg></i>{c.label}</span>
        </motion.span>
      ))}

      <div className="ns-toggle" role="group" aria-label="Brain view">
        {[['art', 'Illustration'], ['3d', '3D']].map(([k, label]) => (
          <button key={k} aria-pressed={mode === k} onClick={() => setMode(k)}>
            {mode === k && <motion.span layoutId="ns-pill" className="pill" transition={{ duration: 0.5, ease: EASE }} />}
            {label}
          </button>
        ))}
      </div>
    </Reveal>
  )
}

export default function Neuro() {
  return (
    <CurveSection className="epi curve-b" id="epilepsy">
      <div className="wrap">
        <div className="epi-grid">
          <Stage />
          <div>
            <Reveal as="span" className="tag">Centre for Neurosciences</Reveal>
            <Reveal as="h2" delay={1} className="serif">Expert care for <em>every mind.</em></Reveal>
            <Reveal as="p" delay={2} className="lead">Comprehensive epilepsy and neurological care in Guntur. Our expert neurosciences team uses advanced diagnostics and personalised treatment plans to manage a wide range of neurological conditions — supporting every patient and family through every stage.</Reveal>
            <Reveal delay={3} className="epi-actions">
              <Magnetic href="#contact" className="btn btn-red">Consult a Specialist <span className="arrow">→</span></Magnetic>
              <a href="#specialities" className="link-arrow">Explore Treatments <Arrow /></a>
            </Reveal>
          </div>
        </div>
        <div className="epi-cards">
          {CARDS.map((c, i) => (
            <Reveal as="a" key={c.title} href="#contact" delay={i} className="ecard" whileHover={{ y: -6, transition: { duration: 0.5, ease: EASE } }}>
              <span className="ic"><svg viewBox="0 0 40 40">{c.icon}</svg></span>
              <span><b>{c.title}</b><small>{c.body}</small></span>
              <span className="go"><Arrow /></span>
            </Reveal>
          ))}
        </div>
      </div>
    </CurveSection>
  )
}
