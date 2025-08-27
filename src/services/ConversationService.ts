// services/ConversationService.ts

// Backend API types (aligned with ChatAPI.py)
interface BackendMessage {
  id: string;
  user_id: string;
  conversation_id: string;
  user_query: string;
  agent_response: string;
  timestamp: string;
}

interface BackendConversationSummary {
  conversation_id: string;
  first_message_time: string;
  last_message_time: string;
  message_count: number;
  latest_user_query?: string;
  latest_agent_response?: string;
}

interface BackendAnalytics {
  total_conversations: number;
  total_messages: number;
  avg_messages_per_conversation: number;
  most_active_day: string;
  common_query_patterns: Array<{pattern: string; count: number}>;
  tool_usage_stats: Record<string, number>;
}

interface BackendSearchResult {
  results: BackendMessage[];
  total_count: number;
  search_term: string;
}

// Frontend types
interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  lastMessage: string;
  messageCount?: number;
}

interface ConversationAnalytics {
  totalConversations: number;
  totalMessages: number;
  avgMessagesPerConversation: number;
  mostActiveDay: string;
  commonQueryPatterns: Array<{pattern: string; count: number}>;
  toolUsageStats: Record<string, number>;
}

// Service configuration
interface ConversationServiceConfig {
  apiBaseUrl?: string;
  defaultTimeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

// Request types
interface SendMessageRequest {
  user_query: string;
}

interface SearchRequest {
  search_term: string;
  conversation_id?: string;
  limit?: number;
}

// Extended fetch options
interface ExtendedRequestInit extends RequestInit {
  timeout?: number;
  retries?: number;
}

class ConversationService {
  private apiBaseUrl: string;
  private defaultTimeout: number;
  private maxRetries: number;
  private retryDelay: number;

  constructor(config: ConversationServiceConfig = {}) {
    this.apiBaseUrl = config.apiBaseUrl || 'http://localhost:5000';
    this.defaultTimeout = config.defaultTimeout || 30000; // 30 seconds default
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000; // 1 second
  }

  // Enhanced API helper with timeout, retry logic, and better error handling
  private async apiCall(endpoint: string, options: ExtendedRequestInit = {}): Promise<any> {
    const {
      timeout = this.defaultTimeout,
      retries = this.maxRetries,
      ...fetchOptions
    } = options;

    const url = `${this.apiBaseUrl}${endpoint}`;
    console.log(`API call to: ${url}`);
    
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log(`Request timeout after ${timeout}ms for ${url}`);
      }, timeout);

      try {
        // Configure headers based on request method
        const defaultHeaders: Record<string, string> = {};
        
        // Only add Content-Type for requests with body
        if (fetchOptions?.method && ['POST', 'PUT', 'PATCH'].includes(fetchOptions.method.toUpperCase())) {
          defaultHeaders['Content-Type'] = 'application/json';
        }
        
        const response = await fetch(url, {
          mode: 'cors',
          credentials: 'omit', // Don't send credentials to avoid complex CORS
          ...fetchOptions,
          signal: controller.signal,
          headers: {
            ...defaultHeaders,
            ...fetchOptions?.headers,
          },
        });
        
        clearTimeout(timeoutId);
        console.log(`Response status: ${response.status} (attempt ${attempt + 1})`);
        
        if (!response.ok) {
          let errorMessage = `API call failed: ${response.status} ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMessage += ` - ${errorData.detail || JSON.stringify(errorData)}`;
          } catch {
            try {
              const errorText = await response.text();
              errorMessage += ` - ${errorText}`;
            } catch {
              errorMessage += ' - Unable to read error response';
            }
          }
          
          const error = new Error(errorMessage);
          
          // Don't retry for client errors (4xx) except 408, 429
          if (response.status >= 400 && response.status < 500 && 
              response.status !== 408 && response.status !== 429) {
            throw error;
          }
          
          lastError = error;
          
          // If this was the last attempt, throw the error
          if (attempt === retries) {
            throw error;
          }
          
          console.log(`Retrying in ${this.retryDelay}ms... (attempt ${attempt + 1}/${retries + 1})`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * (attempt + 1))); // Exponential backoff
          continue;
        }
        
        const data = await response.json();
        console.log(`Response data received successfully (attempt ${attempt + 1})`);
        return data;
        
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          lastError = new Error(`Request timed out after ${timeout}ms`);
        } else if (error instanceof TypeError && error.message.includes('fetch')) {
          lastError = new Error(`Network error: ${error.message}`);
        } else {
          lastError = error as Error;
        }
        
        console.error(`API call error for ${endpoint} (attempt ${attempt + 1}):`, lastError.message);
        
        // If this was the last attempt, throw the error
        if (attempt === retries) {
          throw lastError;
        }
        
        // Don't retry on certain errors
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          console.log(`Retrying network error in ${this.retryDelay}ms... (attempt ${attempt + 1}/${retries + 1})`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * (attempt + 1)));
          continue;
        }
        
        // For other errors, throw immediately
        throw lastError;
      }
    }
    
    // This should never be reached, but just in case
    throw lastError || new Error('Unknown error occurred');
  }

  // Health check with extended timeout
  async healthCheck(): Promise<{status: string; cosmos_db: any}> {
    return await this.apiCall('/health', {
      method: 'GET',
      timeout: 10000 // 10 seconds for health check
    });
  }

  // Fetch conversation summaries for a user with extended timeout
  async getConversationSummaries(
    userId: string, 
    options?: {
      limit?: number;
      includeTools?: boolean;
    }
  ): Promise<BackendConversationSummary[]> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    const params = new URLSearchParams();
    if (options?.limit) {
      params.append('limit', options.limit.toString());
    }
    if (options?.includeTools !== undefined) {
      params.append('include_tools', options.includeTools.toString());
    }
    
    const queryString = params.toString();
    const endpoint = `/api/conversations/${encodeURIComponent(userId)}${queryString ? '?' + queryString : ''}`;
    
    return await this.apiCall(endpoint, {
      method: 'GET',
      timeout: 45000, // 45 seconds for large conversation lists
      retries: 2 // Fewer retries for this potentially expensive operation
    });
  }

  // Get user analytics
  async getUserAnalytics(
    userId: string, 
    daysBack: number = 30
  ): Promise<BackendAnalytics> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    const endpoint = `/api/conversations/${encodeURIComponent(userId)}/analytics?days_back=${daysBack}`;
    return await this.apiCall(endpoint, {
      method: 'GET',
      timeout: 60000 // 60 seconds for analytics
    });
  }

  // Fetch full conversation history
  async getConversationHistory(
    userId: string, 
    conversationId: string, 
    limit?: number
  ): Promise<BackendMessage[]> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }
    
    const params = limit ? `?limit=${limit}` : '';
    const endpoint = `/api/conversations/${encodeURIComponent(userId)}/${encodeURIComponent(conversationId)}${params}`;
    
    return await this.apiCall(endpoint, {
      method: 'GET',
      timeout: 30000 // 30 seconds for conversation history
    });
  }

  // Send a message to a conversation (POST to store)
  async sendMessage(
    userId: string, 
    conversationId: string, 
    message: string,
    agentResponse: string,
    timestamp?: string
  ): Promise<{status: string; message: string}> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }
    if (!message.trim()) {
      throw new Error("Message content is required");
    }
    if (!agentResponse.trim()) {
      throw new Error("Agent response is required");
    }
    
    const endpoint = `/api/conversations/${encodeURIComponent(userId)}/${encodeURIComponent(conversationId)}`;
    return await this.apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        user_query: message,
        agent_response: agentResponse,
        timestamp: timestamp
      }),
      timeout: 15000 // 15 seconds for message sending
    });
  }

  // Delete a conversation
  async deleteConversation(
    userId: string, 
    conversationId: string
  ): Promise<{status: string; message: string; deleted_count: number}> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }
    
    const endpoint = `/api/conversations/${encodeURIComponent(userId)}/${encodeURIComponent(conversationId)}`;
    return await this.apiCall(endpoint, {
      method: 'DELETE',
      timeout: 20000 // 20 seconds for deletion
    });
  }

  // Search conversations
  async searchConversations(
    userId: string,
    searchTerm: string,
    conversationId?: string,
    limit: number = 10
  ): Promise<BackendSearchResult> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    if (!searchTerm.trim()) {
      throw new Error("Search term is required");
    }
    
    const endpoint = `/api/conversations/${encodeURIComponent(userId)}/search`;
    return await this.apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        search_term: searchTerm,
        conversation_id: conversationId,
        limit: limit
      }),
      timeout: 30000 // 30 seconds for search
    });
  }

  // Get conversation context
  async getConversationContext(
    userId: string,
    conversationId: string,
    contextLimit: number = 5
  ): Promise<{conversation_id: string; context: any; context_limit: number}> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }
    
    const endpoint = `/api/conversations/${encodeURIComponent(userId)}/${encodeURIComponent(conversationId)}/context?context_limit=${contextLimit}`;
    return await this.apiCall(endpoint, {
      method: 'GET',
      timeout: 25000 // 25 seconds for context
    });
  }

  // Cleanup old conversations
  async cleanupOldConversations(
    userId: string,
    daysOld: number = 90
  ): Promise<{status: string; message: string; deleted_count: number; days_old: number}> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    const endpoint = `/api/conversations/${encodeURIComponent(userId)}/cleanup`;
    return await this.apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        days_old: daysOld
      }),
      timeout: 60000 // 60 seconds for cleanup operations
    });
  }

  // Batch delete conversations
  async batchDeleteConversations(
    userId: string,
    conversationIds: string[]
  ): Promise<{status: string; total_deleted: number; requested_deletions: number}> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    if (!conversationIds.length) {
      throw new Error("At least one conversation ID is required");
    }
    
    const endpoint = `/api/conversations/${encodeURIComponent(userId)}/batch-delete`;
    return await this.apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(conversationIds),
      timeout: 45000 // 45 seconds for batch operations
    });
  }

  // Utility: Convert backend messages to frontend format
  convertBackendMessagesToFrontend(backendMessages: BackendMessage[]): Message[] {
    const frontendMessages: Message[] = [];
    
    backendMessages.forEach(msg => {
      // Add user message
      frontendMessages.push({
        id: `${msg.id}_user`,
        content: msg.user_query,
        isUser: true,
        timestamp: new Date(msg.timestamp)
      });
      
      // Add agent response
      frontendMessages.push({
        id: `${msg.id}_agent`,
        content: msg.agent_response,
        isUser: false,
        timestamp: new Date(msg.timestamp)
      });
    });
    
    return frontendMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Utility: Convert backend analytics to frontend format
  convertBackendAnalyticsToFrontend(backendAnalytics: BackendAnalytics): ConversationAnalytics {
    return {
      totalConversations: backendAnalytics.total_conversations,
      totalMessages: backendAnalytics.total_messages,
      avgMessagesPerConversation: backendAnalytics.avg_messages_per_conversation,
      mostActiveDay: backendAnalytics.most_active_day,
      commonQueryPatterns: backendAnalytics.common_query_patterns,
      toolUsageStats: backendAnalytics.tool_usage_stats
    };
  }

  // Utility: Get conversation preview from messages or summary
  getConversationPreview(summary: BackendConversationSummary): string {
    if (summary.latest_user_query) {
      const preview = summary.latest_user_query.substring(0, 100);
      return preview + (summary.latest_user_query.length > 100 ? "..." : "");
    }
    return "New conversation";
  }

  // Utility: Convert backend conversation summary to frontend conversation
  convertToFrontendConversation(summary: BackendConversationSummary): Conversation | null {
    // Handle cases where conversation_id might be missing or invalid
    if (!summary.conversation_id) {
      console.warn('Conversation summary missing conversation_id:', summary);
      return null; // Return null for invalid conversations
    }

    const preview = this.getConversationPreview(summary);
    
    return {
      id: summary.conversation_id,
      title: preview,
      messages: [], // Messages loaded on demand
      timestamp: new Date(summary.last_message_time),
      lastMessage: preview,
      messageCount: summary.message_count
    };
  }

  // Utility: Load all conversations for a user
  async loadUserConversations(
    userId: string, 
    options?: {
      limit?: number;
      includeTools?: boolean;
    }
  ): Promise<Conversation[]> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    console.log(`Loading conversations for user: ${userId}`);
    
    const summaries = await this.getConversationSummaries(userId, options);
    console.log(`Fetched ${summaries.length} conversation summaries:`, summaries);
    
    if (!Array.isArray(summaries)) {
      throw new Error("Invalid response format: expected array of conversations");
    }
    
    // Convert summaries to frontend format, filtering out invalid ones
    const frontendConversations = summaries
      .map(summary => this.convertToFrontendConversation(summary))
      .filter((conversation): conversation is Conversation => conversation !== null); // Type guard to remove nulls
    
    // Sort by timestamp (newest first)
    frontendConversations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    console.log(`Successfully loaded ${frontendConversations.length} valid conversations`);
    return frontendConversations;
  }

  // Utility: Load conversation with messages
  async loadConversationWithMessages(
    userId: string, 
    conversation: Conversation,
    limit?: number
  ): Promise<Conversation> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    // If conversation already has messages, return as is
    if (conversation.messages.length > 0) {
      return conversation;
    }
    
    console.log(`Loading messages for conversation: ${conversation.id}`);
    
    const backendMessages = await this.getConversationHistory(userId, conversation.id, limit);
    const frontendMessages = this.convertBackendMessagesToFrontend(backendMessages);
    
    return {
      ...conversation,
      messages: frontendMessages
    };
  }

  // Utility: Get user analytics in frontend format
  async getUserAnalyticsFormatted(userId: string, daysBack: number = 30): Promise<ConversationAnalytics> {
    const backendAnalytics = await this.getUserAnalytics(userId, daysBack);
    return this.convertBackendAnalyticsToFrontend(backendAnalytics);
  }

  // Utility: Update configuration at runtime
  updateConfig(config: Partial<ConversationServiceConfig>): void {
    if (config.apiBaseUrl !== undefined) {
      this.apiBaseUrl = config.apiBaseUrl;
    }
    if (config.defaultTimeout !== undefined) {
      this.defaultTimeout = config.defaultTimeout;
    }
    if (config.maxRetries !== undefined) {
      this.maxRetries = config.maxRetries;
    }
    if (config.retryDelay !== undefined) {
      this.retryDelay = config.retryDelay;
    }
    console.log('ConversationService configuration updated:', {
      apiBaseUrl: this.apiBaseUrl,
      defaultTimeout: this.defaultTimeout,
      maxRetries: this.maxRetries,
      retryDelay: this.retryDelay
    });
  }
}

// Export types for use in components
export type {
  BackendMessage,
  BackendConversationSummary,
  BackendAnalytics,
  BackendSearchResult,
  Message,
  Conversation,
  ConversationAnalytics,
  ConversationServiceConfig,
  SendMessageRequest,
  SearchRequest,
  ExtendedRequestInit
};

// Export singleton instance with enhanced configuration
export const conversationService = new ConversationService({
  defaultTimeout: 30000, // 30 seconds
  maxRetries: 3,
  retryDelay: 1000
});

// Export class for custom instances
export { ConversationService };