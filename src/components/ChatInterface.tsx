import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Sparkles } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatSidebar from "./ChatSidebar";
import SuggestionBubbles from "./SuggestionBubbles";
import { demoMessages } from "@/data/demoData";

const ChatInterface = () => {
  const [messages, setMessages] = useState(demoMessages);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sendMessage = (newMessage: string) => {
    if (newMessage.trim() === "") return;

    const userMessage = {
      id: String(Date.now()),
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    setTimeout(() => {
      const aiResponse = {
        id: String(Date.now() + 1),
        text: "This is a demo AI response to your message.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    }, 1000);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const suggestions = [
    "Explain quantum physics",
    "Write a poem about the moon",
    "Translate 'hello' to Spanish",
    "Summarize the plot of Hamlet",
  ];

  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <ChatSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
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

        <ChatMessages messages={messages} chatContainerRef={chatContainerRef} />
        <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />
        <SuggestionBubbles suggestions={suggestions} sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default ChatInterface;
