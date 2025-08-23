import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalAuditLogger } from '@/hooks/useGlobalAuditLogger';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import { useAIAgent } from '@/hooks/aiAgent';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import ImprovedChatInput from "@/components/ImprovedChatInput";
import ChatWelcomeDialog from "./ChatWelcomeDialog";
import ConnectivityPanel from "./ConnectivityPanel";

import { Message, Conversation } from "@/types/chat";
import { toast } from "sonner";

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('weez-welcome-shown');
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState("default");
  const [showConnectServices, setShowConnectServices] = useState(false);
  const navigate = useNavigate();
  const { logCustomEvent } = useGlobalAuditLogger();
  const { logFileAccess, logAuditEvent } = useAuditLogger();

  // AI Agent hook - this handles the loading state and errors
  const { askAgent, isLoading, error: aiError, clearError } = useAIAgent();

  // User ID - replace with actual user from auth context
  const userId = 'sayyadshakiltajoddin@gmail.com';

  // Initialize with a default conversation
  useEffect(() => {
    const defaultConversation: Conversation = {
      id: "default",
      messages: [],
      timestamp: new Date()
    };
    setConversations([defaultConversation]);
  }, []);

  // Handle sending message to AI agent
  const handleSendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || isLoading) return;

    // Clear any previous errors
    clearError();

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Update current conversation with user message
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, messages: [...conv.messages, userMessage] }
        : conv
    ));

    try {
      console.log('🚀 Sending message to AI Agent:', newMessage);
      console.log('👤 User ID:', userId);
      
      // Call AI agent - the hook handles loading state
      const aiResponse = await askAgent(newMessage.trim(), userId);

      console.log('📥 AI Agent response:', {
        responseReceived: !!aiResponse,
        responseType: typeof aiResponse,
        responseLength: aiResponse?.length || 0,
        responsePreview: aiResponse?.substring(0, 100) || 'No response',
        hasError: !!aiError
      });

      if (aiResponse && aiResponse.trim()) {
        // Add AI response message
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prevMessages => [...prevMessages, aiMessage]);

        // Update current conversation with AI response
        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, messages: [...conv.messages, aiMessage] }
            : conv
        ));

        console.log('✅ AI Agent response displayed successfully');
      } else {
        // Handle case where AI agent returns null or empty string
        console.log('❌ AI Agent returned null/empty response');
        console.log('🔍 Current aiError:', aiError);
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiError 
            ? `AI Agent Error: ${aiError}` 
            : "I received an empty response from the AI service. Please try rephrasing your message.",
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prevMessages => [...prevMessages, errorMessage]);
        
        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, messages: [...conv.messages, errorMessage] }
            : conv
        ));
      }
    } catch (error) {
      console.error('💥 Error in handleSendMessage:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Connection Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your connection and try again.`,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, errorMessage]);
      
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { ...conv, messages: [...conv.messages, errorMessage] }
          : conv
      ));
    }
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
    <SidebarProvider>
      <div className="flex h-screen w-full bg-white">
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
          onNavigateToWorkspace={handleNavigateToWorkspace}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Remove header for cleaner look */}
          
          <div className="flex-1 flex flex-col min-h-0">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="text-center max-w-2xl mx-auto">
                  {/* Black circular logo */}
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <div className="w-4 h-4 bg-black rounded-full"></div>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-medium text-gray-600 mb-2">
                    Hi, there 👋
                  </h2>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-8">
                    How can we help?
                  </h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    <div 
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleSendMessage("Help me to create a personal branding and web page")}
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      </div>
                      <p className="text-gray-800 font-medium text-left">
                        Help me to create a personal branding and web page
                      </p>
                    </div>
                    
                    <div 
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleSendMessage("Write a report based on my website data")}
                    >
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                        <div className="w-4 h-4 bg-pink-600 rounded"></div>
                      </div>
                      <p className="text-gray-800 font-medium text-left">
                        Write a report based on my website data
                      </p>
                    </div>
                    
                    <div 
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleSendMessage("Write a tailored, engaging content, with a focus quality")}
                    >
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                        <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                      </div>
                      <p className="text-gray-800 font-medium text-left">
                        Write a tailored, engaging content, with a focus quality
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ChatMessages 
                messages={messages} 
                isThinking={isLoading}
                thinkingType="general"
                onSendMessage={handleSendMessage}
              />
            )}
            
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="max-w-4xl mx-auto">
                <ImprovedChatInput 
                  onSendMessage={handleSendMessage} 
                  disabled={isLoading} 
                />
                
                {/* Show error if there's an AI error */}
                {aiError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    <span>Error: {aiError}</span>
                    <button 
                      onClick={clearError} 
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showWelcome && (
        <ChatWelcomeDialog
          open={showWelcome}
          onOpenChange={(open) => {
            setShowWelcome(open);
            if (!open) {
              localStorage.setItem('weez-welcome-shown', 'true');
            }
          }}
        />
      )}
    </SidebarProvider>
  );
};

export default ChatInterface;
