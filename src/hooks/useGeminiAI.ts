
import { useState } from 'react';
import { callGeminiAPI, GeminiAPIResponse } from '@/lib/gemini-api';

export function useGeminiAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<GeminiAPIResponse | null>(null);

  const queryGemini = async (prompt: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await callGeminiAPI(prompt);
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
    clearResponse: () => setResponse(null)
  };
}
