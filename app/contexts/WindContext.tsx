'use client';

import { createContext, useContext, useRef, MutableRefObject } from 'react';

interface WindContextType {
  targetWindSpeedRef: MutableRefObject<number>;
}

const WindContext = createContext<WindContextType>({
  targetWindSpeedRef: { current: 0.6 },
});

export function WindProvider({ children }: { children: React.ReactNode }) {
  const targetWindSpeedRef = useRef(0.6);
  return (
    <WindContext.Provider value={{ targetWindSpeedRef }}>
      {children}
    </WindContext.Provider>
  );
}

export function useWind() {
  return useContext(WindContext);
}
