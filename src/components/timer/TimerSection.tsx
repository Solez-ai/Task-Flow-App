
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import TimerModeSelector from './TimerModeSelector';
import ActiveTaskDisplay from './ActiveTaskDisplay';
import { Task } from '../TaskItem';
import { useTimer } from '@/hooks/useTimer';
import Timer from '../Timer';

interface TimerSectionProps {
  activeTask: Task | null;
  onSessionComplete: () => void;
  onStudyRoundComplete: () => void;
  onResetActiveTask: () => void;
  layoutMode?: 'pc' | 'phone';
}

const TimerSection = ({ 
  activeTask, 
  onSessionComplete,
  onStudyRoundComplete,
  onResetActiveTask,
  layoutMode = 'pc'
}: TimerSectionProps) => {
  // We'll use the Timer component instead of integrating directly with useTimer
  // Phone layout is more compact
  if (layoutMode === 'phone') {
    return (
      <Card className="mb-4 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Timer</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Timer 
            onSessionComplete={onSessionComplete}
            onStudyRoundComplete={onStudyRoundComplete}
            activeTask={activeTask}
            onResetActiveTask={onResetActiveTask}
          />
        </CardContent>
      </Card>
    );
  }

  // Original PC layout
  return (
    <Card className="mb-8 shadow-md">
      <CardHeader>
        <CardTitle>Focus Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <Timer 
          onSessionComplete={onSessionComplete}
          onStudyRoundComplete={onStudyRoundComplete}
          activeTask={activeTask}
          onResetActiveTask={onResetActiveTask}
        />
      </CardContent>
    </Card>
  );
};

export default TimerSection;
