import { NAV_LINKS } from '../data.js'
import Brand from './Brand.jsx'

export default function Footer() {
  return (
    <footer data-dark>
      <div className="wrap">
        <div className="f-grid">
          <div>
            <Brand />
            <p style={{ marginTop: 20, maxWidth: 320 }}>A multispecialty hospital in the heart of Guntur, serving people with utmost care, compassion and commitment.</p>
          </div>
          <div className="f-links"><h4>Quick links</h4>{NAV_LINKS.map(l => <a key={l.href} href={l.href}>{l.label === 'About' ? 'About Us' : l.label}</a>)}</div>
          <div><h4>Visit</h4><p>Old Bank Road, Lane beside Sai Bhaskar Hospital, Near Vinayaka Temple, Kothapet, Guntur 522001</p></div>
          <div><h4>Location</h4><div className="map"><iframe loading="lazy" title="Map" src="https://www.google.com/maps?q=Naveen+Hospitals+Kothapet+Guntur&output=embed" /></div></div>
        </div>
        <div className="f-bottom"><span>© {new Date().getFullYear()} Naveen Hospitals. All rights reserved.</span><span>Kothapet · Guntur · Andhra Pradesh</span></div>
      </div>
    </footer>
  )
}
