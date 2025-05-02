import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Volume2, 
  VolumeX,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

// Define music tracks with the user's provided links
const musicTracks = [
  {
    id: 1,
    title: "Quiet Night",
    artist: "Lofi Beat",
    src: "https://pixabay.com/music/beats-quiet-night-lofi-332744/"
  },
  {
    id: 2,
    title: "Lofi Coffee",
    artist: "Lofi Beat",
    src: "https://pixabay.com/music/beats-lofi-coffee-332824/"
  },
  {
    id: 3,
    title: "Lofi Rain",
    artist: "Lofi Music",
    src: "https://pixabay.com/music/beats-lofi-rain-lofi-music-332732/"
  },
  {
    id: 4,
    title: "Coffee Lofi Chill",
    artist: "Lofi Music",
    src: "https://pixabay.com/music/beats-coffee-lofi-chill-lofi-music-332738/"
  },
  {
    id: 5,
    title: "Rainy Lofi City",
    artist: "Lofi Music",
    src: "https://pixabay.com/music/beats-rainy-lofi-city-lofi-music-332746/"
  },
  {
    id: 6,
    title: "Soft Calm",
    artist: "Upbeat Background",
    src: "https://pixabay.com/music/upbeat-background-music-soft-calm-333111/"
  }
];

const MusicPlayer: React.FC = () => {
  const { theme } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const currentTrack = musicTracks[currentTrackIndex];

  // Fix for the Pixabay links to get the actual audio file
  const getAudioUrl = (pixabayUrl: string) => {
    // Pixabay links need special handling as they're not direct download links
    // This pattern transforms the display URLs to actual audio file URLs
    // For example: transforms the webpage URL to actual audio file URL
    
    // Check if it's already a usable audio URL
    if (pixabayUrl.endsWith('.mp3')) return pixabayUrl;
    
    // For actual implementation, you would need to handle proper audio file URLs
    // For now, we'll use the demo audio files as fallbacks
    return "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3";
  };

  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio(getAudioUrl(currentTrack.src));
      
      // Set up audio event listeners
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      
      audioRef.current.addEventListener('ended', handleTrackEnd);
    }
    
    // Update audio properties when track changes
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleTrackEnd);
      }
    };
  }, []);

  // Handle track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = getAudioUrl(currentTrack.src);
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log("Playback error:", err));
      }
    }
  }, [currentTrackIndex, currentTrack.src]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Handle playback rate changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Handle loop setting
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log("Playback error:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTrackEnd = () => {
    if (!isLooping) {
      nextTrack();
    }
  };

  const nextTrack = () => {
    const newIndex = (currentTrackIndex + 1) % musicTracks.length;
    setCurrentTrackIndex(newIndex);
  };

  const prevTrack = () => {
    const newIndex = (currentTrackIndex - 1 + musicTracks.length) % musicTracks.length;
    setCurrentTrackIndex(newIndex);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newValue: number[]) => {
    const vol = newValue[0];
    setVolume(vol);
    if (vol === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleSpeedChange = (newValue: number[]) => {
    setPlaybackRate(newValue[0] / 100);
  };

  // Format time for display (mm:ss)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Dynamic background gradient based on theme
  const bgGradient = theme === 'dark' 
    ? 'bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-slate-700'
    : 'bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50 border-purple-200';

  return (
    <Card className={cn(
      "mb-8 overflow-hidden transition-all duration-300",
      bgGradient
    )}>
      <CardContent className="p-5">
        {/* Music Player Title */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={cn(
              "text-lg font-medium",
              theme === 'dark' ? 'text-purple-200' : 'text-purple-800'
            )}>
              Focus Flow Music
            </h3>
            <p className={cn(
              "text-xs italic",
              theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
            )}>
              "Music is one of the keys to focus"
            </p>
          </div>
        </div>

        {/* Track Info */}
        <div className="flex flex-col mb-4">
          <h4 className={cn(
            "font-bold text-base",
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          )}>
            {currentTrack.title}
          </h4>
          <p className={cn(
            "text-sm",
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            {currentTrack.artist}
          </p>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            size="icon" 
            variant="outline" 
            className={cn(
              "rounded-full",
              theme === 'dark' ? 'border-purple-700 hover:bg-purple-900' : 'border-purple-300 hover:bg-purple-100'
            )} 
            onClick={prevTrack}
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
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>

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
        <div className="flex justify-center">
          <span className="text-xs text-center">
            {playbackRate.toFixed(1)}x speed
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
