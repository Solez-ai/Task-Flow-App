
import React from 'react';
import { Badge } from '@/types/badges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface BadgeDisplayProps {
  earnedBadges: Badge[];
  className?: string;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ earnedBadges, className }) => {
  // Group badges by category
  const streakBadges = earnedBadges.filter(badge => badge.category === 'streak');
  const timeBadges = earnedBadges.filter(badge => badge.category === 'time');
  const taskBadges = earnedBadges.filter(badge => badge.category === 'task');
  const goalBadges = earnedBadges.filter(badge => badge.category === 'goal');

  if (earnedBadges.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Your Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            You haven't earned any badges yet. Keep using FocusFlow to unlock achievements!
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderBadgeCategory = (title: string, badges: Badge[]) => {
    if (badges.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {badges.map(badge => (
            <div 
              key={badge.id}
              className="flex items-center gap-2 p-3 rounded-md bg-amber-50 border border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/30"
            >
              <div className="text-2xl">{badge.icon}</div>
              <div>
                <p className="font-medium text-sm">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-amber-500">🏆</span> Your Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
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
