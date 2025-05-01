
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/useTheme';

interface CalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ open, onOpenChange }) => {
  const { theme } = useTheme();
  const [display, setDisplay] = useState('0');
  const [currentOperation, setCurrentOperation] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [resetDisplay, setResetDisplay] = useState(false);

  const handleNumberClick = (num: string) => {
    if (display === '0' || resetDisplay) {
      setDisplay(num);
      setResetDisplay(false);
    } else {
      setDisplay(`${display}${num}`);
    }
  };

  const handleOperationClick = (operation: string) => {
    if (previousValue !== null && !resetDisplay) {
      const result = calculateResult(previousValue, parseFloat(display), currentOperation!);
      // Fixed: Convert result to string before setting display
      setDisplay(typeof result === 'number' ? String(result) : result);
      setPreviousValue(typeof result === 'number' ? result : previousValue);
    } else {
      setPreviousValue(parseFloat(display));
    }
    
    setCurrentOperation(operation);
    setResetDisplay(true);
  };

  const calculateResult = (num1: number, num2: number, operation: string): number | string => {
    switch (operation) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case '*':
        return num1 * num2;
      case '/':
        return num2 !== 0 ? num1 / num2 : 'Error';
      default:
        return num2;
    }
  };

  const handleEquals = () => {
    if (currentOperation && previousValue !== null) {
      const result = calculateResult(previousValue, parseFloat(display), currentOperation);
      setDisplay(typeof result === 'number' ? String(result) : result);
      setCurrentOperation(null);
      setPreviousValue(null);
      setResetDisplay(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setCurrentOperation(null);
    setPreviousValue(null);
    setResetDisplay(false);
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(`${display}.`);
    }
  };

  const buttonStyle = theme === 'dark' 
    ? 'bg-slate-800 hover:bg-slate-700 text-gray-200'
    : 'bg-gray-100 hover:bg-gray-200 text-gray-800';
  
  const operationButtonStyle = theme === 'dark'
    ? 'bg-task hover:bg-task-dark text-white'
    : 'bg-task-light hover:bg-task text-task-dark hover:text-white';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[300px] dark:bg-slate-900 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-task-dark dark:text-task">Calculator</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <Input
            value={display}
            readOnly
            className="text-right text-xl py-2 mb-4 font-mono dark:bg-slate-800 dark:text-gray-100"
          />
          
          <div className="grid grid-cols-4 gap-2">
            <Button className={buttonStyle} onClick={() => handleNumberClick('7')}>7</Button>
            <Button className={buttonStyle} onClick={() => handleNumberClick('8')}>8</Button>
            <Button className={buttonStyle} onClick={() => handleNumberClick('9')}>9</Button>
            <Button className={operationButtonStyle} onClick={() => handleOperationClick('/')}>÷</Button>
            
            <Button className={buttonStyle} onClick={() => handleNumberClick('4')}>4</Button>
            <Button className={buttonStyle} onClick={() => handleNumberClick('5')}>5</Button>
            <Button className={buttonStyle} onClick={() => handleNumberClick('6')}>6</Button>
            <Button className={operationButtonStyle} onClick={() => handleOperationClick('*')}>×</Button>
            
            <Button className={buttonStyle} onClick={() => handleNumberClick('1')}>1</Button>
            <Button className={buttonStyle} onClick={() => handleNumberClick('2')}>2</Button>
            <Button className={buttonStyle} onClick={() => handleNumberClick('3')}>3</Button>
            <Button className={operationButtonStyle} onClick={() => handleOperationClick('-')}>−</Button>
            
            <Button className={buttonStyle} onClick={() => handleNumberClick('0')}>0</Button>
            <Button className={buttonStyle} onClick={handleDecimal}>.</Button>
            <Button className={buttonStyle} onClick={handleClear}>C</Button>
            <Button className={operationButtonStyle} onClick={() => handleOperationClick('+')}>+</Button>
            
            <Button className="col-span-4 bg-task-dark hover:bg-task text-white" onClick={handleEquals}>=</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Calculator;
