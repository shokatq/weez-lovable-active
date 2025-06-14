
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import SuggestionBubbles from "./SuggestionBubbles";
import { demoFiles, demoResponses } from "@/data/demoData";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isThinking?: boolean;
  files?: any[];
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

const ChatInterface = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Welcome to Weezy",
      lastMessage: "Hello! I'm Weezy, your AI assistant.",
      timestamp: new Date(),
      messages: [
        {
          id: "1",
          content: "Hello! I'm Weezy, your intelligent AI assistant. I can help you search files, summarize documents, answer questions about your content, and upload files to various platforms. Just ask me naturally!",
          isUser: false,
          timestamp: new Date(),
        },
      ],
    },
  ]);

  const [currentConversationId, setCurrentConversationId] = useState("1");
  const [isThinking, setIsThinking] = useState(false);

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  const detectIntent = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Search intent
    if (lowerQuery.includes('find') || lowerQuery.includes('search') || lowerQuery.includes('look for')) {
      return 'search';
    }
    
    // Summarize intent
    if (lowerQuery.includes('summarize') || lowerQuery.includes('summary') || lowerQuery.includes('summarise')) {
      return 'summary';
    }
    
    // RAG intent
    if (lowerQuery.includes('explain') || lowerQuery.includes('about') || lowerQuery.includes('what is') || lowerQuery.includes('tell me about')) {
      return 'rag';
    }
    
    // Upload intent
    if (lowerQuery.includes('upload') || lowerQuery.includes('save to') || lowerQuery.includes('add to')) {
      return 'upload';
    }
    
    return 'general';
  };

  const getResponseForIntent = (intent: string, query: string) => {
    const demoResponse = demoResponses.find(response => response.type === intent);
    
    if (demoResponse) {
      return {
        content: demoResponse.response,
        files: demoResponse.files || []
      };
    }
    
    // Fallback responses
    switch (intent) {
      case 'search':
        return {
          content: "I found several files that match your search criteria. Here are the most relevant ones:",
          files: [demoFiles[0], demoFiles[1]]
        };
      case 'summary':
        return {
          content: "Here's a summary of your requested document:\n\n• Key findings and insights\n• Main topics covered\n• Important metrics and data points\n• Actionable recommendations",
          files: [demoFiles[1]]
        };
      case 'rag':
        return {
          content: "Based on your files, here's what I found about that topic:\n\n• Detailed explanation of the concept\n• Key implementation details\n• Best practices and recommendations\n• Related topics you might find interesting",
          files: [demoFiles[0]]
        };
      case 'upload':
        return {
          content: "✅ Successfully uploaded your file!\n\n📁 Location: Cloud Storage\n🔗 File accessible to team members\n⏰ Upload completed successfully",
          files: []
        };
      default:
        return {
          content: `I understand you're asking about "${query}". I can help you with:\n\n• 🔍 Searching files across platforms\n• 📄 Summarizing documents\n• 💡 Answering questions about your content\n• ☁️ Uploading files to cloud services\n\nTry asking me to "find my project files" or "summarize my latest report"!`,
          files: []
        };
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversation || content.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    // Add user message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              lastMessage: content,
              timestamp: new Date(),
            }
          : conv
      )
    );

    // Show thinking animation
    setIsThinking(true);

    // Detect intent and generate response
    setTimeout(() => {
      const intent = detectIntent(content);
      const response = getResponseForIntent(intent, content);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        isUser: false,
        timestamp: new Date(),
        files: response.files,
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: [...conv.messages, aiMessage],
                lastMessage: aiMessage.content,
                timestamp: new Date(),
              }
            : conv
        )
      );

      setIsThinking(false);
    }, 2000);
  };

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      lastMessage: "Start a new conversation...",
      timestamp: new Date(),
      messages: [],
    };

    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-weezy-dark">
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onConversationSelect={setCurrentConversationId}
          onNewConversation={createNewConversation}
        />
        
        <main className="flex-1 flex flex-col relative">
          <ChatHeader />
          
          <div className="flex-1 flex flex-col relative">
            <ChatMessages 
              messages={currentConversation?.messages || []} 
              isThinking={isThinking}
            />
            
            <div className="relative">
              <SuggestionBubbles />
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ChatInterface;
