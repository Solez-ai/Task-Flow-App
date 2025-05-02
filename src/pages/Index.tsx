
import React from 'react';
import TaskFlowTimer from '@/components/TaskFlowTimer';
import MotivationalPopup from '@/components/MotivationalPopup';
import { StatsProvider } from '@/contexts/StatsContext';

const Index: React.FC = () => {
  return (
    <StatsProvider>
      <TaskFlowTimer />
      <MotivationalPopup />
    </StatsProvider>
  );
};

export default Index;
