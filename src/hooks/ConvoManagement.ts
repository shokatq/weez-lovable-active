import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/hooks/useAuth';
import { 
  conversationService, 
  ConversationService,
  type Conversation, 
  type Message,
  type BackendMessage 
} from '@/services/ConversationService';

interface ConversationManager {
  currentConversation: Conversation | null;
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  createNewConversation: () => void;
  selectConversation: (conversation: Conversation) => void;
  sendMessage: (message: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
}

interface UseConversationManagerProps {
  apiBaseUrl?: string;
  onSendMessage?: (message: string, conversationId: string) => Promise<string>;
  filterToolExecution?: boolean; // New prop to control filtering
}

export const useConversationManager = ({
  apiBaseUrl = 'http://localhost:5000',
  onSendMessage,
  filterToolExecution = true // Default to true to filter out tool execution messages
}: UseConversationManagerProps): ConversationManager => {
  // Get authenticated user from useAuth hook
  const { user, loading: authLoading } = useAuth();
  
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user ID from authenticated user
  const userId = user?.email || user?.id;

  // Create service instance with custom API base URL if needed
  const service = useState(() => {
    if (apiBaseUrl !== 'http://localhost:5000') {
      return new ConversationService({ apiBaseUrl });
    }
    return conversationService;
  })[0];

  // Filter function to exclude tool execution messages
  const filterToolExecutionMessages = useCallback((messages: BackendMessage[]): BackendMessage[] => {
    if (!filterToolExecution) return messages;
    
    return messages.filter(message => {
      // Filter out messages that contain [TOOL_EXECUTION] in user_query
      const isToolExecution = message.user_query?.includes('[TOOL_EXECUTION]');
      
      if (isToolExecution) {
        console.log('Filtering out tool execution message:', message.user_query);
      }
      
      return !isToolExecution;
    });
  }, [filterToolExecution]);

  // Enhanced service wrapper that filters messages
  const getFilteredConversationHistory = useCallback(async (
    userId: string, 
    conversationId: string, 
    limit?: number
  ): Promise<BackendMessage[]> => {
    const backendMessages = await service.getConversationHistory(userId, conversationId, limit);
    return filterToolExecutionMessages(backendMessages);
  }, [service, filterToolExecutionMessages]);

  // Enhanced service wrapper for conversation summaries
  const getFilteredConversationSummaries = useCallback(async (
    userId: string, 
    options?: {
      limit?: number;
      includeTools?: boolean;
    }
  ) => {
    const summaries = await service.getConversationSummaries(userId, options);
    
    // If filtering is enabled, we might want to update message counts
    // by excluding tool execution messages
    if (filterToolExecution && Array.isArray(summaries)) {
      // For each summary, we could fetch the actual messages to get accurate counts
      // But this might be expensive, so we'll keep the original counts for now
      // and just filter when actually loading the conversation
      return summaries;
    }
    
    return summaries;
  }, [service, filterToolExecution]);

  // Create a new conversation
  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: 'New conversation',
      messages: [],
      timestamp: new Date(),
      lastMessage: ''
    };
    
    setCurrentConversation(newConversation);
    setConversations(prev => [newConversation, ...prev]);
    setError(null); // Clear any previous errors
  }, []);

  // Select an existing conversation with filtered messages
  const selectConversation = useCallback(async (conversation: Conversation) => {
    try {
      setError(null);
      
      if (!userId) {
        setError("User must be authenticated");
        return;
      }
      
      setLoading(true);
      
      // Load filtered conversation messages
      const filteredBackendMessages = await getFilteredConversationHistory(
        userId, 
        conversation.id
      );
      
      // Convert to frontend messages
      const frontendMessages = service.convertBackendMessagesToFrontend(filteredBackendMessages);
      
      const conversationWithMessages: Conversation = {
        ...conversation,
        messages: frontendMessages
      };
      
      setCurrentConversation(conversationWithMessages);
      
      // Update the conversation in the conversations list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversation.id ? conversationWithMessages : conv
        )
      );
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to load conversation:', err);
      setError(`Failed to load conversation: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [userId, service, getFilteredConversationHistory]);

  // Send a message
  const sendMessage = useCallback(async (messageContent: string) => {
    if (!currentConversation) return;
    
    if (!userId) {
      setError("User must be authenticated to send messages");
      return;
    }

    try {
      setError(null);
      
      const userMessage: Message = {
        id: uuidv4(),
        content: messageContent,
        isUser: true,
        timestamp: new Date()
      };

      // Add user message immediately
      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, userMessage],
        lastMessage: messageContent,
        timestamp: new Date()
      };
      setCurrentConversation(updatedConversation);

      // Update conversations list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversation.id ? updatedConversation : conv
        )
      );

      setLoading(true);

      let agentResponse: string;
      
      if (onSendMessage) {
        // Use custom handler
        agentResponse = await onSendMessage(messageContent, currentConversation.id);
      } else {
        // Use service to send message - this will store in backend
        const response = await service.sendMessage(
          userId, 
          currentConversation.id, 
          messageContent, 
          "Processing..." // Temporary response while we wait for actual response
        );
        agentResponse = response.message || "Message sent successfully";
      }

      const assistantMessage: Message = {
        id: uuidv4(),
        content: agentResponse,
        isUser: false,
        timestamp: new Date()
      };

      // Add assistant message
      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
        lastMessage: agentResponse
      };
      
      setCurrentConversation(finalConversation);
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversation.id ? finalConversation : conv
        )
      );

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to send message:', err);
      setError(`Failed to send message: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [currentConversation, userId, service, onSendMessage]);

  // Delete a conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      setError(null);
      
      if (!userId) {
        setError("User must be authenticated");
        return;
      }
      
      setLoading(true);

      await service.deleteConversation(userId, conversationId);

      // Remove from local state
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      // If the deleted conversation was currently selected, clear it
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
      }

      console.log(`Successfully deleted conversation: ${conversationId}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to delete conversation:', err);
      setError(`Failed to delete conversation: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [userId, service, currentConversation]);

  // Refresh conversations list with filtering
  const refreshConversations = useCallback(async () => {
    try {
      setError(null);
      
      if (!userId) {
        console.log("No user ID available, skipping refresh");
        return;
      }
      
      setLoading(true);
      
      // Get filtered conversation summaries
      const summaries = await getFilteredConversationSummaries(userId);
      
      if (!Array.isArray(summaries)) {
        throw new Error("Invalid response format: expected array of conversations");
      }
      
      // Convert summaries to frontend format, filtering out invalid ones
      const frontendConversations = summaries
        .map(summary => service.convertToFrontendConversation(summary))
        .filter((conversation): conversation is Conversation => conversation !== null);
      
      // Sort by timestamp (newest first)
      frontendConversations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      console.log(`Successfully loaded ${frontendConversations.length} valid conversations (filtered: ${filterToolExecution ? 'enabled' : 'disabled'})`);
      setConversations(frontendConversations);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to refresh conversations:', err);
      setError(`Failed to load conversations: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [userId, service, getFilteredConversationSummaries, filterToolExecution]);

  // Auto-refresh conversations when user changes or component mounts
  useEffect(() => {
    if (userId && !authLoading) {
      refreshConversations();
    }
  }, [userId, authLoading, refreshConversations]);

  return {
    currentConversation,
    conversations,
    loading,
    error,
    createNewConversation,
    selectConversation,
    sendMessage,
    deleteConversation,
    refreshConversations
  };
};


