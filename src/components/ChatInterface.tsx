
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import SuggestionBubbles from "./SuggestionBubbles";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isThinking?: boolean;
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
          content: "Hello! I'm Weezy, your intelligent AI assistant. How can I help you today?",
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

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${content}". As Weezy, I'm here to help you with various tasks including document analysis, research, and creative projects. How would you like me to assist you further?`,
        isUser: false,
        timestamp: new Date(),
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
