
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, ArrowDown } from 'lucide-react';
import { useGeminiAI } from '@/hooks/useGeminiAI';
import { Task } from './TaskItem';

interface AIProductivityInsightsProps {
  tasks: Task[];
}

const AIProductivityInsights: React.FC<AIProductivityInsightsProps> = ({ tasks }) => {
  const { queryGemini, loading, response, clearResponse } = useGeminiAI();
  const [insightType, setInsightType] = useState<string | null>(null);

  const getProductivityInsights = async () => {
    setInsightType('productivity');
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    
    await queryGemini(`
      Generate productivity insights based on the following data:
      - Total tasks: ${totalTasks}
      - Completed tasks: ${completedTasks}
      - Completion rate: ${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
    `);
  };

  const getDailyPlan = async () => {
    setInsightType('daily-plan');
    const incompleteTasks = tasks.filter(task => !task.completed);
    
    await queryGemini(`
      Generate a suggested daily plan based on these incomplete tasks:
      ${incompleteTasks.map(task => `- ${task.text} ${task.timeInMinutes ? `(Est. ${task.timeInMinutes} min)` : ''}`).join('\n')}
    `);
  };

  const getBreakSuggestion = async () => {
    setInsightType('break');
    await queryGemini(`suggest a break activity based on productivity levels`);
  };

  return (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-task dark:text-task-light">
          <BrainCircuit className="h-5 w-5" />
          AI Productivity Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          <Button
            onClick={getProductivityInsights}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600"
            size="sm"
          >
            {loading && insightType === 'productivity' ? "Analyzing..." : "Get Productivity Insights"}
          </Button>
          
          <Button
            onClick={getDailyPlan}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white dark:from-blue-600 dark:to-teal-600"
            size="sm"
          >
            {loading && insightType === 'daily-plan' ? "Planning..." : "Generate Daily Plan"}
          </Button>
          
          <Button
            onClick={getBreakSuggestion}
            disabled={loading}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white dark:from-amber-600 dark:to-orange-600"
            size="sm"
          >
            {loading && insightType === 'break' ? "Thinking..." : "Suggest Break Activity"}
          </Button>
        </div>
        
        {response && (
          <div className="mt-3 bg-gray-50 dark:bg-slate-900 p-3 rounded-md border dark:border-slate-700">
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

export default AIProductivityInsights;
