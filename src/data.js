const SITE = 'https://www.naveenhospitals.com/img'

export const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#specialities', label: 'Departments' },
  { href: '#epilepsy', label: 'Neurosciences' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
]

export const HERO_VIDEO = '/video/hero.mp4'

export const MARQUEE = ['Neurology', 'Epilepsy Care', 'General Surgery', 'Ophthalmology', 'Day‑Care Procedures', '24×7 Emergency']

export const ABOUT_IMAGES = {
  main: `${SITE}/slider/youtube-thumbnail.jpg`,
  side: `${SITE}/gallery/gallery2.jpg`,
  founder: `${SITE}/d1.jpg`,
}

export const STATS = [
  { value: 5932, plus: true, label: 'SURGERIES PERFORMED' },
  { value: 24709, plus: true, label: 'HAPPY PATIENTS' },
  { value: 13, plus: false, label: 'QUALITY DOCTORS' },
]

export const DEPARTMENTS = [
  {
    name: 'Neurology',
    sub: 'Brain · Spine · Nerves',
    kicker: 'Flagship · Centre for Neurosciences',
    img: 'https://images.unsplash.com/photo-1758691463110-697a814b2033?w=1600&q=80&auto=format&fit=crop',
    imgPos: '50% 35%',
    body: 'Comprehensive care for disorders of the brain, spine and nervous system — delivered by a multidisciplinary team with the best available technology.',
    tags: ['Epilepsy', 'Stroke', 'Headache & Migraine', 'Spine', 'Movement Disorders'],
    doc: { name: 'Dr. Naveen Vandanapu', role: 'Neurologist · DM (Neurology)', img: `${SITE}/d1.jpg` },
  },
  {
    name: 'General Surgery',
    sub: 'Day‑care · Advanced',
    kicker: '40+ years of combined experience',
    img: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?w=1600&q=80&auto=format&fit=crop',
    imgPos: '50% 40%',
    body: 'The whole spectrum of surgical care — from the simplest procedures to complex advanced surgeries — with day‑care options in sophisticated operation theatres.',
    tags: ['Day‑care Surgery', 'Laparoscopic', 'Advanced Procedures'],
    doc: { name: 'Dr. V. Lakshman', role: 'Surgeon · M.S. (Gen), F.R.S.H. (London)', img: `${SITE}/d2.jpg` },
  },
  {
    name: 'Ophthalmology',
    sub: 'Vision · Eye surgery',
    kicker: 'First‑class eye care',
    img: 'https://images.unsplash.com/photo-1766310549795-dd0fc75d499f?w=1600&q=80&auto=format&fit=crop',
    imgPos: '55% 50%',
    body: 'Accurate diagnostics for vision problems and surgical treatment for complex conditions of the eye, all under one roof.',
    tags: ['Vision Diagnostics', 'Eye Surgery', 'Complex Conditions'],
    doc: { name: 'Dr. Pavani T', role: 'Ophthalmologist · MS (Ophthalmology)', img: `${SITE}/d3.jpg` },
  },
]

export const TESTIMONIALS = [
  { text: 'We are very happy that our dad is recovering very well. We were so impressed with the cleanliness of the hospital and the lovely staff — so caring and kind, with beautiful smiles on their faces.', name: 'Vani Potru', role: 'Patient family' },
  { text: 'This is one hospital that truly cares for patients. The treatment, diagnosis and the way my mother was cared for is admirable. She is feeling much better now.', name: 'K N', role: 'Patient family' },
  { text: 'The best hospital for neurology ailments. From the lab to the lift, nursing to housekeeping — the staff is polite and helpful, and the doctor makes patients feel comfortable before every procedure.', name: 'Pavani', role: 'Patient' },
]

export const GALLERY = [
  { label: 'Operation theatre', src: `${SITE}/slider/slide2-3.jpg`, alt: 'Surgeons in the operation theatre', pos: '12% 50%' },
  { label: 'Recognition', src: `${SITE}/gallery/gallery1.jpg`, alt: 'Award ceremony' },
  { label: 'CME sessions', src: `${SITE}/gallery/gallery3.jpg`, alt: 'Medical education session' },
  { label: 'Awards', src: `${SITE}/gallery/gallery4.jpg`, alt: 'Award presentation' },
  { label: 'Our team', src: `${SITE}/gallery/gallery5.jpg`, alt: 'Hospital team group photo' },
  { label: 'Conferences', src: `${SITE}/gallery/gallery6.jpg`, alt: 'Medical conference' },
]

export const PHONES = [
  { tel: '9493438552', label: '94934 38552' },
  { tel: '7989938145', label: '79899 38145' },
]
export const EMAIL = 'contactdrnaveen@gmail.com'
