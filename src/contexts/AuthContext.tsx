
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      // Store profile data in localStorage for persistence
      if (data) {
        console.log("Profile found:", data);
        localStorage.setItem('userProfile', JSON.stringify(data));
        setProfile(data);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      // Try to get profile from localStorage if fetch fails
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          if (parsedProfile && parsedProfile.id === userId) {
            setProfile(parsedProfile);
            console.log("Using cached profile from localStorage");
          } else {
            console.log("Cached profile doesn't match current user, ignoring");
          }
        } catch (e) {
          console.error("Error parsing saved profile:", e);
        }
      }
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    // Set loading state while we get the session
    setIsLoading(true);
    console.log("Setting up auth state listener");

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // We use setTimeout to avoid nested Supabase calls which can cause deadlocks
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }

        if (event === 'SIGNED_IN') {
          toast.success('Signed in successfully');
        } else if (event === 'SIGNED_OUT') {
          toast.info('Signed out successfully');
          localStorage.removeItem('userProfile');
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession ? "Found session" : "No session");
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        // Use existing profile data from localStorage if available
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          try {
            const parsedProfile = JSON.parse(savedProfile);
            if (parsedProfile && parsedProfile.id === initialSession.user.id) {
              setProfile(parsedProfile);
              console.log("Using cached profile from localStorage");
            }
          } catch (e) {
            console.error("Error parsing saved profile:", e);
          }
        }
        
        fetchProfile(initialSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for:", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error);
        toast.error("Sign in failed: " + error.message);
      }
      
      return { error };
    } catch (error) {
      console.error("Unexpected sign in error:", error);
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      console.log("Attempting sign up for:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign up error:", error);
        toast.error("Sign up failed: " + error.message);
      } else {
        toast.success("Sign up successful! Verify your email if required.");
      }
      
      return { data, error };
    } catch (error) {
      console.error("Unexpected sign up error:", error);
      return { error, data: null };
    }
  };

  // Sign out
  const signOut = async () => {
    console.log("Signing out");
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
