
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Calculator as CalculatorIcon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface HeaderLogoProps {
  onCalendarOpen: () => void;
  onCalculatorOpen: () => void;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ onCalendarOpen, onCalculatorOpen }) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center gap-3">
      {/* Logo image in light mode, text in dark mode */}
      {theme === 'light' ? (
        <div className="h-14">
          <img 
            src="/lovable-uploads/6fe1d351-56a8-45e0-b312-d6db23663f33.png" 
            alt="FocusFlow Logo" 
            className="h-full object-contain"
          />
        </div>
      ) : (
        <h1 className="text-task text-2xl font-bold">FocusFlow</h1>
      )}
      
      {/* Mini Calendar Button */}
      <Button variant="ghost" size="icon" onClick={onCalendarOpen} className="h-8 w-8 rounded-full hover:bg-task/10 dark:hover:bg-task/20" title="Task Calendar">
        <Calendar className="h-4 w-4 text-task-dark dark:text-task" />
      </Button>
      
      {/* Mini Calculator Button */}
      <Button variant="ghost" size="icon" onClick={onCalculatorOpen} className="h-8 w-8 rounded-full hover:bg-task/10 dark:hover:bg-task/20" title="Quick Calculator">
        <CalculatorIcon className="h-4 w-4 text-task-dark dark:text-task" />
      </Button>
    </div>
  );
};

export default HeaderLogo;
