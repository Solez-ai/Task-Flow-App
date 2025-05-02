
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Clock } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface AudioControlsProps {
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  toggleMute: () => void;
  handleVolumeChange: (value: number[]) => void;
  handleSpeedChange: (value: number[]) => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  volume,
  isMuted,
  playbackRate,
  toggleMute,
  handleVolumeChange,
  handleSpeedChange
}) => {
  const { theme } = useTheme();
  
  return (
    <>
      {/* Volume Control */}
      <div className="flex items-center gap-2 mb-3">
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 p-0"
          onClick={toggleMute}
        >
          {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <div className="w-full">
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className={theme === 'dark' ? '[&>div]:bg-purple-400' : '[&>div]:bg-purple-500'}
          />
        </div>
      </div>

      {/* Playback Speed Control */}
      <div className="flex items-center gap-2 mb-1">
        <Clock className="h-4 w-4" />
        <div className="w-full flex items-center">
          <span className="text-xs mr-2">0.5x</span>
          <Slider
            value={[playbackRate * 100]}
            min={50}
            max={150}
            step={25}
            onValueChange={handleSpeedChange}
            className={theme === 'dark' ? '[&>div]:bg-purple-400' : '[&>div]:bg-purple-500'}
          />
          <span className="text-xs ml-2">1.5x</span>
        </div>
      </div>

      {/* Current Speed Display */}
      <div className="flex justify-center mb-4">
        <span className="text-xs text-center">
          {playbackRate.toFixed(1)}x speed
        </span>
      </div>
    </>
  );
};

export default AudioControls;
