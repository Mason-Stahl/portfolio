'use client';

import { createContext, useContext, useRef, MutableRefObject } from 'react';

export const DEFAULT_WIND_SPEED = 0.6;

interface WindContextType {
  targetWindSpeedRef: MutableRefObject<number>;
}

const WindContext = createContext<WindContextType>({
  targetWindSpeedRef: { current: DEFAULT_WIND_SPEED },
});

export function WindProvider({ children }: { children: React.ReactNode }) {
  const targetWindSpeedRef = useRef(DEFAULT_WIND_SPEED);
  return (
    <WindContext.Provider value={{ targetWindSpeedRef }}>
      {children}
    </WindContext.Provider>
  );
}

export function useWind() {
  return useContext(WindContext);
}
