'use client';

import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// CONFIGURATION - Edit these values to customize bird behavior
// ============================================================================

const CONFIG = {
  // Formation settings
  minBirds: 3,
  maxBirds: 7,
  minSpacing: 30,
  formationSpacing: 25,
  formationSpacingVariance: 10,
  
  // Speed settings — pixels per second (screen-size independent)
  minBirdSpeed: 100,
  maxBirdSpeed: 160,
  
  // Size settings
  minBirdSize: 18,
  maxBirdSize: 30,
  
  // Timing settings
  spawnInterval: 3000,
  maxSimultaneous: 20,
  
  // Glide/pause settings
  minGlideDuration: 300,
  maxGlideDuration: 1500,
  minGlideWait: 2000,
  maxGlideWait: 6000,
  
  // Bobbing motion settings
  bobbingAmplitude: 4,
  bobbingSpeed: 3,
  
  // Display settings
  containerHeight: 500,
  leftToRightProbability: 0.8,
  vFormationProbability: 0.7,
};

// ============================================================================
// TYPES
// ============================================================================

interface BirdData {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  duration: number;
  delay: number;
  size: number;
  flapOffset: number;
  wingScale: number;
  bobbingOffset: number;
}

interface BirdProps extends BirdData {
  onComplete: (id: number) => void;
}

// ============================================================================
// BIRD SVG COMPONENT
// ============================================================================

const BirdSVG = ({ size, flapOffset, wingScale }: { size: number; flapOffset: number; wingScale: number }) => {
  const wingLeftRef = useRef<SVGLineElement>(null);
  const wingRightRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const scheduleGlide = () => {
      const waitTime = CONFIG.minGlideWait + 
        Math.random() * (CONFIG.maxGlideWait - CONFIG.minGlideWait);
      
      setTimeout(() => {
        const glideDuration = CONFIG.minGlideDuration + 
          Math.random() * (CONFIG.maxGlideDuration - CONFIG.minGlideDuration);
        
        if (wingLeftRef.current && wingRightRef.current) {
          wingLeftRef.current.style.animationPlayState = 'paused';
          wingRightRef.current.style.animationPlayState = 'paused';
          
          setTimeout(() => {
            if (wingLeftRef.current && wingRightRef.current) {
              wingLeftRef.current.style.animationPlayState = 'running';
              wingRightRef.current.style.animationPlayState = 'running';
            }
            scheduleGlide();
          }, glideDuration);
        }
      }, waitTime);
    };

    scheduleGlide();
  }, []);

  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 24 16"
      fill="none"
      style={{ transform: 'rotate(180deg)' }}
    >
      <line
        ref={wingLeftRef}
        x1="12" y1="8" x2={6 - (6 * (wingScale - 1))} y2="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="wing-left"
        style={{ animationDelay: `${flapOffset}s` }}
      />
      <line
        ref={wingRightRef}
        x1="12" y1="8" x2={18 + (6 * (wingScale - 1))} y2="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="wing-right"
        style={{ animationDelay: `${flapOffset}s` }}
      />
    </svg>
  );
};

// ============================================================================
// INDIVIDUAL BIRD COMPONENT
// ============================================================================

const Bird = ({ id, startX, startY, endX, duration, delay, size, flapOffset, wingScale, bobbingOffset, onComplete }: BirdProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(id), (duration + delay + 0.5) * 1000);
    return () => clearTimeout(timer);
  }, [id, duration, delay, onComplete]);

  return (
    <div
      className="bird-container"
      style={{
        left: `${startX}px`,
        top: `${startY}px`,
        // @ts-ignore - CSS variables
        '--end-x': `${endX}px`,
        '--duration': `${duration}s`,
        '--delay': `${delay}s`,
      }}
    >
      <div
        className="bird-bobbing"
        style={{
          // @ts-ignore - CSS variables
          '--bobbing-offset': `${bobbingOffset}s`,
          '--bobbing-amplitude': `${CONFIG.bobbingAmplitude}px`,
          '--bobbing-speed': `${CONFIG.bobbingSpeed}s`,
        }}
      >
        <BirdSVG size={size} flapOffset={flapOffset} wingScale={wingScale} />
      </div>
    </div>
  );
};

// ============================================================================
// FORMATION GENERATOR
// ============================================================================

const generateFormation = (containerWidth: number, birdIdCounter: React.MutableRefObject<number>): BirdData[] => {
  const height = window.innerHeight;
  const numBirds = Math.floor(Math.random() * (CONFIG.maxBirds - CONFIG.minBirds + 1)) + CONFIG.minBirds;
  
  const leftToRight = Math.random() < CONFIG.leftToRightProbability;
  const startX = leftToRight ? -300 : containerWidth + 300;
  const endX = leftToRight ? containerWidth + 300 : -300;
  
  const baseY = Math.random() * (height * 0.6) + (height * 0.2);
  const pixelDistance = Math.abs(endX - startX);
  const targetPxPerSec = CONFIG.minBirdSpeed + Math.random() * (CONFIG.maxBirdSpeed - CONFIG.minBirdSpeed);
  const formationSpeed = pixelDistance / targetPxPerSec;
  const largerOnTop = Math.random() > 0.5;
  const isVFormation = Math.random() < CONFIG.vFormationProbability;

  const birdYPositions: Array<{ y: number; offsetDelay: number }> = [];

  for (let i = 0; i < numBirds; i++) {
    let offsetY, offsetDelay;
    
    if (isVFormation) {
      const side = i % 2 === 0 ? 1 : -1;
      const position = Math.floor(i / 2);
      offsetY = position * (CONFIG.formationSpacing + Math.random() * CONFIG.formationSpacingVariance) * side;
      offsetDelay = position * 0.2;
    } else {
      offsetY = (Math.random() - 0.5) * height * 0.5;
      offsetDelay = Math.random() * 0.5;
    }

    let birdY = Math.max(0, Math.min(height, baseY + offsetY));
    
    let attempts = 0;
    while (attempts < 10) {
      const tooClose = birdYPositions.some(b => Math.abs(b.y - birdY) < CONFIG.minSpacing);
      if (!tooClose) break;
      birdY += (Math.random() > 0.5 ? 1 : -1) * CONFIG.minSpacing;
      birdY = Math.max(0, Math.min(height, birdY));
      attempts++;
    }
    
    birdYPositions.push({ y: birdY, offsetDelay });
  }

  const sortedByY = [...birdYPositions].sort((a, b) => a.y - b.y);
  const minY = sortedByY[0].y;
  const maxY = sortedByY[sortedByY.length - 1].y;
  const yRange = maxY - minY || 1;

  return birdYPositions.map(({ y, offsetDelay }) => {
    const normalizedY = (y - minY) / yRange;
    const wingScale = largerOnTop 
      ? 1.3 - (normalizedY * 0.6)
      : 0.7 + (normalizedY * 0.6);

    return {
      id: birdIdCounter.current++,
      startX,
      startY: y,
      endX,
      duration: formationSpeed,
      delay: offsetDelay,
      size: CONFIG.minBirdSize + Math.random() * (CONFIG.maxBirdSize - CONFIG.minBirdSize),
      flapOffset: Math.random() * 0.5,
      wingScale,
      bobbingOffset: Math.random() * CONFIG.bobbingSpeed,
    };
  });
};

// ============================================================================
// MAIN COMPONENT (EXPORTED)
// ============================================================================

export default function AmbientBirds() {
  const [birds, setBirds] = useState<BirdData[]>([]);
  const birdIdCounter = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spawnFormation = () => {
    const newBirds = generateFormation(window.innerWidth, birdIdCounter);
    setBirds(prev => [...prev, ...newBirds].slice(-CONFIG.maxSimultaneous));
  };

  const removeBird = (id: number) => setBirds(prev => prev.filter(bird => bird.id !== id));

  useEffect(() => {
    spawnFormation();
    intervalRef.current = setInterval(() => spawnFormation(), CONFIG.spawnInterval + Math.random() * 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {birds.map(bird => (
        <Bird key={bird.id} {...bird} onComplete={removeBird} />
      ))}
    </div>
  );
}