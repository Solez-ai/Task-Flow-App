
/**
 * Format time in seconds to a display string (mm:ss)
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Get name for timer mode
 */
export const getTimerModeName = (
  timerMode: 'focus' | 'break' | 'study' | 'mini-focus' | 'long-break',
  studyState: 'focus' | 'break',
  activeTask: any | null
): string => {
  if (activeTask) return 'Task Timer';
  if (timerMode === 'study') return studyState === 'focus' ? 'Study Focus' : 'Study Break';
  if (timerMode === 'mini-focus') return 'Mini Focus';
  if (timerMode === 'long-break') return 'Long Break';
  return timerMode === 'focus' ? 'Focus Time' : 'Break Time';
};

/**
 * Get CSS theme class based on timer mode
 */
export const getTimerTheme = (
  timerMode: 'focus' | 'break' | 'study' | 'mini-focus' | 'long-break',
  studyState: 'focus' | 'break',
  activeTask: any | null
): string => {
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
