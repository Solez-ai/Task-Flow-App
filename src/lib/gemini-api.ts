
// This is a utility file for making calls to the Gemini API
// In production, these calls should be made through Supabase Edge Functions
// for security reasons

export interface GeminiAPIResponse {
  text: string;
  suggestions?: string[];
  priority?: 'high' | 'medium' | 'low';
  timeEstimate?: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// For demonstration purposes only - in production this should be in Supabase Edge Function
export const callGeminiAPI = async (
  prompt: string, 
  chatHistory?: ChatMessage[]
): Promise<GeminiAPIResponse> => {
  console.log('Simulating Gemini API call with prompt:', prompt);
  console.log('Chat history:', chatHistory);
  
  // Simulate API delay for realism
  await new Promise(resolve => setTimeout(resolve, 800));

  // Handle project tagging
  if (prompt.toLowerCase().includes('project') && 
      (prompt.toLowerCase().includes('tag') || prompt.toLowerCase().includes('add'))) {
    return {
      text: "I can help you tag this task with a project. Simply type the project name in the input field above and click 'Add'.",
    };
  }
  
  if (prompt.includes('prioritize')) {
    // Task prioritization
    const lowPriorityWords = ['later', 'eventually', 'sometime', 'consider', 'maybe', 'minor'];
    const highPriorityWords = ['urgent', 'important', 'deadline', 'today', 'critical', 'asap', 'soon'];
    
    let priority: 'high' | 'medium' | 'low';
    const promptLower = prompt.toLowerCase();
    
    if (highPriorityWords.some(word => promptLower.includes(word))) {
      priority = 'high';
    } else if (lowPriorityWords.some(word => promptLower.includes(word))) {
      priority = 'low';
    } else {
      priority = 'medium';
    }
    
    return {
      text: `Based on analyzing your task description, I've determined this is a ${priority} priority task.`,
      priority
    };
  }
  
  if (prompt.includes('estimate time')) {
    // Time estimation
    const complexityIndicators = {
      high: ['complex', 'difficult', 'challenging', 'research', 'learn'],
      medium: ['develop', 'create', 'implement', 'design', 'write'],
      low: ['update', 'fix', 'check', 'verify', 'review', 'email']
    };
    
    let timeEstimate = 30; // Default medium time
    const promptLower = prompt.toLowerCase();
    
    if (complexityIndicators.high.some(word => promptLower.includes(word))) {
      timeEstimate = Math.floor(Math.random() * 30) + 45; // 45-75 minutes
    } else if (complexityIndicators.low.some(word => promptLower.includes(word))) {
      timeEstimate = Math.floor(Math.random() * 15) + 10; // 10-25 minutes
    } else {
      timeEstimate = Math.floor(Math.random() * 20) + 25; // 25-45 minutes
    }
    
    return {
      text: `I estimate this task will take approximately ${timeEstimate} minutes based on its complexity and scope.`,
      timeEstimate
    };
  }
  
  if (prompt.includes('analyze sentiment')) {
    // Sentiment analysis
    const positiveWords = ['happy', 'exciting', 'fun', 'good', 'great', 'enjoy', 'like', 'love'];
    const negativeWords = ['hard', 'difficult', 'challenging', 'boring', 'tedious', 'hate', 'dislike'];
    
    let sentiment: 'positive' | 'negative' | 'neutral';
    const promptLower = prompt.toLowerCase();
    
    if (positiveWords.some(word => promptLower.includes(word))) {
      sentiment = 'positive';
    } else if (negativeWords.some(word => promptLower.includes(word))) {
      sentiment = 'negative';
    } else {
      sentiment = 'neutral';
    }
    
    const messages = {
      positive: "This task has a positive sentiment, which suggests you may enjoy working on it. People tend to be more productive when working on tasks they find engaging.",
      negative: "This task has a negative sentiment, which might make it harder to start. Consider breaking it into smaller parts or pairing it with a more enjoyable task.",
      neutral: "This task has a neutral sentiment. It's neither particularly enjoyable nor unpleasant, making it a good candidate for a focused work session."
    };
    
    return {
      text: messages[sentiment],
      sentiment
    };
  }
  
  if (prompt.includes('suggest break')) {
    // Break suggestions
    const breaks = [
      "Take a short 5-minute walk to refresh your mind.",
      "Try a quick stretching session for 3 minutes.",
      "Practice deep breathing for 2 minutes to improve focus.",
      "Consider a quick hydration break - drink a glass of water.",
      "Look away from your screen and focus on a distant object for 20 seconds.",
      "Do a quick mindfulness exercise - focus on your breathing for 1 minute.",
      "Stand up and do 10 jumping jacks to get your blood flowing.",
      "Make yourself a cup of tea or coffee.",
      "Listen to one song that you enjoy before returning to work."
    ];
    
    // Select 2-3 random break suggestions
    const shuffled = [...breaks].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 2);
    
    return {
      text: "Here are some break activities that can help refresh your mind:",
      suggestions: selected
    };
  }
  
  if (prompt.includes('productivity insights')) {
    // Extract completion rate from prompt
    const completionRateMatch = prompt.match(/Completion rate: (\d+)%/);
    const completionRate = completionRateMatch ? parseInt(completionRateMatch[1]) : 0;
    const totalTasksMatch = prompt.match(/Total tasks: (\d+)/);
    const totalTasks = totalTasksMatch ? parseInt(totalTasksMatch[1]) : 0;
    
    if (totalTasks === 0) {
      return {
        text: "You haven't added any tasks yet. Start by adding a few tasks to track your productivity.",
        suggestions: [
          "Add tasks that are important to you",
          "Break large projects into smaller tasks",
          "Set realistic time estimates"
        ]
      };
    }
    
    if (completionRate >= 80) {
      return {
        text: `Great job! You've completed ${completionRate}% of your tasks. You're being highly productive today.`,
        suggestions: [
          "Consider tackling a challenging task next",
          "Take a short break to maintain your momentum",
          "Review your completed tasks and celebrate your progress"
        ]
      };
    } else if (completionRate >= 50) {
      return {
        text: `You're making good progress with a ${completionRate}% completion rate. Keep up the momentum!`,
        suggestions: [
          "Focus on completing one more task before taking a longer break",
          "Group similar remaining tasks together for efficiency",
          "Consider using the Pomodoro technique for your next task"
        ]
      };
    } else {
      return {
        text: `You've completed ${completionRate}% of your tasks. Let's work on improving your productivity.`,
        suggestions: [
          "Start with the smallest or easiest task to build momentum",
          "Break down complex tasks into smaller steps",
          "Try a 25-minute focused work session with no distractions"
        ]
      };
    }
  }
  
  if (prompt.includes('daily plan')) {
    // Parse tasks from the prompt
    const taskLines = prompt.split('\n').filter(line => line.trim().startsWith('-'));
    
    if (taskLines.length === 0) {
      return {
        text: "You don't have any incomplete tasks. Add some tasks to get a suggested daily plan.",
        suggestions: ["Add some tasks to get started"]
      };
    }
    
    return {
      text: "Here's a suggested plan for tackling your tasks efficiently:",
      suggestions: [
        "Start your day with a 25-minute focus session on your highest priority task",
        "Group similar tasks together to minimize context switching",
        "Schedule breaks between task blocks to maintain mental energy",
        "End your day by reviewing what you've accomplished and planning for tomorrow"
      ]
    };
  }
  
  // Handle general chat messages
  if (chatHistory && chatHistory.length > 0) {
    const responses = [
      "I can help you manage your tasks more effectively. Would you like suggestions on prioritization?",
      "Consider breaking down large tasks into smaller, more manageable pieces.",
      "Setting realistic time estimates can help you plan your day better.",
      "I notice you're working on several tasks. Is there a specific one you'd like to focus on?",
      "Would you like me to analyze this task and suggest a priority level?",
      "I can help you estimate how long this task might take to complete.",
      "Using project tags can help you organize related tasks together.",
      "Remember to take breaks between tasks to maintain productivity.",
    ];
    
    return {
      text: responses[Math.floor(Math.random() * responses.length)]
    };
  }
  
  // Default response for other queries
  return {
    text: "I'm here to help you stay productive. What would you like assistance with?",
    suggestions: [
      "Prioritize my tasks",
      "Estimate time for a task",
      "Suggest a break activity",
      "Analyze my productivity"
    ]
  };
};
