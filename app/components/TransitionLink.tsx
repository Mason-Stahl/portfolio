'use client';

import { useRouter } from 'next/navigation';
import { useWind } from '../contexts/WindContext';
import { useTransition } from '../contexts/TransitionContext';
import { MouseEvent, ReactNode } from 'react';

const TRANSITION_WIND_SPEED = 4;
const TRANSITION_OUT_MS = 1000;

export default function TransitionLink({
  href,
  children,
  className,
  direction = 'left',
  scrollTo,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  direction?: 'left' | 'right';
  scrollTo?: string;
}) {
  const router = useRouter();
  const { targetWindSpeedRef } = useWind();
  const { setLeavingDirection } = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (scrollTo) {
      sessionStorage.setItem('returnSection', scrollTo);
    }
    // Negative wind speed = rightward gust
    targetWindSpeedRef.current = direction === 'right' ? -TRANSITION_WIND_SPEED : TRANSITION_WIND_SPEED;
    setLeavingDirection(direction);
    setTimeout(() => {
      router.push(href);
    }, TRANSITION_OUT_MS);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
