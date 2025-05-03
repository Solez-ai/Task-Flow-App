
import React from 'react';
import { Badge } from '@/types/badges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useBadges } from '@/hooks/useBadges';

interface BadgeDisplayProps {
  className?: string;
  compact?: boolean;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ className, compact }) => {
  // Get badges from the hook
  const { earnedBadges } = useBadges();
  
  // Safely handle the case where earnedBadges might be undefined
  const badges = earnedBadges || [];
  
  // Group badges by category
  const streakBadges = badges.filter(badge => badge.category === 'streak');
  const timeBadges = badges.filter(badge => badge.category === 'time');
  const taskBadges = badges.filter(badge => badge.category === 'task');
  const goalBadges = badges.filter(badge => badge.category === 'goal');

  if (badges.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className={compact ? "pb-2" : ""}>
          <CardTitle className={compact ? "text-sm" : ""}>Your Badges</CardTitle>
        </CardHeader>
        <CardContent className={compact ? "pt-0 text-xs" : ""}>
          <p className="text-center text-muted-foreground py-4">
            You haven't earned any badges yet. Keep using FocusFlow to unlock achievements!
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderBadgeCategory = (title: string, badges: Badge[]) => {
    if (badges.length === 0) return null;
    
    return (
      <div className={compact ? "mb-3" : "mb-6"}>
        <h3 className={compact ? "text-sm font-semibold mb-2" : "text-lg font-semibold mb-3"}>{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {badges.map(badge => (
            <div 
              key={badge.id}
              className={`flex items-center gap-2 p-2 rounded-md bg-amber-50 border border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/30 ${compact ? 'text-xs' : ''}`}
            >
              <div className={compact ? "text-lg" : "text-2xl"}>{badge.icon}</div>
              <div>
                <p className={compact ? "font-medium text-xs" : "font-medium text-sm"}>{badge.name}</p>
                <p className={compact ? "text-xxs text-muted-foreground" : "text-xs text-muted-foreground"}>{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className={compact ? "pb-2" : ""}>
        <CardTitle className={`flex items-center gap-2 ${compact ? "text-sm" : ""}`}>
          <span className="text-amber-500">🏆</span> Your Badges
        </CardTitle>
      </CardHeader>
      <CardContent className={compact ? "pt-0" : ""}>
        <ScrollArea className={compact ? "h-[200px] pr-4" : "h-[300px] pr-4"}>
          {renderBadgeCategory("Streak Badges", streakBadges)}
          {streakBadges.length > 0 && (timeBadges.length > 0 || taskBadges.length > 0 || goalBadges.length > 0) && (
            <Separator className="my-4" />
          )}
          
          {renderBadgeCategory("Time Badges", timeBadges)}
          {timeBadges.length > 0 && (taskBadges.length > 0 || goalBadges.length > 0) && (
            <Separator className="my-4" />
          )}
          
          {renderBadgeCategory("Task Badges", taskBadges)}
          {taskBadges.length > 0 && goalBadges.length > 0 && (
            <Separator className="my-4" />
          )}
          
          {renderBadgeCategory("Goal Badges", goalBadges)}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default BadgeDisplay;
