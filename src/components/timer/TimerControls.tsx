
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Play, Pause, RefreshCw, SkipForward } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  timerMode: 'focus' | 'break' | 'study' | 'mini-focus' | 'long-break';
  studyState: 'focus' | 'break';
  isStudyActive?: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  timerMode,
  studyState,
  isStudyActive = false,
  onStart,
  onPause,
  onReset,
  onSkip
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-4">
      {/* Main start/pause button */}
      <Button 
        onClick={isRunning ? onPause : onStart} 
        className={cn(
          "min-w-[120px]",
          timerMode === 'break' || timerMode === 'long-break' || (timerMode === 'study' && studyState === 'break')
            ? "bg-green-500 hover:bg-green-600" 
            : timerMode === 'mini-focus'
              ? "bg-indigo-500 hover:bg-indigo-600"
              : "bg-task hover:bg-task-dark"
        )}
      >
        {isRunning 
          ? <><Pause className="mr-2 h-4 w-4" /> Pause</> 
          : <><Play className="mr-2 h-4 w-4" /> Start</>
        }
      </Button>
      
      {/* Reset button */}
      <Button 
        onClick={onReset} 
        variant="outline"
        className="dark:border-slate-700 dark:hover:bg-slate-800"
      >
        <RefreshCw className="mr-2 h-4 w-4" /> Reset
      </Button>
      
      {/* Skip button - only show during study mode when timer is running */}
      {isRunning && isStudyActive && (
        <Button 
          onClick={onSkip}
          variant="outline" 
          className="dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <SkipForward className="mr-2 h-4 w-4" /> Skip
        </Button>
      )}
    </div>
  );
};

export default TimerControls;
