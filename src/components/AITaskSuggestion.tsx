
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Clock, ArrowDown } from 'lucide-react';
import { Task } from './TaskItem';
import { useGeminiAI } from '@/hooks/useGeminiAI';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AITaskSuggestionProps {
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
}

const AITaskSuggestion: React.FC<AITaskSuggestionProps> = ({ task, onUpdateTask }) => {
  const { queryGemini, loading, response, clearResponse } = useGeminiAI();

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-500 hover:bg-red-600';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-task hover:bg-task-dark';
    }
  };

  const prioritizeTask = async () => {
    if (loading) return;
    
    const result = await queryGemini(`prioritize this task: ${task.text}`);
    
    if (result?.priority) {
      onUpdateTask({ ...task, priority: result.priority });
      toast.success(`Task priority set to ${result.priority}`);
    }
  };

  const estimateTaskTime = async () => {
    if (loading) return;
    
    const result = await queryGemini(`estimate time for task: ${task.text}`);
    
    if (result?.timeEstimate) {
      onUpdateTask({ ...task, timeInMinutes: result.timeEstimate });
      toast.success(`Time estimate: ${result.timeEstimate} minutes`);
    }
  };

  const analyzeSentiment = async () => {
    if (loading) return;
    
    await queryGemini(`analyze sentiment for task: ${task.text}`);
    // Sentiment is displayed in the UI but not saved to the task
  };

  return (
    <Card className="mt-4 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <BrainCircuit className="h-5 w-5 text-task dark:text-task-light" />
          <h3 className="font-medium text-gray-800 dark:text-gray-200">AI Suggestions</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          <Button 
            onClick={prioritizeTask}
            disabled={loading}
            className={cn(
              "text-white",
              task.priority ? getPriorityColor(task.priority) : "bg-task hover:bg-task-dark dark:bg-slate-700"
            )}
            size="sm"
          >
            {loading ? "Analyzing..." : "Prioritize Task"}
            {task.priority && (
              <Badge className="ml-2 bg-white/20">{task.priority}</Badge>
            )}
          </Button>
          
          <Button
            onClick={estimateTaskTime}
            disabled={loading}
            className="bg-task hover:bg-task-dark text-white dark:bg-slate-700"
            size="sm"
          >
            <Clock className="mr-1 h-4 w-4" />
            AI Time Estimate
          </Button>
          
          <Button
            onClick={analyzeSentiment}
            disabled={loading}
            className="bg-task hover:bg-task-dark text-white dark:bg-slate-700"
            size="sm"
          >
            Analyze Sentiment
          </Button>
        </div>
        
        {response && (
          <div className="mt-3 bg-gray-50 dark:bg-slate-900 p-3 rounded-md">
            <p className="text-sm text-gray-700 dark:text-gray-300">{response.text}</p>
            
            {response.suggestions && response.suggestions.length > 0 && (
              <ul className="mt-2 space-y-1">
                {response.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
            
            {response.sentiment && (
              <Badge className={cn(
                "mt-2",
                response.sentiment === 'positive' ? "bg-green-500" : 
                response.sentiment === 'negative' ? "bg-red-500" : "bg-gray-500"
              )}>
                {response.sentiment}
              </Badge>
            )}
            
            <div className="mt-2 text-right">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => clearResponse()}
                className="text-xs dark:text-gray-400"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AITaskSuggestion;
