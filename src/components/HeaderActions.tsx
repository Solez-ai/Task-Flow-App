
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLayout } from '@/contexts/LayoutContext';
import { useTheme } from '@/hooks/useTheme';
import { Monitor, Smartphone, User, Sun, Moon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

const HeaderActions: React.FC = () => {
  const { signOut, user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Add a layout toggle
  const LayoutToggle = () => {
    const { layoutMode, toggleLayoutMode } = useLayout();
    
    return (
      <Button
        variant="outline"
        size="sm"
        className="mr-2"
        onClick={toggleLayoutMode}
      >
        {layoutMode === 'pc' ? <Smartphone size={16} /> : <Monitor size={16} />}
      </Button>
    );
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        className="mr-0"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </Button>
      <LayoutToggle />
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt={user.email || "User Avatar"} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to="/auth">
          <Button variant="outline" size="sm">
            Login
          </Button>
        </Link>
      )}
    </div>
  );
};

export default HeaderActions;
