
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
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  // Calculate progress percentage based on time remaining in the day
  const totalDayMilliseconds = 24 * 60 * 60 * 1000;
  const millisecondsPassed = endOfDay.getTime() - now.getTime();
  const timeProgress = 100 - (millisecondsPassed / totalDayMilliseconds) * 100;

  return (
    <Card className="mt-2 dark:bg-slate-900 dark:border-slate-800 overflow-hidden shadow-md border-amber-100 dark:border-amber-800/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-amber-500 to-red-500 shadow-lg animate-pulse">
              <Flame size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-base text-gray-800 dark:text-amber-200">
                Current Streak
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 text-sm px-3 py-1">
                  {streak}
                </Badge>
                {streak >= 3 && (
                  <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                    🔥 On fire!
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              Complete a task today to continue your streak
            </p>
            <p className="text-xs font-medium text-amber-600 dark:text-amber-500 mt-1">
              Next task: +1 to streak
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between mb-1 text-xs">
            <span className="font-medium">Today's countdown</span>
            <span className="text-muted-foreground">{Math.min(100, Math.round(timeProgress))}% of day elapsed</span>
          </div>
          <Progress 
            value={Math.min(100, Math.round(timeProgress))} 
            className={cn(
              "h-2.5 bg-red-100 dark:bg-red-950/30", 
              "[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-red-600"
            )} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakPanel;
