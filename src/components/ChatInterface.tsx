
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
import { demoFiles } from "@/data/demoData";
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
  isUploading?: boolean;
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

  const getRandomFile = () => {
    return demoFiles[Math.floor(Math.random() * demoFiles.length)];
  };

  const getRandomFiles = (count: number) => {
    const shuffled = [...demoFiles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

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

    if (lowerContent.includes('summarize') || lowerContent.includes('summary')) {
        currentThinkingType = 'summary';
        const randomFile = getRandomFile();
        
        // Brief summary without ** formatting
        const briefSummary = randomFile.summary.split('.')[0] + '. Key highlights include improved performance metrics and strategic recommendations for future development.';
        
        response = {
            id: (Date.now() + 1).toString(),
            content: `Summary of "${randomFile.name}":\n\n${briefSummary}`,
            isUser: false,
            timestamp: new Date(),
            files: [randomFile] as any,
        };
    } else if (lowerContent.includes('explain') || lowerContent.includes('explanation')) {
        currentThinkingType = 'rag';
        const randomFile = getRandomFile();
        response = {
            id: (Date.now() + 1).toString(),
            content: `Based on "${randomFile.name}":\n\n${randomFile.summary}\n\nThis document provides comprehensive insights and detailed analysis on the subject matter with thorough documentation of findings.`,
            isUser: false,
            timestamp: new Date(),
            files: [randomFile] as any,
        };
    } else if (lowerContent.includes('find') || lowerContent.includes('search') || lowerContent.includes('show')) {
        currentThinkingType = 'search';
        let filesToShow = [];
        
        if (lowerContent.includes('pdf')) {
            filesToShow = demoFiles.filter(f => f.type === 'PDF');
        } else if (lowerContent.includes('excel') || lowerContent.includes('xlsx')) {
            filesToShow = demoFiles.filter(f => f.type === 'Excel');
        } else if (lowerContent.includes('word') || lowerContent.includes('docx')) {
            filesToShow = demoFiles.filter(f => f.type === 'Word');
        } else {
            filesToShow = getRandomFiles(3);
        }
        
        response = {
            id: (Date.now() + 1).toString(),
            content: `Found ${filesToShow.length} files matching your search criteria.`,
            isUser: false,
            timestamp: new Date(),
            files: filesToShow as any,
        };
    } else if (lowerContent.includes('upload')) {
        currentThinkingType = 'upload';
        const randomFile = getRandomFile();
        
        // Add upload animation
        const uploadMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: `Uploading "${randomFile.name}" to ${randomFile.platform}...`,
            isUser: false,
            timestamp: new Date(),
            files: [randomFile] as any,
            isUploading: true,
        };

        setConversations(prev => prev.map(conv => 
            conv.id === currentConversationId 
              ? { ...conv, messages: [...conv.messages, uploadMessage] }
              : conv
        ));

        setTimeout(() => {
            response = {
                id: (Date.now() + 2).toString(),
                content: `Successfully uploaded "${randomFile.name}" to ${randomFile.platform}\n\nLocation: /Documents/\nFile accessible via your dashboard\nFile size: ${randomFile.size}\nUpload completed successfully`,
                isUser: false,
                timestamp: new Date(),
                files: [randomFile] as any,
            };

            setConversations(prev => prev.map(conv => 
                conv.id === currentConversationId 
                  ? { ...conv, messages: [...conv.messages.slice(0, -1), response!] }
                  : conv
            ));
            setIsThinking(false);
        }, 3000);
        return;
    } else if (lowerContent.includes('analyze') || lowerContent.includes('analysis')) {
        currentThinkingType = 'rag';
        const randomFile = getRandomFile();
        response = {
            id: (Date.now() + 1).toString(),
            content: `Analysis of "${randomFile.name}":\n\nDocument type: ${randomFile.type}\nLast modified: ${randomFile.lastModified}\nStorage platform: ${randomFile.platform}\nFile size: ${randomFile.size}\n\nContent Summary:\n${randomFile.summary}`,
            isUser: false,
            timestamp: new Date(),
            files: [randomFile] as any,
        };
    }
    
    setThinkingType(currentThinkingType);
    
    setTimeout(() => {
      const aiResponse: Message = response || {
        id: (Date.now() + 1).toString(),
        content: "I can help you with file operations. Try asking me to summarize, explain, find, or analyze your documents.",
        isUser: false,
        timestamp: new Date(),
        files: [getRandomFile()] as any,
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
    "Summarize a random file",
    "Explain any document in detail", 
    "Find my PDF files",
    "Analyze a document"
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(167,139,250,0.08),transparent_50%)] pointer-events-none"></div>
        
        <ChatSidebar 
          conversations={conversations}
          currentConversationId={currentConversationId}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
          onNavigateToWorkspace={() => {
            navigate("/workspace-new");
            setTimeout(() => window.scrollTo(0, 0), 100);
          }}
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
