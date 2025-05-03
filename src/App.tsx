
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { LayoutProvider } from './contexts/LayoutContext';
import { ThemeProvider } from '@/hooks/useTheme';
import { StatsProvider } from './contexts/StatsContext';
import './App.css';

const App = () => {
  // Listen for storage events to sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && (
          e.key.startsWith('userMusic') || 
          e.key.startsWith('tasks') ||
          e.key.startsWith('dailyStats') ||
          e.key.startsWith('earnedBadges') ||
          e.key === 'currentTrackIndex'
      )) {
        // Force refresh if key data changed in another tab
        console.log("Storage change detected for key:", e.key, "- reloading page");
        window.location.reload();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <main>
      <AuthProvider>
        <ThemeProvider>
          <LayoutProvider>
            <StatsProvider>
              <Toaster position="bottom-right" richColors closeButton />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </StatsProvider>
          </LayoutProvider>
        </ThemeProvider>
      </AuthProvider>
    </main>
  );
};

export default App;
