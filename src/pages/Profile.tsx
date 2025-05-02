import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Loader2, Upload, User } from 'lucide-react';
const Profile: React.FC = () => {
  const {
    user,
    profile,
    signOut,
    refreshProfile
  } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
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
  }, [user, profile, navigate]);
  const updateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedAt = new Date().toISOString(); // Convert Date to string

      const {
        error
      } = await supabase.from('profiles').update({
        username,
        updated_at: updatedAt
      }).eq('id', user.id);
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
      const {
        error: uploadError
      } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data
      } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const avatarUrl = data.publicUrl;

      // Update profile
      const {
        error: updateError
      } = await supabase.from('profiles').update({
        avatar_url: avatarUrl
      }).eq('id', user.id);
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
  return <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-slate-950 dark:to-slate-900">
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

        <Card className="dark:bg-slate-900 dark:border-slate-800 max-w-lg mx-auto">
          <CardHeader className="pb-2 my-[36px]">
            <CardTitle className="dark:text-gray-200">Profile Details</CardTitle>
            <CardDescription className="dark:text-gray-400">Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-task">
                  {avatarUrl ? <AvatarImage src={avatarUrl} alt="Profile" /> : <AvatarFallback className="bg-task text-white text-xl">
                      {user?.email ? getInitials(user.email) : <User />}
                    </AvatarFallback>}
                </Avatar>
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-task text-white p-1 rounded-full cursor-pointer">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </label>
                <input id="avatar-upload" type="file" accept="image/*" onChange={uploadAvatar} className="hidden" disabled={uploading} />
              </div>
              <p className="mt-3 text-sm font-medium dark:text-gray-300">{user.email}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium dark:text-gray-300">Username</label>
                <Input id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" className="dark:bg-slate-800 dark:border-slate-700" />
              </div>

              <Button onClick={updateProfile} disabled={loading} className="w-full bg-task hover:bg-task-dark dark:bg-task dark:hover:bg-task-dark">
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Profile;