
import React from 'react';
import { Button } from '@/components/ui/button';
import { Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerModeSelectorProps {
  timerMode: 'focus' | 'break' | 'study' | 'mini-focus' | 'long-break';
  isStudyActive: boolean;
  onChangeMode: (mode: 'focus' | 'mini-focus' | 'break' | 'long-break') => void;
  onToggleStudy: () => void;
}

const TimerModeSelector: React.FC<TimerModeSelectorProps> = ({
  timerMode,
  isStudyActive,
  onChangeMode,
  onToggleStudy
}) => {
  return (
    <>
      {!isStudyActive && (
        <div className="grid grid-cols-2 gap-2 mt-4 mb-4">
          <Button 
            variant={timerMode === 'focus' ? "default" : "outline"}
            onClick={() => onChangeMode('focus')}
            className={cn(
              timerMode === 'focus' ? "bg-task hover:bg-task-dark" : "dark:border-slate-700 dark:hover:bg-slate-800"
            )}
          >
            25min Focus
          </Button>
          <Button 
            variant={timerMode === 'mini-focus' ? "default" : "outline"}
            onClick={() => onChangeMode('mini-focus')}
            className={cn(
              timerMode === 'mini-focus' ? "bg-indigo-500 hover:bg-indigo-600" : "dark:border-slate-700 dark:hover:bg-slate-800"
            )}
          >
            10min Mini Focus
          </Button>
          <Button 
            variant={timerMode === 'break' ? "default" : "outline"}
            onClick={() => onChangeMode('break')}
            className={cn(
              timerMode === 'break' ? "bg-green-500 hover:bg-green-600" : "dark:border-slate-700 dark:hover:bg-slate-800"
            )}
          >
            5min Break
          </Button>
          <Button 
            variant={timerMode === 'long-break' ? "default" : "outline"}
            onClick={() => onChangeMode('long-break')}
            className={cn(
              timerMode === 'long-break' ? "bg-teal-600 hover:bg-teal-700" : "dark:border-slate-700 dark:hover:bg-slate-800"
            )}
          >
            15min Long Break
          </Button>
        </div>
      )}
      
      <Button 
        variant={isStudyActive ? "default" : "outline"}
        className={cn(
          "w-full mt-2",
          isStudyActive 
            ? "bg-blue-500 hover:bg-blue-600" 
            : "dark:border-slate-700 dark:hover:bg-slate-800"
        )}
        onClick={onToggleStudy}
      >
        <Coffee className="mr-2 h-4 w-4" />
        {isStudyActive ? "Exit Study Mode" : "Enter Study Mode"}
      </Button>
    </>
  );
};

export default TimerModeSelector;
