
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, X } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Task } from './TaskItem';
import { getTimerModeName, getTimerTheme } from '@/utils/timerUtils';
import TimerDisplay from './timer/TimerDisplay';
import TimerControls from './timer/TimerControls';
import TimerModeSelector from './timer/TimerModeSelector';
import ActiveTaskDisplay from './timer/ActiveTaskDisplay';

interface TimerProps {
  onSessionComplete?: () => void;
  activeTask?: Task | null;
  onResetActiveTask?: () => void;
}

const Timer: React.FC<TimerProps> = ({
  onSessionComplete,
  activeTask,
  onResetActiveTask
}) => {
  const [timerMode, setTimerMode] = React.useState<'focus' | 'break' | 'study' | 'mini-focus' | 'long-break'>('focus');
  const [studyState, setStudyState] = React.useState<'focus' | 'break'>('focus');
  const [isStudyActive, setIsStudyActive] = React.useState(false);
  const [pomodoroCount, setPomodoroCount] = React.useState(1);

  // Set initial time based on active task, study mode or timer mode
  const getInitialTime = () => {
    if (activeTask) return activeTask.timeInMinutes! * 60;
    if (timerMode === 'study') return studyState === 'focus' ? 25 * 60 : 5 * 60;
    
    // Add time for different modes
    if (timerMode === 'focus') return 25 * 60;
    if (timerMode === 'mini-focus') return 10 * 60;
    if (timerMode === 'break') return 5 * 60;
    if (timerMode === 'long-break') return 15 * 60;
    
    return 25 * 60; // Default
  };
  
  const handleComplete = () => {
    // Handle normal timer completion
    if (!isStudyActive) {
      const isWorkSession = timerMode === 'focus' || timerMode === 'mini-focus';
      toast(isWorkSession ? 'Focus session completed!' : 'Break completed!', {
        description: isWorkSession ? 'Time for a break!' : 'Ready to focus again?'
      });
      if (isWorkSession && onSessionComplete) {
        onSessionComplete();
      }

      // Auto-switch timer duration if not task-specific
      if (!activeTask) {
        setTimerMode(isWorkSession ? 'break' : 'focus');
        const newTime = isWorkSession ? 5 : 25;
        timer.reset();
        timer.setTimerDuration(newTime);
      } else {
        // Reset active task after completion
        if (onResetActiveTask) {
          onResetActiveTask();
        }
      }
    }
    // Handle study mode completion - automatic transitions between focus and break
    else {
      if (studyState === 'focus') {
        // Focus period completed - transition to break
        setStudyState('break');
        timer.reset();
        timer.setTimerDuration(5);
        toast('Focus session completed!', {
          description: 'Time for a short break!'
        });
        if (onSessionComplete) {
          onSessionComplete();
        }
        timer.start();
      } else {
        // Break period completed - transition to focus and increment count
        setStudyState('focus');
        timer.reset();
        timer.setTimerDuration(25);
        setPomodoroCount(prev => prev + 1);
        toast('Break completed!', {
          description: 'Starting your next focus session!'
        });
        timer.start();
      }
    }
  };
  
  const initialTime = getInitialTime();
  const timer = useTimer({
    initialTime,
    onComplete: handleComplete
  });

  // Reset timer when active task changes
  useEffect(() => {
    if (activeTask) {
      timer.reset();
      timer.setTimerDuration(activeTask.timeInMinutes || 25);
      setTimerMode('focus');
      setIsStudyActive(false);
    }
  }, [activeTask]);

  // Effect to handle changing time when study mode or state changes
  useEffect(() => {
    if (timerMode === 'study' && !activeTask) {
      timer.reset();
      timer.setTimerDuration(studyState === 'focus' ? 25 : 5);
    }
  }, [timerMode, studyState]);

  // Start study mode
  const startStudyMode = () => {
    setTimerMode('study');
    setIsStudyActive(true);
    setStudyState('focus');
    setPomodoroCount(1);
    timer.reset();
    timer.setTimerDuration(25);
    timer.start();
    toast.info('Study mode activated', {
      description: 'Focus for 25 minutes, then take a 5 minute break'
    });
  };

  // Stop study mode
  const stopStudyMode = () => {
    setIsStudyActive(false);
    setTimerMode('focus');
    timer.reset();
    timer.setTimerDuration(25);
    toast.info('Study mode deactivated');
  };

  // Cancel active task timer
  const cancelActiveTaskTimer = () => {
    if (onResetActiveTask) {
      onResetActiveTask();
    }
    timer.reset();
    timer.setTimerDuration(25);
    setTimerMode('focus');
    toast.info('Task timer canceled');
  };

  // Skip current session
  const skipCurrentSession = () => {
    if (isStudyActive) {
      if (studyState === 'focus') {
        // Skip to break
        setStudyState('break');
        timer.reset();
        timer.setTimerDuration(5);
        toast.info('Skipped to break');
        timer.start();
      } else {
        // Skip break, go to next focus
        setStudyState('focus');
        timer.reset();
        timer.setTimerDuration(25);
        setPomodoroCount(prev => prev + 1);
        toast.info('Starting next focus session');
        timer.start();
      }
    } else {
      // For normal timer, just toggle between focus/break
      const isWorkSession = timerMode === 'focus' || timerMode === 'mini-focus';
      setTimerMode(isWorkSession ? 'break' : 'focus');
      const newTime = isWorkSession ? 5 : 25;
      timer.reset();
      timer.setTimerDuration(newTime);
      toast.info(isWorkSession ? 'Skipped to break' : 'Skipped to focus time');
    }
  };

  // Handle timer mode change 
  const changeTimerMode = (mode: 'focus' | 'mini-focus' | 'break' | 'long-break') => {
    if (isStudyActive) {
      stopStudyMode();
    }
    
    setTimerMode(mode);
    
    // Set appropriate duration based on mode
    let duration = 25;
    if (mode === 'mini-focus') duration = 10;
    else if (mode === 'break') duration = 5;
    else if (mode === 'long-break') duration = 15;
    
    timer.reset();
    timer.setTimerDuration(duration);
    
    toast.info(`Timer set to ${mode.replace('-', ' ')} mode`, {
      description: `${duration} minutes timer set`
    });
  };

  // Toggle study mode
  const toggleStudyMode = () => {
    if (isStudyActive) {
      stopStudyMode();
    } else {
      startStudyMode();
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className={cn("py-3", getTimerTheme(timerMode, studyState, activeTask))}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            <span>{getTimerModeName(timerMode, studyState, activeTask)}</span>
          </div>
          
          {activeTask && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={cancelActiveTaskTimer} 
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Show task info if timer is for specific task */}
        <ActiveTaskDisplay 
          activeTask={activeTask} 
          onResetActiveTask={() => onResetActiveTask?.()}
        />
        
        {/* Timer Display */}
        <TimerDisplay 
          timeLeft={timer.timeLeft}
          totalTime={timer.totalTime}
          timerMode={timerMode}
          studyState={studyState}
          isStudyActive={isStudyActive}
          pomodoroCount={pomodoroCount}
        />
        
        {/* Timer Controls */}
        <TimerControls 
          isRunning={timer.isRunning}
          timerMode={timerMode}
          studyState={studyState}
          onStart={timer.start}
          onPause={timer.pause}
          onReset={timer.reset}
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
    </Card>
  );
};

export default Timer;
