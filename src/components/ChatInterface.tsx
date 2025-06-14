import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Search, FileText, Brain, Upload, ArrowRight, Zap } from "lucide-react";
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
      title: "Smart Search",
      description: "AI-powered document discovery",
      action: () => handleSendMessage("Search for my recent files"),
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      accentColor: "blue"
    },
    {
      icon: FileText,
      title: "Instant Summary",
      description: "Quick document insights",
      action: () => handleSendMessage("Summarize my latest document"),
      gradient: "from-emerald-500 via-emerald-600 to-teal-600",
      accentColor: "emerald"
    },
    {
      icon: Brain,
      title: "Smart Q&A",
      description: "Query your content intelligently",
      action: () => handleSendMessage("Answer questions about my files"),
      gradient: "from-purple-500 via-purple-600 to-violet-600",
      accentColor: "purple"
    },
    {
      icon: Upload,
      title: "Upload & Analyze",
      description: "Process new documents instantly",
      action: () => handleSendMessage("Help me upload and analyze a new file"),
      gradient: "from-orange-500 via-orange-600 to-amber-600",
      accentColor: "orange"
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
      <div className="min-h-screen flex w-full bg-black text-white relative overflow-hidden">
        {/* Modern background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(167,139,250,0.08),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(59,130,246,0.03)_60deg,transparent_120deg)] pointer-events-none"></div>
        
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
              <div className="flex-1 flex flex-col items-center px-6 md:px-12 py-10 lg:py-16 overflow-y-auto">
                {/* Hero Section */}
                <div className="flex flex-col items-center justify-center mb-12 w-full max-w-7xl mx-auto">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl border border-blue-400/20 relative">
                      <Sparkles className="w-8 h-8 text-white animate-pulse" />
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="text-center max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-4 tracking-tight leading-tight">
                      Meet Weezy
                    </h1>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <p className="text-lg md:text-xl text-gray-300 font-medium">
                        Your Intelligent Document Assistant
                      </p>
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                    </div>
                    <p className="text-base md:text-lg text-gray-400 font-normal max-w-3xl mx-auto leading-relaxed">
                      Unlock the power of AI to search, analyze, and understand your documents like never before. 
                      <span className="text-blue-400 font-medium"> Transform chaos into clarity.</span>
                    </p>
                  </div>
                </div>

                {/* Modern Quick Actions Grid */}
                <div className="mb-12 max-w-7xl mx-auto w-full">
                  <div className="text-center mb-10">
                    <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                      What can I help you with?
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action, idx) => (
                      <div
                        key={idx}
                        onClick={action.action}
                        className="group relative p-6 bg-gray-900/50 border border-gray-800 rounded-2xl cursor-pointer hover:scale-105 transition-all duration-500 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden"
                      >
                        {/* Hover gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
                        
                        {/* Icon container */}
                        <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                          <action.icon className="w-6 h-6 text-white" />
                          <div className={`absolute -inset-1 bg-gradient-to-br ${action.gradient} opacity-50 blur-lg group-hover:opacity-75 transition-opacity duration-300 rounded-xl`}></div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative">
                          <h3 className="text-white font-bold mb-2 text-lg group-hover:text-blue-100 transition-colors duration-300">
                            {action.title}
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                            {action.description}
                          </p>
                        </div>
                        
                        {/* Arrow indicator */}
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <ArrowRight className="w-5 h-5 text-white/70" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modern Chat Input Section */}
                <div className="max-w-4xl mx-auto w-full">
                  <div className="relative p-6 bg-gray-900/50 border border-gray-800 rounded-2xl shadow-2xl">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                    </div>
                    
                    <div className="mb-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold text-white">Start Your Conversation</span>
                        <Zap className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-gray-400 text-xs">Ask me anything about your documents</p>
                    </div>
                    
                    <ChatInput onSendMessage={handleSendMessage} />
                    <SuggestionBubbles suggestions={suggestions} onSendMessage={handleSendMessage} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
                <ChatMessages 
                  messages={messages} 
                  isThinking={isThinking}
                  thinkingType={thinkingType}
                />
                <div className="mt-auto">
                  <ChatInput onSendMessage={handleSendMessage} />
                  <SuggestionBubbles suggestions={suggestions} onSendMessage={handleSendMessage} />
                </div>
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ChatInterface;
