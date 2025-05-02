
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
  return (
    <Card className="shadow-md">
      <CardHeader className={layoutMode === 'phone' ? 'pb-2' : ''}>
        <CardTitle className={layoutMode === 'phone' ? 'text-lg' : ''}>Statistics</CardTitle>
      </CardHeader>
      <CardContent className={`${layoutMode === 'phone' ? 'pt-0 space-y-2' : 'space-y-4'}`}>
        <DailyStatsPanel compact={layoutMode === 'phone'} />
        <StreakPanel compact={layoutMode === 'phone'} />
        <BadgeDisplay compact={layoutMode === 'phone'} />
      </CardContent>
    </Card>
  );
};

export default StatisticsSection;
