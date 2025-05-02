
import React from 'react';
import { Card } from '@/components/ui/card';
import { Music } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Track } from './MusicLibrary';

interface TrackInfoProps {
  track: Track | null;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ track }) => {
  const { theme } = useTheme();
  
  if (!track) {
    return (
      <Card className={cn(
        "h-20 mb-4 flex items-center justify-center",
        theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-purple-200'
      )}>
        <div className="flex flex-col items-center">
          <Music className="h-6 w-6 text-gray-400 mb-1" />
          <p className="text-sm text-muted-foreground">No track selected</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "h-20 mb-4 flex items-center p-4 bg-gradient-to-r",
      theme === 'dark' 
        ? 'from-slate-800 to-purple-900 border-slate-700'
        : 'from-white to-purple-100 border-purple-200'
    )}>
      <div className="rounded-md flex items-center justify-center h-12 w-12 bg-purple-200 dark:bg-purple-900 mr-4">
        <Music className={cn(
          "h-6 w-6",
          theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
        )} />
      </div>
      <div className="overflow-hidden">
        <h4 className="font-medium text-base truncate dark:text-gray-100">{track.title}</h4>
        <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
      </div>
    </Card>
  );
};

export default TrackInfo;
