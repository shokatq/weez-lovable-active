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
import { demoResponses, demoFiles } from "@/data/demoData";
import { ThinkingAnimationProps } from "@/components/ThinkingAnimation";

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
      messages: [],
      timestamp: new Date(Date.now() - 60000),
    }
  ]);
  
  const [currentConversationId, setCurrentConversationId] = useState("1");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingType, setThinkingType] = useState<ThinkingAnimationProps['type']>('general');

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

    setIsThinking(true);
    let currentThinkingType: ThinkingAnimationProps['type'] = 'general';
    let response: Message | null = null;
    const lowerContent = content.toLowerCase();

    // Demo logic
    if (lowerContent.includes('find pdf reports')) {
        currentThinkingType = 'search';
        const pdfs = demoFiles.filter(f => f.type === 'PDF');
        response = {
            id: (Date.now() + 1).toString(),
            content: `I found ${pdfs.length} PDF reports for you.`,
            isUser: false,
            timestamp: new Date(),
            files: pdfs as any, // Cast to any to match Message type
        };
    } else if (lowerContent.includes('search') || lowerContent.includes('find') || lowerContent.includes('show excel')) {
        currentThinkingType = 'search';
        const demoResponse = demoResponses.find(r => r.type === 'search');
        if (demoResponse) {
            response = {
                id: (Date.now() + 1).toString(),
                content: demoResponse.response,
                isUser: false,
                timestamp: new Date(),
                files: demoResponse.files as any,
            };
        }
    } else if (lowerContent.includes('summarize')) {
        currentThinkingType = 'summary';
        const demoResponse = demoResponses.find(r => r.type === 'summary');
        if (demoResponse) {
             response = {
                id: (Date.now() + 1).toString(),
                content: demoResponse.response,
                isUser: false,
                timestamp: new Date(),
                files: demoResponse.files as any,
            };
        }
    } else if (lowerContent.includes('explain')) {
        currentThinkingType = 'rag';
        const demoResponse = demoResponses.find(r => r.type === 'rag');
        if (demoResponse) {
            response = {
                id: (Date.now() + 1).toString(),
                content: demoResponse.response,
                isUser: false,
                timestamp: new Date(),
                files: demoResponse.files as any,
            };
        }
    } else if (lowerContent.includes('upload')) {
        currentThinkingType = 'upload';
        const demoResponse = demoResponses.find(r => r.type === 'upload');
        if (demoResponse) {
            response = {
                id: (Date.now() + 1).toString(),
                content: demoResponse.response,
                isUser: false,
                timestamp: new Date(),
                files: demoResponse.files as any,
            };
        }
    }
    
    setThinkingType(currentThinkingType);
    
    setTimeout(() => {
      const aiResponse: Message = response || {
        id: (Date.now() + 1).toString(),
        content: "I can help with that! This is a demo response to showcase the functionality. Try asking me to 'find my financial reports' or 'summarize the ResNet paper'.",
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
    "Find PDF reports from last week",
    "Summarize 'Q4 Financials.pdf'",
    "What are the key takeaways from the 'ResNet' paper?",
    "Show me my recent Excel files"
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-black text-white relative overflow-hidden">
        {/* Modern background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(167,139,250,0.08),transparent_50%)] pointer-events-none"></div>
        
        <ChatSidebar 
          conversations={conversations}
          currentConversationId={currentConversationId}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
          onNavigateToWorkspace={() => navigate("/workspace-new")}
        />
        
        <SidebarInset className="flex-1 flex flex-col relative z-10 bg-gray-950">
          <ChatHeader />
          <ChatMessages 
            messages={messages} 
            isThinking={isThinking}
            thinkingType={thinkingType}
          />
          <div className="w-full bg-gray-950 border-t border-gray-800/50">
              <div className="max-w-3xl mx-auto px-4 pt-4 pb-6">
                {messages.length === 0 && !isThinking && (
                  <SuggestionBubbles suggestions={suggestions} onSendMessage={handleSendMessage} />
                )}
                <ChatInput onSendMessage={handleSendMessage} />
              </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ChatInterface;
