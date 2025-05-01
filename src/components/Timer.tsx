
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Coffee,
  Clock,
  X
} from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Task } from './TaskItem';

interface TimerProps {
  onSessionComplete?: () => void;
  activeTask?: Task | null;
  onResetActiveTask?: () => void;
}

const Timer: React.FC<TimerProps> = ({ onSessionComplete, activeTask, onResetActiveTask }) => {
  const [timerMode, setTimerMode] = React.useState<'focus' | 'break'>('focus');

  const handleComplete = () => {
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
  };

  // Set initial time based on active task or timer mode
  const initialTime = activeTask 
    ? activeTask.timeInMinutes! * 60
    : (timerMode === 'focus' ? 25 * 60 : 5 * 60);

  const timer = useTimer({
    initialTime,
    onComplete: handleComplete
  });

  // Reset timer when active task changes
  React.useEffect(() => {
    if (activeTask) {
      timer.reset();
      timer.setTimerDuration(activeTask.timeInMinutes || 25);
      setTimerMode('focus');
    }
  }, [activeTask]);

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

  const setTimerType = (type: 'focus' | 'break') => {
    if (activeTask) return; // Don't allow changing type during task-specific timer
    
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

  return (
    <Card className="mb-8 dark:bg-slate-900 dark:border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div className="dark:text-gray-200">
            {activeTask 
              ? <span className="flex items-center">Task Focus: <span className="font-normal ml-2 text-task dark:text-task-light">{activeTask.text}</span></span>
              : (timerMode === 'focus' ? 'Focus Time' : 'Break Time')
            }
          </div>
          
          {!activeTask && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setTimerType('focus')}
                className={cn(
                  timerMode === 'focus' 
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
                className={cn(
                  timerMode === 'break' 
                    ? "bg-task text-white hover:text-white hover:bg-task-dark dark:bg-task dark:hover:bg-task-dark" 
                    : "bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
                )}
              >
                <Coffee className="h-4 w-4 mr-1" />
                Break
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="text-6xl font-bold mb-6 dark:text-gray-100">{timer.formattedTime}</div>
          <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                timer.isActive && !timer.isPaused ? "animate-progress" : "",
                activeTask ? "bg-green-500" : (timerMode === 'focus' ? "bg-task" : "bg-blue-500")
              )}
              style={{ 
                width: `${timer.percentComplete}%`,
                '--duration': `${timer.time}s`
              } as React.CSSProperties}
            ></div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
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
            <Button 
              variant="outline"
              onClick={timer.reset}
              className="dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Reset
            </Button>
            
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
