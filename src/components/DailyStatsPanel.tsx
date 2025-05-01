
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Clock, CheckCircle, BarChart, RefreshCw, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DailyStats } from '@/hooks/useDailyStats';

interface DailyStatsPanelProps {
  stats: DailyStats;
  onResetStats: () => void;
}

const DailyStatsPanel: React.FC<DailyStatsPanelProps> = ({ stats, onResetStats }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  // Format minutes into hours and minutes
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Card className="mt-8 dark:bg-slate-900 dark:border-slate-800">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <CardHeader className="pb-2">
          <CollapsibleTrigger className="w-full text-left flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 dark:text-gray-200">
              <BarChart className="h-5 w-5 text-task dark:text-task-light" />
              Daily Stats
            </CardTitle>
            <ChevronDown className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen ? "transform rotate-180" : ""
            )} />
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-3 rounded-lg bg-task-light dark:bg-slate-800 dark:border-slate-700 border">
                <Badge variant="secondary" className="mb-1 bg-white/80 dark:bg-slate-700">
                  <Clock className="h-3 w-3 mr-1 text-task dark:text-task-light" />
                  Focus Sessions
                </Badge>
                <span className="text-2xl font-bold text-task-dark dark:text-task-light">{stats.pomodoroSessions}</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-green-100 dark:bg-slate-800 dark:border-slate-700 border">
                <Badge variant="secondary" className="mb-1 bg-white/80 dark:bg-slate-700">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-600 dark:text-green-500" />
                  Completed Tasks
                </Badge>
                <span className="text-2xl font-bold text-green-700 dark:text-green-500">{stats.completedTasks}</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-blue-100 dark:bg-slate-800 dark:border-slate-700 border">
                <Badge variant="secondary" className="mb-1 bg-white/80 dark:bg-slate-700">
                  <Clock className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-500" />
                  Total Focus Time
                </Badge>
                <span className="text-2xl font-bold text-blue-700 dark:text-blue-500">{formatTime(stats.focusedTimeMinutes)}</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-amber-100 dark:bg-slate-800 dark:border-slate-700 border">
                <Badge variant="secondary" className="mb-1 bg-white/80 dark:bg-slate-700">
                  <BookOpen className="h-3 w-3 mr-1 text-amber-600 dark:text-amber-500" />
                  Study Rounds
                </Badge>
                <span className="text-2xl font-bold text-amber-700 dark:text-amber-500">{stats.studyModeRounds}</span>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onResetStats}
                className="text-muted-foreground"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Clear Today's Stats
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default DailyStatsPanel;
