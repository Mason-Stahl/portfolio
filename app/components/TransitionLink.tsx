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
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const { targetWindSpeedRef } = useWind();
  const { setLeaving } = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Kick off wind gust + content slide-out simultaneously
    targetWindSpeedRef.current = TRANSITION_WIND_SPEED;
    setLeaving(true);
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
