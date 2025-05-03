
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Track } from '@/components/MusicLibrary';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useUserTracks() {
  const { user } = useAuth();
  const [audioObjectURLs, setAudioObjectURLs] = useState<string[]>([]);
  const [userTracks, setUserTracks] = useState<Track[]>(() => {
    try {
      // Get saved tracks from localStorage
      const savedTracks = localStorage.getItem('userMusicTracks');
      const savedTracksUserId = localStorage.getItem('tracksUserId');
      
      // Only restore tracks if they belong to the current user
      if (savedTracks && user && savedTracksUserId === user.id) {
        return JSON.parse(savedTracks); 
      } else if (savedTracks && !user && !savedTracksUserId) {
        // For non-authenticated users, we can still show their local tracks
        return JSON.parse(savedTracks);
      }
    } catch (error) {
      console.error("Error parsing saved tracks:", error);
    }
    return [];
  });
  
  // Load tracks from Supabase when user logs in
  useEffect(() => {
    async function loadUserTracks() {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_music')
            .select('*')
            .eq('user_id', user.id);
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            const existingTrackIds = new Set(userTracks.map(track => track.id));
            
            // Only add tracks that don't already exist locally
            const newTracks = data
              .filter(dbTrack => !existingTrackIds.has(dbTrack.id))
              .map(dbTrack => ({
                id: dbTrack.id,
                title: dbTrack.title,
                artist: dbTrack.artist || 'My Music',
                src: dbTrack.storage_path,
                isUserUploaded: true
              }));
              
            if (newTracks.length > 0) {
              setUserTracks(prev => [...prev, ...newTracks]);
            }
          }
        } catch (error) {
          console.error("Error loading tracks from Supabase:", error);
        }
      }
    }
    
    loadUserTracks();
  }, [user]);
  
  // Save user tracks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('userMusicTracks', JSON.stringify(userTracks));
    // Store the user ID alongside tracks for authentication verification
    if (user) {
      localStorage.setItem('tracksUserId', user.id);
    }
  }, [userTracks, user]);
  
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

    // If user is logged in, save track to Supabase
    if (user) {
      supabase
        .from('user_music')
        .insert({
          id,
          user_id: user.id,
          title: title,
          artist: 'My Music',
          storage_path: objectURL // This is just a placeholder, in a real app we'd upload to storage
        })
        .then(({ error }) => {
          if (error) {
            console.error('Error saving track to Supabase:', error);
          }
        });
    }
    
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
    
    // If user is logged in, delete track from Supabase
    if (user) {
      supabase
        .from('user_music')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) {
            console.error('Error deleting track from Supabase:', error);
          }
        });
    }
    
    return newTrackIndex;
  };

  return {
    userTracks,
    handleFileUpload,
    handleDeleteTrack
  };
}
