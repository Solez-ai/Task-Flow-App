
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { getTimerModeName, getTimerTheme } from '@/utils/timerUtils';
import TimerDisplay from './timer/TimerDisplay';
import TimerControls from './timer/TimerControls';
import TimerModeSelector from './timer/TimerModeSelector';
import ActiveTaskDisplay from './timer/ActiveTaskDisplay';
import { TimerProvider, useTimerContext } from '@/contexts/TimerContext';
import { Task } from './TaskItem';

// Extract TimerContent as a separate component
const TimerContent: React.FC = () => {
  const { 
    timerMode, 
    studyState, 
    activeTask, 
    isStudyActive, 
    pomodoroCount, 
    timeLeft, 
    totalTime, 
    isRunning, 
    start, 
    pause, 
    reset, 
    skipCurrentSession, 
    changeTimerMode, 
    toggleStudyMode 
  } = useTimerContext();

  return (
    <>
      <CardHeader className={cn("py-3", getTimerTheme(timerMode, studyState, activeTask))}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            <span>{getTimerModeName(timerMode, studyState, activeTask)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Show task info if timer is for specific task */}
        <ActiveTaskDisplay />
        
        {/* Timer Display */}
        <TimerDisplay 
          timeLeft={timeLeft}
          totalTime={totalTime}
          timerMode={timerMode}
          studyState={studyState}
          isStudyActive={isStudyActive}
          pomodoroCount={pomodoroCount}
        />
        
        {/* Timer Controls */}
        <TimerControls 
          isRunning={isRunning}
          timerMode={timerMode}
          studyState={studyState}
          isStudyActive={isStudyActive}
          onStart={start}
          onPause={pause}
          onReset={reset}
          onSkip={skipCurrentSession}
        />
        
        {/* Timer Mode Selection */}
        {!activeTask && (
          <TimerModeSelector
            timerMode={timerMode}
            isStudyActive={isStudyActive}
            onChangeMode={changeTimerMode}
            onToggleStudy={toggleStudyMode}
          />
        )}
      </CardContent>
    </>
  );
};

// Main Timer component
const Timer: React.FC<{
  onSessionComplete?: () => void;
  onStudyRoundComplete?: () => void;
  activeTask?: Task | null;
  onResetActiveTask?: () => void;
}> = ({
  onSessionComplete,
  onStudyRoundComplete,
  activeTask,
  onResetActiveTask
}) => {
  return (
    <TimerProvider 
      onSessionComplete={onSessionComplete}
      onResetActiveTask={onResetActiveTask}
      onStudyRoundComplete={onStudyRoundComplete}
    >
      <Card className="overflow-hidden">
        <TimerContent />
      </Card>
    </TimerProvider>
  );
};

export default Timer;
