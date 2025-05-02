
import { useState, useEffect, useRef } from 'react';

interface TimerOptions {
  initialTime: number;
  onComplete?: () => void;
}

interface TimerControls {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setTimerDuration: (minutes: number) => void;
}

export const useTimer = ({ initialTime, onComplete }: TimerOptions): TimerControls => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [totalTime, setTotalTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Update ref when onComplete prop changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer tick effect
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timer complete
          clearInterval(intervalRef.current as number);
          setIsRunning(false);
          
          // Call onComplete callback if provided
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const start = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  const setTimerDuration = (minutes: number) => {
    // Ensure minutes is a valid number
    const validMinutes = Math.max(1, Math.min(minutes || 25, 120));
    const seconds = validMinutes * 60;
    setTimeLeft(seconds);
    setTotalTime(seconds);
  };

  return {
    timeLeft,
    totalTime,
    isRunning,
    start,
    pause,
    reset,
    setTimerDuration
  };
};
