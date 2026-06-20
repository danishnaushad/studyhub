import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface DemoContextType {
  isDemo: boolean;
}

const DemoContext = createContext<DemoContextType>({ isDemo: false });

export const useDemo = () => useContext(DemoContext);

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isDemo = import.meta.env.VITE_AUDIT_MODE === 'true';

  return (
    <DemoContext.Provider value={{ isDemo }}>
      {children}
    </DemoContext.Provider>
  );
};
