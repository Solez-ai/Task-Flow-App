
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
  const isMobileDevice = useIsMobile();
  
  // Default to PC layout on desktop and phone layout on mobile devices
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(isMobileDevice ? 'phone' : 'pc');

  // Update layout mode when device changes
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
