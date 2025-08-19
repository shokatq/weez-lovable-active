
import { useState, useCallback } from 'react';
import { AIAgentService } from '../services/aiAgent';

export interface UseAIAgentReturn {
  isLoading: boolean;
  error: string | null;
  askAgent: (query: string, userId: string) => Promise<string | null>;
  clearError: () => void;
}

export const useAIAgent = (): UseAIAgentReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askAgent = useCallback(async (query: string, userId: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AIAgentService.askAgent(query, userId);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    askAgent,
    clearError
  };
};

