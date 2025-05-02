
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import TimerModeSelector from './TimerModeSelector';
import ActiveTaskDisplay from './ActiveTaskDisplay';
import { Task } from '../TaskItem';
import { useTimer } from '@/hooks/useTimer';

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
  const { 
    secondsLeft, 
    timerRunning, 
    timerMode,
    timerState,
    progress,
    sessionCount,
    startTimer,
    pauseTimer,
    resetTimer,
    skipBreak,
    setTimerMode
  } = useTimer({
    onTimerComplete: () => {
      if (timerState === 'focus') {
        onSessionComplete();
      } else if (timerState === 'study') {
        onStudyRoundComplete();
      }
    }
  });

  // Compact layout for phone
  if (layoutMode === 'phone') {
    return (
      <Card className="mb-4 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Timer</span>
            <TimerModeSelector 
              timerMode={timerMode} 
              setTimerMode={setTimerMode}
              size="sm"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {activeTask && (
            <ActiveTaskDisplay 
              task={activeTask} 
              onClear={onResetActiveTask}
              compact={true}
            />
          )}
          
          <TimerDisplay 
            secondsLeft={secondsLeft} 
            timerState={timerState}
            progress={progress}
            sessionCount={sessionCount}
            compact={true}
          />
          
          <TimerControls 
            timerRunning={timerRunning}
            onStart={startTimer}
            onPause={pauseTimer}
            onReset={resetTimer}
            onSkipBreak={skipBreak}
            timerState={timerState}
            layout="compact"
          />
        </CardContent>
      </Card>
    );
  }

  // Original PC layout
  return (
    <Card className="mb-8 shadow-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Focus Timer</span>
          <TimerModeSelector 
            timerMode={timerMode} 
            setTimerMode={setTimerMode}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeTask && (
          <ActiveTaskDisplay 
            task={activeTask} 
            onClear={onResetActiveTask} 
          />
        )}
        
        <TimerDisplay 
          secondsLeft={secondsLeft} 
          timerState={timerState}
          progress={progress}
          sessionCount={sessionCount}
        />
        
        <TimerControls 
          timerRunning={timerRunning}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={resetTimer}
          onSkipBreak={skipBreak}
          timerState={timerState}
        />
      </CardContent>
    </Card>
  );
};

export default TimerSection;
