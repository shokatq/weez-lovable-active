import { Message } from '@/types/chat';

// Configuration - Flask backend for platform connections
const FLASK_BASE_URL = import.meta.env.VITE_FLASK_URL || 'http://localhost:5000';
const FASTAPI_BASE_URL = 'https://weez-openai-resource.azurewebsites.net'; // Updated to actual Azure URL

export interface SearchRequest {
  query_text: string;
  user_id: string;
  platform?: string;
  file_type?: string;
  time_range?: string;
  top_k?: number;
}

export interface SummarizeRequest {
  action: 'summarize';
  file_id: string;
  user_id: string;
  summary_type?: 'short' | 'medium' | 'long';
  query_text?: string;
}

export interface RAGRequest {
  action: 'rag_query';
  query_text: string;
  user_id: string;
  top_k?: number;
}

export interface AgentRequest {
  query: string;
  user_id: string;
}

export interface FileSearchRequest {
  file_id: string;
  user_id: string;
  query_text?: string;
  top_k?: number;
}

export interface SimilarDocumentsRequest {
  file_id: string;
  user_id: string;
  top_k?: number;
}

export interface SearchSuggestionsRequest {
  partial_query: string;
  user_id: string;
  limit?: number;
}

export interface UploadMetadataRequest {
  file_id: string;
  file_name: string;
  file_path: string;
  platform: string;
}

export interface FastAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class FastAPIService {
  private async makeRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' = 'POST', 
    body?: any
  ): Promise<FastAPIResponse<T>> {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`FastAPI ${endpoint} error:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  // Search across platforms
  async search(request: SearchRequest): Promise<FastAPIResponse> {
    return this.makeRequest('/search', 'POST', request);
  }

  // Summarize documents
  async summarize(request: SummarizeRequest): Promise<FastAPIResponse> {
    return this.makeRequest('/summarize', 'POST', request);
  }

  // RAG-based question answering
  async ask(request: RAGRequest): Promise<FastAPIResponse> {
    return this.makeRequest('/rag', 'POST', request);
  }

  // AI Agent query
  async askAgent(request: AgentRequest): Promise<FastAPIResponse> {
    return this.makeRequest('/ask', 'POST', request);
  }

  // File-specific search
  async searchInFile(request: FileSearchRequest): Promise<FastAPIResponse> {
    return this.makeRequest('/search/file', 'POST', request);
  }

  // Similar documents
  async findSimilarDocuments(request: SimilarDocumentsRequest): Promise<FastAPIResponse> {
    return this.makeRequest('/search/similar', 'POST', request);
  }

  // Search suggestions
  async getSearchSuggestions(request: SearchSuggestionsRequest): Promise<FastAPIResponse> {
    return this.makeRequest('/search/suggestions', 'POST', request);
  }

  // Search statistics
  async getSearchStats(userId: string): Promise<FastAPIResponse> {
    return this.makeRequest(`/search/stats/${userId}`, 'GET');
  }

  // Generate metadata for uploaded files
  async generateMetadata(request: UploadMetadataRequest): Promise<FastAPIResponse> {
    return this.makeRequest('/generate_metadata', 'POST', request);
  }

  // Get platform connections status
  async getPlatformStatus(): Promise<FastAPIResponse> {
    return this.makeRequest('/platform_status', 'GET');
  }

  // Trigger platform sync
  async syncPlatforms(): Promise<FastAPIResponse> {
    return this.makeRequest('/sync_platforms', 'POST');
  }

  // Health check
  async healthCheck(): Promise<FastAPIResponse> {
    return this.makeRequest('/health', 'GET');
  }
}

export const fastApiService = new FastAPIService();

// Flask platform sync endpoints
export const syncGoogleDrive = async (userEmail: string) => {
  try {
    const response = await fetch(`${FLASK_BASE_URL}/sync/google?user_email=${encodeURIComponent(userEmail)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Google Drive sync failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Google Drive sync error:', error);
    throw error;
  }
};

export const syncSlack = async (userEmail: string) => {
  try {
    const response = await fetch(`${FLASK_BASE_URL}/sync/slack?user_email=${encodeURIComponent(userEmail)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Slack sync failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Slack sync error:', error);
    throw error;
  }
};

// Intent detection helper
export const detectIntent = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Search patterns
  if (lowerMessage.match(/(find|search|look for|locate|show me).+file/i) ||
      lowerMessage.match(/files? (about|related to|containing)/i) ||
      lowerMessage.match(/(pdf|document|file).*(from|in|across|stored)/i)) {
    return 'search';
  }
  
  // Summarization patterns
  if (lowerMessage.match(/(summarize|summarise|summary|give me.+summary|explain.+detail|overview)/i)) {
    return 'summarize';
  }
  
  // RAG/Question patterns
  if (lowerMessage.match(/(what is|how does|explain|tell me about|can you help.+understand|why|how to)/i)) {
    return 'ask';
  }
  
  // Upload patterns
  if (lowerMessage.match(/(upload|save|send|share).+(file|document)/i)) {
    return 'upload';
  }
  
  return 'general';
};

// Background platform sync
export const startPlatformSync = () => {
  // Sync every 5 minutes
  const syncInterval = 5 * 60 * 1000;
  
  const sync = async () => {
    try {
      const result = await fastApiService.syncPlatforms();
      if (result.success) {
        console.log('Platform sync completed successfully');
      } else {
        console.warn('Platform sync failed:', result.error);
      }
    } catch (error) {
      console.error('Platform sync error:', error);
    }
  };
  
  // Initial sync
  sync();
  
  // Set up recurring sync
  return setInterval(sync, syncInterval);
};