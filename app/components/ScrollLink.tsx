'use client';

import { ReactNode } from 'react';

export default function ScrollLink({
  targetId,
  children,
  className,
}: {
  targetId: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={() =>
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
      }
      className={className}
    >
      {children}
    </button>
  );
}
