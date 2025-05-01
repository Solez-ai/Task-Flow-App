
// This is a utility file for making calls to the Gemini API
// In production, these calls should be made through Supabase Edge Functions
// for security reasons

export interface GeminiAPIResponse {
  text: string;
  suggestions?: string[];
  priority?: 'high' | 'medium' | 'low';
  timeEstimate?: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  project?: string;
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
  
  // Handle general chat messages with better context awareness
  if (chatHistory && chatHistory.length > 0) {
    // If the prompt contains specific topics, respond accordingly
    const promptLower = prompt.toLowerCase();
    
    // Check for specific topics in the conversation
    if (promptLower.includes('photosynthesis') || promptLower.includes('biology')) {
      return {
        text: "For your assignment on photosynthesis, here are some key points to include:\n\n" +
             "1. Photosynthesis is the process plants use to convert light energy into chemical energy\n" +
             "2. Key components: chlorophyll, carbon dioxide, water, and sunlight\n" +
             "3. The process produces glucose and oxygen as byproducts\n" +
             "4. It takes place in the chloroplasts, primarily in the leaves\n" +
             "5. There are two main stages: light-dependent reactions and light-independent reactions (Calvin cycle)\n\n" +
             "Would you like me to elaborate on any of these points or suggest a structure for your essay?"
      };
    }
    
    if (promptLower.includes('pointer') || promptLower.includes('suggest')) {
      return {
        text: "Here are some general pointers for your task:\n\n" +
             "1. Break it down into smaller subtasks\n" +
             "2. Set a specific time to work on it\n" +
             "3. Eliminate distractions while working\n" +
             "4. Use the Pomodoro technique (25 minutes focus, 5 minute break)\n" +
             "5. Track your progress to maintain motivation\n\n" +
             "Is there a specific aspect of this task you're struggling with?"
      };
    }
    
    // Default responses for general conversation, avoiding repetition
    const conversationalResponses = [
      "I can help you manage this task more effectively. Would you like some specific advice on how to approach it?",
      "Would it help to break this task down into smaller steps? I can help you create a plan.",
      "Is there a particular aspect of this task that you're finding challenging?",
      "Have you set a deadline for this task? Setting time constraints can improve focus and productivity.",
      "Would you like me to help you prioritize this task relative to your other responsibilities?",
      "Is there any specific information or resources you need to complete this task successfully?",
      "Let me know if you need help organizing your approach to this task."
    ];
    
    // Use the last message to determine context and avoid repetition
    const lastUserMessage = chatHistory.filter(msg => msg.role === 'user').pop();
    const lastBotMessage = chatHistory.filter(msg => msg.role === 'assistant').pop();
    
    // Filter out responses similar to the last bot message to avoid repetition
    let filteredResponses = conversationalResponses;
    if (lastBotMessage) {
      filteredResponses = conversationalResponses.filter(response => 
        !lastBotMessage.content.includes(response.substring(0, 20))
      );
    }
    
    // If we've filtered everything, use the original list
    if (filteredResponses.length === 0) {
      filteredResponses = conversationalResponses;
    }
    
    return {
      text: filteredResponses[Math.floor(Math.random() * filteredResponses.length)]
    };
  }
  
  // Default response for other queries without chat history
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
