// Metadata Generation Service
// Integrates with the Python Flask metadata generation service

const METADATA_BASE_URL = 'https://generate-metadata-cffyg9hva0hugyb4.canadacentral-01.azurewebsites.net';

export interface ProcessingStats {
  total_files: number;
  processed_files: number;
  unprocessed_files: number;
  chunk_documents: number;
  processing_percentage: number;
  error?: string;
}

export interface ProcessingResult {
  status: 'success' | 'partial_success' | 'failed' | 'error';
  total_items: number;
  processed: number;
  successful: number;
  failed: number;
  results: Array<{
    file_id: string;
    filename: string;
    success: boolean;
    message: string;
  }>;
  error?: string;
}

export interface SingleFileResult {
  success: boolean;
  message: string;
  file_id: string;
  metadata?: any;
}

export interface DeleteChunksResult {
  success: boolean;
  message: string;
  file_id: string;
}

class MetadataService {
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    try {
      const url = `${METADATA_BASE_URL}${endpoint}`;
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Metadata service ${endpoint} error:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
    return this.makeRequest('/health');
  }

  // Get processing statistics
  async getProcessingStats(userId?: string): Promise<ProcessingStats> {
    const endpoint = userId 
      ? `/processing-stats?user_id=${encodeURIComponent(userId)}`
      : '/processing-stats';
    return this.makeRequest(endpoint);
  }

  // Process metadata in batches
  async processMetadata(userId: string, batchSize: number = 10): Promise<ProcessingResult> {
    return this.makeRequest('/process-metadata', 'POST', {
      user_id: userId,
      batch_size: batchSize
    });
  }

  // Process a single file
  async processSingleFile(fileId: string, userId: string): Promise<SingleFileResult> {
    return this.makeRequest('/process-single-file', 'POST', {
      file_id: fileId,
      user_id: userId
    });
  }

  // Reprocess a specific file
  async reprocessFile(fileId: string, userId: string): Promise<SingleFileResult> {
    return this.makeRequest('/reprocess-file', 'POST', {
      file_id: fileId,
      user_id: userId
    });
  }

  // Delete chunks for a specific file
  async deleteFileChunks(fileId: string, userId: string): Promise<DeleteChunksResult> {
    return this.makeRequest('/delete-chunks', 'DELETE', {
      file_id: fileId,
      user_id: userId
    });
  }

  // Poll processing progress with timeout
  async pollProcessingProgress(
    userId: string,
    onProgress?: (stats: ProcessingStats) => void,
    maxAttempts: number = 60,
    intervalMs: number = 5000
  ): Promise<ProcessingStats> {
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          attempts++;
          const stats = await this.getProcessingStats(userId);
          
          if (onProgress) {
            onProgress(stats);
          }
          
          // Check if processing is complete or max attempts reached
          if (stats.processing_percentage >= 100 || attempts >= maxAttempts) {
            resolve(stats);
            return;
          }
          
          // Continue polling
          setTimeout(poll, intervalMs);
        } catch (error) {
          reject(error);
        }
      };
      
      poll();
    });
  }

  // Start metadata processing with progress tracking
  async startProcessingWithProgress(
    userId: string,
    batchSize: number = 5,
    onProgress?: (stats: ProcessingStats) => void
  ): Promise<ProcessingResult> {
    try {
      // First, get current stats
      const initialStats = await this.getProcessingStats(userId);
      
      if (initialStats.total_files === 0) {
        return {
          status: 'success',
          total_items: 0,
          processed: 0,
          successful: 0,
          failed: 0,
          results: []
        };
      }
      
      // If all files are already processed
      if (initialStats.processing_percentage >= 100) {
        return {
          status: 'success',
          total_items: initialStats.total_files,
          processed: initialStats.processed_files,
          successful: initialStats.processed_files,
          failed: 0,
          results: []
        };
      }
      
      // Start processing
      const processResult = await this.processMetadata(userId, batchSize);
      
      // If processing started successfully, poll for progress
      if (processResult.status !== 'error') {
        await this.pollProcessingProgress(userId, onProgress);
      }
      
      return processResult;
    } catch (error) {
      console.error('Error in startProcessingWithProgress:', error);
      throw error;
    }
  }
}

export const metadataService = new MetadataService();
