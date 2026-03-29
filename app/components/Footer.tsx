"use client"

import React, { useEffect, useState } from "react"

export default function Footer() {
  const [stones, setStones] = useState<React.ReactElement[]>([])

  useEffect(() => {
    const _stones: React.ReactElement[] = []

    // CONFIG
    const CONFIG = {
      vertexCounts: [5, 6, 7],
      radiusRange: [35, 55],
      angleVariance: 25,
      borderRadius: 3,
      blur: 0.4,
      rotationRange: 16,
      baseXRandomness: 3,
      baseYRandomness: 3,
      layers: [
        { yStart: 48, yEnd: 62, count: 22, w: [32,45], h: [18,26], opacity: [0.16,0.22], color: "52,44,38", rowHeight:8,  xOffset:10, spacing:4.8 },
        { yStart: 62, yEnd: 78, count: 35, w: [48,68], h: [28,40], opacity: [0.19,0.25], color: "58,48,41", rowHeight:10, xOffset:14, spacing:4.2 },
        { yStart: 78, yEnd: 98, count:110, w: [58,85], h: [36,52], opacity: [0.22,0.28], color: "48,40,35", rowHeight:9,  xOffset:18, spacing:3.8 }
      ]
    }

    // polygon generator
    const generatePolygon = (vertices: number): string => {
      const points: string[] = []
      const angleStep = 360 / vertices
      for (let i = 0; i < vertices; i++) {
        const angle =
          (i * angleStep + (Math.random() - 0.5) * CONFIG.angleVariance) *
          (Math.PI / 180)
        const radius =
          CONFIG.radiusRange[0] +
          Math.random() * (CONFIG.radiusRange[1] - CONFIG.radiusRange[0])
        const x = Math.max(10, Math.min(90, 50 + radius * Math.cos(angle)))
        const y = Math.max(10, Math.min(90, 50 + radius * Math.sin(angle)))
        points.push(`${x}% ${y}%`)
      }
      return points.join(", ")
    }

    const polygonShapes = CONFIG.vertexCounts.flatMap(v => [
      generatePolygon(v),
      generatePolygon(v)
    ])
    const shapeCount = polygonShapes.length

    CONFIG.layers.forEach((layer, layerIdx) => {
      let yPos = layer.yStart
      let rowIndex = 0
      let stoneCount = 0

      const xRand = CONFIG.baseXRandomness / (layerIdx + 1)
      const yRand = CONFIG.baseYRandomness / (layerIdx + 1)
      const rotHalf = CONFIG.rotationRange / 2

      while (yPos < layer.yEnd && stoneCount < layer.count) {
        const xBase = rowIndex % 2 === 0 ? 0 : -layer.xOffset
        let currentX = xBase

        while (currentX < 105 && stoneCount < layer.count) {
          const w = layer.w[0] + Math.random() * (layer.w[1] - layer.w[0])
          const h = layer.h[0] + Math.random() * (layer.h[1] - layer.h[0])
          const shapeIndex = Math.floor(Math.random() * shapeCount)
          const opacity =
            layer.opacity[0] +
            Math.random() * (layer.opacity[1] - layer.opacity[0])
          const rotation =
            -rotHalf + Math.random() * CONFIG.rotationRange

          _stones.push(
            <div
              key={`stone-${layerIdx}-${stoneCount}`}
              className="absolute"
              style={{
                width: w,
                height: h,
                left: `${currentX}%`,
                top: `${yPos}%`,
                backgroundColor: `rgba(${layer.color},${opacity.toFixed(2)})`,
                clipPath: `polygon(${polygonShapes[shapeIndex]})`,
                transform: `rotate(${rotation.toFixed(1)}deg)`,
                borderRadius: `${CONFIG.borderRadius}px`,
                filter: `blur(${CONFIG.blur}px)`,
                willChange: "transform"
              }}
            />
          )

          currentX += w / layer.spacing + Math.random() * xRand
          stoneCount++
        }

        yPos += layer.rowHeight + Math.random() * yRand
        rowIndex++
      }
    })

    setStones(_stones)
  }, [])

  return (
    <footer
      className="text-white py-12 md:py-16 relative"
      style={{
        background:
          "linear-gradient(to bottom, #78350f 0%, #5a2a0a 30%, #4a2208 60%, #3a1a06 100%)"
      }}
    >
      {/* Depth gradient */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.32) 100%)"
          }}
        />
        {stones}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 md:px-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo placeholder */}
          <div className="flex-shrink-0">
            <div className="w-64 h-64 bg-amber-800 flex items-center justify-center rounded-lg">
              <span className="text-amber-600 text-sm">250×250 Logo</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex-1 md:text-right space-y-6">
            <blockquote className="text-2xl md:text-3xl font-light italic leading-relaxed">
              "the intersection of nature and technology"
            </blockquote>
            <div className="text-sm md:text-base space-y-2 text-amber-100">
              <p>
                <a href="mailto:mason@example.com" className="hover:underline">
                  mason@example.com
                </a>
              </p>
              <p>
                <a href="tel:+15551234567" className="hover:underline">
                  (555) 123-4567
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
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
