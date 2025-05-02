
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-4xl font-bold mb-2 text-task-dark dark:text-task">404</h1>
      <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">Page not found</p>
      <p className="text-center mb-8 text-gray-500 dark:text-gray-400 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link to="/">
        <Button>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
