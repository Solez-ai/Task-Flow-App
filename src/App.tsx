
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { LayoutProvider } from './contexts/LayoutContext';
import { StatsProvider } from './contexts/StatsContext';
import './App.css';

const App = () => {
  return (
    <main>
      <AuthProvider>
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
      </AuthProvider>
    </main>
  );
};

export default App;
