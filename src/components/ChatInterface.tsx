
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Sparkles, Search, FileText, Brain, Upload } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatSidebar from "./ChatSidebar";
import SuggestionBubbles from "./SuggestionBubbles";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  files?: Array<{
    id: string;
    name: string;
    platform: string;
    size: string;
  }>;
}

export interface Conversation {
  id: string;
  messages: Message[];
  timestamp: Date;
}

const ChatInterface = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      messages: [
        {
          id: "1",
          content: "Hello! I'm Weezy, your AI-powered assistant. I can help you search through your files, summarize documents, answer questions about your content, and manage your workspace. How can I assist you today?",
          isUser: false,
          timestamp: new Date(Date.now() - 60000),
        }
      ],
      timestamp: new Date(Date.now() - 60000),
    }
  ]);
  
  const [currentConversationId, setCurrentConversationId] = useState("1");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingType, setThinkingType] = useState<'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general'>('general');

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  const navigate = useNavigate();

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, messages: [...conv.messages, newMessage] }
        : conv
    ));

    // Simulate AI response with appropriate thinking type
    setIsThinking(true);
    if (content.toLowerCase().includes('search') || content.toLowerCase().includes('find')) {
      setThinkingType('search');
    } else if (content.toLowerCase().includes('summarize') || content.toLowerCase().includes('summary')) {
      setThinkingType('summary');
    } else {
      setThinkingType('general');
    }
    
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand your request. Let me help you with that. This is a demo response to show the interface functionality.",
        isUser: false,
        timestamp: new Date(),
      };

      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { ...conv, messages: [...conv.messages, aiResponse] }
          : conv
      ));
      
      setIsThinking(false);
    }, 2000);
  };

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      messages: [],
      timestamp: new Date(),
    };
    
    setConversations(prev => [...prev, newConversation]);
    setCurrentConversationId(newConversation.id);
  };

  const handleConversationSelect = (id: string) => {
    setCurrentConversationId(id);
  };

  const quickActions = [
    {
      icon: Search,
      title: "Search Files",
      description: "Find documents across all platforms",
      action: () => handleSendMessage("Search for my recent files"),
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: FileText,
      title: "Summarize Document",
      description: "Get quick summaries of your files",
      action: () => handleSendMessage("Summarize my latest document"),
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Brain,
      title: "Ask Questions",
      description: "Query your document content",
      action: () => handleSendMessage("Answer questions about my files"),
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Upload,
      title: "Upload & Analyze",
      description: "Upload new files for analysis",
      action: () => handleSendMessage("Help me upload and analyze a new file"),
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  const suggestions = [
    "Find PDF reports from last week",
    "Summarize quarterly results",
    "Search shared Google Docs",
    "Show Excel spreadsheets",
    "Find presentation files",
    "List recent uploads"
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.08),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.02),transparent_50%)] pointer-events-none"></div>
        
        <ChatSidebar 
          conversations={conversations}
          currentConversationId={currentConversationId}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
          onNavigateToWorkspace={() => navigate("/workspace")}
        />
        
        <SidebarInset className="flex-1 flex flex-col relative z-10">
          <ChatHeader />

          <div className="flex-1 flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 px-6 py-8 flex flex-col">
                {/* Welcome Section */}
                <div className="text-center mb-12">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl mx-auto">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl opacity-60 animate-pulse"></div>
                  </div>
                  
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent mb-4">
                    Welcome to Weezy AI
                  </h1>
                  <p className="text-gray-400 text-lg font-medium">
                    Your intelligent file assistant for search, summarization, and analysis
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="mb-12">
                  <h2 className="text-xl font-semibold text-gray-300 mb-6 text-center">
                    What would you like to do?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                    {quickActions.map((action, index) => (
                      <div
                        key={index}
                        onClick={action.action}
                        className="group p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:border-gray-600/60 backdrop-blur-sm"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">{action.title}</h3>
                        <p className="text-gray-400 text-sm">{action.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Input Section */}
                <div className="mt-auto">
                  <ChatInput onSendMessage={handleSendMessage} />
                  <SuggestionBubbles suggestions={suggestions} onSendMessage={handleSendMessage} />
                </div>
              </div>
            ) : (
              <>
                <ChatMessages 
                  messages={messages} 
                  isThinking={isThinking}
                  thinkingType={thinkingType}
                />
                
                <div className="mt-auto">
                  <ChatInput onSendMessage={handleSendMessage} />
                  <SuggestionBubbles suggestions={suggestions} onSendMessage={handleSendMessage} />
                </div>
              </>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ChatInterface;
