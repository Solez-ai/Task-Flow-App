
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Coffee,
  Clock 
} from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TimerProps {
  onSessionComplete?: () => void;
}

const Timer: React.FC<TimerProps> = ({ onSessionComplete }) => {
  const [timerMode, setTimerMode] = React.useState<'focus' | 'break'>('focus');

  const handleComplete = () => {
    const isWorkSession = timerMode === 'focus';
    
    toast(
      isWorkSession ? 'Focus session completed!' : 'Break completed!',
      { 
        description: isWorkSession ? 'Time for a break!' : 'Ready to focus again?'
      }
    );
    
    setTimerMode(isWorkSession ? 'break' : 'focus');
    
    if (isWorkSession && onSessionComplete) {
      onSessionComplete();
    }
    
    // Auto-switch timer duration
    const newTime = isWorkSession ? 5 : 25;
    timer.reset();
    timer.setTimerDuration(newTime);
  };

  const timer = useTimer({
    initialTime: timerMode === 'focus' ? 25 * 60 : 5 * 60,
    onComplete: handleComplete
  });

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
    setTimerMode(type);
    timer.reset();
    timer.setTimerDuration(type === 'focus' ? 25 : 5);
  };

  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div>
            {timerMode === 'focus' ? 'Focus Time' : 'Break Time'}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setTimerType('focus')}
              className={cn(
                timerMode === 'focus' ? 'bg-task text-white hover:text-white hover:bg-task-dark' : 'bg-white'
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
                timerMode === 'break' ? 'bg-task text-white hover:text-white hover:bg-task-dark' : 'bg-white'
              )}
            >
              <Coffee className="h-4 w-4 mr-1" />
              Break
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="text-6xl font-bold mb-6">{timer.formattedTime}</div>
          <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                timer.isActive && !timer.isPaused ? "animate-progress" : "",
                timerMode === 'focus' ? "bg-task" : "bg-blue-500"
              )}
              style={{ 
                width: `${timer.percentComplete}%`,
                '--duration': `${timer.time}s`
              } as React.CSSProperties}
            ></div>
          </div>
          <div className="flex space-x-4">
            <Button 
              className={cn(
                "w-32",
                timerMode === 'focus' ? "bg-task hover:bg-task-dark" : "bg-blue-500 hover:bg-blue-600"
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
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Timer;
