
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrainCircuit, Send, User } from 'lucide-react';
import { useGeminiAI } from '@/hooks/useGeminiAI';
import { cn } from '@/lib/utils';
import { Task } from './TaskItem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  task?: Task;
  onUpdateTask?: (task: Task) => void;
}

const AIChat: React.FC<AIChatProps> = ({ task, onUpdateTask }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { queryGemini, loading } = useGeminiAI();
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Add a welcome message when the component mounts
    if (messages.length === 0) {
      const welcomeMessage = task 
        ? `Hello! I'm here to help with your task "${task.text}". What would you like to do with this task?`
        : "Hello! I'm your AI assistant. How can I help you with your tasks today?";
        
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date()
        }
      ]);
    }
  }, [task]);
  
  useEffect(() => {
    // Scroll to the bottom when messages change
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Create context-aware prompt
    let prompt = input;
    if (task) {
      prompt = `Regarding task "${task.text}": ${input}`;
    }
    
    try {
      const result = await queryGemini(prompt);
      
      if (result) {
        // Update task if needed
        if (task && onUpdateTask) {
          const updatedTask = { ...task };
          
          if (result.priority && !task.priority) {
            updatedTask.priority = result.priority;
          }
          
          if (result.timeEstimate && !task.timeInMinutes) {
            updatedTask.timeInMinutes = result.timeEstimate;
          }
          
          if (JSON.stringify(updatedTask) !== JSON.stringify(task)) {
            onUpdateTask(updatedTask);
          }
        }
        
        // Add AI response to messages
        const aiMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: result.text,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error querying AI:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev, 
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        }
      ]);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-[400px] dark:bg-slate-900 dark:border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-task dark:text-task-light">
          <BrainCircuit className="h-5 w-5" />
          {task ? `AI Assistant - ${task.text}` : 'AI Assistant'}
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-grow px-4">
        <div className="space-y-4 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3 rounded-lg p-3",
                message.role === 'assistant' 
                  ? "bg-accent text-accent-foreground" 
                  : "bg-primary text-primary-foreground"
              )}
            >
              <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
                {message.role === 'assistant' ? (
                  <BrainCircuit className="h-4 w-4 text-primary" />
                ) : (
                  <User className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p className="text-xs opacity-70 mt-1">
                  {new Intl.DateTimeFormat('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  }).format(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>
      <CardFooter className="border-t p-3 dark:border-slate-700">
        <div className="flex w-full items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={loading || !input.trim()}
            size="icon"
            className="bg-task hover:bg-task-dark dark:bg-task dark:hover:bg-task-dark"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIChat;
