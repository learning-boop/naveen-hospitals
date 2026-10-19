export default function Brand({ as: Tag = 'a', ...rest }) {
  const props = Tag === 'a'
    ? { href: '#top', 'aria-label': 'Naveen Hospitals — Passion for care, back to top' }
    : { 'aria-hidden': true }
  return (
    <Tag className="brand" {...props} {...rest}>
      <img className="brand-mark" src="/img/logo-mark.png" alt="" width="203" height="400" />
      <span className="brand-text"><b>Naveen Hospitals</b><i className="brand-rule" /><small>Passion for care</small></span>
    </Tag>
  )
}
