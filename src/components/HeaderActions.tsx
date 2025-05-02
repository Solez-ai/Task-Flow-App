
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon, Info, User, BrainCircuit } from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import AboutDialog from './AboutDialog';
import PrivacyDialog from './PrivacyDialog';

const HeaderActions: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);

  const handleAIAssistantClick = () => {
    toast.info("AI Features Coming Soon", {
      description: "We're working on intelligent features to help you be more productive!"
    });
  };

  return (
    <>
      <div className="flex items-center gap-3">
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
        
        {/* Account (placeholder) - Updated styling for better dark/light mode handling */}
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-gray-300 hover:bg-slate-100 transition-colors"
        >
          <User className="mr-1 h-4 w-4" />
          <span>Account</span>
        </Button>
      </div>

      {/* Dialogs */}
      <AboutDialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen} />
      <PrivacyDialog open={privacyDialogOpen} onOpenChange={setPrivacyDialogOpen} />
    </>
  );
};

export default HeaderActions;
