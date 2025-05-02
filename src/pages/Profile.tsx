
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Loader2, Upload, User, History, Music } from 'lucide-react';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [taskHistory, setTaskHistory] = useState<any[]>([]);
  const [userMusic, setUserMusic] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // If user is not logged in, redirect to auth page
    if (!user) {
      navigate('/auth');
      return;
    }

    // Load profile data
    if (profile) {
      setUsername(profile.username || '');
      setAvatarUrl(profile.avatar_url);
    }

    // Load user data
    fetchUserData();
  }, [user, profile, navigate]);

  const fetchUserData = async () => {
    setLoadingData(true);
    if (!user) return;

    try {
      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;
      setTaskHistory(tasksData || []);

      // Fetch music
      const { data: musicData, error: musicError } = await supabase
        .from('user_music')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (musicError) throw musicError;
      setUserMusic(musicData || []);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load your data');
    } finally {
      setLoadingData(false);
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const updatedAt = new Date().toISOString(); // Convert Date to string
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          updated_at: updatedAt,
        })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const avatarUrl = data.publicUrl;

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(avatarUrl);
      await refreshProfile();
      toast.success('Avatar updated');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error('Error uploading avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (!user) {
    return null; // Will redirect to auth page via useEffect
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  // Format tasks for display
  const formattedTasks = taskHistory.map(task => ({
    ...task,
    formattedDate: format(new Date(task.created_at), 'MMM dd, yyyy'),
    formattedCompletedAt: task.completed_at ? format(new Date(task.completed_at), 'MMM dd, yyyy') : '-'
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-task-dark dark:text-task">Your Profile</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/')}>
              Return to App
            </Button>
            <Button variant="destructive" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Section */}
          <Card className="md:col-span-1 dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="dark:text-gray-200">Profile Details</CardTitle>
              <CardDescription className="dark:text-gray-400">Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-task">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt="Profile" />
                    ) : (
                      <AvatarFallback className="bg-task text-white text-xl">
                        {user?.email ? getInitials(user.email) : <User />}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-task text-white p-1 rounded-full cursor-pointer"
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    className="hidden"
                    disabled={uploading}
                  />
                </div>
                <p className="mt-3 text-sm font-medium dark:text-gray-300">{user.email}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium dark:text-gray-300">Username</label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>

                <Button
                  onClick={updateProfile}
                  disabled={loading}
                  className="w-full bg-task hover:bg-task-dark dark:bg-task dark:hover:bg-task-dark"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Data Section */}
          <Card className="md:col-span-2 dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="dark:text-gray-200">Your Activity Data</CardTitle>
              <CardDescription className="dark:text-gray-400">View your tasks and music</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {loadingData ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-task" />
                </div>
              ) : (
                <Tabs defaultValue="history">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="history" className="flex items-center gap-1">
                      <History className="h-4 w-4" />
                      <span className="hidden sm:inline">Task History</span>
                    </TabsTrigger>
                    <TabsTrigger value="music" className="flex items-center gap-1">
                      <Music className="h-4 w-4" />
                      <span className="hidden sm:inline">Music Library</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Task History Tab */}
                  <TabsContent value="history" className="space-y-4">
                    {formattedTasks.length === 0 ? (
                      <div className="text-center py-12">
                        <History className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <h3 className="text-xl font-medium dark:text-gray-300">No task history yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Your completed tasks will appear here</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b dark:border-gray-700">
                              <th className="py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Task</th>
                              <th className="py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                              <th className="py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                              <th className="py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Completed</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formattedTasks.slice(0, 10).map((task) => (
                              <tr key={task.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                <td className="py-2 text-sm dark:text-gray-300">{task.text}</td>
                                <td className="py-2 text-sm dark:text-gray-300">{task.formattedDate}</td>
                                <td className="py-2 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs ${task.completed ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                                    {task.completed ? 'Completed' : 'Pending'}
                                  </span>
                                </td>
                                <td className="py-2 text-sm dark:text-gray-300">{task.formattedCompletedAt}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {formattedTasks.length > 10 && (
                          <div className="text-center mt-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Showing 10 of {formattedTasks.length} tasks</p>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  {/* Music Library Tab */}
                  <TabsContent value="music">
                    <h3 className="text-lg font-medium mb-3 dark:text-gray-200">Your Music Collection</h3>
                    {userMusic.length === 0 ? (
                      <div className="text-center py-12">
                        <Music className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <h3 className="text-xl font-medium dark:text-gray-300">Your music library is empty</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          Upload music in the app to build your collection
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {userMusic.map((track) => (
                          <div 
                            key={track.id}
                            className="flex items-center p-3 border rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <div className="h-10 w-10 flex items-center justify-center bg-task/10 rounded-md mr-3">
                              <Music className="h-5 w-5 text-task" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate dark:text-gray-200">{track.title}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{track.artist}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
