
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { Track } from '@/components/MusicLibrary';

interface TrackInfoProps {
  track: Track | {
    id: string;
    title: string;
    artist: string;
    src: string;
    isUserUploaded?: boolean;
  };
}

const TrackInfo: React.FC<TrackInfoProps> = ({ track }) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex flex-col mb-4">
      <h4 className={cn(
        "font-bold text-base",
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      )}>
        {track?.title || "No music available"}
      </h4>
      <p className={cn(
        "text-sm",
        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
      )}>
        {track?.artist || "Upload music to start playing"} {track?.isUserUploaded && '(Uploaded)'}
      </p>
    </div>
  );
};

export default TrackInfo;
