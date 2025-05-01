
// This is a utility file for making calls to the Gemini API
// In production, these calls should be made through Supabase Edge Functions
// for security reasons

export interface GeminiAPIResponse {
  text: string;
  suggestions?: string[];
}

// For demonstration purposes only - in production this should be in Supabase Edge Function
export const callGeminiAPI = async (prompt: string): Promise<GeminiAPIResponse> => {
  console.log('Simulating Gemini API call with prompt:', prompt);
  
  // Simulate API delay for realism
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Default response for queries
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
