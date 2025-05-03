
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Track } from '@/components/MusicLibrary';
import { useAuth } from '@/contexts/AuthContext';

export function useAudioPlayer(tracks: Track[], initialTrackIndex: number = 0) {
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    try {
      // Try to restore current track index from localStorage if available
      const savedIndex = localStorage.getItem('currentTrackIndex');
      const savedIndexUserId = localStorage.getItem('currentTrackIndexUserId');
      
      if (savedIndex !== null && tracks.length > 0) {
        // Check if saved index is valid based on authentication status
        if ((user && savedIndexUserId === user.id) || (!user && !savedIndexUserId)) {
          const parsedIndex = parseInt(savedIndex, 10);
          console.log("Restoring track index:", parsedIndex);
          // Make sure the index is valid for the current track list
          if (parsedIndex >= 0 && parsedIndex < tracks.length) {
            return parsedIndex;
          }
        }
      }
    } catch (error) {
      console.error("Error parsing saved track index:", error);
    }
    return Math.min(initialTrackIndex, Math.max(0, tracks.length - 1));
  });
  
  const [volume, setVolume] = useState(() => {
    try {
      const savedVolume = localStorage.getItem('audioVolume');
      return savedVolume ? parseInt(savedVolume, 10) : 70;
    } catch (error) {
      return 70;
    }
  });
  
  const [isMuted, setIsMuted] = useState(() => {
    try {
      const savedMuted = localStorage.getItem('audioMuted');
      return savedMuted ? savedMuted === 'true' : false;
    } catch (error) {
      return false;
    }
  });
  
  const [isLooping, setIsLooping] = useState(() => {
    try {
      const savedLoop = localStorage.getItem('audioLoop');
      return savedLoop ? savedLoop === 'true' : false;
    } catch (error) {
      return false;
    }
  });
  
  const [playbackRate, setPlaybackRate] = useState(() => {
    try {
      const savedRate = localStorage.getItem('audioPlaybackRate');
      return savedRate ? parseFloat(savedRate) : 1;
    } catch (error) {
      return 1;
    }
  });
  
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Get current track safely
  const currentTrack = tracks.length > 0 && currentTrackIndex < tracks.length ? 
    tracks[currentTrackIndex] : 
    {
      id: 'placeholder',
      title: 'No tracks available',
      artist: 'Please upload music',
      src: '',
      isUserUploaded: true
    };

  // Save audio settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('audioVolume', volume.toString());
      localStorage.setItem('audioMuted', isMuted.toString());
      localStorage.setItem('audioLoop', isLooping.toString());
      localStorage.setItem('audioPlaybackRate', playbackRate.toString());
      
      // If authenticated, associate settings with user
      if (user) {
        localStorage.setItem('currentTrackIndexUserId', user.id);
      }
    } catch (error) {
      console.error("Error saving audio settings:", error);
    }
  }, [volume, isMuted, isLooping, playbackRate, user]);

  // Save current track index to localStorage
  useEffect(() => {
    if (tracks.length > 0) {
      try {
        console.log("Saving current track index:", currentTrackIndex);
        localStorage.setItem('currentTrackIndex', currentTrackIndex.toString());
      } catch (error) {
        console.error("Error saving current track index:", error);
      }
    }
  }, [currentTrackIndex, tracks.length]);

  // Get audio URL (handle blob URLs and direct file paths)
  const getAudioUrl = (trackSrc: string) => {
    if (!trackSrc) return '';
    if (trackSrc.startsWith('blob:')) return trackSrc;
    if (trackSrc.endsWith('.mp3') || trackSrc.endsWith('.wav') || trackSrc.endsWith('.ogg')) return trackSrc;
    return "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3";
  };

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any blob URLs when component unmounts
      tracks.forEach(track => {
        if (track.src && track.src.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(track.src);
          } catch (e) {
            console.error("Error revoking object URL:", e);
          }
        }
      });
    };
  }, []);

  // Initialize audio element
  useEffect(() => {
    console.log("Initializing audio player");
    
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      console.log("Created new audio element");
      
      // Set up audio event listeners
      audioRef.current.addEventListener('loadedmetadata', () => {
        console.log("Audio metadata loaded, duration:", audioRef.current?.duration);
        setDuration(audioRef.current?.duration || 0);
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      
      audioRef.current.addEventListener('ended', () => {
        console.log("Track ended");
        handleTrackEnd();
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error("Audio error:", e);
        toast.error("Error playing track. Please try another file.");
        setIsPlaying(false);
      });
    }
    
    // If we have a current track, set its source
    if (currentTrack?.src) {
      const audioUrl = getAudioUrl(currentTrack.src);
      console.log("Setting initial track source:", audioUrl);
      
      if (audioRef.current.src !== audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
      }
    }
    
    // Apply settings
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
      audioRef.current.loop = isLooping;
      audioRef.current.playbackRate = playbackRate;
    }
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleTrackEnd);
        setIsPlaying(false);
      }
    };
  }, []);

  // Handle track changes
  useEffect(() => {
    if (audioRef.current && currentTrack?.src) {
      const wasPlaying = isPlaying;
      const audioUrl = getAudioUrl(currentTrack.src);
      
      console.log("Changing track, was playing:", wasPlaying, "new URL:", audioUrl);
      
      if (audioRef.current.src !== audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        
        if (wasPlaying) {
          audioRef.current.play().catch(err => {
            console.error("Playback error:", err);
            setIsPlaying(false);
            toast.error("Error playing track. Please try another file.");
          });
        }
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
        console.log("Pausing audio");
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (!currentTrack?.src) {
          toast.error("Please upload music to play");
          return;
        }
        
        console.log("Playing audio");
        audioRef.current.play().catch(err => {
          console.error("Playback error:", err);
          toast.error("Error playing track. Please try another file.");
        }).then(() => {
          setIsPlaying(true);
        });
      }
    }
  };

  const handleTrackEnd = () => {
    console.log("Track ended handler");
    if (!isLooping) {
      nextTrack();
    }
  };

  const nextTrack = () => {
    if (tracks.length === 0) {
      toast.info("No tracks available. Please upload music.");
      return;
    }
    console.log("Next track");
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(newIndex);
  };

  const prevTrack = () => {
    if (tracks.length === 0) {
      toast.info("No tracks available. Please upload music.");
      return;
    }
    console.log("Previous track");
    const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(newIndex);
  };

  const toggleLoop = () => {
    console.log("Toggle loop:", !isLooping);
    setIsLooping(!isLooping);
  };

  const toggleMute = () => {
    console.log("Toggle mute:", !isMuted);
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newValue: number[]) => {
    const vol = newValue[0];
    console.log("Volume change:", vol);
    setVolume(vol);
    if (vol === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleSpeedChange = (newValue: number[]) => {
    const speed = newValue[0] / 100;
    console.log("Speed change:", speed);
    setPlaybackRate(speed);
  };

  // Format time for display (mm:ss)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return {
    audioRef,
    isPlaying,
    currentTrackIndex,
    setCurrentTrackIndex,
    volume,
    isMuted,
    isLooping,
    playbackRate,
    duration,
    currentTime,
    currentTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    toggleLoop,
    toggleMute,
    handleVolumeChange,
    handleSpeedChange,
    formatTime
  };
}
