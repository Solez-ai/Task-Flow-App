
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface PlayerControlsProps {
  isPlaying: boolean;
  togglePlay: () => void;
  prevTrack: () => void;
  nextTrack: () => void;
  toggleLoop: () => void;
  isLooping: boolean;
  disabled: boolean;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  togglePlay,
  prevTrack,
  nextTrack,
  toggleLoop,
  isLooping,
  disabled
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center justify-between mb-4">
      <Button 
        size="icon" 
        variant="outline" 
        className={cn(
          "rounded-full",
          theme === 'dark' ? 'border-purple-700 hover:bg-purple-900' : 'border-purple-300 hover:bg-purple-100'
        )} 
        onClick={prevTrack}
        disabled={disabled}
      >
        <SkipBack className="h-4 w-4" />
      </Button>
      
      <Button 
        onClick={togglePlay}
        className={cn(
          "rounded-full w-12 h-12 flex items-center justify-center",
          theme === 'dark' 
            ? 'bg-purple-600 hover:bg-purple-700' 
            : 'bg-purple-500 hover:bg-purple-600'
        )}
        disabled={disabled}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
      </Button>
      
      <Button 
        size="icon" 
        variant="outline" 
        className={cn(
          "rounded-full",
          theme === 'dark' ? 'border-purple-700 hover:bg-purple-900' : 'border-purple-300 hover:bg-purple-100'
        )} 
        onClick={nextTrack}
        disabled={disabled}
      >
        <SkipForward className="h-4 w-4" />
      </Button>
      
      <Button 
        size="icon" 
        variant="outline" 
        onClick={toggleLoop}
        className={cn(
          "rounded-full",
          isLooping 
            ? (theme === 'dark' ? 'bg-purple-700 text-white' : 'bg-purple-200 text-purple-800') 
            : (theme === 'dark' ? 'border-purple-700 hover:bg-purple-900' : 'border-purple-300 hover:bg-purple-100')
        )}
        disabled={disabled}
      >
        <Repeat className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PlayerControls;
