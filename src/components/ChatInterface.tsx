
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import ChatWelcomeDialog from "./ChatWelcomeDialog";
import { Message, Conversation } from "@/types/chat";
import { demoFiles, demoResponses } from "@/data/demoData";

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingType, setThinkingType] = useState<'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general'>('general');
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

  const simulateAIResponse = async (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Determine thinking type and response based on message content
    let responseType: 'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general' = 'general';
    let response = "";
    let files: any[] = [];
    let thinkingTime = 2000;

    if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
      responseType = 'search';
      thinkingTime = 1500;
      const relevantFiles = demoFiles.filter(file => 
        lowerMessage.includes('deep learning') ? file.name.toLowerCase().includes('deep') :
        lowerMessage.includes('financial') ? file.name.toLowerCase().includes('financial') :
        lowerMessage.includes('project') ? file.name.toLowerCase().includes('project') :
        Math.random() > 0.5
      ).slice(0, 3);
      files = relevantFiles;
      response = `I found ${relevantFiles.length} relevant files across your connected platforms:\n\n${relevantFiles.map(f => `📄 **${f.name}** (${f.platform} - ${f.size})\n   ${f.summary}`).join('\n\n')}`;
    } else if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
      responseType = 'summary';
      thinkingTime = 2500;
      const randomFile = demoFiles[Math.floor(Math.random() * demoFiles.length)];
      files = [randomFile];
      response = `Here's a summary of **${randomFile.name}**:\n\n${randomFile.summary}\n\n**Key Details:**\n• Platform: ${randomFile.platform}\n• Size: ${randomFile.size}\n• Last Modified: ${randomFile.lastModified}\n• Type: ${randomFile.type}`;
    } else if (lowerMessage.includes('upload') || lowerMessage.includes('save')) {
      responseType = 'upload';
      thinkingTime = 3000;
      response = "✅ **Upload Successful!**\n\n📁 File uploaded to Google Drive\n🔗 Shareable link: drive.google.com/file/d/1abc...\n👥 Permissions: Team members (view access)\n📊 File size: 2.4 MB\n⏰ Upload completed in 2.8s";
    } else if (lowerMessage.includes('explain') || lowerMessage.includes('about')) {
      responseType = 'rag';
      thinkingTime = 2800;
      const randomFile = demoFiles[Math.floor(Math.random() * demoFiles.length)];
      files = [randomFile];
      response = `Based on your **${randomFile.name}** document:\n\n${randomFile.summary}\n\n**Detailed Analysis:**\n• This document contains comprehensive information about the topic\n• Key insights and data points are well-structured\n• Recommendations and next steps are clearly outlined\n• The content is current and relevant to your current projects`;
    } else {
      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      responseType = randomResponse.type;
      response = randomResponse.response;
      files = randomResponse.files || [];
      thinkingTime = 1800;
    }

    // Show thinking animation
    setIsThinking(true);
    setThinkingType(responseType);

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
