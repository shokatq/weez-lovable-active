import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { useGlobalAuditLogger } from '@/hooks/useGlobalAuditLogger';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import { useAIAgent } from '@/hooks/aiAgent';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Settings, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import ImprovedChatInput from "@/components/ImprovedChatInput";
import ChatWelcomeDialog from "./ChatWelcomeDialog";
import ConnectivityPanel from "./ConnectivityPanel";

import { Message } from "@/types/chat";
import { toast } from "sonner";

// Interface to match what ChatSidebar expects
interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  lastMessage: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('weez-welcome-shown');
  });
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [showConnectServices, setShowConnectServices] = useState(false);
  const navigate = useNavigate();
  
  // Auth hook to get user information dynamically
  const { user, session, loading: authLoading } = useAuth();
  
  const { logCustomEvent } = useGlobalAuditLogger();
  const { logAuditEvent, logFileAccess } = useAuditLogger();

  // AI Agent hook - this handles the loading state and errors
  const { askAgent, isLoading, error: aiError, clearError } = useAIAgent();

  // Get userId dynamically from authenticated user
  const userId = user?.email || user?.id || null;

  // Redirect to auth if user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('🚫 User not authenticated, redirecting to auth page');
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // API helper for saving messages to backend
  const saveMessageToBackend = async (userMessage: string, aiResponse: string, conversationId: string) => {
    if (!userId) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          conversationId,
          userQuery: userMessage,
          agentResponse: aiResponse
        }),
      });

      if (!response.ok) {
        console.error('Failed to save message to backend:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving message to backend:', error);
    }
  };

  // API helper for creating new conversation
  const createNewConversationInBackend = async (): Promise<string | null> => {
    if (!userId) return null;
    
    try {
      const response = await fetch('http://localhost:5000/api/conversations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId
        }),
      });

      if (!response.ok) {
        console.error('Failed to create conversation in backend:', response.statusText);
        return null;
      }

      const data = await response.json();
      return data.conversationId || data.conversation_id;
    } catch (error) {
      console.error('Error creating conversation in backend:', error);
      return null;
    }
  };

  // Handle sending message to AI agent
  const handleSendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || isLoading) return;

    // Check if user is authenticated before sending message
    if (!userId) {
      toast.error('Please sign in to send messages');
      navigate('/auth');
      return;
    }

    // If no current conversation, create a new one
    let conversationId = currentConversationId;
    if (!conversationId) {
      conversationId = await createNewConversationInBackend();
      if (!conversationId) {
        toast.error('Failed to create new conversation');
        return;
      }
      setCurrentConversationId(conversationId);
    }

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

    try {
      console.log('🚀 Sending message to AI Agent:', newMessage);
      console.log('👤 Authenticated User ID:', userId);
      console.log('💬 Conversation ID:', conversationId);
      
      // Call AI agent with authenticated user ID
      const aiResponse = await askAgent(newMessage.trim(), userId);

      console.log('📥 AI Agent response:', {
        responseReceived: !!aiResponse,
        responseType: typeof aiResponse,
        responseLength: aiResponse?.length || 0,
        responsePreview: aiResponse?.substring(0, 100) || 'No response',
        hasError: !!aiError,
        userId: userId
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

        // Save both messages to backend
        await saveMessageToBackend(newMessage.trim(), aiResponse, conversationId);

        console.log('✅ AI Agent response displayed successfully');
        
        // Log successful AI interaction
        if (user) {
          logAuditEvent({
            action: 'ai_message_sent',
            resourceType: 'chat',
            resourceId: conversationId,
            metadata: { 
              messageLength: newMessage.length,
              responseLength: aiResponse.length,
              conversationId: conversationId
            },
            severity: 'low'
          });
        }
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
    }
  };

  const handleFileAction = (file: any) => {
    console.log("File action triggered:", file);
    
    // Log file access with authenticated user using correct API
    if (user && file?.id) {
      logFileAccess(file.id, file.name || 'Unknown file');
    }
  };

  // Handle conversation selection from sidebar
  const handleConversationSelect = (conversation: Conversation) => {
    console.log('Selecting conversation:', conversation);
    setCurrentConversationId(conversation.id);
    setCurrentConversation(conversation);
    setMessages(conversation.messages);

    // Log conversation selection event using correct API
    if (user) {
      logAuditEvent({
        action: 'conversation_selected',
        resourceType: 'chat',
        resourceId: conversation.id,
        metadata: { conversationId: conversation.id },
        severity: 'low'
      });
    }
  };

  // Handle new conversation creation
  const handleNewConversation = async () => {
    console.log('Creating new conversation');
    
    // Clear current conversation state
    setCurrentConversationId(null);
    setCurrentConversation(null);
    setMessages([]);
    clearError();

    // Log new conversation creation using correct API
    if (user) {
      logAuditEvent({
        action: 'conversation_created',
        resourceType: 'chat',
        resourceId: 'new',
        metadata: { action: 'new_conversation_initiated' },
        severity: 'low'
      });
    }
  };

  const handleNavigateToWorkspace = () => {
    navigate("/workspace");
  };

  // Show loading screen while authentication is being checked
  if (authLoading) {
    return (
      <div className="flex h-screen w-full bg-background items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Show error message if user is not authenticated
  if (!user) {
    return (
      <div className="flex h-screen w-full bg-background items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please sign in to access the chat interface. You will be redirected to the authentication page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <ChatSidebar
          currentConversationId={currentConversationId || ""}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
          onNavigateToWorkspace={handleNavigateToWorkspace}
          apiBaseUrl="http://localhost:5000" // Make this configurable via environment variable if needed
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <ChatHeader />
          
          <div className="flex-1 flex flex-col min-h-0">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
                <div className="text-center max-w-2xl mx-auto w-full">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-2 sm:mb-3">
                    Welcome back, {user.email?.split('@')[0] || 'User'}!
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-4">
                    How can I help you today? Ask me anything about your files, documents, or any questions you have.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto px-4">
                    <Button
                      variant="outline"
                      className="text-left h-auto p-3 sm:p-4 justify-start hover:bg-muted/50 transition-all duration-200"
                      onClick={() => handleSendMessage("Analyze my files and provide a summary")}
                      disabled={isLoading}
                    >
                      <div>
                        <p className="font-medium text-sm sm:text-base">File Analysis</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Analyze documents</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-left h-auto p-3 sm:p-4 justify-start hover:bg-muted/50 transition-all duration-200"
                      onClick={() => handleSendMessage("Help me organize my workspace")}
                      disabled={isLoading}
                    >
                      <div>
                        <p className="font-medium text-sm sm:text-base">Workspace Organization</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Get help organizing files</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-left h-auto p-3 sm:p-4 justify-start hover:bg-muted/50 transition-all duration-200"
                      onClick={() => handleSendMessage("What can you help me with?")}
                      disabled={isLoading}
                    >
                      <div>
                        <p className="font-medium text-sm sm:text-base">Capabilities</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Learn what I can do</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-left h-auto p-3 sm:p-4 justify-start hover:bg-muted/50 transition-all duration-200"
                      onClick={() => handleSendMessage("Show me my recent activity")}
                      disabled={isLoading}
                    >
                      <div>
                        <p className="font-medium text-sm sm:text-base">Recent Activity</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">View recent actions</p>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border px-4">
                    <Dialog open={showConnectServices} onOpenChange={setShowConnectServices}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="lg" className="w-full text-sm sm:text-base">
                          <Settings className="w-4 h-4 mr-2" />
                          Connect Services
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto w-[95vw] sm:w-auto">
                        <ConnectivityPanel />
                      </DialogContent>
                    </Dialog>
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
            
            <div className="border-t border-border bg-background p-3 sm:p-4">
              <div className="max-w-4xl mx-auto">
                <ImprovedChatInput 
                  onSendMessage={handleSendMessage} 
                  disabled={isLoading || !userId} 
                />
                
                {/* Show authentication warning if no userId */}
                {!userId && (
                  <div className="mt-2 p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-700 dark:text-yellow-300 text-xs sm:text-sm">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                    Please sign in to send messages
                  </div>
                )}
                
                {/* Show error if there's an AI error */}
                {aiError && (
                  <div className="mt-2 p-2 sm:p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-xs sm:text-sm">
                    <span>Error: {aiError}</span>
                    <button 
                      onClick={clearError} 
                      className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
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
      
      {showWelcome && user && (
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

