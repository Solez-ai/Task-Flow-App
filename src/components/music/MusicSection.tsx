
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MusicPlayer from '../MusicPlayer';
import { useTheme } from '@/hooks/useTheme';

interface MusicSectionProps {
  layoutMode?: 'pc' | 'phone';
}

const MusicSection: React.FC<MusicSectionProps> = ({ layoutMode = 'pc' }) => {
  const { theme } = useTheme();
  const isCompact = layoutMode === 'phone';
  
  // Add dynamic background gradient based on theme
  const bgGradient = theme === 'dark' 
    ? 'from-slate-900 via-purple-900 to-slate-900 border-slate-700'
    : 'from-purple-50 via-purple-100 to-purple-50 border-purple-200';

  return (
    <Card className={`shadow-md bg-gradient-to-r ${bgGradient} overflow-hidden mb-6`}>
      <CardHeader className={isCompact ? 'py-3 px-4' : ''}>
        <CardTitle className={isCompact ? 'text-lg' : ''}>
          Music Player
        </CardTitle>
      </CardHeader>
      <CardContent className={isCompact ? 'pt-0 px-3' : ''}>
        <MusicPlayer />
      </CardContent>
    </Card>
  );
};

export default MusicSection;
