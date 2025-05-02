
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Auth: React.FC = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      toast.success('Account created successfully!', {
        description: 'Please check your email for verification instructions.'
      });
      setActiveTab('login');
    } catch (error: any) {
      toast.error('Sign up failed', {
        description: error.message || 'Please try again with a different email.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-task-dark dark:text-task mb-2">FocusFlow</h1>
          <p className="text-gray-600 dark:text-gray-300">Login or create an account to save your progress</p>
        </div>

        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-4">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            <TabsContent value="login" className="mt-0">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium dark:text-gray-200">Email</label>
                  <Input
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium dark:text-gray-200">Password</label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-task hover:bg-task-dark dark:bg-task dark:hover:bg-task-dark"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium dark:text-gray-200">Email</label>
                  <Input
                    id="signup-email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium dark:text-gray-200">Password</label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="dark:bg-slate-800 dark:border-slate-700"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Password must be at least 6 characters</p>
                </div>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-task hover:bg-task-dark dark:bg-task dark:hover:bg-task-dark"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              By signing in, you'll be able to save all your tasks, stats, and achievements across devices.
            </div>
          </CardFooter>
        </Card>

        <div className="mt-4 text-center">
          <Button variant="link" onClick={() => navigate('/')} className="text-gray-600 dark:text-gray-300">
            ← Back to App
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
