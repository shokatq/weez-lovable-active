import { Message } from '@/types/chat';

// Configuration - replace with your Azure-deployed FastAPI URL
const FASTAPI_BASE_URL = import.meta.env.VITE_FASTAPI_URL || 'https://your-azure-fastapi-url.azurewebsites.net';

export interface SearchRequest {
  query: string;
  platform?: string;
  file_type?: string;
  limit?: number;
}

export interface SummarizeRequest {
  file_id?: string;
  file_url?: string;
  summary_type: 'brief' | 'detailed' | 'key_points';
}

export interface RAGRequest {
  question: string;
  context_files?: string[];
  max_tokens?: number;
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