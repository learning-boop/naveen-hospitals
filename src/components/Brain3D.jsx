import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useInView } from 'framer-motion'
import * as THREE from 'three'
import { isReducedMotion } from '../lib/motion.jsx'

/*
 * A procedural "neural brain": points scattered over two folded hemispheres,
 * a cerebellum and a brainstem, wired to their nearest neighbours, with
 * signals travelling along the wires. No model files to download.
 *
 *  variant="hero"        — dark backdrop, additive glow, follows the mouse
 *  variant="interactive" — light backdrop, drag to rotate
 */

const THEMES = {
  hero: { a: '#5fe3d3', b: '#5fe0ff', line: '#5fe0ff', lineOpacity: 0.16, pulse: '#9ff5e9', blending: THREE.AdditiveBlending, size: 0.034 },
  interactive: { a: '#0b7d7a', b: '#16246a', line: '#0f1b4c', lineOpacity: 0.14, pulse: '#e2302f', blending: THREE.NormalBlending, size: 0.036 },
}

function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildBrain(count, theme) {
  const rand = rng(7)
  const pts = []
  const push = (x, y, z) => pts.push(new THREE.Vector3(x, y, z))

  // Cerebrum: two hemispheres with gyri-like folds and a fissure down the middle.
  const cortex = Math.round(count * 0.8)
  while (pts.length < cortex) {
    const th = rand() * Math.PI * 2, ph = Math.acos(2 * rand() - 1)
    const dx = Math.sin(ph) * Math.cos(th), dy = Math.cos(ph), dz = Math.sin(ph) * Math.sin(th)
    if (Math.abs(dx) < 0.07 && dy > -0.3) continue
    const side = dx >= 0 ? 1 : -1
    const fold = 1 + 0.07 * Math.sin(9 * th) * Math.sin(8 * ph) + 0.03 * Math.sin(23 * th + 1) * Math.sin(19 * ph)
    const depth = rand() < 0.14 ? 0.45 + rand() * 0.45 : 1
    let x = dx * 0.8 * fold * depth + side * 0.05
    let y = dy * 0.7 * fold * depth + 0.1
    const z = dz * 1.05 * fold * depth
    if (y < -0.28) y = -0.28 + (y + 0.28) * 0.35
    // the temporal lobes hang a little lower toward the front
    if (z > 0.1 && Math.abs(x) > 0.45) y -= 0.08
    push(x, y, z)
  }
  // Cerebellum
  const cb = Math.round(count * 0.14)
  for (let i = 0; i < cb; i++) {
    const th = rand() * Math.PI * 2, ph = Math.acos(2 * rand() - 1)
    const f = 1 + 0.05 * Math.sin(30 * ph)
    push(Math.sin(ph) * Math.cos(th) * 0.55 * f, -0.42 + Math.cos(ph) * 0.2 * f, -0.62 + Math.sin(ph) * Math.sin(th) * 0.3 * f)
  }
  // Brainstem
  while (pts.length < count) {
    const t = rand(), a = rand() * Math.PI * 2, r = 0.09 + rand() * 0.04
    push(Math.cos(a) * r, -0.3 - t * 0.75, -0.22 - t * 0.12 + Math.sin(a) * r)
  }

  // Vertex colours: blend from one brand colour to another, front to back.
  const ca = new THREE.Color(theme.a), cbc = new THREE.Color(theme.b), tmp = new THREE.Color()
  const positions = new Float32Array(pts.length * 3)
  const colors = new Float32Array(pts.length * 3)
  pts.forEach((p, i) => {
    p.toArray(positions, i * 3)
    tmp.copy(ca).lerp(cbc, THREE.MathUtils.clamp((p.z + 1) / 2 + rand() * 0.2 - 0.1, 0, 1))
    tmp.toArray(colors, i * 3)
  })

  // Wire each point to a few nearest neighbours.
  const segs = []
  const MAX = 0.16 * 0.16
  for (let i = 0; i < pts.length; i++) {
    let links = 0
    for (let j = i + 1; j < pts.length && links < 3; j++) {
      if (pts[i].distanceToSquared(pts[j]) < MAX) { segs.push(i, j); links++ }
    }
  }
  const lines = new Float32Array(segs.length * 3)
  for (let k = 0; k < segs.length; k++) pts[segs[k]].toArray(lines, k * 3)

  return { pts, positions, colors, lines, segs }
}

function dotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.4, 'rgba(255,255,255,.85)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Brain({ variant, mouse, drag }) {
  const theme = THEMES[variant]
  const reduce = useMemo(isReducedMotion, [])
  const group = useRef()
  const pulseGeo = useRef()
  const { viewport } = useThree()

  const brain = useMemo(() => buildBrain(variant === 'hero' ? 1500 : 1700, theme), [variant, theme])
  const sprite = useMemo(dotTexture, [])
  const PULSES = reduce ? 0 : 70
  const pulses = useMemo(() => {
    const r = Math.random
    const pick = () => Math.floor(r() * (brain.segs.length / 2)) * 2
    return { pick, list: Array.from({ length: PULSES }, () => ({ s: pick(), t: r(), v: 0.4 + r() * 0.9 })), pos: new Float32Array(Math.max(1, PULSES) * 3) }
  }, [brain, PULSES])

  useEffect(() => () => sprite.dispose(), [sprite])

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    dt = Math.min(dt, 0.05)
    if (variant === 'hero') {
      g.userData.spin = (g.userData.spin || 0) + (reduce ? 0 : dt * 0.12)
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, g.userData.spin + mouse.current.x * 0.5, 0.05)
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.15 + mouse.current.y * 0.18, 0.05)
    } else {
      const d = drag.current
      if (!d.down) {
        d.vy = THREE.MathUtils.lerp(d.vy, reduce ? 0 : 0.0025, 0.03)
        d.vx *= 0.92
      }
      g.rotation.y += d.vy
      g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + d.vx, -0.7, 0.7)
    }

    if (!PULSES || !pulseGeo.current) return
    const { segs, pts } = brain
    const arr = pulses.pos
    pulses.list.forEach((p, i) => {
      p.t += dt * p.v
      if (p.t >= 1) { p.t = 0; p.s = pulses.pick() }
      const a = pts[segs[p.s]], b = pts[segs[p.s + 1]]
      arr[i * 3] = a.x + (b.x - a.x) * p.t
      arr[i * 3 + 1] = a.y + (b.y - a.y) * p.t
      arr[i * 3 + 2] = a.z + (b.z - a.z) * p.t
    })
    pulseGeo.current.attributes.position.needsUpdate = true
  })

  // In the hero the brain sits to the right of the headline.
  const heroPos = [viewport.width * 0.26, viewport.height * 0.12, 0]
  const scale = variant === 'hero' ? Math.min(0.95, viewport.height * 0.3) : Math.min(viewport.width, viewport.height) * 0.34

  return (
    <group ref={group} position={variant === 'hero' ? heroPos : [0, 0.05, 0]} scale={scale} rotation={[0.15, -0.6, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[brain.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[brain.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial map={sprite} size={theme.size} vertexColors transparent depthWrite={false} blending={theme.blending} sizeAttenuation opacity={variant === 'hero' ? 0.9 : 0.85} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[brain.lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={theme.line} transparent opacity={theme.lineOpacity} depthWrite={false} blending={theme.blending} />
      </lineSegments>
      {PULSES > 0 && (
        <points>
          <bufferGeometry ref={pulseGeo}>
            <bufferAttribute attach="attributes-position" args={[pulses.pos, 3]} />
          </bufferGeometry>
          <pointsMaterial map={sprite} color={theme.pulse} size={theme.size * 3.2} transparent depthWrite={false} blending={theme.blending} sizeAttenuation />
        </points>
      )}
    </group>
  )
}

export default function Brain3D({ variant = 'hero', className }) {
  const wrap = useRef(null)
  const inView = useInView(wrap, { amount: 0.05 })
  const mouse = useRef({ x: 0, y: 0 })
  const drag = useRef({ down: false, x: 0, y: 0, vx: 0, vy: 0 })
  const [grabbing, setGrabbing] = useState(false)

  // The hero canvas sits beneath the page content, so listen on the window.
  useEffect(() => {
    if (variant !== 'hero') return
    const f = e => { mouse.current.x = e.clientX / window.innerWidth * 2 - 1; mouse.current.y = e.clientY / window.innerHeight * 2 - 1 }
    window.addEventListener('mousemove', f)
    return () => window.removeEventListener('mousemove', f)
  }, [variant])

  useEffect(() => {
    if (variant !== 'interactive') return
    const move = e => {
      const d = drag.current
      if (!d.down) return
      d.vy = (e.clientX - d.x) * 0.006
      d.vx = (e.clientY - d.y) * 0.004
      d.x = e.clientX; d.y = e.clientY
    }
    const up = () => { drag.current.down = false; setGrabbing(false) }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [variant])

  const onDown = variant === 'interactive' ? e => {
    Object.assign(drag.current, { down: true, x: e.clientX, y: e.clientY })
    setGrabbing(true)
  } : undefined

  return (
    <div
      ref={wrap}
      className={className}
      style={{ position: 'absolute', inset: 0, touchAction: variant === 'interactive' ? 'pan-y' : undefined, cursor: variant === 'interactive' ? (grabbing ? 'grabbing' : 'grab') : undefined }}
      onPointerDown={onDown}
    >
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.4], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        style={{ pointerEvents: variant === 'hero' ? 'none' : 'auto' }}
      >
        <Brain variant={variant} mouse={mouse} drag={drag} />
      </Canvas>
    </div>
  )
}
