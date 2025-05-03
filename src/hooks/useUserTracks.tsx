
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Track } from '@/components/MusicLibrary';

export function useUserTracks() {
  const [audioObjectURLs, setAudioObjectURLs] = useState<string[]>([]);
  const [userTracks, setUserTracks] = useState<Track[]>(() => {
    const savedTracks = localStorage.getItem('userMusicTracks');
    return savedTracks ? JSON.parse(savedTracks) : [];
  });
  
  // Save user tracks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('userMusicTracks', JSON.stringify(userTracks));
  }, [userTracks]);
  
  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      audioObjectURLs.forEach(url => URL.revokeObjectURL(url));
    };
  }, [audioObjectURLs]);
  
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
    
    // Return the index of the new track
    return userTracks.length;
  };

  const handleDeleteTrack = (id: string | number, currentTrackIndex: number) => {
    // Find the track to get its URL
    const trackToDelete = userTracks.find(track => track.id === id);
    
    // Determine the new current track index
    let newTrackIndex = currentTrackIndex;
    
    if (userTracks.length <= 1) {
      // If this is the only track, reset index
      newTrackIndex = 0;
    } else {
      // Adjust index if needed
      const deletedIndex = userTracks.findIndex(track => track.id === id);
      if (deletedIndex !== -1 && deletedIndex < currentTrackIndex) {
        newTrackIndex = currentTrackIndex - 1;
      } else if (deletedIndex === currentTrackIndex && deletedIndex === userTracks.length - 1) {
        // If we're deleting the last track and it's currently playing, move to previous track
        newTrackIndex = Math.max(0, currentTrackIndex - 1);
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
    
    return newTrackIndex;
  };

  return {
    userTracks,
    handleFileUpload,
    handleDeleteTrack
  };
}
