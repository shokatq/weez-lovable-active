
import { useState } from "react";
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_70%,rgba(120,119,198,0.04),transparent_50%)] pointer-events-none"></div>
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
              <div className="flex-1 flex flex-col px-2 py-6 md:px-10 md:py-10 lg:py-14">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-10 w-full max-w-6xl mx-auto">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-xl p-6 md:w-60 w-full flex flex-col items-center justify-center relative overflow-hidden border border-blue-400/20">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center shadow-lg mb-4">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-white mb-1">Welcome!</h2>
                      <p className="text-gray-200 text-sm font-medium">Weezy, your file AI assistant.</p>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-3 tracking-tight">
                      Intelligent Workspace Assistant
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl">
                      Search, summarize, analyze, and organize your documents with one smart assistant.
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-10 max-w-6xl mx-auto w-full">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-200 mb-3 md:mb-5 text-center">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, idx) => (
                      <div
                        key={idx}
                        onClick={action.action}
                        className="group p-5 bg-gradient-to-br from-gray-900/80 to-gray-800/70 border border-gray-700/50 rounded-xl cursor-pointer hover:scale-105 transition-all duration-300 hover:border-blue-500/40 hover:shadow-blue-600/10 shadow-sm hover:shadow-lg relative"
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-white font-semibold mb-1 text-lg">{action.title}</h3>
                        <p className="text-gray-400 text-xs md:text-sm">{action.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Input Section (card-like) */}
                <div className="max-w-2xl mx-auto bg-gray-900/60 border border-gray-800/80 rounded-2xl p-3 md:p-6 shadow-lg">
                  <ChatInput onSendMessage={handleSendMessage} />
                  <SuggestionBubbles suggestions={suggestions} onSendMessage={handleSendMessage} />
                </div>
              </div>
            ) : (
              <>
                {/* Conversation panel look */}
                <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full bg-gray-900/70 border border-gray-800/80 rounded-2xl mt-3 shadow-lg">
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
              </>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ChatInterface;

