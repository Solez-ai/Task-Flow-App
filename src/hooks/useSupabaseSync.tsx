
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useStats } from '@/contexts/StatsContext';
import { useBadges } from '@/hooks/useBadges';
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
  const { earnedBadges } = useBadges();

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

  // Sync daily stats with Supabase
  const syncDailyStats = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      // Check if we have stats for today
      const { data: existingStat, error: fetchError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();
        
      if (fetchError) throw fetchError;
      
      if (existingStat) {
        // Update existing stats
        const { error: updateError } = await supabase
          .from('user_stats')
          .update({
            pomodoro_sessions: stats.pomodoroSessions,
            completed_tasks: stats.completedTasks,
            focused_time_minutes: stats.focusedTimeMinutes,
            study_mode_rounds: stats.studyModeRounds
          })
          .eq('id', existingStat.id);
          
        if (updateError) throw updateError;
      } else {
        // Insert new stats for today
        const { error: insertError } = await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            date: today,
            pomodoro_sessions: stats.pomodoroSessions,
            completed_tasks: stats.completedTasks,
            focused_time_minutes: stats.focusedTimeMinutes,
            study_mode_rounds: stats.studyModeRounds
          });
          
        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error syncing stats:', error);
    }
  };

  // Sync earned badges with Supabase
  const syncBadges = async () => {
    if (!user || earnedBadges.length === 0) return;
    
    try {
      // Get existing badges for user
      const { data: existingBadges, error: fetchError } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', user.id);
        
      if (fetchError) throw fetchError;
      
      const existingBadgeIds = new Set((existingBadges || []).map(b => b.badge_id));
      const newBadges = earnedBadges.filter(badge => !existingBadgeIds.has(badge.id));
      
      // Insert only new badges
      if (newBadges.length > 0) {
        const { error: insertError } = await supabase
          .from('user_badges')
          .insert(
            newBadges.map(badge => ({
              user_id: user.id,
              badge_id: badge.id,
              name: badge.name,
              description: badge.description,
              category: badge.category,
              icon: badge.icon
            }))
          );
          
        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error syncing badges:', error);
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
        syncDailyStats(),
        syncBadges(),
        syncMusicTracks()
      ]);
    };

    const syncTimer = setInterval(syncAllData, 60000); // Sync every minute
    
    // Initial sync
    syncAllData();
    
    return () => {
      clearInterval(syncTimer);
    };
  }, [user, tasks, stats, earnedBadges, userTracks]);
  
  return {
    syncTasks,
    syncDailyStats,
    syncBadges,
    syncMusicTracks
  };
}
