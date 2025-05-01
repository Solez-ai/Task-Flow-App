
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Clock, ArrowDown, Tag, MessageCircle } from 'lucide-react';
import { Task } from './TaskItem';
import { useGeminiAI } from '@/hooks/useGeminiAI';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import AIChat from './AIChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AITaskSuggestionProps {
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
}

const AITaskSuggestion: React.FC<AITaskSuggestionProps> = ({ task, onUpdateTask }) => {
  const { queryGemini, loading, response, clearResponse } = useGeminiAI();
  const [currentTab, setCurrentTab] = useState('suggestions');
  const [projectName, setProjectName] = useState(task.project || '');
  const [showProjectInput, setShowProjectInput] = useState(false);

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
  
  const addProjectTag = () => {
    if (!projectName.trim()) return;
    
    onUpdateTask({ ...task, project: projectName.trim() });
    toast.success(`Added to project: ${projectName}`);
    setShowProjectInput(false);
  };

  return (
    <Card className="mt-4 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <BrainCircuit className="h-5 w-5 text-task dark:text-task-light" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs defaultValue="suggestions" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-2 mb-4 bg-gray-100 dark:bg-slate-800">
            <TabsTrigger value="suggestions" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              Quick Actions
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              <span className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                Chat
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="suggestions">
            <div className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button 
                  onClick={prioritizeTask}
                  disabled={loading}
                  className={cn(
                    "text-white px-3 py-2 h-auto",
                    task.priority ? getPriorityColor(task.priority) : "bg-task hover:bg-task-dark dark:bg-slate-700"
                  )}
                >
                  {loading ? "Analyzing..." : "Prioritize Task"}
                  {task.priority && (
                    <Badge className="ml-2 bg-white/20">{task.priority}</Badge>
                  )}
                </Button>
                
                <Button
                  onClick={estimateTaskTime}
                  disabled={loading}
                  className="bg-task hover:bg-task-dark text-white dark:bg-slate-700 px-3 py-2 h-auto"
                >
                  <Clock className="mr-1 h-4 w-4" />
                  AI Time Estimate
                </Button>
                
                <Button
                  onClick={analyzeSentiment}
                  disabled={loading}
                  className="bg-task hover:bg-task-dark text-white dark:bg-slate-700 px-3 py-2 h-auto"
                >
                  Analyze Sentiment
                </Button>
              </div>
              
              <div className="mt-2">
                {showProjectInput ? (
                  <div className="flex gap-2 items-center">
                    <input 
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Enter project name"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      onKeyPress={(e) => e.key === 'Enter' && addProjectTag()}
                    />
                    <Button onClick={addProjectTag} size="sm">Add</Button>
                    <Button 
                      onClick={() => setShowProjectInput(false)} 
                      variant="ghost" 
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowProjectInput(true)}
                    variant="outline"
                    className="w-full flex justify-center items-center gap-2"
                  >
                    <Tag className="h-4 w-4" />
                    {task.project ? `Change Project Tag: ${task.project}` : 'Add Project Tag'}
                  </Button>
                )}
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
            </div>
          </TabsContent>
          
          <TabsContent value="chat">
            <AIChat 
              task={task}
              onUpdateTask={onUpdateTask}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AITaskSuggestion;
