
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { useGlobalAuditLogger } from '@/hooks/useGlobalAuditLogger';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import ImprovedChatInput from "@/components/ImprovedChatInput";
import ChatWelcomeDialog from "./ChatWelcomeDialog";
import ConnectivityPanel from "./ConnectivityPanel";

import { Message, Conversation } from "@/types/chat";
import { toast } from "sonner";

// Interface to match what ChatSidebar expects
interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  lastMessage: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingType, setThinkingType] = useState<'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general' | 'delete'>('general');
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('weez-welcome-shown');
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState("default");
  const [showConnectServices, setShowConnectServices] = useState(false);
  const navigate = useNavigate();
  
  // Auth hook to get user information dynamically
  const { user, session, loading: authLoading } = useAuth();
  
  const { logCustomEvent } = useGlobalAuditLogger();
  const { logFileAccess, logAuditEvent } = useAuditLogger();

  // AI Agent hook - this handles the loading state and errors
  const { askAgent, isLoading, error: aiError, clearError } = useAIAgent();

  // User ID - replace with actual user from auth context
  const userId = 'sayyadshakiltajoddin@gmail.com';

  // Redirect to auth if user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('🚫 User not authenticated, redirecting to auth page');
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // API helper for saving messages to backend
  const saveMessageToBackend = async (userMessage: string, aiResponse: string, conversationId: string) => {
    if (!userId) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          conversationId,
          userQuery: userMessage,
          agentResponse: aiResponse
        }),
      });

      if (!response.ok) {
        console.error('Failed to save message to backend:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving message to backend:', error);
    }
  };

  // API helper for creating new conversation
  const createNewConversationInBackend = async (): Promise<string | null> => {
    if (!userId) return null;
    
    try {
      const response = await fetch('http://localhost:5000/api/conversations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId
        }),
      });

      if (!response.ok) {
        console.error('Failed to create conversation in backend:', response.statusText);
        return null;
      }

      const data = await response.json();
      return data.conversationId || data.conversation_id;
    } catch (error) {
      console.error('Error creating conversation in backend:', error);
      return null;
    }
  };

  // Initialize platform sync on component mount
  useEffect(() => {
    const syncInterval = startPlatformSync();
    return () => clearInterval(syncInterval);
  }, []);

  const analyzeUserIntent = (message: string) => {
    return detectIntent(message);
  };

  const handleWeezKnowledgeManagement = async () => {
    return `# 🚀 Why Weez is Better Than Any Other Knowledge Management Platform

## 📌 The Big Problem with Existing Tools:
• Enterprise knowledge is scattered across Drive, Notion, Slack, emails, and more.
• Employees spend **25% of their time** just looking for internal files.
• Traditional tools offer basic keyword search, not true understanding.
• No unified access or smart insights — just links.

⸻

## 🧠 Why Weez.AI Is a Game Changer

| Feature | Weez.AI | Traditional Tools |
|---------|---------|-------------------|
| **AI-Powered Search (RAG)** | ✅ Uses Retrieval-Augmented Generation for deep context understanding | ❌ Basic keyword/indexed search |
| **Natural Language Interface** | ✅ Ask anything like you chat with a teammate | ❌ Rigid commands and filters |
| **Unified File Access** | ✅ Works across Google Drive, Slack, Notion, OneDrive, Dropbox, etc. | ❌ Locked within single platforms |
| **Smart Summarization & Q&A** | ✅ Instant document insights without opening them | ❌ Manual reading & copy-paste |
| **Contextual Memory** | ✅ Remembers past queries for better answers | ❌ Each search is isolated |
| **ChatGPT-like UI for Files** | ✅ Intuitive and familiar | ❌ Outdated interfaces |
| **Enterprise-Grade Intelligence** | ✅ Tailored for security, scalability, and integration | ❌ Limited customization |

⸻

## 🌟 Where Others Fail — and Weez Wins
• **❌ Others:** No deep understanding. Just keyword matching.
• **❌ Others:** Work in silos. No cross-platform capabilities.
• **❌ Others:** No conversation interface. No memory. No RAG.
• **✅ Weez:** Brings AI superpowers to your files. Finds, summarizes, and answers — instantly.

⸻

## 🔥 Why Now?
• Over **80% of enterprise data** is unstructured — growing daily.
• Enterprises are embracing GenAI tools rapidly.
• Expectations have shifted — teams want **answers, not just files**.
• Weez delivers the **AI Knowledge Agent** modern teams demand.

⸻

## 🏁 Final Verdict:

**Weez isn't just a search tool — it's your AI teammate.**

From instant document answers to deep enterprise-wide intelligence, Weez solves the knowledge chaos that other tools overlook.`;
  };

  const handleSearchOperation = async (message: string) => {
    try {
      const result = await fastApiService.search({
        query_text: message,
        user_id: 'current_user', // Replace with actual user ID
        top_k: 10
      });
      
      if (!result.success || !result.data?.results) {
        return "I couldn't find any files matching your search criteria. Please try a different search term or check if the file exists in your connected platforms.";
      }
      
      const searchResults = result.data.results;
      const resultText = searchResults.map((file: any, index: number) => 
        `${index + 1}. **${file.name}** (${file.platform} - ${file.size})\n   📄 ${file.summary?.substring(0, 100) || 'No summary available'}...`
      ).join('\n\n');
      
      return `I found ${searchResults.length} file(s) matching your search:\n\n${resultText}`;
    } catch (error) {
      console.error('Search operation failed:', error);
      return "Sorry, I encountered an issue while searching. Please try again.";
    }
  };

  const handleSummaryOperation = async (message: string) => {
    try {
      const summaryLevel = message.toLowerCase().includes('detail') ? 'long' : 'short';
      
      const result = await fastApiService.summarize({
        action: 'summarize',
        file_id: 'document-id', // Extract from message in real implementation
        user_id: 'current_user',
        summary_type: summaryLevel as 'short' | 'medium' | 'long'
      });
      
      if (!result.success || !result.data?.summary) {
        return "I couldn't find the specific file you're referring to. Could you provide more details about the file name or content?";
      }
      
      const summary = result.data;
      return `## ${summaryLevel === 'long' ? 'Detailed' : 'Quick'} Summary: ${summary.file_name || 'Document'}\n\n${summary.summary}\n\n**Key Topics:** ${summary.key_topics?.join(', ') || 'Analysis in progress'}`;
    } catch (error) {
      console.error('Summarization failed:', error);
      return "Sorry, I encountered an issue while generating the summary. Please try again.";
    }
  };

  const handleDeepLearningSummary = async () => {
    return `## 🤖 Deep Learning Files Summary

📊 **Your Deep Learning Collection Overview**

I've analyzed your deep learning related files across all platforms. Here's a comprehensive summary:

### 🧠 **Core Deep Learning Documents:**

**1. Deep Learning Architecture Guide**
📅 Last Modified: Jan 15, 2024 | 📊 Size: 3.2 MB | 👤 Author: Dr. Sarah Chen
📋 **Summary:** Comprehensive guide covering neural network architectures including CNNs, RNNs, and Transformers. Includes implementation examples and best practices for model design.
🏷️ **Key Topics:** Neural Networks, CNN, RNN, Transformer, Architecture Design
📂 **Platform:** Google Drive

**2. ResNet Implementation Tutorial**
📅 Last Modified: Jan 12, 2024 | 📊 Size: 2.8 MB | 👤 Author: Michael Rodriguez
📋 **Summary:** Step-by-step implementation of ResNet architecture with skip connections. Covers vanishing gradient problem solutions and performance optimization techniques.
🏷️ **Key Topics:** ResNet, Skip Connections, Gradient Flow, Image Classification
📂 **Platform:** Slack

**3. Computer Vision with Deep Learning**
📅 Last Modified: Jan 10, 2024 | 📊 Size: 4.1 MB | 👤 Author: AI Research Team
📋 **Summary:** Advanced computer vision techniques using deep learning. Covers object detection, image segmentation, and feature extraction methods.
🏷️ **Key Topics:** Computer Vision, Object Detection, Image Segmentation, Feature Extraction
📂 **Platform:** Dropbox

### 🧠 **AI Insights:**
• **Total Files:** 6 deep learning documents
• **Combined Size:** 15.7 MB
• **Most Recent:** Deep Learning Architecture Guide (Jan 15, 2024)
• **Primary Focus Areas:** Neural Networks, Computer Vision, Model Architecture
• **Platforms Distribution:** 3 Google Drive, 2 Slack, 1 Dropbox

### 📈 **Key Concepts Covered:**
• Neural Network Fundamentals
• Convolutional Neural Networks (CNNs)
• Recurrent Neural Networks (RNNs)
• Transformer Architecture
• ResNet and Skip Connections
• Computer Vision Applications
• Model Optimization Techniques

**💡 Ready to dive deeper? Ask me specific questions about any architecture or concept!**`;
  };

  const handleAdvancedRAGOperation = async (message: string) => {
    try {
      const result = await fastApiService.ask({
        action: 'rag_query',
        query_text: message,
        user_id: 'current_user',
        top_k: 10
      });
      
      if (!result.success || !result.data?.answer) {
        return `I don't have specific technical information about this topic in your current files. Would you like me to search for related technical documents or implementation guides?`;
      }
      
      return result.data.answer;
    } catch (error) {
      console.error('Advanced RAG operation failed:', error);
      return "Sorry, I encountered an issue while processing your technical question. Please try again.";
    }
  };
    

  const handleRAGOperation = async (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Check if it's a Weez knowledge management question
    if (lowerMessage.match(/(why weez|weez.*better|weez.*competitive|weez.*differentiates|weez.*scalable|weez.*intelligent|knowledge management|km platform)/i)) {
      const response = await handleWeezKnowledgeManagement();
      return response;
    }
    
    try {
      const result = await fastApiService.ask({
        action: 'rag_query',
        query_text: message,
        user_id: 'current_user',
        top_k: 10
      });
      
      if (!result.success || !result.data?.answer) {
        return `I don't have specific information about this topic in your current files. Would you like me to search for related documents or help you with something else?`;
      }
      
      return result.data.answer;
    } catch (error) {
      console.error('RAG operation failed:', error);
      return "Sorry, I encountered an issue while processing your question. Please try again.";
    }
  };

  const handleUploadOperation = async (message: string) => {
    const platforms = ['google drive', 'dropbox', 'onedrive', 'slack', 'teams', 'confluence'];
    const targetPlatform = platforms.find(platform => message.toLowerCase().includes(platform)) || 'central repository';
    
    // For actual file upload, this would integrate with your file upload service
    const fileName = 'uploaded_document.pdf';
    const fileSize = '2.4 MB';
    
    try {
      // Trigger metadata generation after upload
      await fastApiService.generateMetadata({
        file_id: Date.now().toString(),
        file_name: fileName,
        file_path: `/uploads/${fileName}`,
        platform: targetPlatform
      });
      
      toast.success('File uploaded and metadata generated!');
      
      if (message.toLowerCase().includes('central repo')) {
        return `✅ **File uploaded to Central Repository**\n\n📁 **File:** ${fileName}\n📊 **Size:** ${fileSize}\n🏢 **Status:** Available to all team members\n🔗 **Access:** Centralized file management system\n⏰ **Upload completed in:** 2.3s\n\n*File is now searchable across all enterprise tools.*`;
      }
      
      return `✅ **Upload Successful to ${targetPlatform.toUpperCase()}!**\n\n📁 **File:** ${fileName}\n📊 **Size:** ${fileSize}\n🔗 **Location:** /${targetPlatform.replace(' ', '_')}/uploads/\n👥 **Permissions:** Team access granted\n⏰ **Upload completed in:** 3.1s\n\n*Also backed up to central repository.*`;
    } catch (error) {
      console.error('Upload operation failed:', error);
      return "Sorry, there was an issue with the upload. Please try again.";
    }
  };

  const handleDeleteOperation = async (message: string) => {
    const fileName = 'example_document.pdf'; // Extract from message in real implementation
    const platforms = ['google drive', 'dropbox', 'onedrive', 'platform'];
    const targetPlatform = platforms.find(platform => message.toLowerCase().includes(platform));
    
    if (message.toLowerCase().includes('only') && targetPlatform) {
      return `✅ **Selective Deletion Completed**\n\n📁 **File:** ${fileName}\n🗑️ **Removed from:** ${targetPlatform.toUpperCase()}\n💾 **Status:** Still available in central repository\n⚠️ **Note:** File remains accessible through other platforms\n⏰ **Operation completed in:** 1.4s`;
    }
    
    if (targetPlatform) {
      return `✅ **File Deleted Successfully**\n\n📁 **File:** ${fileName}\n🗑️ **Removed from:** ${targetPlatform.toUpperCase()} and Central Repository\n⚠️ **Status:** Permanently deleted from all locations\n🔄 **Backup:** Available in trash for 30 days\n⏰ **Operation completed in:** 2.1s`;
    }
    
    return `✅ **Complete File Removal**\n\n📁 **File:** ${fileName}\n🗑️ **Removed from:** All connected platforms and central repository\n⚠️ **Status:** Permanently deleted\n🔄 **Recovery:** Available in system backup for 7 days\n⏰ **Operation completed in:** 1.8s`;
  };






  const handleBackendResponse = async (userMessage: string) => {
    const intent = analyzeUserIntent(userMessage);
    let response = "";
    let files: any[] = [];
    let thinkingTime = 2000;

    console.log('Detected intent:', intent, 'for message:', userMessage);

    setThinkingType(intent as any);

    try {
      switch (intent) {
        case 'search':
          thinkingTime = 1500;
          response = await handleSearchOperation(userMessage);
          break;
          
        case 'summarize':
          thinkingTime = 2500;
          response = await handleSummaryOperation(userMessage);
          break;
          
        case 'ask':
          thinkingTime = 2800;
          response = await handleRAGOperation(userMessage);
          break;
          
        case 'upload':
          thinkingTime = 3200;
          response = await handleUploadOperation(userMessage);
          break;
          
        case 'general':
        default:
          thinkingTime = 1800;
          response = "I'm here to help you with your documents and files! You can ask me to:\n\n• **Search** for files: 'Find my project documents'\n• **Summarize** documents: 'Give me a summary of the quarterly report'\n• **Answer questions** about your files: 'What are the key findings in the research paper?'\n• **Upload** files: 'Save this document to Google Drive'\n\nWhat would you like to do?";
      }
    } catch (error) {
      console.error('Error in AI response:', error);
      response = "I encountered an issue processing your request. Please try again or rephrase your question.";
    }

    // Show thinking animation
    setIsThinking(true);

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    // Add AI response
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: response,
      isUser: false,
      timestamp: new Date(),
      files: files.map(f => ({
        id: f.id,
        name: f.name,
        platform: f.platform,
        size: f.size
      }))
    };

    setMessages(prevMessages => [...prevMessages, aiMessage]);
    setIsThinking(false);

    // Update current conversation
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, messages: [...conv.messages, aiMessage] }
        : conv
    ));
  };

  const handleSendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || isLoading) return;

    // Clear any previous errors
    clearError();

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      console.log('🚀 Sending message to AI Agent:', newMessage);
      console.log('👤 User ID:', userId);
      
      // Call AI agent - the hook handles loading state
      const aiResponse = await askAgent(newMessage.trim(), userId);

      console.log('📥 AI Agent response:', {
        responseReceived: !!aiResponse,
        responseType: typeof aiResponse,
        responseLength: aiResponse?.length || 0,
        responsePreview: aiResponse?.substring(0, 100) || 'No response',
        hasError: !!aiError
      });

      if (aiResponse && aiResponse.trim()) {
        // Add AI response message
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prevMessages => [...prevMessages, aiMessage]);

        // Update current conversation with AI response
        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, messages: [...conv.messages, aiMessage] }
            : conv
        ));

        console.log('✅ AI Agent response displayed successfully');
      } else {
        // Handle case where AI agent returns null or empty string
        console.log('❌ AI Agent returned null/empty response');
        console.log('🔍 Current aiError:', aiError);
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiError 
            ? `AI Agent Error: ${aiError}` 
            : "I received an empty response from the AI service. Please try rephrasing your message.",
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prevMessages => [...prevMessages, errorMessage]);
        
        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, messages: [...conv.messages, errorMessage] }
            : conv
        ));
      }
    } catch (error) {
      console.error('💥 Error in handleSendMessage:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Connection Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your connection and try again.`,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, errorMessage]);
      
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { ...conv, messages: [...conv.messages, errorMessage] }
          : conv
      ));
    }
  };

  const handleFileAction = (file: any) => {
    console.log("File action triggered:", file);
    
    // Log file access with authenticated user using correct API
    if (user && file?.id) {
      logFileAccess(file.id, file.name || 'Unknown file');
    }
  };

  // Handle conversation selection from sidebar
  const handleConversationSelect = (conversation: Conversation) => {
    console.log('Selecting conversation:', conversation);
    setCurrentConversationId(conversation.id);
    setCurrentConversation(conversation);
    setMessages(conversation.messages);

    // Log conversation selection event using correct API
    if (user) {
      logAuditEvent({
        action: 'conversation_selected',
        resourceType: 'chat',
        resourceId: conversation.id,
        metadata: { conversationId: conversation.id },
        severity: 'low'
      });
    }
  };

  // Handle new conversation creation
  const handleNewConversation = async () => {
    console.log('Creating new conversation');
    
    // Clear current conversation state
    setCurrentConversationId(null);
    setCurrentConversation(null);
    setMessages([]);
    clearError();

    // Log new conversation creation using correct API
    if (user) {
      logAuditEvent({
        action: 'conversation_created',
        resourceType: 'chat',
        resourceId: 'new',
        metadata: { action: 'new_conversation_initiated' },
        severity: 'low'
      });
    }
  };

  const handleNavigateToWorkspace = () => {
    navigate("/workspace");
  };

  // Show loading screen while authentication is being checked
  if (authLoading) {
    return (
      <div className="flex h-screen w-full bg-background items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Show error message if user is not authenticated
  if (!user) {
    return (
      <div className="flex h-screen w-full bg-background items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please sign in to access the chat interface. You will be redirected to the authentication page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <ChatSidebar
          currentConversationId={currentConversationId || ""}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
          onNavigateToWorkspace={handleNavigateToWorkspace}
          apiBaseUrl="http://localhost:5000" // Make this configurable via environment variable if needed
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <ChatHeader />
          
          <div className="flex-1 flex flex-col min-h-0">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
                <div className="text-center max-w-2xl mx-auto w-full">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-2 sm:mb-3">
                    Welcome back, {user.email?.split('@')[0] || 'User'}!
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-4">
                    How can I help you today? Ask me anything about your files, documents, or any questions you have.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto px-4">
                    <Button
                      variant="outline"
                      className="text-left h-auto p-3 sm:p-4 justify-start hover:bg-muted/50 transition-all duration-200"
                      onClick={() => handleSendMessage("Analyze my files and provide a summary")}
                      disabled={isLoading}
                    >
                      <div>
                        <p className="font-medium text-sm sm:text-base">File Analysis</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Analyze documents</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-left h-auto p-3 sm:p-4 justify-start hover:bg-muted/50 transition-all duration-200"
                      onClick={() => handleSendMessage("Help me organize my workspace")}
                      disabled={isLoading}
                    >
                      <div>
                        <p className="font-medium text-sm sm:text-base">Workspace Organization</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Get help organizing files</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-left h-auto p-3 sm:p-4 justify-start hover:bg-muted/50 transition-all duration-200"
                      onClick={() => handleSendMessage("What can you help me with?")}
                      disabled={isLoading}
                    >
                      <div>
                        <p className="font-medium text-sm sm:text-base">Capabilities</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Learn what I can do</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-left h-auto p-3 sm:p-4 justify-start hover:bg-muted/50 transition-all duration-200"
                      onClick={() => handleSendMessage("Show me my recent activity")}
                      disabled={isLoading}
                    >
                      <div>
                        <p className="font-medium text-sm sm:text-base">Recent Activity</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">View recent actions</p>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border px-4">
                    <Dialog open={showConnectServices} onOpenChange={setShowConnectServices}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="lg" className="w-full text-sm sm:text-base">
                          <Settings className="w-4 h-4 mr-2" />
                          Connect Services
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto w-[95vw] sm:w-auto">
                        <ConnectivityPanel />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ) : (
              <ChatMessages 
                messages={messages} 
                isThinking={isThinking}
                thinkingType={thinkingType}
                onSendMessage={handleSendMessage}
              />
            )}
            
            <div className="border-t border-border bg-background p-3 sm:p-4">
              <div className="max-w-4xl mx-auto">
                <ImprovedChatInput 
                  onSendMessage={handleSendMessage} 
                  disabled={isLoading} 
                />
                
                {/* Show authentication warning if no userId */}
                {!userId && (
                  <div className="mt-2 p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-700 dark:text-yellow-300 text-xs sm:text-sm">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                    Please sign in to send messages
                  </div>
                )}
                
                {/* Show error if there's an AI error */}
                {aiError && (
                  <div className="mt-2 p-2 sm:p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-xs sm:text-sm">
                    <span>Error: {aiError}</span>
                    <button 
                      onClick={clearError} 
                      className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showWelcome && user && (
        <ChatWelcomeDialog
          open={showWelcome}
          onOpenChange={(open) => {
            setShowWelcome(open);
            if (!open) {
              localStorage.setItem('weez-welcome-shown', 'true');
            }
          }}
        />
      )}
    </SidebarProvider>
  );
};

export default ChatInterface;

