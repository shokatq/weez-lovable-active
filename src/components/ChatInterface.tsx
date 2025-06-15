
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import ConnectivityPanel from "@/components/ConnectivityPanel";
import ChatWelcomeDialog from "./ChatWelcomeDialog";
import { Message, Conversation } from "@/types/chat";

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
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

  const handleSendMessage = (newMessage: string) => {
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prevMessages => [...prevMessages, message]);
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
    <div className="h-screen flex bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-hidden">
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
          
          <div className="flex-1 flex">
            <div className="flex-1 flex flex-col">
              <ChatMessages 
                messages={messages} 
                isThinking={isThinking} 
              />
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
            
            <ConnectivityPanel />
          </div>
        </div>
      </div>

      <ChatWelcomeDialog 
        open={showWelcome} 
        onOpenChange={setShowWelcome} 
      />
    </div>
  );
};

export default ChatInterface;
