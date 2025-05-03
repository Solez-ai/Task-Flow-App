
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Track } from '@/components/MusicLibrary';

export function useAudioPlayer(tracks: Track[], initialTrackIndex: number = 0) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const currentTrack = tracks[currentTrackIndex] || {
    id: 'placeholder',
    title: 'No tracks available',
    artist: 'Please upload music',
    src: '',
    isUserUploaded: true
  };

  // Get audio URL (handle blob URLs and direct file paths)
  const getAudioUrl = (pixabayUrl: string) => {
    if (pixabayUrl.endsWith('.mp3') || pixabayUrl.startsWith('blob:') || !pixabayUrl) return pixabayUrl;
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
    if (tracks.length === 0) {
      toast.info("No tracks available. Please upload music.");
      return;
    }
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(newIndex);
  };

  const prevTrack = () => {
    if (tracks.length === 0) {
      toast.info("No tracks available. Please upload music.");
      return;
    }
    const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
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
