// services/aiAgent.ts - Enhanced with CORS handling and better debugging
export interface AIAgentRequest {
  query: string;
  user_id: string;
}

export interface AIAgentResponse {
  response: string;
  user_id: string;
}

export class AIAgentService {
  private static readonly BASE_URL = 'https://weez-ai-agent-v1-h0ahcgcqc2crg9ev.canadacentral-01.azurewebsites.net';

  /**
   * Send a query to the AI agent and get a response
   */
  static async askAgent(query: string, userId: string): Promise<string> {
    // Debug logging
    console.log('🚀 AIAgentService.askAgent called with:', {
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      userId,
      timestamp: new Date().toISOString()
    });

    try {
      const requestBody: AIAgentRequest = {
        query: query,
        user_id: userId
      };

      console.log('📤 Making request to AI Agent:', {
        url: `${this.BASE_URL}/ask`,
        method: 'POST',
        body: requestBody
      });

      const response = await fetch(`${this.BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Add CORS headers
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        mode: 'cors', // Explicitly set CORS mode
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: {
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length'),
          server: response.headers.get('server'),
          date: response.headers.get('date')
        }
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { detail: 'Failed to parse error response' };
        }
        
        const errorMessage = `AI Agent request failed: ${response.status} ${response.statusText}. ${
          errorData.detail || errorData.message || 'Unknown error'
        }`;
        console.error('❌ AI Agent request failed:', errorMessage);
        throw new Error(errorMessage);
      }

      // Get the raw text first to debug
      const rawText = await response.text();
      console.log('📄 Raw response text:', rawText);

      // Parse JSON
      let data: AIAgentResponse;
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', parseError);
        console.error('Raw response was:', rawText);
        throw new Error(`Failed to parse AI agent response: ${parseError}`);
      }
      
      console.log('✅ AI Agent response parsed:', {
        hasResponse: !!data.response,
        responseLength: data.response?.length || 0,
        responseType: typeof data.response,
        userId: data.user_id,
        responsePreview: data.response?.substring(0, 200) + (data.response?.length > 200 ? '...' : ''),
        allFields: Object.keys(data)
      });

      // Validate response structure
      if (!data.response) {
        console.error('❌ AI Agent response missing required field:', data);
        throw new Error('AI Agent response is missing the response field');
      }

      if (typeof data.response !== 'string') {
        console.error('❌ AI Agent response field is not a string:', typeof data.response, data.response);
        throw new Error(`AI Agent response field is ${typeof data.response}, expected string`);
      }

      return data.response;
    } catch (error) {
      console.error('💥 AI Agent request failed:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network/CORS error
        throw new Error('Network error: Unable to connect to AI service. This might be a CORS issue or network connectivity problem.');
      }
      
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        throw error; // Re-throw the original error
      }
      
      throw new Error('Failed to get AI response: Unknown error');
    }
  }

  /**
   * Check if the AI agent service is healthy
   */
  static async healthCheck(): Promise<boolean> {
    try {
      console.log('🏥 Performing AI Agent health check...');
      
      const response = await fetch(`${this.BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors'
      });

      const isHealthy = response.ok;
      console.log(`💓 AI Agent health check result: ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`, {
        status: response.status,
        statusText: response.statusText
      });

      return isHealthy;
    } catch (error) {
      console.error('🚨 AI Agent health check failed:', error);
      return false;
    }
  }

  /**
   * Test the AI agent with a simple query
   */
  static async testConnection(userId: string): Promise<{ success: boolean; message: string; response?: string }> {
    try {
      console.log('🧪 Testing AI Agent connection...');
      
      const testQuery = "Hello, this is a test message. Please respond briefly.";
      const response = await this.askAgent(testQuery, userId);
      
      return {
        success: true,
        message: 'AI Agent connection test successful',
        response: response
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error during connection test'
      };
    }
  }
}
