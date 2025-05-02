
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
  Clock,
  Music
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';
import AudioFileUploader from './AudioFileUploader';
import MusicLibrary, { Track } from './MusicLibrary';

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
  const [audioObjectURLs, setAudioObjectURLs] = useState<string[]>([]);
  const [userTracks, setUserTracks] = useState<Track[]>(() => {
    const savedTracks = localStorage.getItem('userMusicTracks');
    return savedTracks ? JSON.parse(savedTracks) : [];
  });
  
  // Only use user tracks (no preset tracks)
  const allTracks = userTracks;
  const currentTrack = allTracks[currentTrackIndex] || {
    id: 'placeholder',
    title: 'No tracks available',
    artist: 'Please upload music',
    src: '',
    isUserUploaded: true
  };

  // Save user tracks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('userMusicTracks', JSON.stringify(userTracks));
  }, [userTracks]);

  // Fix for the Pixabay links to get the actual audio file
  const getAudioUrl = (pixabayUrl: string) => {
    // Check if it's already a usable audio URL
    if (pixabayUrl.endsWith('.mp3') || pixabayUrl.startsWith('blob:') || !pixabayUrl) return pixabayUrl;
    
    // For actual implementation, you would need to handle proper audio file URLs
    // For now, we'll use the demo audio files as fallbacks
    return "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3";
  };

  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack?.src ? getAudioUrl(currentTrack.src) : '');
      
      // Set up audio event listeners
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      
      audioRef.current.addEventListener('ended', handleTrackEnd);
    }
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleTrackEnd);
      }
    };
  }, []);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      audioObjectURLs.forEach(url => URL.revokeObjectURL(url));
    };
  }, [audioObjectURLs]);

  // Handle track changes
  useEffect(() => {
    if (audioRef.current && currentTrack?.src) {
      audioRef.current.src = getAudioUrl(currentTrack.src);
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log("Playback error:", err));
      }
    }
  }, [currentTrackIndex, currentTrack?.src]);

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
        if (!currentTrack?.src) {
          toast.error("Please upload music to play");
          return;
        }
        audioRef.current.play().catch(err => {
          console.log("Playback error:", err);
          toast.error("Error playing track. Please try another file.");
        });
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
    if (allTracks.length === 0) {
      toast.info("No tracks available. Please upload music.");
      return;
    }
    const newIndex = (currentTrackIndex + 1) % allTracks.length;
    setCurrentTrackIndex(newIndex);
  };

  const prevTrack = () => {
    if (allTracks.length === 0) {
      toast.info("No tracks available. Please upload music.");
      return;
    }
    const newIndex = (currentTrackIndex - 1 + allTracks.length) % allTracks.length;
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

  const handleFileUpload = (file: File) => {
    // Create an object URL for the file
    const objectURL = URL.createObjectURL(file);
    setAudioObjectURLs(prev => [...prev, objectURL]);
    
    // Generate a unique ID
    const id = `user-${Date.now()}`;
    
    // Extract title from filename (remove extension)
    const title = file.name.replace(/\.[^/.]+$/, "");
    
    // Add to user tracks
    const newTrack: Track = {
      id,
      title,
      artist: 'My Music',
      src: objectURL,
      isUserUploaded: true
    };
    
    setUserTracks(prev => [...prev, newTrack]);
    
    // If this is the first track, set it as current
    if (userTracks.length === 0) {
      setCurrentTrackIndex(0);
    }
  };

  const handleDeleteTrack = (id: string | number) => {
    // Find the track to get its URL
    const trackToDelete = userTracks.find(track => track.id === id);
    
    // If the current track is being deleted, switch to another track or show empty state
    if (currentTrack && currentTrack.id === id) {
      if (userTracks.length <= 1) {
        // If this is the only track, reset player
        setCurrentTrackIndex(0);
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      } else {
        // Switch to another track
        setCurrentTrackIndex(currentTrackIndex === 0 ? 1 : 0);
      }
    } else if (currentTrackIndex >= userTracks.length - 1) {
      // Adjust currentTrackIndex if the deleted track is before current
      const deletedIndex = userTracks.findIndex(track => track.id === id);
      if (deletedIndex !== -1 && deletedIndex < currentTrackIndex) {
        setCurrentTrackIndex(currentTrackIndex - 1);
      }
    }
    
    // Remove the object URL if it exists
    if (trackToDelete && trackToDelete.src.startsWith('blob:')) {
      URL.revokeObjectURL(trackToDelete.src);
      setAudioObjectURLs(prev => prev.filter(url => url !== trackToDelete.src));
    }
    
    // Update user tracks
    setUserTracks(prev => prev.filter(track => track.id !== id));
    toast.success("Track removed from library");
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    if (audioRef.current && !isPlaying) {
      togglePlay();
    }
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

  const [showUploader, setShowUploader] = useState(true);

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
          
          <Button 
            size="sm" 
            variant={showUploader ? "secondary" : "outline"} 
            onClick={() => setShowUploader(!showUploader)}
            className={cn(
              "text-xs",
              theme === 'dark' ? 'border-purple-700' : 'border-purple-300'
            )}
          >
            <Music className="h-3 w-3 mr-1" />
            {showUploader ? "Hide Uploader" : "Upload Music"}
          </Button>
        </div>

        {/* Track Info */}
        <div className="flex flex-col mb-4">
          <h4 className={cn(
            "font-bold text-base",
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          )}>
            {currentTrack?.title || "No music available"}
          </h4>
          <p className={cn(
            "text-sm",
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            {currentTrack?.artist || "Upload music to start playing"} {currentTrack?.isUserUploaded && '(Uploaded)'}
          </p>
        </div>

        {/* Audio File Uploader (Always shown initially since there's no preset music) */}
        {showUploader && (
          <AudioFileUploader onFileUpload={handleFileUpload} />
        )}

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
            disabled={userTracks.length === 0}
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
            disabled={userTracks.length === 0}
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
            disabled={userTracks.length === 0}
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
            disabled={userTracks.length === 0}
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
        <div className="flex justify-center mb-4">
          <span className="text-xs text-center">
            {playbackRate.toFixed(1)}x speed
          </span>
        </div>
        
        {/* Music Library */}
        <MusicLibrary 
          tracks={allTracks}
          currentTrackIndex={currentTrackIndex}
          isPlaying={isPlaying}
          onTrackSelect={handleTrackSelect}
          onDeleteTrack={(id) => handleDeleteTrack(id)}
        />
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
