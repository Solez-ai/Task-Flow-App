
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Calculator as CalculatorIcon } from 'lucide-react';

interface HeaderLogoProps {
  onCalendarOpen: () => void;
  onCalculatorOpen: () => void;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ onCalendarOpen, onCalculatorOpen }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl font-bold text-task-dark dark:text-task">FocusFlow</span>
      
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
