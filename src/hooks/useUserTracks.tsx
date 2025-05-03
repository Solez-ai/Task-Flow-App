
import { useState, useEffect } from 'react';
import { Track } from '@/components/MusicLibrary';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useUserTracks() {
  const { user } = useAuth();
  const [userTracks, setUserTracks] = useState<Track[]>(() => {
    try {
      const savedTracks = localStorage.getItem('userMusic');
      const savedTracksUserId = localStorage.getItem('userMusicUserId');
      
      // Only restore tracks if they belong to the current user
      if (savedTracks && user && savedTracksUserId === user.id) {
        console.log("Restoring music library for user", user.id);
        return JSON.parse(savedTracks);
      } else if (savedTracks && !user && !savedTracksUserId) {
        console.log("Restoring music library for anonymous user");
        // For non-authenticated users, we can still show their local tracks
        return JSON.parse(savedTracks);
      }
    } catch (error) {
      console.error('Error loading user tracks:', error);
    }
    return [];
  });

  // Fetch music tracks from Supabase when user logs in
  useEffect(() => {
    const fetchUserMusic = async () => {
      if (!user) return;
      
      try {
        console.log("Fetching music from Supabase for user", user.id);
        const { data, error } = await supabase
          .from('user_music')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log("Found music tracks in Supabase:", data.length);
          
          // We can't directly fetch the audio files, but we can check if we already have them locally
          const existingTrackIds = new Set(userTracks.map(track => track.id));
          const newDatabaseTracks = data.filter(dbTrack => !existingTrackIds.has(dbTrack.id));
          
          if (newDatabaseTracks.length > 0) {
            console.log("Found new tracks in database that aren't in local storage:", newDatabaseTracks.length);
            // For now, we'll just show these in a notification
            // In a real implementation, we would fetch the actual audio files from storage
          }
        }
      } catch (error) {
        console.error("Error fetching music from Supabase:", error);
      }
    };
    
    fetchUserMusic();
  }, [user?.id]);

  // Save user tracks to localStorage whenever they change
  useEffect(() => {
    try {
      console.log("Saving music library to localStorage, tracks:", userTracks.length);
      localStorage.setItem('userMusic', JSON.stringify(userTracks));
      
      // Store the user ID alongside music for authentication verification
      if (user) {
        localStorage.setItem('userMusicUserId', user.id);
      }
    } catch (error) {
      console.error('Error saving tracks to localStorage:', error);
    }
  }, [userTracks, user]);

  // Handle file upload
  const handleFileUpload = (file: File): number => {
    const blobUrl = URL.createObjectURL(file);
    
    const newTrack: Track = {
      id: Date.now().toString(), // Use timestamp instead of UUID
      title: file.name.replace(/\.(mp3|wav|ogg)$/i, ''),
      artist: "User Upload",
      src: blobUrl,
      isUserUploaded: true
    };
    
    // Add the new track and return its index
    setUserTracks(prev => [...prev, newTrack]);
    return userTracks.length; // This is the index of the new track
  };

  // Handle track deletion
  const handleDeleteTrack = (id: string | number, currentTrackIndex: number): number => {
    let newIndex = currentTrackIndex;
    
    setUserTracks(prev => {
      const trackIndex = prev.findIndex(track => track.id === id);
      
      // If we're deleting the current track or one before it, update the current index
      if (trackIndex !== -1) {
        if (trackIndex < currentTrackIndex) {
          newIndex = Math.max(0, currentTrackIndex - 1);
        } else if (trackIndex === currentTrackIndex) {
          newIndex = Math.min(prev.length - 2, currentTrackIndex);
          if (newIndex < 0) newIndex = 0;
        }
        
        // Release blob URL to free up memory
        const track = prev[trackIndex];
        if (track?.src?.startsWith('blob:')) {
          URL.revokeObjectURL(track.src);
        }
      }
      
      return prev.filter(track => track.id !== id);
    });
    
    return newIndex;
  };

  return {
    userTracks,
    handleFileUpload,
    handleDeleteTrack
  };
}
