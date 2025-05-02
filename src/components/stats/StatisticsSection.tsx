
import React from 'react';
import DailyStatsPanel from '../DailyStatsPanel';
import StreakPanel from '../StreakPanel';

const StatisticsSection: React.FC = () => {
  return (
    <>
      <DailyStatsPanel />
      <StreakPanel />
    </>
  );
};

export default StatisticsSection;
