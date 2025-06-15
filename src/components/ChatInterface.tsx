import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import ChatWelcomeDialog from "./ChatWelcomeDialog";
import { Message, Conversation } from "@/types/chat";
import { demoFiles, semanticSearch, findFileByDescription, extractTopicFromQuery } from "@/data/demoData";

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingType, setThinkingType] = useState<'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general' | 'delete'>('general');
  const [showWelcome, setShowWelcome] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState("default");
  const navigate = useNavigate();

  // Initialize with a default conversation
  useEffect(() => {
    const defaultConversation: Conversation = {
      id: "default",
      messages: [],
      timestamp: new Date()
    };
    setConversations([defaultConversation]);
  }, []);

  const analyzeUserIntent = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Search patterns
    if (lowerMessage.match(/(find|search|look for|locate|show me).+file/i) ||
        lowerMessage.match(/files? (about|related to|containing)/i)) {
      return 'search';
    }
    
    // Summary patterns
    if (lowerMessage.match(/(summarize|summary|give me.+summary|explain.+detail|overview)/i)) {
      return 'summary';
    }
    
    // RAG/Question patterns
    if (lowerMessage.match(/(what is|how does|explain|tell me about|can you help.+understand)/i)) {
      return 'rag';
    }
    
    // Upload patterns
    if (lowerMessage.match(/(upload|save|send|share).+(to|on|in).+(drive|dropbox|onedrive|slack|teams)/i) ||
        lowerMessage.match(/(upload|save).+file/i)) {
      return 'upload';
    }
    
    // Delete patterns
    if (lowerMessage.match(/(delete|remove|get rid of).+file/i) ||
        lowerMessage.match(/(delete|remove).+(from|in).+(drive|dropbox|platform)/i)) {
      return 'delete';
    }
    
    return 'general';
  };

  const handleSearchOperation = async (message: string) => {
    const searchResults = semanticSearch(message);
    
    if (searchResults.length === 0) {
      return "I couldn't find any files matching your search criteria. Please try a different search term or check if the file exists in your connected platforms.";
    }
    
    const resultText = searchResults.map((file, index) => 
      `${index + 1}. **${file.name}** (${file.platform} - ${file.size})\n   📄 ${file.summary.substring(0, 100)}...`
    ).join('\n\n');
    
    return `I found ${searchResults.length} file(s) matching your search:\n\n${resultText}`;
  };

  const handleSummaryOperation = async (message: string) => {
    const file = findFileByDescription(message);
    
    if (!file) {
      return "I couldn't find the specific file you're referring to. Could you provide more details about the file name or content?";
    }
    
    const summaryLevel = message.toLowerCase().includes('detail') ? 'detailed' : 'short';
    
    if (summaryLevel === 'detailed') {
      return `## Detailed Summary: ${file.name}\n\n**Platform:** ${file.platform}\n**Size:** ${file.size}\n**Last Modified:** ${file.lastModified}\n\n**Content Overview:**\n${file.summary}\n\n**Key Topics:** ${file.tags.join(', ')}\n\n**File Type:** ${file.type} document containing comprehensive information suitable for ${file.tags[0]} purposes.`;
    } else {
      return `## Quick Summary: ${file.name}\n\n${file.summary.split('.')[0]}.\n\n**Key highlights:** ${file.tags.slice(0, 3).join(', ')}`;
    }
  };

  const handleRAGOperation = async (message: string) => {
    const topic = extractTopicFromQuery(message);
    const relevantFiles = semanticSearch(topic);
    
    if (relevantFiles.length === 0) {
      return `I don't have specific information about "${topic}" in your current files. Would you like me to search for related documents or help you with something else?`;
    }
    
    const primaryFile = relevantFiles[0];
    
    // Generate contextual answer based on the topic and file content
    const answers = {
      'resnet': `**ResNet (Residual Networks)** is a deep learning architecture that solves the vanishing gradient problem through skip connections.\n\n**Key Features:**\n• Skip connections allow gradients to flow directly\n• Enables training of very deep networks (50-152 layers)\n• Uses bottleneck blocks for computational efficiency\n• Achieves superior performance on image classification\n\n*Source: ${primaryFile.name}*`,
      
      'deep learning': `**Deep Learning** is a subset of machine learning using artificial neural networks with multiple layers.\n\n**Core Concepts:**\n• Multiple hidden layers for feature extraction\n• Backpropagation for training\n• Various architectures (CNN, RNN, Transformer)\n• Applications in computer vision, NLP, and more\n\n*Based on: ${primaryFile.name}*`,
      
      'api': `**API (Application Programming Interface)** defines how software components communicate.\n\n**Integration Best Practices:**\n• Authentication and security protocols\n• Rate limiting and error handling\n• Documentation and testing\n• Version management\n\n*Reference: ${primaryFile.name}*`,
      
      'investment': `**Investment Analysis** involves evaluating financial opportunities for optimal returns.\n\n**Key Metrics:**\n• Risk assessment and diversification\n• Return on investment (ROI) calculations\n• Market trend analysis\n• Portfolio optimization\n\n*Data from: ${primaryFile.name}*`
    };
    
    return answers[topic.toLowerCase()] || 
           `Based on your **${primaryFile.name}** document:\n\n${primaryFile.summary}\n\n**This information relates to:** ${primaryFile.tags.join(', ')}\n\nWould you like me to elaborate on any specific aspect?`;
  };

  const handleUploadOperation = async (message: string) => {
    const platforms = ['google drive', 'dropbox', 'onedrive', 'slack', 'teams', 'confluence'];
    const targetPlatform = platforms.find(platform => message.toLowerCase().includes(platform)) || 'central repository';
    
    const file = findFileByDescription(message) || demoFiles[Math.floor(Math.random() * demoFiles.length)];
    
    if (message.toLowerCase().includes('central repo')) {
      return `✅ **File uploaded to Central Repository**\n\n📁 **File:** ${file.name}\n📊 **Size:** ${file.size}\n🏢 **Status:** Available to all team members\n🔗 **Access:** Centralized file management system\n⏰ **Upload completed in:** 2.3s\n\n*File is now searchable across all enterprise tools.*`;
    }
    
    return `✅ **Upload Successful to ${targetPlatform.toUpperCase()}!**\n\n📁 **File:** ${file.name}\n📊 **Size:** ${file.size}\n🔗 **Location:** /${targetPlatform.replace(' ', '_')}/uploads/\n👥 **Permissions:** Team access granted\n⏰ **Upload completed in:** 3.1s\n\n*Also backed up to central repository.*`;
  };

  const handleDeleteOperation = async (message: string) => {
    const file = findFileByDescription(message) || demoFiles[Math.floor(Math.random() * demoFiles.length)];
    const platforms = ['google drive', 'dropbox', 'onedrive', 'platform'];
    const targetPlatform = platforms.find(platform => message.toLowerCase().includes(platform));
    
    if (message.toLowerCase().includes('only') && targetPlatform) {
      return `✅ **Selective Deletion Completed**\n\n📁 **File:** ${file.name}\n🗑️ **Removed from:** ${targetPlatform.toUpperCase()}\n💾 **Status:** Still available in central repository\n⚠️ **Note:** File remains accessible through other platforms\n⏰ **Operation completed in:** 1.4s`;
    }
    
    if (targetPlatform) {
      return `✅ **File Deleted Successfully**\n\n📁 **File:** ${file.name}\n🗑️ **Removed from:** ${targetPlatform.toUpperCase()} and Central Repository\n⚠️ **Status:** Permanently deleted from all locations\n🔄 **Backup:** Available in trash for 30 days\n⏰ **Operation completed in:** 2.1s`;
    }
    
    return `✅ **Complete File Removal**\n\n📁 **File:** ${file.name}\n🗑️ **Removed from:** All connected platforms and central repository\n⚠️ **Status:** Permanently deleted\n🔄 **Recovery:** Available in system backup for 7 days\n⏰ **Operation completed in:** 1.8s`;
  };

  const simulateAIResponse = async (userMessage: string) => {
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
          files = semanticSearch(userMessage).slice(0, 3);
          break;
          
        case 'summary':
          thinkingTime = 2500;
          response = await handleSummaryOperation(userMessage);
          const summaryFile = findFileByDescription(userMessage);
          if (summaryFile) files = [summaryFile];
          break;
          
        case 'rag':
          thinkingTime = 2800;
          response = await handleRAGOperation(userMessage);
          const topic = extractTopicFromQuery(userMessage);
          files = semanticSearch(topic).slice(0, 2);
          break;
          
        case 'upload':
          thinkingTime = 3200;
          response = await handleUploadOperation(userMessage);
          break;
          
        case 'delete':
          thinkingTime = 2200;
          response = await handleDeleteOperation(userMessage);
          break;
          
        default:
          thinkingTime = 1800;
          response = "I'm here to help you with file operations! You can ask me to:\n\n• **Search** for files: 'Find my deep learning papers'\n• **Summarize** documents: 'Give me a summary of the project proposal'\n• **Answer questions** about your files: 'What is ResNet architecture?'\n• **Upload** files: 'Save this to Google Drive'\n• **Delete** files: 'Remove the old report from Dropbox'\n\nWhat would you like to do?";
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

    // Simulate AI response
    await simulateAIResponse(newMessage);
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
      <div className="h-screen flex bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-hidden w-full">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(167,139,250,0.1),transparent_50%)] pointer-events-none"></div>
        
        <div className="relative z-10 flex w-full">
          <ChatSidebar 
            conversations={conversations}
            currentConversationId={currentConversationId}
            onConversationSelect={handleConversationSelect}
            onNewConversation={handleNewConversation}
            onNavigateToWorkspace={handleNavigateToWorkspace}
          />
          
          <div className="flex-1 flex flex-col">
            <ChatHeader />
            
            <div className="flex-1 flex flex-col">
              <ChatMessages 
                messages={messages} 
                isThinking={isThinking}
                thinkingType={thinkingType}
                onSendMessage={handleSendMessage}
              />
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>

        <ChatWelcomeDialog 
          open={showWelcome} 
          onOpenChange={setShowWelcome} 
        />
      </div>
    </SidebarProvider>
  );
};

export default ChatInterface;
