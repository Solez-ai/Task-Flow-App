
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { toast } from 'sonner';
import { Task } from '@/components/TaskItem';

type TimerMode = 'focus' | 'break' | 'study' | 'mini-focus' | 'long-break';
type StudyState = 'focus' | 'break';

interface TimerContextType {
  timerMode: TimerMode;
  studyState: StudyState;
  isStudyActive: boolean;
  pomodoroCount: number;
  activeTask: Task | null;
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  setTimerMode: (mode: TimerMode) => void;
  setActiveTask: (task: Task | null) => void;
  startStudyMode: () => void;
  stopStudyMode: () => void;
  skipCurrentSession: () => void;
  toggleStudyMode: () => void;
  changeTimerMode: (mode: 'focus' | 'mini-focus' | 'break' | 'long-break') => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
};

interface TimerProviderProps {
  children: React.ReactNode;
  onSessionComplete?: () => void;
  onStudyRoundComplete?: () => void;
  onResetActiveTask?: () => void;
  activeTask?: Task | null;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ 
  children, 
  onSessionComplete,
  onStudyRoundComplete,
  onResetActiveTask,
  activeTask: initialActiveTask
}) => {
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');
  const [studyState, setStudyState] = useState<StudyState>('focus');
  const [isStudyActive, setIsStudyActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(1);
  const [activeTask, setActiveTask] = useState<Task | null>(initialActiveTask || null);

  // Set initial time based on active task, study mode or timer mode
  const getInitialTime = () => {
    if (activeTask && activeTask.timeInMinutes) return activeTask.timeInMinutes * 60;
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
        setActiveTask(null);
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
        
        // Call study round complete callback when a break finishes (completing a full cycle)
        if (onStudyRoundComplete) {
          onStudyRoundComplete();
        }
        
        timer.start();
      }
    }
  };
  
  const initialTime = getInitialTime();
  const timer = useTimer({
    initialTime,
    onComplete: handleComplete
  });

  // Set initial active task from props when provided
  useEffect(() => {
    if (initialActiveTask && initialActiveTask !== activeTask) {
      setActiveTask(initialActiveTask);
    }
  }, [initialActiveTask]);

  // Reset timer when active task changes
  useEffect(() => {
    if (activeTask) {
      timer.reset();
      const taskTime = activeTask.timeInMinutes || 25;
      timer.setTimerDuration(taskTime);
      setTimerMode('focus');
      setIsStudyActive(false);
      // Auto-start timer for task
      timer.start();
      // Notify the user that we're using the task's specific time
      if (activeTask.timeInMinutes) {
        toast.info(`Starting timer for: ${activeTask.text}`, {
          description: `${activeTask.timeInMinutes} minute timer set`
        });
      }
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

  // Toggle study mode
  const toggleStudyMode = () => {
    if (isStudyActive) {
      stopStudyMode();
    } else {
      startStudyMode();
    }
  };

  // Change timer mode
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
        
        // Call study round complete callback when a break is skipped
        if (onStudyRoundComplete) {
          onStudyRoundComplete();
        }
        
        toast.info('Starting next focus session');
        timer.start();
      }
    }
  };

  const value = {
    timerMode,
    studyState,
    isStudyActive,
    pomodoroCount,
    activeTask, 
    timeLeft: timer.timeLeft,
    totalTime: timer.totalTime,
    isRunning: timer.isRunning,
    setTimerMode,
    setActiveTask,
    startStudyMode,
    stopStudyMode,
    skipCurrentSession,
    toggleStudyMode,
    changeTimerMode,
    start: timer.start,
    pause: timer.pause,
    reset: timer.reset
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};
