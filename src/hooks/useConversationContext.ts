// hooks/useConversationContext.ts
// This hook manages conversation context and message flow

import { useState, useCallback, useRef } from 'react';
import { Message } from '@/types/chat';

interface ConversationContextHook {
  currentConversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadConversation: (conversationId: string, userId: string) => Promise<void>;
  sendMessageWithContext: (message: string, userId: string, apiBaseUrl: string) => Promise<string>;
  createNewConversation: () => void;
  clearError: () => void;
}

export const useConversationContext = (): ConversationContextHook => {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Keep track of conversation state
  const conversationRef = useRef<{
    id: string | null;
    messageCount: number;
  }>({ id: null, messageCount: 0 });

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load conversation history from backend
  const loadConversation = useCallback(async (conversationId: string, userId: string) => {
    if (!userId || !conversationId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading conversation history:', conversationId);
      
      const response = await fetch(
        `http://localhost:5000/api/conversations/${encodeURIComponent(userId)}/${encodeURIComponent(conversationId)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to load conversation: ${response.status}`);
      }

      const conversationHistory = await response.json();
      console.log('Received conversation history:', conversationHistory);

      // Transform backend format to frontend Message format
      const transformedMessages: Message[] = [];
      
      conversationHistory.forEach((item: any) => {
        // Add user message
        if (item.user_query && item.user_query.trim()) {
          transformedMessages.push({
            id: `${item.id}_user`,
            content: item.user_query,
            isUser: true,
            timestamp: new Date(item.timestamp)
          });
        }
        
        // Add AI response
        if (item.agent_response && item.agent_response.trim()) {
          transformedMessages.push({
            id: `${item.id}_agent`,
            content: item.agent_response,
            isUser: false,
            timestamp: new Date(item.timestamp)
          });
        }
      });

      setMessages(transformedMessages);
      setCurrentConversationId(conversationId);
      conversationRef.current = { id: conversationId, messageCount: transformedMessages.length };
      
      console.log(`Loaded conversation with ${transformedMessages.length} messages`);
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load conversation';
      console.error('Error loading conversation:', errorMsg);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send message with proper context
  const sendMessageWithContext = useCallback(async (
  message: string, 
  userId: string, 
  apiBaseUrl: string
): Promise<string> => {
  if (!message.trim() || isLoading || !userId) {
    throw new Error('Invalid message or user not authenticated');
  }

  try {
    setIsLoading(true);
    setError(null);

    // CRITICAL FIX: Don't generate conversation ID on frontend
    // Let backend handle it
    const conversationId = currentConversationId; // Use existing or null

    console.log('Sending message with context:', {
      conversationId: conversationId || 'NEW_CONVERSATION',
      existingMessageCount: messages.length,
      hasContext: messages.length > 0
    });

    // Add user message to state immediately
    const userMessage: Message = {
      id: `${Date.now()}_user`,
      content: message.trim(),
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Call backend - it will create conversation ID if needed
    const response = await fetch(`${apiBaseUrl}/api/chat/${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message.trim(),
        conversation_id: conversationId // null for new, UUID for existing
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const aiResponse = result.response;
    const returnedConversationId = result.conversation_id;

    // Update conversation ID if this was a new conversation
    if (!currentConversationId && returnedConversationId) {
      setCurrentConversationId(returnedConversationId);
      conversationRef.current.id = returnedConversationId;
    }

    console.log('Received AI response:', {
      hasResponse: !!aiResponse,
      responseLength: aiResponse?.length || 0,
      conversationId: returnedConversationId
    });

    if (!aiResponse || !aiResponse.trim()) {
      throw new Error('Received empty response from AI');
    }

    // Add AI response to state
    const aiMessage: Message = {
      id: `${Date.now()}_ai`,
      content: aiResponse,
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);

    conversationRef.current.messageCount += 2;

    return aiResponse;

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
    console.error('Error sending message:', errorMsg);
    setError(errorMsg);
    
    const errorMessage: Message = {
      id: `${Date.now()}_error`,
      content: `Error: ${errorMsg}`,
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, errorMessage]);
    
    throw err;
  } finally {
    setIsLoading(false);
  }
}, [currentConversationId, messages.length, isLoading]);


  // Create new conversation
  const createNewConversation = useCallback(() => {
    console.log('Creating new conversation');
    setCurrentConversationId(null);
    setMessages([]);
    setError(null);
    conversationRef.current = { id: null, messageCount: 0 };
  }, []);

  return {
    currentConversationId,
    messages,
    isLoading,
    error,
    loadConversation,
    sendMessageWithContext,
    createNewConversation,
    clearError
  };
};

// Update ChatInterface.tsx to use this hook:
// Replace the existing message handling with:

/*
const {
  currentConversationId,
  messages,
  isLoading: contextLoading,
  error: contextError,
  loadConversation,
  sendMessageWithContext,
  createNewConversation,
  clearError: clearContextError
} = useConversationContext();

// Update handleSendMessage
const handleSendMessage = async (newMessage: string) => {
  if (!userId) {
    toast.error('Please sign in to send messages');
    navigate('/auth');
    return;
  }

  try {
    await sendMessageWithContext(newMessage, userId, 'http://localhost:5000');
  } catch (error) {
    console.error('Failed to send message:', error);
    // Error is already handled in the hook
  }
};

// Update handleConversationSelect
const handleConversationSelect = async (conversation: Conversation) => {
  if (!userId) return;
  
  try {
    await loadConversation(conversation.id, userId);
    setCurrentConversation(conversation);
  } catch (error) {
    console.error('Failed to load conversation:', error);
  }
};

// Update handleNewConversation
const handleNewConversation = () => {
  createNewConversation();
  setCurrentConversation(null);
};
*/