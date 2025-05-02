
import React, { useState } from 'react';
import TaskCalendar from './TaskCalendar';
import Calculator from './Calculator';
import HeaderLogo from './HeaderLogo';
import HeaderActions from './HeaderActions';

interface HeaderProps {
  tasks: Array<any>; // We'll type this properly when we use it
}

const Header: React.FC<HeaderProps> = ({
  tasks
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  return (
    <header className="py-4 px-4 sm:px-6 border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 dark:border-slate-800 sticky top-0 z-10">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <HeaderLogo 
            onCalendarOpen={() => setCalendarOpen(true)} 
            onCalculatorOpen={() => setCalculatorOpen(true)} 
          />
          <HeaderActions />
        </div>
      </div>
      
      {/* Modals */}
      <TaskCalendar open={calendarOpen} onOpenChange={setCalendarOpen} tasks={tasks} />
      <Calculator open={calculatorOpen} onOpenChange={setCalculatorOpen} />
    </header>
  );
};

export default Header;
