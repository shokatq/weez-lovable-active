import { useState, useEffect } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import ConnectivityPanel from "@/components/ConnectivityPanel";
import ChatWelcomeDialog from "./ChatWelcomeDialog";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleSendMessage = (newMessage) => {
    setMessages(prevMessages => [...prevMessages, { text: newMessage, sender: 'user' }]);
  };

  const handleFileAction = (file) => {
    console.log("File action triggered:", file);
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(167,139,250,0.1),transparent_50%)] pointer-events-none"></div>
      
      <div className="relative z-10 flex w-full">
        <ChatSidebar />
        
        <div className="flex-1 flex flex-col">
          <ChatHeader />
          
          <div className="flex-1 flex">
            <div className="flex-1 flex flex-col">
              <ChatMessages 
                messages={messages} 
                isLoading={isLoading} 
                onFileAction={handleFileAction}
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
