'use client';

import React, { useState, useRef } from 'react';

// instanceId must be unique per page — used to namespace SVG IDs so two
// instances don't share the same mask/filter/gradient references.
export default function XRayLeaf({ instanceId = 'leaf' }: { instanceId?: string }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [pulseOffset, setPulseOffset] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const id = instanceId;
  const xrayRadius = 80;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPulseOffset(prev => (prev - 2 + 100) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // getScreenCTM correctly maps screen coordinates → SVG user-space even when
  // the SVG is inside a CSS-rotated/scaled ancestor (as used in HeroBranch).
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    setMousePos({ x: svgPt.x, y: svgPt.y });
  };

  const leafPath = "M200,50 Q250,100 240,180 Q230,240 200,280 Q170,240 160,180 Q150,100 200,50 Z";

  // Vein endpoints computed to match the leaf bezier boundary exactly:
  //   Right y=150 edge ≈ x=241  |  Right y=180 edge = x=240 (bezier junction)
  //   Left  y=150 edge ≈ x=159  |  Left  y=180 edge = x=160 (bezier junction)
  const veins = [
    "M200,50 L200,280",
    "M200,100 Q225,128 241,150",
    "M200,140 Q225,160 240,180",
    "M200,180 Q218,202 227,230",
    "M200,100 Q175,128 159,150",
    "M200,140 Q175,160 160,180",
    "M200,180 Q182,202 173,230",
  ];

  const circuits = [
    "M200,50 L200,280",
    "M200,100 Q225,128 241,150",
    "M200,140 Q225,160 240,180",
    "M200,180 Q218,202 227,230",
    "M200,100 Q175,128 159,150",
    "M200,140 Q175,160 160,180",
    "M200,180 Q182,202 173,230",
  ];

  const nodes = [
    { cx: 200, cy: 100 },
    { cx: 200, cy: 140 },
    { cx: 200, cy: 180 },
    { cx: 200, cy: 220 },
    { cx: 241, cy: 150 },
    { cx: 240, cy: 180 },
    { cx: 227, cy: 230 },
    { cx: 159, cy: 150 },
    { cx: 160, cy: 180 },
    { cx: 173, cy: 230 },
  ];

  return (
    <svg
      ref={svgRef}
      width="400"
      height="330"
      viewBox="0 0 400 330"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ cursor: 'crosshair', overflow: 'visible', display: 'block' }}
    >
      <defs>
        <mask id={`${id}-xrayMask`}>
          <rect width="400" height="330" fill="white" />
          {isHovering && (
            <circle cx={mousePos.x} cy={mousePos.y} r={xrayRadius} fill="black" />
          )}
        </mask>

        {/* clipPath lives in defs so it's valid SVG and updates with mouse */}
        <clipPath id={`${id}-xrayClip`}>
          <circle cx={mousePos.x} cy={mousePos.y} r={isHovering ? xrayRadius : 0} />
        </clipPath>

        <linearGradient id={`${id}-leafGradient`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>

        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id={`${id}-pulseGlow`}>
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <radialGradient id={`${id}-revealGlow`}>
          <stop offset="70%" stopColor="rgba(96, 165, 250, 0)" />
          <stop offset="85%" stopColor="rgba(96, 165, 250, 0.3)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
        </radialGradient>
      </defs>

      {/* Circuit layer — clipped to the x-ray circle */}
      <g clipPath={`url(#${id}-xrayClip)`}>
        <circle cx={mousePos.x} cy={mousePos.y} r={xrayRadius} fill="#1e1b4b" />
        <path d={leafPath} fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.3" />
        {circuits.map((path, i) => (
          <g key={`circuit-${i}`}>
            <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2" filter={`url(#${id}-glow)`} />
            <path
              d={path}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="3"
              strokeDasharray="10 90"
              strokeDashoffset={pulseOffset + i * 15}
              filter={`url(#${id}-pulseGlow)`}
              opacity="0.9"
            />
          </g>
        ))}
        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            <circle cx={node.cx} cy={node.cy} r="3" fill="#60a5fa" filter={`url(#${id}-glow)`} />
            <circle
              cx={node.cx}
              cy={node.cy}
              r="5"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1"
              opacity={(Math.sin((pulseOffset + i * 10) / 10) + 1) / 3}
            />
          </g>
        ))}
      </g>

      {/* Soft glow ring around the reveal edge */}
      {isHovering && (
        <circle
          cx={mousePos.x}
          cy={mousePos.y}
          r={xrayRadius}
          fill={`url(#${id}-revealGlow)`}
          pointerEvents="none"
        />
      )}

      {/* Natural leaf — masked to hide the x-ray circle */}
      <g mask={`url(#${id}-xrayMask)`}>
        <path d={leafPath} fill={`url(#${id}-leafGradient)`} stroke="#15803d" strokeWidth="2" />
        {veins.map((vein, i) => (
          <path
            key={`vein-${i}`}
            d={vein}
            fill="none"
            stroke="#15803d"
            strokeWidth={i === 0 ? "3" : "1.5"}
            opacity="0.6"
          />
        ))}
      </g>
    </svg>
  );
}
