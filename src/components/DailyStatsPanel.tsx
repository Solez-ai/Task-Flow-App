
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Clock, CheckCircle, BarChart, RefreshCw, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DailyStats } from '@/hooks/useDailyStats';
import StatCard from './stats/StatCard';

interface DailyStatsPanelProps {
  stats: DailyStats;
  onResetStats: () => void;
}

const DailyStatsPanel: React.FC<DailyStatsPanelProps> = ({
  stats,
  onResetStats
}) => {
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
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CardHeader className="pb-2">
          <CollapsibleTrigger className="w-full text-left flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 dark:text-gray-200">
              <BarChart className="h-5 w-5 text-task dark:text-task-light" />
              Daily Stats
            </CardTitle>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isOpen ? "transform rotate-180" : "")} />
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-2 my-[8px] px-[17px] py-[16px]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                title="Focus Sessions"
                value={stats.pomodoroSessions}
                icon={Clock}
                iconColor="text-task dark:text-task-light"
                bgColorClass="bg-task-light dark:bg-slate-800 dark:border-slate-700"
              />
              
              <StatCard 
                title="Completed Tasks"
                value={stats.completedTasks}
                icon={CheckCircle}
                iconColor="text-green-600 dark:text-green-500"
                bgColorClass="bg-green-100 dark:bg-slate-800 dark:border-slate-700"
              />
              
              <StatCard 
                title="Total Focus Time"
                value={formatTime(stats.focusedTimeMinutes)}
                icon={Clock}
                iconColor="text-blue-600 dark:text-blue-500"
                bgColorClass="bg-blue-100 dark:bg-slate-800 dark:border-slate-700"
              />
              
              <StatCard 
                title="Study Rounds"
                value={stats.studyModeRounds}
                icon={BookOpen}
                iconColor="text-amber-600 dark:text-amber-500"
                bgColorClass="bg-amber-100 dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={onResetStats} className="text-muted-foreground">
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
