'use client';

import { createContext, useContext, useState } from 'react';

interface TransitionContextType {
  leavingDirection: 'left' | 'right' | null;
  setLeavingDirection: (dir: 'left' | 'right' | null) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  leavingDirection: null,
  setLeavingDirection: () => {},
});

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [leavingDirection, setLeavingDirection] = useState<'left' | 'right' | null>(null);
  return (
    <TransitionContext.Provider value={{ leavingDirection, setLeavingDirection }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionContext);
}
