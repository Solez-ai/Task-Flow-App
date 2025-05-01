
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakPanelProps {
  streak: number;
  completedToday: number;
}

const StreakPanel: React.FC<StreakPanelProps> = ({
  streak,
  completedToday
}) => {
  // Only show streak panel if user has completed at least 2 tasks
  if (completedToday < 2) return null;

  // Calculate the progress bar percentage for the next day
  // The idea is to show how close they are to completing a task for the day
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  // Calculate progress percentage based on time remaining in the day
  const totalDayMilliseconds = 24 * 60 * 60 * 1000;
  const millisecondsPassed = endOfDay.getTime() - now.getTime();
  const timeProgress = 100 - millisecondsPassed / totalDayMilliseconds * 100;

  return (
    <Card className="mt-2 dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
      <CardContent className="p-4 my-[11px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Flame size={20} className="text-amber-600 dark:text-amber-500 animate-pulse-glow" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">
                Current Streak
              </h4>
              <Badge variant="secondary" className="mt-1 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
                {streak} {streak === 1 ? 'day' : 'days'}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              Complete a task today to continue your streak
            </p>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex justify-between mb-1 text-xs my-[20px]">
            <span>Today's progress</span>
            <span>{Math.min(100, Math.round(timeProgress))}% of day elapsed</span>
          </div>
          <Progress value={Math.min(100, Math.round(timeProgress))} className={cn(
            "h-2", 
            timeProgress > 80 ? "bg-red-200 [&>div]:bg-red-500" : 
            timeProgress > 50 ? "bg-amber-200 [&>div]:bg-amber-500" : 
            "bg-green-200 [&>div]:bg-green-500"
          )} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakPanel;
