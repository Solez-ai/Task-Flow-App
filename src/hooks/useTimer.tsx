
import { useState, useEffect, useCallback } from 'react';

interface UseTimerProps {
  initialTime?: number;
  autostart?: boolean;
  onComplete?: () => void;
}

export const useTimer = ({ 
  initialTime = 25 * 60, // Default 25 minutes in seconds
  autostart = false, 
  onComplete 
}: UseTimerProps = {}) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(autostart);
  const [isPaused, setIsPaused] = useState(false);

  const start = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    setTime(initialTime);
    setIsActive(false);
    setIsPaused(false);
  }, [initialTime]);

  const setTimerDuration = useCallback((minutes: number) => {
    const newTime = minutes * 60;
    setTime(newTime);
  }, []);

  useEffect(() => {
    let interval: number | null = null;

    if (isActive && !isPaused) {
      interval = window.setInterval(() => {
        setTime((time) => {
          if (time <= 1) {
            if (interval) clearInterval(interval);
            if (onComplete) onComplete();
            setIsActive(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, onComplete]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const percentComplete = ((initialTime - time) / initialTime) * 100;

  return {
    time,
    formattedTime,
    percentComplete,
    isActive,
    isPaused,
    start,
    pause,
    resume,
    reset,
    setTimerDuration,
  };
};
