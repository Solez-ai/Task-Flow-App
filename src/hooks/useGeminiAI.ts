
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
      // Add current prompt to chat history
      const updatedChatHistory = includeChatHistory ? 
        [...chatHistory, {role: 'user', content: prompt}] : 
        [{role: 'user', content: prompt}];
        
      const result = await callGeminiAPI(prompt, includeChatHistory ? chatHistory : undefined);
      
      // Update chat history with the response
      if (includeChatHistory && result) {
        setChatHistory([
          ...updatedChatHistory,
          {role: 'assistant', content: result.text}
        ]);
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
