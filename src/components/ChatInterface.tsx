
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalAuditLogger } from '@/hooks/useGlobalAuditLogger';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Settings, Search } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import ImprovedChatInput from "@/components/ImprovedChatInput";
import ChatWelcomeDialog from "./ChatWelcomeDialog";
import ConnectivityPanel from "./ConnectivityPanel";

import { Message, Conversation } from "@/types/chat";
import { fastApiService, detectIntent, startPlatformSync } from "@/services/fastApiService";
import { toast } from "sonner";

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingType, setThinkingType] = useState<'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general' | 'delete'>('general');
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('weez-welcome-shown');
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState("default");
  const [showWorkspacePrompt, setShowWorkspacePrompt] = useState(true);
  const [showConnectServices, setShowConnectServices] = useState(false);
  const navigate = useNavigate();
  const { logCustomEvent } = useGlobalAuditLogger();
  const { logFileAccess, logAuditEvent } = useAuditLogger();

  // Initialize with a default conversation
  useEffect(() => {
    const defaultConversation: Conversation = {
      id: "default",
      messages: [],
      timestamp: new Date()
    };
    setConversations([defaultConversation]);
  }, []);

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
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Update current conversation with user message
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, messages: [...conv.messages, userMessage] }
        : conv
    ));

    // Process with backend
    await handleBackendResponse(newMessage);
  };

  const handleFileAction = (file: any) => {
    console.log("File action triggered:", file);
  };

  const handleConversationSelect = (id: string) => {
    setCurrentConversationId(id);
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setMessages(conversation.messages);
    }
  };

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      messages: [],
      timestamp: new Date()
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setMessages([]);
  };

  const handleNavigateToWorkspace = () => {
    navigate("/workspace");
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
          onNavigateToWorkspace={handleNavigateToWorkspace}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <ChatHeader />
          
          <div className="flex-1 flex flex-col min-h-0">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground mb-3">
                    How can I help you today?
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Ask me anything about your marketing files, campaigns, or strategy. I'm here to help you find insights and create content.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                    <Button
                      variant="outline"
                      className="text-left h-auto p-4 justify-start"
                      onClick={() => handleSendMessage("Summarize my latest marketing campaign files")}
                    >
                      <div>
                        <p className="font-medium">Campaign Analysis</p>
                        <p className="text-sm text-muted-foreground">Summarize my latest marketing files</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-left h-auto p-4 justify-start"
                      onClick={() => handleSendMessage("Help me create content for social media")}
                    >
                      <div>
                        <p className="font-medium">Content Creation</p>
                        <p className="text-sm text-muted-foreground">Generate social media content</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-left h-auto p-4 justify-start"
                      onClick={() => handleSendMessage("Find files about our brand guidelines")}
                    >
                      <div>
                        <p className="font-medium">Brand Assets</p>
                        <p className="text-sm text-muted-foreground">Locate brand guidelines and assets</p>
                      </div>
                    </Button>
                     <Button
                       variant="outline"
                       className="text-left h-auto p-4 justify-start"
                       onClick={() => handleSendMessage("Analyze our competitor research")}
                     >
                       <div>
                         <p className="font-medium">Market Research</p>
                         <p className="text-sm text-muted-foreground">Review competitor analysis</p>
                       </div>
                      </Button>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-border">
                      <Dialog open={showConnectServices} onOpenChange={setShowConnectServices}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="lg" className="w-full">
                            <Settings className="w-4 h-4 mr-2" />
                            Connect Services
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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
            
            <div className="border-t border-border bg-background p-4">
              <div className="max-w-4xl mx-auto">
                <ImprovedChatInput onSendMessage={handleSendMessage} disabled={isThinking} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showWelcome && (
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
