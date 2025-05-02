
import React, { createContext, useContext, ReactNode } from 'react';
import { useDailyStats, DailyStats } from '@/hooks/useDailyStats';

interface StatsContextType {
  stats: DailyStats;
  addPomodoroSession: (minutes?: number) => void;
  addCompletedTask: () => void;
  addStudyModeRound: () => void;
  resetStats: () => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const useStats = (): StatsContextType => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};

interface StatsProviderProps {
  children: ReactNode;
}

export const StatsProvider: React.FC<StatsProviderProps> = ({ children }) => {
  const statsHook = useDailyStats();
  
  return (
    <StatsContext.Provider value={statsHook}>
      {children}
    </StatsContext.Provider>
  );
};
