
import { useState } from 'react';
import { callGeminiAPI, GeminiAPIResponse } from '@/lib/gemini-api';

export function useGeminiAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<GeminiAPIResponse | null>(null);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);

  const queryGemini = async (prompt: string, includeChatHistory = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Add current prompt to chat history with proper typing
      const userMessage = { role: 'user' as const, content: prompt };
      const updatedChatHistory = includeChatHistory ? 
        [...chatHistory, userMessage] : 
        [userMessage];
        
      // Include chat history in API call to maintain context
      const result = await callGeminiAPI(prompt, includeChatHistory ? chatHistory : undefined);
      
      // Only update chat history if we're in chat mode and got a valid response
      if (includeChatHistory && result) {
        const assistantMessage = { role: 'assistant' as const, content: result.text };
        setChatHistory([...updatedChatHistory, assistantMessage]);
      }
      
      setResponse(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error querying Gemini API:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    queryGemini,
    response,
    loading,
    error,
    chatHistory,
    clearResponse: () => setResponse(null),
    clearChatHistory: () => setChatHistory([])
  };
}
