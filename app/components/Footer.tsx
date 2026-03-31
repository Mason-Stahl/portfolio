"use client"

import React, { useEffect, useRef } from "react"
import { drawRocks } from "../lib/rockCanvas"

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
          // Clip from the top when SVG is taller than 90vh (wide screens).
          // 90vh = distance from mountain-trigger (top: 10% of 100vh section) to bottom.
          maxHeight: "90vh",
          overflow: "hidden",
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