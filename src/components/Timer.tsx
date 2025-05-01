
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Coffee,
  Clock,
  X,
  SkipForward
} from 'lucide-react';
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

const Timer: React.FC<TimerProps> = ({ onSessionComplete, activeTask, onResetActiveTask }) => {
  const [timerMode, setTimerMode] = React.useState<'focus' | 'break' | 'study'>('focus');
  const [studyState, setStudyState] = React.useState<'focus' | 'break'>('focus');
  const [isStudyActive, setIsStudyActive] = React.useState(false);
  const [pomodoroCount, setPomodoroCount] = React.useState(1);
  
  // Set initial time based on active task, study mode or timer mode
  const getInitialTime = () => {
    if (activeTask) return activeTask.timeInMinutes! * 60;
    if (timerMode === 'study') return studyState === 'focus' ? 25 * 60 : 5 * 60;
    return timerMode === 'focus' ? 25 * 60 : 5 * 60;
  };

  const handleComplete = () => {
    // Handle normal timer completion
    if (!isStudyActive) {
      const isWorkSession = timerMode === 'focus';
      
      toast(
        isWorkSession ? 'Focus session completed!' : 'Break completed!',
        { 
          description: isWorkSession ? 'Time for a break!' : 'Ready to focus again?'
        }
      );
      
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

  const handleTimerControl = () => {
    if (timer.isActive) {
      if (timer.isPaused) {
        timer.resume();
      } else {
        timer.pause();
      }
    } else {
      timer.start();
    }
  };

  const handleStudyModeToggle = () => {
    // Toggle study mode on/off
    if (!isStudyActive) {
      // Starting study mode
      setTimerMode('study');
      setStudyState('focus');
      setPomodoroCount(1);
      timer.reset();
      timer.setTimerDuration(25);
      setIsStudyActive(true);
      timer.start();
      toast('Study Mode activated!', {
        description: 'Focus for 25 minutes, then take a 5-minute break'
      });
    } else {
      // Stopping study mode
      setIsStudyActive(false);
      setTimerMode('focus');
      timer.reset();
      timer.setTimerDuration(25);
      setPomodoroCount(1);
      toast('Study Mode stopped', {
        description: 'You can continue with regular focus sessions'
      });
    }
  };

  const handleSkipBreak = () => {
    if (isStudyActive && studyState === 'break') {
      setStudyState('focus');
      timer.reset();
      timer.setTimerDuration(25);
      setPomodoroCount(prev => prev + 1);
      toast('Break skipped!', {
        description: 'Starting your next focus session'
      });
      timer.start();
    }
  };

  const setTimerType = (type: 'focus' | 'break') => {
    if (activeTask || isStudyActive) return; // Don't allow changing type during task-specific timer or study mode
    
    setTimerMode(type);
    timer.reset();
    timer.setTimerDuration(type === 'focus' ? 25 : 5);
  };

  const handleCancelTaskTimer = () => {
    if (onResetActiveTask) {
      onResetActiveTask();
      timer.reset();
      timer.setTimerDuration(25);
    }
  };

  // Determine background colors based on mode
  let timerBgClass = "bg-task hover:bg-task-dark dark:bg-task dark:hover:bg-task-dark";
  if (timerMode === 'study' && studyState === 'break') {
    timerBgClass = "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700";
  } else if (timerMode === 'break') {
    timerBgClass = "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700";
  }

  return (
    <Card className={cn(
      "mb-8 transition-all duration-300 ease-in-out",
      isStudyActive && studyState === 'break' 
        ? "border-green-400 dark:border-green-700" 
        : "dark:bg-slate-900 dark:border-slate-800"
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div className="dark:text-gray-200">
            {activeTask 
              ? <span className="flex items-center">Task Focus: <span className="font-normal ml-2 text-task dark:text-task-light">{activeTask.text}</span></span>
              : isStudyActive 
                ? (
                  <div className="flex items-center gap-2">
                    <span>{studyState === 'focus' ? 'Focus Time - Stay Sharp' : 'Break Time - Rest a Bit!'}</span>
                    <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800">
                      Round {pomodoroCount}
                    </Badge>
                  </div>
                )
                : (timerMode === 'focus' ? 'Focus Time' : 'Break Time')
            }
          </div>
          
          {!activeTask && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setTimerType('focus')}
                disabled={isStudyActive}
                className={cn(
                  "transition-colors",
                  (timerMode === 'focus' || (timerMode === 'study' && studyState === 'focus')) && !isStudyActive
                    ? "bg-task text-white hover:text-white hover:bg-task-dark dark:bg-task dark:hover:bg-task-dark" 
                    : "bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
                )}
              >
                <Clock className="h-4 w-4 mr-1" />
                Focus
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setTimerType('break')}
                disabled={isStudyActive}
                className={cn(
                  "transition-colors",
                  (timerMode === 'break' || (timerMode === 'study' && studyState === 'break')) && !isStudyActive
                    ? "bg-blue-500 text-white hover:text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700" 
                    : "bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
                )}
              >
                <Coffee className="h-4 w-4 mr-1" />
                Break
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleStudyModeToggle}
                className={cn(
                  "transition-colors border-2",
                  isStudyActive
                    ? "bg-green-500 text-white border-green-600 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700" 
                    : "bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
                )}
              >
                <Clock className="h-4 w-4 mr-1" />
                Study Mode
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className={cn(
            "text-6xl font-bold mb-6 transition-colors duration-300",
            isStudyActive && studyState === 'break' ? "text-green-600 dark:text-green-400" : "dark:text-gray-100"
          )}>
            {timer.formattedTime}
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                timer.isActive && !timer.isPaused ? "animate-progress" : "",
                isStudyActive && studyState === 'break' 
                  ? "bg-green-500 dark:bg-green-500" 
                  : activeTask 
                    ? "bg-green-500"
                    : (timerMode === 'focus' || (isStudyActive && studyState === 'focus'))
                      ? "bg-task" 
                      : "bg-blue-500"
              )}
              style={{ 
                width: `${timer.percentComplete}%`,
                '--duration': `${timer.time}s`
              } as React.CSSProperties}
            ></div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {isStudyActive ? (
              <Button
                className={cn(
                  "w-32",
                  studyState === 'break' 
                    ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                    : "bg-task hover:bg-task-dark dark:bg-task dark:hover:bg-task-dark"
                )}
                onClick={handleTimerControl}
              >
                {!timer.isActive ? (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Start
                  </>
                ) : timer.isPaused ? (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Resume
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-4 w-4" /> Pause
                  </>
                )}
              </Button>
            ) : (
              <Button 
                className={cn(
                  "w-32",
                  activeTask
                    ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                    : (timerMode === 'focus' 
                        ? "bg-task hover:bg-task-dark dark:bg-task dark:hover:bg-task-dark" 
                        : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700")
                )}
                onClick={handleTimerControl}
              >
                {!timer.isActive ? (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Start
                  </>
                ) : timer.isPaused ? (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Resume
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-4 w-4" /> Pause
                  </>
                )}
              </Button>
            )}
            
            {isStudyActive ? (
              <Button 
                variant="outline"
                className="dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
                onClick={handleStudyModeToggle}
              >
                <X className="mr-2 h-4 w-4" /> Stop Study Mode
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={timer.reset}
                className="dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Reset
              </Button>
            )}
            
            {isStudyActive && studyState === 'break' && (
              <Button 
                variant="outline" 
                onClick={handleSkipBreak}
                className="border-green-300 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-800 dark:text-green-500 dark:hover:bg-green-900/30"
              >
                <SkipForward className="mr-2 h-4 w-4" /> Skip Break
              </Button>
            )}
            
            {activeTask && (
              <Button 
                variant="outline" 
                onClick={handleCancelTaskTimer}
                className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:text-red-500 dark:hover:bg-red-900/30"
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Timer;
