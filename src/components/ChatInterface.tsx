
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Sparkles } from "lucide-react";
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

    // Simulate AI response
    setIsThinking(true);
    setThinkingType('general');
    
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

  const suggestions = [
    "Explain quantum physics",
    "Write a poem about the moon", 
    "Translate 'hello' to Spanish",
    "Summarize the plot of Hamlet",
  ];

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <ChatSidebar 
        conversations={conversations}
        currentConversationId={currentConversationId}
        onConversationSelect={handleConversationSelect}
        onNewConversation={handleNewConversation}
      />
      
      <div className="flex-1 flex flex-col relative">
        <ChatHeader />
        
        {/* Workspace Dashboard Button */}
        <div className="absolute top-4 right-6 z-10">
          <Button
            onClick={() => navigate("/workspace")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg border border-blue-500/20 backdrop-blur-sm"
          >
            <Building2 className="w-5 h-5 mr-2" />
            Workspace Dashboard
            <Sparkles className="w-4 h-4 ml-2 opacity-70" />
          </Button>
        </div>

        <ChatMessages 
          messages={messages} 
          isThinking={isThinking}
          thinkingType={thinkingType}
        />
        <ChatInput onSendMessage={handleSendMessage} />
        <SuggestionBubbles suggestions={suggestions} onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatInterface;
