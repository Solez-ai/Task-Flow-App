
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

type LayoutMode = 'pc' | 'phone';

interface LayoutContextProps {
  layoutMode: LayoutMode;
  toggleLayoutMode: () => void;
  isMobileDevice: boolean;
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  // Initialize with a default value to prevent initial render issues
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('pc');
  const isMobileDevice = useIsMobile();
  
  // Update layout mode when device detection completes
  useEffect(() => {
    setLayoutMode(isMobileDevice ? 'phone' : 'pc');
  }, [isMobileDevice]);

  const toggleLayoutMode = () => {
    setLayoutMode(prev => prev === 'pc' ? 'phone' : 'pc');
  };

  return (
    <LayoutContext.Provider value={{ layoutMode, toggleLayoutMode, isMobileDevice }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
