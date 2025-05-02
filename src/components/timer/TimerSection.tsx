
import React from 'react';
import Timer from '../Timer';
import { Task } from '../TaskItem';

interface TimerSectionProps {
  activeTask: Task | null;
  onSessionComplete: () => void;
  onStudyRoundComplete: () => void;
  onResetActiveTask: () => void;
}

const TimerSection: React.FC<TimerSectionProps> = ({
  activeTask,
  onSessionComplete,
  onStudyRoundComplete,
  onResetActiveTask
}) => {
  return (
    <Timer 
      onSessionComplete={onSessionComplete} 
      activeTask={activeTask} 
      onResetActiveTask={onResetActiveTask} 
      onStudyRoundComplete={onStudyRoundComplete}
    />
  );
};

export default TimerSection;
