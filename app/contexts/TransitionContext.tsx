'use client';

import { createContext, useContext, useState } from 'react';

interface TransitionContextType {
  isLeaving: boolean;
  setLeaving: (v: boolean) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  isLeaving: false,
  setLeaving: () => {},
});

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isLeaving, setLeaving] = useState(false);
  return (
    <TransitionContext.Provider value={{ isLeaving, setLeaving }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionContext);
}
