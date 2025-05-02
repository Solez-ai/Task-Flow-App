
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon, Info, User, BrainCircuit, Smartphone, Computer, Menu } from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import AboutDialog from './AboutDialog';
import PrivacyDialog from './PrivacyDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useLayout } from '@/contexts/LayoutContext';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const HeaderActions: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const { layoutMode, toggleLayoutMode, isMobileDevice } = useLayout();
  const navigate = useNavigate();
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAIAssistantClick = () => {
    toast.info("AI Features Coming Soon", {
      description: "We're working on intelligent features to help you be more productive!",
      duration: 3000,
    });
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  // Phone layout components
  if (layoutMode === 'phone' || (isMobileDevice && layoutMode === 'phone')) {
    return (
      <div className="flex items-center gap-2">
        {/* Layout Toggle Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full" 
          onClick={toggleLayoutMode}
          title={`Switch to ${layoutMode === 'phone' ? 'PC' : 'Phone'} Layout`}
        >
          {layoutMode === 'phone' ? (
            <Computer className="h-4 w-4" />
          ) : (
            <Smartphone className="h-4 w-4" />
          )}
        </Button>
        
        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80vw] max-w-sm">
            <div className="flex flex-col gap-4 py-4">
              {/* Theme Toggle */}
              <Button 
                variant="outline" 
                className="justify-between" 
                onClick={toggleTheme}
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4 mr-2" /> Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 mr-2" /> Light Mode
                  </>
                )}
              </Button>
              
              {/* AI Assistant Button */}
              <Button 
                className="justify-between relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none hover:opacity-90 transition-opacity" 
                onClick={handleAIAssistantClick}
              >
                <span className="absolute inset-0 animate-pulse bg-white/20 rounded-md"></span>
                <BrainCircuit className="mr-2 h-4 w-4" />
                <span>AI Assistant</span>
              </Button>
              
              {/* About Button */}
              <Button 
                variant="outline" 
                className="justify-between"
                onClick={() => setAboutDialogOpen(true)}
              >
                <Info className="h-4 w-4 mr-2" />
                About FocusFlow
              </Button>
              
              {/* Privacy Button */}
              <Button 
                variant="outline" 
                className="justify-between"
                onClick={() => setPrivacyDialogOpen(true)}
              >
                <Info className="h-4 w-4 mr-2" />
                Privacy Policy
              </Button>
              
              {/* Account Button */}
              {user ? (
                <Button 
                  onClick={handleProfileClick}
                  className="justify-between bg-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-gray-300 hover:bg-slate-100 transition-colors"
                  variant="outline"
                >
                  <div className="flex items-center">
                    <Avatar className="h-5 w-5 mr-2">
                      {profile?.avatar_url ? (
                        <AvatarImage src={profile.avatar_url} alt="Profile" />
                      ) : (
                        <AvatarFallback className="bg-task text-white text-xs">
                          {user.email ? getInitials(user.email) : <User className="h-3 w-3" />}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    Profile
                  </div>
                </Button>
              ) : (
                <Button 
                  onClick={handleAuthClick}
                  className="justify-between bg-task hover:bg-task-dark text-white transition-colors"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // PC layout (original layout)
  return (
    <>
      <div className="flex items-center gap-3">
        {/* Layout Toggle Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full dark:text-gray-300" 
          onClick={toggleLayoutMode}
          title={`Switch to ${layoutMode === 'pc' ? 'Phone' : 'PC'} Layout`}
        >
          {layoutMode === 'pc' ? (
            <Smartphone className="h-4 w-4" />
          ) : (
            <Computer className="h-4 w-4" />
          )}
        </Button>

        {/* AI Assistant Button */}
        <Button variant="outline" size="sm" className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none hover:opacity-90 transition-opacity" onClick={handleAIAssistantClick}>
          <span className="absolute inset-0 animate-pulse bg-white/20 rounded-md"></span>
          <BrainCircuit className="mr-1 h-4 w-4" />
          <span>AI Assistant</span>
        </Button>
        
        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full dark:text-gray-300">
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        
        {/* About Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full dark:text-gray-300">
              <Info className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dark:bg-slate-900 dark:border-slate-800">
            <DropdownMenuLabel className="dark:text-gray-200">About</DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:bg-slate-800" />
            <DropdownMenuItem onClick={() => setAboutDialogOpen(true)} className="dark:text-gray-300 dark:focus:text-white dark:focus:bg-slate-800">
              About FocusFlow
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPrivacyDialogOpen(true)} className="dark:text-gray-300 dark:focus:text-white dark:focus:bg-slate-800">
              Privacy Policy
            </DropdownMenuItem>
            <DropdownMenuItem className="dark:text-gray-300 dark:focus:text-white dark:focus:bg-slate-800">
              Created by Samin Yeasar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Account/Profile Button */}
        {user ? (
          <Button 
            onClick={handleProfileClick}
            size="sm" 
            variant="outline"
            className="bg-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-gray-300 hover:bg-slate-100 transition-colors flex items-center gap-2"
          >
            <Avatar className="h-5 w-5">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt="Profile" />
              ) : (
                <AvatarFallback className="bg-task text-white text-xs">
                  {user.email ? getInitials(user.email) : <User className="h-3 w-3" />}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="hidden sm:inline">Profile</span>
          </Button>
        ) : (
          <Button 
            onClick={handleAuthClick}
            size="sm" 
            className="bg-task hover:bg-task-dark text-white transition-colors"
          >
            <User className="mr-1 h-4 w-4" />
            <span>Sign In</span>
          </Button>
        )}
      </div>

      {/* Dialogs */}
      <AboutDialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen} />
      <PrivacyDialog open={privacyDialogOpen} onOpenChange={setPrivacyDialogOpen} />
    </>
  );
};

export default HeaderActions;
