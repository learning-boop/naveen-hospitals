import { useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { CurveSection, Line, Reveal } from '../lib/motion.jsx'
import { EMAIL, PHONES } from '../data.js'

function BookingForm() {
  const [note, setNote] = useState(null)
  // Demo only — wire this to the hospital's booking backend before launch.
  const submit = e => {
    e.preventDefault()
    const first = e.currentTarget.elements.name.value.trim().split(' ')[0]
    setNote(`Thank you, ${first}! Our team will call you shortly to confirm.`)
    e.currentTarget.reset()
  }
  return (
    <Reveal as="form" delay={1} className="form" onSubmit={submit}>
      <h3>Book an appointment</h3>
      <div className="row">
        <input required placeholder="Full name" name="name" autoComplete="name" />
        <input required placeholder="Phone number" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="row">
        <select name="dept" aria-label="Department">
          <option>Neurology</option><option>Epilepsy Clinic</option><option>General Surgery</option><option>Ophthalmology</option>
        </select>
        <input type="date" name="date" aria-label="Preferred date" />
      </div>
      <button className="btn" type="submit">Request appointment <span className="arrow">→</span></button>
      <div className="note" role="status" style={note ? { color: 'var(--teal)' } : undefined}>
        {note ?? 'Our team will call you back to confirm your slot.'}
      </div>
    </Reveal>
  )
}

export default function Emergency() {
  const big = useRef(null)
  const shown = useInView(big, { once: true, amount: 0.3 })
  return (
    <CurveSection className="emerg curve-b" id="contact" data-dark>
      <div className="wrap">
        <Reveal as="span" className="tag" style={{ color: '#fff' }}>For emergency cases</Reveal>
        <div className="bigtxt" ref={big} style={{ marginTop: 20 }}>
          <Line show={shown}>We're here,</Line>
          <Line show={shown} delay={0.12}><em>day &amp; night.</em></Line>
        </div>
        <div className="emerg-row">
          <Reveal className="phones">
            {PHONES.map(p => <a key={p.tel} href={`tel:${p.tel}`}>{p.label} <span>Call now →</span></a>)}
            <a href={`mailto:${EMAIL}`} style={{ fontSize: 'clamp(20px,2.2vw,30px)' }}>{EMAIL} <span>Email →</span></a>
          </Reveal>
          <BookingForm />
        </div>
      </div>
    </CurveSection>
  )
}
