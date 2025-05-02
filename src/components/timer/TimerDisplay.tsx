
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatTime } from '@/utils/timerUtils';

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
  timerMode: 'focus' | 'break' | 'study' | 'mini-focus' | 'long-break';
  studyState: 'focus' | 'break';
  isStudyActive: boolean;
  pomodoroCount: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  totalTime,
  timerMode,
  studyState,
  isStudyActive,
  pomodoroCount
}) => {
  return (
    <div className="text-center mb-6">
      <div className="text-5xl font-mono font-bold mb-2 dark:text-gray-200">
        {formatTime(timeLeft)}
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
            width: `${(timeLeft / totalTime) * 100}%` 
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
  );
};

export default TimerDisplay;
