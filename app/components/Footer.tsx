"use client"

import React, { useEffect, useRef } from "react"

// ─── SCENE CONFIG ─────────────────────────────────────────────────────────────
const SCENE = {
  // How far cliffs rise above footer top. '-100%' = fully above, '-50%' = half overlapping.
  landscapeOffset: '-100%',

  deer: {
    height: '62%',
    left: '19%',
    bottom: '25%',
    color: 'white' as 'white' | 'earth',
  },

  footer: {
    paddingY: 'py-12 md:py-8',
  },
}
// ──────────────────────────────────────────────────────────────────────────────

// Seeded pseudo-random number generator (deterministic, no hydration mismatch)
function makeRng(seed: number) {
  let s = seed | 0
  return () => {
    s = (Math.imul(s ^ (s >>> 16), 0x45d9f3b) ^ (s >>> 11)) | 1
    return (s >>> 0) / 0xffffffff
  }
}

// Build a wavy boundary function from 4 stacked sines with random phases/freqs
// so peaks and valleys land at unpredictable x positions
function makeBoundary(baseYFrac: number, ampPx: number, seed: number) {
  const r = makeRng(seed)
  const components = [
    { freq: 0.8 + r() * 0.6,  amp: ampPx * 0.55, phase: r() * Math.PI * 2 },
    { freq: 1.6 + r() * 1.2,  amp: ampPx * 0.28, phase: r() * Math.PI * 2 },
    { freq: 3.1 + r() * 2.0,  amp: ampPx * 0.12, phase: r() * Math.PI * 2 },
    { freq: 6.0 + r() * 3.0,  amp: ampPx * 0.05, phase: r() * Math.PI * 2 },
  ]
  return (x: number, W: number, H: number) => {
    let y = H * baseYFrac
    for (const c of components) {
      y += Math.sin((x / W) * Math.PI * c.freq + c.phase) * c.amp
    }
    return y
  }
}

type BoundaryFn = (x: number, W: number, H: number) => number

// Clip a convex polygon by a half-plane (keep side where (p-p0)·n >= 0)
function clipHalf(
  poly: [number, number][],
  p0x: number, p0y: number,
  nx: number,  ny: number
): [number, number][] {
  if (!poly.length) return []
  const out: [number, number][] = []
  for (let i = 0; i < poly.length; i++) {
    const [ax, ay] = poly[i]
    const [bx, by] = poly[(i + 1) % poly.length]
    const da = (ax - p0x) * nx + (ay - p0y) * ny
    const db = (bx - p0x) * nx + (by - p0y) * ny
    if (da >= 0) out.push([ax, ay])
    if ((da >= 0) !== (db >= 0)) {
      const t = da / (da - db)
      out.push([ax + t * (bx - ax), ay + t * (by - ay)])
    }
  }
  return out
}

// Compute the Voronoi cell for `site` among `others`, clipped to [0,W] x [yMin,yMax]
function voronoiCell(
  site: [number, number],
  others: [number, number][],
  W: number,
  yMin: number,
  yMax: number
): [number, number][] {
  let poly: [number, number][] = [
    [0, yMin], [W, yMin], [W, yMax], [0, yMax],
  ]
  for (const o of others) {
    if (o === site) continue
    const mx = (site[0] + o[0]) / 2
    const my = (site[1] + o[1]) / 2
    const nx = site[0] - o[0]
    const ny = site[1] - o[1]
    poly = clipHalf(poly, mx, my, nx, ny)
    if (!poly.length) break
  }
  return poly
}

function drawRocks(canvas: HTMLCanvasElement, W: number, H: number) {
  const dpr = window.devicePixelRatio || 1
  canvas.width  = W * dpr
  canvas.height = H * dpr
  canvas.style.width  = W + "px"
  canvas.style.height = H + "px"

  const ctx = canvas.getContext("2d")!
  ctx.scale(dpr, dpr)

  // ── Boundary functions (each independently randomised) ──────────────────
  const y0:   BoundaryFn = (_x, _W, _H) => 0
  const y1:   BoundaryFn = makeBoundary(0.20, 10, 101)
  const y2:   BoundaryFn = makeBoundary(0.45, 12, 202)
  const y3:   BoundaryFn = makeBoundary(0.72, 11, 303)
  const yBot: BoundaryFn = (_x, _W, H) => H + 2

  const STEPS = 180

  function traceBand(topFn: BoundaryFn, botFn: BoundaryFn) {
    ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const x = (i / STEPS) * W
      const y = topFn(x, W, H)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    for (let i = STEPS; i >= 0; i--) {
      const x = (i / STEPS) * W
      ctx.lineTo(x, botFn(x, W, H))
    }
    ctx.closePath()
  }

  // ── Base layer fills ────────────────────────────────────────────────────
  const baseLayers = [
    { top: y0, bot: y1,   color: "#5a2a0a" },
    { top: y1, bot: y2,   color: "#4a2208" },
    { top: y2, bot: y3,   color: "#3d1c06" },
    { top: y3, bot: yBot, color: "#2e1304" },
  ]
  for (const l of baseLayers) {
    traceBand(l.top, l.bot)
    ctx.fillStyle = l.color
    ctx.fill()
  }

  // ── TOPSOIL: tiny scattered dots ────────────────────────────────────────
  {
    const r = makeRng(1)
    ctx.save()
    traceBand(y0, y1)
    ctx.clip()
    for (let i = 0; i < 320; i++) {
      const x    = r() * W
      const y    = r() * H * 0.22
      const size = 0.8 + r() * 2.2
      const op   = 0.15 + r() * 0.25
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${120 + (r() * 40) | 0},${90 + (r() * 30) | 0},${60 + (r() * 20) | 0},${op.toFixed(2)})`
      ctx.fill()
    }
    ctx.restore()
  }

  // ── SUBSOIL: small organic ellipses ────────────────────────────────────
  {
    const r = makeRng(2)
    ctx.save()
    traceBand(y1, y2)
    ctx.clip()
    for (let i = 0; i < 180; i++) {
      const x  = r() * W
      const y  = H * 0.18 + r() * H * 0.30
      const rx = 2 + r() * 6
      const ry = rx * (0.5 + r() * 0.6)
      const op = 0.18 + r() * 0.28
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(r() * Math.PI)
      ctx.beginPath()
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${(100 + r() * 30) | 0},${(75 + r() * 25) | 0},${(50 + r() * 20) | 0},${op.toFixed(2)})`
      ctx.fill()
      ctx.restore()
    }
    ctx.restore()
  }

  // ── WEATHERED ROCK: eroded Voronoi cells ───────────────────────────────
  {
    const r    = makeRng(3)
    const yMin = H * 0.38
    const yMax = H * 0.80
    const lH   = yMax - yMin
    const cols = 14, rows = 5
    const cellW = W / cols
    const cellH = lH / rows

    const seeds: [number, number][] = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const xOff = row % 2 === 0 ? 0 : cellW * 0.5
        seeds.push([
          col * cellW + cellW * 0.2 + r() * cellW * 0.6 + xOff,
          yMin + row * cellH + cellH * 0.2 + r() * cellH * 0.6,
        ])
      }
    }

    ctx.save()
    traceBand(y2, y3)
    ctx.clip()

    seeds.forEach((site, si) => {
      const poly = voronoiCell(site, seeds, W, yMin, yMax)
      if (poly.length < 3) return

      const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length
      const cy = poly.reduce((s, p) => s + p[1], 0) / poly.length
      const erosion = 0.76 + r() * 0.1
      const rr  = makeRng(si * 77 + 3000)
      const jAmt = Math.min(cellW, cellH) * 0.12

      const pts = poly.map(([px, py]): [number, number] => [
        cx + (px - cx) * erosion + (rr() - 0.5) * 2 * jAmt,
        cy + (py - cy) * erosion + (rr() - 0.5) * 2 * jAmt,
      ])

      const op = 0.35 + rr() * 0.3
      const b  = (55 + rr() * 35) | 0

      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
      ctx.closePath()
      ctx.fillStyle   = `rgba(${b + 20},${b},${b - 15},${op.toFixed(2)})`
      ctx.strokeStyle = `rgba(${b - 10},${b - 20},${b - 30},0.5)`
      ctx.lineWidth   = 0.6
      ctx.fill()
      ctx.stroke()
    })

    ctx.restore()
  }

  // ── BEDROCK: tight Voronoi, fully interlocked ───────────────────────────
  {
    const r    = makeRng(4)
    const yMin = H * 0.65
    const yMax = H + 10
    const lH   = yMax - yMin
    const cols = 9, rows = 6
    const cellW = W / cols
    const cellH = lH / rows

    const seeds: [number, number][] = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const xOff = row % 2 === 0 ? 0 : cellW * 0.45
        seeds.push([
          col * cellW + cellW * 0.15 + r() * cellW * 0.7 + xOff,
          yMin + row * cellH + cellH * 0.15 + r() * cellH * 0.7,
        ])
      }
    }

    ctx.save()
    traceBand(y3, yBot)
    ctx.clip()

    seeds.forEach((site, si) => {
      const poly = voronoiCell(site, seeds, W, yMin, yMax)
      if (poly.length < 3) return

      const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length
      const cy = poly.reduce((s, p) => s + p[1], 0) / poly.length
      const erosion = 0.88 + r() * 0.06
      const rr   = makeRng(si * 91 + 5000)
      const jAmt = Math.min(cellW, cellH) * 0.04

      const pts = poly.map(([px, py]): [number, number] => [
        cx + (px - cx) * erosion + (rr() - 0.5) * 2 * jAmt,
        cy + (py - cy) * erosion + (rr() - 0.5) * 2 * jAmt,
      ])

      const b  = (70 + rr() * 45) | 0
      const op = 0.75 + rr() * 0.22

      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
      ctx.closePath()

      const grad = ctx.createLinearGradient(
        cx - cellW / 2, cy - cellH / 2,
        cx + cellW / 3, cy + cellH / 2
      )
      grad.addColorStop(0, `rgba(${b + 18},${b + 8},${b - 5},${op.toFixed(2)})`)
      grad.addColorStop(1, `rgba(${b - 10},${b - 18},${b - 28},${(op * 0.8).toFixed(2)})`)

      ctx.fillStyle   = grad
      ctx.strokeStyle = "rgba(20,12,6,0.7)"
      ctx.lineWidth   = 1.2
      ctx.fill()
      ctx.stroke()
    })

    ctx.restore()
  }

  // ── Depth vignette ──────────────────────────────────────────────────────
  const vg = ctx.createLinearGradient(0, 0, 0, H)
  vg.addColorStop(0, "rgba(161, 94, 94, 0)")
  vg.addColorStop(1, "rgba(0,0,0,0.25)")
  ctx.fillStyle = vg
  ctx.fillRect(0, 0, W, H)
}

export default function Footer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  // Rocks canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const footer = footerRef.current
    if (!canvas || !footer) return
    const draw = () => {
      const W = footer.offsetWidth
      const H = footer.offsetHeight
      if (W > 0 && H > 0) drawRocks(canvas, W, H)
    }
    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(footer)
    return () => ro.disconnect()
  }, [])


  return (
    <footer
      ref={footerRef}
      className="text-white relative"
      style={{
        background:
          "linear-gradient(to bottom, #78350f 0%, #5a2a0a 30%, #4a2208 60%, #3a1a06 100%)",
      }}
    >
      {/* Cliffs + deer — in front of mountains */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          transform: `translateY(${SCENE.landscapeOffset})`,
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <div style={{ position: "relative", width: "100%" }}>
          <img src="/images/general/cliff_2.svg" alt="" style={{ width: "100%", display: "block" }} />
          <img
            src="/images/general/deer.svg"
            alt=""
            style={{
              position: "absolute",
              left: SCENE.deer.left,
              bottom: SCENE.deer.bottom,
              height: SCENE.deer.height,
              filter:
                SCENE.deer.color === "earth"
                  ? "sepia(1) saturate(1.2) brightness(0.62)"
                  : undefined,
              transform: "scaleX(-1)",
            }}
          />
        </div>
      </div>

      {/* Rock layer canvas — fills the full footer */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Depth gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.80) 100%)",
        }}
      />

      {/* Content */}
      <div
        className={`max-w-7xl mx-auto px-8 md:px-16 relative z-10 ${SCENE.footer.paddingY}`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/images/general/logo_white.png"
              alt="Mason Stahl"
              style={{ width: 150, height: 150, objectFit: "contain" }}
            />
          </div>

          {/* Right side */}
          <div className="flex-1 md:text-right space-y-6">
            <blockquote className="text-2xl md:text-3xl font-light italic leading-relaxed">
              "the intersection of nature and technology"
            </blockquote>
            <div className="text-sm md:text-base space-y-2 text-amber-100">
              <p>
                <a
                  href="mailto:masonstahl50@gmail.com"
                  className="hover:underline"
                >
                  masonstahl50@gmail.com
                </a>
              </p>
              <p>
                <a href="tel:+19089630225" className="hover:underline">
                  (908) 963-0225
                </a>
              </p>
              <p>
                <a
                  href="https://linkedin.com/in/mason-stahl2024"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline inline-flex items-center gap-1"
                >
                  LinkedIn Profile
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}