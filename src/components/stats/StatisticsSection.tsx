
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import DailyStatsPanel from '../DailyStatsPanel';
import StreakPanel from '../StreakPanel';
import BadgeDisplay from '../BadgeDisplay';

interface StatisticsSectionProps {
  layoutMode?: 'pc' | 'phone';
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ 
  layoutMode = 'pc' 
}) => {
  const isCompact = layoutMode === 'phone';
  
  return (
    <Card className="shadow-md">
      <CardHeader className={isCompact ? 'pb-2' : ''}>
        <CardTitle className={isCompact ? 'text-lg' : ''}>Statistics</CardTitle>
      </CardHeader>
      <CardContent className={`${isCompact ? 'pt-0 space-y-2' : 'space-y-4'}`}>
        <DailyStatsPanel />
        <StreakPanel />
        <BadgeDisplay compact={isCompact} />
      </CardContent>
    </Card>
  );
};

export default StatisticsSection;
