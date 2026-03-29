import React, { useState, useRef } from 'react';

export default function XRayLeaf() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const leafRef = useRef(null);

  const handleMouseMove = (e) => {
    if (leafRef.current) {
      const rect = leafRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const xrayRadius = 80;
  const [pulseOffset, setPulseOffset] = useState(0);
  const [isOverLeaf, setIsOverLeaf] = useState(false);

  // Animate pulse (reversed direction)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPulseOffset(prev => (prev - 2 + 100) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Check if mouse is over the leaf shape
  const checkIfOverLeaf = (x, y) => {
    // Simple distance check from leaf center
    const leafCenterX = 200;
    const leafCenterY = 165;
    const distance = Math.sqrt(Math.pow(x - leafCenterX, 2) + Math.pow(y - leafCenterY, 2));
    return distance < 120; // Approximate leaf radius
  };

  const handleMouseMoveWithCheck = (e) => {
    handleMouseMove(e);
    if (leafRef.current) {
      const rect = leafRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setIsOverLeaf(checkIfOverLeaf(x, y));
    }
  };

  // Leaf shape path
  const leafPath = "M200,50 Q250,100 240,180 Q230,240 200,280 Q170,240 160,180 Q150,100 200,50 Z";
  
  // Main vein paths (mirrored)
  const veins = [
    "M200,50 L200,280", // Central vein
    "M200,100 Q220,120 235,150",
    "M200,140 Q220,155 232,180",
    "M200,180 Q218,200 228,230",
    "M200,100 Q180,120 165,150",
    "M200,140 Q180,155 168,180",
    "M200,180 Q182,200 172,230",
  ];

  // Circuit paths matching vein structure
  const circuits = [
    "M200,50 L200,280", // Central circuit line
    "M200,100 Q220,120 235,150 L238,155", // with nodes
    "M200,140 Q220,155 232,180 L235,185",
    "M200,180 Q218,200 228,230 L230,235",
    "M200,100 Q180,120 165,150 L162,155",
    "M200,140 Q180,155 168,180 L165,185",
    "M200,180 Q182,200 172,230 L170,235",
  ];

  // Circuit nodes (junction points)
  const nodes = [
    { cx: 200, cy: 100 },
    { cx: 200, cy: 140 },
    { cx: 200, cy: 180 },
    { cx: 200, cy: 220 },
    { cx: 235, cy: 150 },
    { cx: 232, cy: 180 },
    { cx: 228, cy: 230 },
    { cx: 165, cy: 150 },
    { cx: 168, cy: 180 },
    { cx: 172, cy: 230 },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative">
        <svg
          ref={leafRef}
          width="400"
          height="330"
          viewBox="0 0 400 330"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="cursor-crosshair"
        >
          <defs>
            {/* X-ray reveal mask */}
            <mask id="xrayMask">
              <rect width="400" height="330" fill="white" />
              {isHovering && (
                <circle
                  cx={mousePos.x}
                  cy={mousePos.y}
                  r={xrayRadius}
                  fill="black"
                />
              )}
            </mask>

            {/* Gradient for leaf */}
            <linearGradient id="leafGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>

            {/* Glow for circuit */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Stronger glow for pulses */}
            <filter id="pulseGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Radial glow around reveal circle */}
            <radialGradient id="revealGlow">
              <stop offset="70%" stopColor="rgba(96, 165, 250, 0)" />
              <stop offset="85%" stopColor="rgba(96, 165, 250, 0.3)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </radialGradient>
          </defs>
          
          {/* BOTTOM LAYER - Circuit version (revealed by x-ray) */}
          {isHovering && (
            <g clipPath="url(#xrayClip)">
              {/* Dark tech background for revealed area */}
              <circle
                cx={mousePos.x}
                cy={mousePos.y}
                r={xrayRadius}
                fill="#1e1b4b"
              />
              
              {/* Leaf shape outline in circuit layer */}
              <path
                d={leafPath}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                opacity="0.3"
              />

              {/* Circuit lines with animated pulses */}
              {circuits.map((path, i) => (
                <g key={`circuit-group-${i}`}>
                  {/* Base circuit line */}
                  <path
                    d={path}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    filter="url(#glow)"
                  />
                  {/* Animated pulse traveling along the path */}
                  <path
                    d={path}
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="3"
                    strokeDasharray="10 90"
                    strokeDashoffset={pulseOffset + (i * 15)}
                    filter="url(#pulseGlow)"
                    opacity="0.9"
                  />
                </g>
              ))}

              {/* Circuit nodes with pulsing animation */}
              {nodes.map((node, i) => (
                <g key={`node-group-${i}`}>
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="3"
                    fill="#60a5fa"
                    filter="url(#glow)"
                  />
                  {/* Pulsing outer ring */}
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

              {/* Clip to only show in reveal circle */}
              <defs>
                <clipPath id="xrayClip">
                  <circle
                    cx={mousePos.x}
                    cy={mousePos.y}
                    r={xrayRadius}
                  />
                </clipPath>
              </defs>
            </g>
          )}

          {/* Glowing ring around the reveal circle */}
          {isHovering && (
            <circle
              cx={mousePos.x}
              cy={mousePos.y}
              r={xrayRadius}
              fill="url(#revealGlow)"
              pointerEvents="none"
            />
          )}
          
          {/* TOP LAYER - Natural leaf with veins */}
          <g mask="url(#xrayMask)">
            {/* Leaf body */}
            <path
              d={leafPath}
              fill="url(#leafGradient)"
              stroke="#15803d"
              strokeWidth="2"
            />
            
            {/* Veins */}
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
        
        <div className="mt-4 text-center text-gray-300 text-sm">
          Hover over the leaf to reveal the circuits beneath
        </div>
      </div>
    </div>
  );
}