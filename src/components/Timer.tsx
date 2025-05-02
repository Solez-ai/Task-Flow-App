
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RefreshCw, Coffee, Clock, X, SkipForward } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Task } from './TaskItem';
import { Badge } from '@/components/ui/badge';

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

  // Format time for display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Helper function to get name of current timer mode
  const getTimerModeName = () => {
    if (activeTask) return 'Task Timer';
    if (timerMode === 'study') return studyState === 'focus' ? 'Study Focus' : 'Study Break';
    if (timerMode === 'mini-focus') return 'Mini Focus';
    if (timerMode === 'long-break') return 'Long Break';
    return timerMode === 'focus' ? 'Focus Time' : 'Break Time';
  };

  // Set color theme based on timer mode
  const getTimerTheme = () => {
    if (activeTask) return 'bg-task text-white';
    if (timerMode === 'study') {
      return studyState === 'focus' 
        ? 'bg-blue-500 text-white' 
        : 'bg-emerald-500 text-white';
    }
    if (timerMode === 'mini-focus') return 'bg-indigo-500 text-white';
    if (timerMode === 'long-break') return 'bg-teal-600 text-white';
    return timerMode === 'focus' 
      ? 'bg-task text-white' 
      : 'bg-green-500 text-white';
  };

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

  return (
    <Card className="overflow-hidden">
      <CardHeader className={cn("py-3", getTimerTheme())}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            <span>{getTimerModeName()}</span>
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
        {activeTask && (
          <div className="mb-4 p-3 bg-task-light rounded-md border border-task/20 dark:bg-slate-800 dark:border-slate-700">
            <h4 className="font-medium text-task-dark dark:text-task-light mb-1">Current Task:</h4>
            <p className="text-gray-700 dark:text-gray-300">{activeTask.text}</p>
          </div>
        )}
        
        {/* Timer Display */}
        <div className="text-center mb-6">
          <div className="text-5xl font-mono font-bold mb-2 dark:text-gray-200">
            {formatTime(timer.timeLeft)}
          </div>
          
          {/* Progress indicator */}
          <div className="h-1 w-full bg-gray-200 rounded-full dark:bg-slate-700">
            <div 
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                timerMode === 'break' || timerMode === 'long-break' || (timerMode === 'study' && studyState === 'break') 
                  ? "bg-green-500" 
                  : timerMode === 'mini-focus' 
                    ? "bg-indigo-500" 
                    : "bg-task"
              )}
              style={{ 
                width: `${(timer.timeLeft / timer.totalTime) * 100}%` 
              }}
            />
          </div>
          
          {/* Study mode counter */}
          {isStudyActive && (
            <div className="mt-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Round {pomodoroCount}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Timer Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {/* Main start/pause button */}
          <Button 
            onClick={timer.isRunning ? timer.pause : timer.start} 
            className={cn(
              "min-w-[120px]",
              timerMode === 'break' || timerMode === 'long-break' || (timerMode === 'study' && studyState === 'break')
                ? "bg-green-500 hover:bg-green-600" 
                : timerMode === 'mini-focus'
                  ? "bg-indigo-500 hover:bg-indigo-600"
                  : "bg-task hover:bg-task-dark"
            )}
          >
            {timer.isRunning 
              ? <><Pause className="mr-2 h-4 w-4" /> Pause</> 
              : <><Play className="mr-2 h-4 w-4" /> Start</>
            }
          </Button>
          
          {/* Reset button */}
          <Button 
            onClick={timer.reset} 
            variant="outline"
            className="dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Reset
          </Button>
          
          {/* Skip button when timer is running */}
          {timer.isRunning && (
            <Button 
              onClick={skipCurrentSession}
              variant="outline" 
              className="dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <SkipForward className="mr-2 h-4 w-4" /> Skip
            </Button>
          )}
        </div>
        
        {/* Timer Mode Selection */}
        {!activeTask && !isStudyActive && (
          <div className="grid grid-cols-2 gap-2 mt-4 mb-4">
            <Button 
              variant={timerMode === 'focus' ? "default" : "outline"}
              onClick={() => changeTimerMode('focus')}
              className={cn(
                timerMode === 'focus' ? "bg-task hover:bg-task-dark" : "dark:border-slate-700 dark:hover:bg-slate-800"
              )}
            >
              25min Focus
            </Button>
            <Button 
              variant={timerMode === 'mini-focus' ? "default" : "outline"}
              onClick={() => changeTimerMode('mini-focus')}
              className={cn(
                timerMode === 'mini-focus' ? "bg-indigo-500 hover:bg-indigo-600" : "dark:border-slate-700 dark:hover:bg-slate-800"
              )}
            >
              10min Mini Focus
            </Button>
            <Button 
              variant={timerMode === 'break' ? "default" : "outline"}
              onClick={() => changeTimerMode('break')}
              className={cn(
                timerMode === 'break' ? "bg-green-500 hover:bg-green-600" : "dark:border-slate-700 dark:hover:bg-slate-800"
              )}
            >
              5min Break
            </Button>
            <Button 
              variant={timerMode === 'long-break' ? "default" : "outline"}
              onClick={() => changeTimerMode('long-break')}
              className={cn(
                timerMode === 'long-break' ? "bg-teal-600 hover:bg-teal-700" : "dark:border-slate-700 dark:hover:bg-slate-800"
              )}
            >
              15min Long Break
            </Button>
          </div>
        )}
        
        {/* Study Mode toggle */}
        {!activeTask && (
          <Button 
            variant={isStudyActive ? "default" : "outline"}
            className={cn(
              "w-full mt-2",
              isStudyActive 
                ? "bg-blue-500 hover:bg-blue-600" 
                : "dark:border-slate-700 dark:hover:bg-slate-800"
            )}
            onClick={isStudyActive ? stopStudyMode : startStudyMode}
          >
            <Coffee className="mr-2 h-4 w-4" />
            {isStudyActive ? "Exit Study Mode" : "Enter Study Mode"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Timer;
