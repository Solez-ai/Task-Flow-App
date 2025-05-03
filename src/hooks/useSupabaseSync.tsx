
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useStats } from '@/contexts/StatsContext';
import { Task } from '@/components/TaskItem';
import { Track } from '@/components/MusicLibrary';
import { toast } from 'sonner';

// Hook to sync local app data with Supabase when user is authenticated
export function useSupabaseSync(
  tasks: Task[],
  userTracks: Track[]
) {
  const { user } = useAuth();
  const { stats } = useStats();

  // Sync tasks with Supabase
  const syncTasks = async () => {
    if (!user) return;
    
    try {
      // First get tasks from Supabase
      const { data: existingTasks, error: fetchError } = await supabase
        .from('tasks')
        .select('id')
        .eq('user_id', user.id);
        
      if (fetchError) throw fetchError;
      
      // For each local task, check if it exists in Supabase
      const existingIds = new Set((existingTasks || []).map(t => t.id));
      
      for (const task of tasks) {
        if (existingIds.has(task.id)) {
          // Update existing task
          const { error: updateError } = await supabase
            .from('tasks')
            .update({
              text: task.text,
              completed: task.completed,
              time_in_minutes: task.timeInMinutes,
              note: task.note || null,
              important: task.important || false,
              completed_at: task.completedAt || null
            })
            .eq('id', task.id);
            
          if (updateError) console.error('Error updating task:', updateError);
        } else {
          // Insert new task
          const { error: insertError } = await supabase
            .from('tasks')
            .insert({
              id: task.id,
              user_id: user.id,
              text: task.text,
              completed: task.completed,
              time_in_minutes: task.timeInMinutes,
              note: task.note || null,
              important: task.important || false,
              completed_at: task.completedAt || null
            });
            
          if (insertError) console.error('Error inserting task:', insertError);
        }
      }
    } catch (error) {
      console.error('Error syncing tasks:', error);
    }
  };

  // Sync user music tracks
  const syncMusicTracks = async () => {
    if (!user || userTracks.length === 0) return;
    
    // Only sync music that has been user uploaded
    const userUploadedTracks = userTracks.filter(track => track.isUserUploaded);
    if (userUploadedTracks.length === 0) return;
    
    try {
      // Check existing tracks in the database
      const { data: existingTracks, error: fetchError } = await supabase
        .from('user_music')
        .select('id, title')
        .eq('user_id', user.id);
        
      if (fetchError) throw fetchError;
      
      const existingTitles = new Set((existingTracks || []).map(t => t.title));
      
      // Only add tracks that don't already exist in the database
      const newTracks = userUploadedTracks.filter(track => !existingTitles.has(track.title));
      
      if (newTracks.length > 0) {
        for (const track of newTracks) {
          // For new tracks, we need to first upload the audio file to storage
          // We're working with Blob URLs which can't be directly sent to Supabase
          // This would require additional work to convert the blob to a file and upload
          // For now, we'll just record the metadata
          const { error: insertError } = await supabase
            .from('user_music')
            .insert({
              user_id: user.id,
              title: track.title,
              artist: track.artist,
              storage_path: 'user_uploaded' // Placeholder since we're not uploading the actual file yet
            });
            
          if (insertError) console.error('Error inserting music track:', insertError);
        }
      }
    } catch (error) {
      console.error('Error syncing music tracks:', error);
    }
  };
  
  // Sync all data when user changes or when there's local data changes
  useEffect(() => {
    if (!user) return;
    
    const syncAllData = async () => {
      await Promise.all([
        syncTasks(),
        syncMusicTracks()
      ]);
    };

    // Sync immediately when tasks or tracks change
    syncAllData();
    
    // Also set up a periodic sync
    const syncTimer = setInterval(syncAllData, 60000); // Sync every minute
    
    return () => {
      clearInterval(syncTimer);
    };
  }, [user, tasks, userTracks]);
  
  return {
    syncTasks,
    syncMusicTracks
  };
}
