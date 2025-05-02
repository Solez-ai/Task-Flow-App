
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import AudioFileUploader from './AudioFileUploader';
import MusicLibrary from './MusicLibrary';
import PlayerControls from './PlayerControls';
import AudioControls from './AudioControls';
import TrackInfo from './TrackInfo';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useUserTracks } from '@/hooks/useUserTracks';

const MusicPlayer: React.FC = () => {
  const { theme } = useTheme();
  const { userTracks, handleFileUpload, handleDeleteTrack } = useUserTracks();
  const [showUploader, setShowUploader] = useState(true);
  
  // Only use user tracks (no preset tracks)
  const allTracks = userTracks;
  
  const {
    isPlaying,
    currentTrackIndex, 
    setCurrentTrackIndex,
    volume,
    isMuted,
    isLooping,
    playbackRate,
    currentTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    toggleLoop,
    toggleMute,
    handleVolumeChange,
    handleSpeedChange
  } = useAudioPlayer(allTracks);

  const onFileUpload = (file: File) => {
    const newIndex = handleFileUpload(file);
    
    // If this is the first track, set it as current
    if (userTracks.length === 0) {
      setCurrentTrackIndex(0);
    }
  };

  const onDeleteTrack = (id: string | number) => {
    // If the current track is being deleted, switch to another track or show empty state
    const newIndex = handleDeleteTrack(id, currentTrackIndex);
    
    // Update the current track index if needed
    if (currentTrack && currentTrack.id === id) {
      setCurrentTrackIndex(newIndex);
      if (isPlaying && userTracks.length <= 1) {
        togglePlay(); // Stop playback if we deleted the last/only track
      }
    }
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    if (!isPlaying) {
      togglePlay();
    }
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
        <TrackInfo track={currentTrack} />

        {/* Audio File Uploader */}
        {showUploader && (
          <AudioFileUploader onFileUpload={onFileUpload} />
        )}

        {/* Player Controls */}
        <PlayerControls
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          prevTrack={prevTrack}
          nextTrack={nextTrack}
          toggleLoop={toggleLoop}
          isLooping={isLooping}
          disabled={userTracks.length === 0}
        />

        {/* Audio Controls (Volume & Speed) */}
        <AudioControls
          volume={volume}
          isMuted={isMuted}
          playbackRate={playbackRate}
          toggleMute={toggleMute}
          handleVolumeChange={handleVolumeChange}
          handleSpeedChange={handleSpeedChange}
        />
        
        {/* Music Library */}
        <MusicLibrary 
          tracks={allTracks}
          currentTrackIndex={currentTrackIndex}
          isPlaying={isPlaying}
          onTrackSelect={handleTrackSelect}
          onDeleteTrack={onDeleteTrack}
        />
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
