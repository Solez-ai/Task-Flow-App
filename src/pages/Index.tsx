
import React from 'react';
import TaskFlowTimer from '@/components/TaskFlowTimer';
import BackgroundDoodles from '@/components/Doodles';
import MotivationalPopup from '@/components/MotivationalPopup';

const Index = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background doodles add visual interest */}
      <BackgroundDoodles />
      
      {/* The main application */}
      <TaskFlowTimer />
      
      {/* Motivational popup appears on first visit */}
      <MotivationalPopup />
    </div>
  );
};

export default Index;
