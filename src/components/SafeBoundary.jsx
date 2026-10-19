import { Component } from 'react'

/** Renders `fallback` (nothing by default) if a child throws — keeps a WebGL failure from blanking the page. */
export default class SafeBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(err) { console.warn('3D scene disabled:', err) }
  render() { return this.state.failed ? (this.props.fallback ?? null) : this.props.children }
}
