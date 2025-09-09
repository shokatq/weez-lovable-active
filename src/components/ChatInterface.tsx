import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { useGlobalAuditLogger } from '@/hooks/useGlobalAuditLogger';
import { useAuditLogger } from '@/hooks/useAuditLogger';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Auth hook to get user information dynamically
  const { user, session, loading: authLoading } = useAuth();
  
  const { logCustomEvent } = useGlobalAuditLogger();
  const { logAuditEvent, logFileAccess } = useAuditLogger();

  // Get userId dynamically from authenticated user
  const userId = user?.email || user?.id || null;

  // Redirect to auth if user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('🚫 User not authenticated, redirecting to auth page');
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Load conversation with messages from backend
  const loadConversationMessages = async (conversationId: string) => {
    if (!userId || !conversationId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading conversation messages for:', conversationId);
      
      const response = await fetch(
        `http://localhost:5000/api/conversations/${encodeURIComponent(userId)}/${encodeURIComponent(conversationId)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to load conversation: ${response.status}`);
      }

      const conversationHistory = await response.json();
      console.log('Loaded conversation history:', conversationHistory);

      // Transform backend format to frontend Message format
      const transformedMessages: Message[] = [];
      
      conversationHistory.forEach((item: any) => {
        // Filter out tool execution messages during transformation
        const isToolExecution = item.user_query?.includes('[TOOL_EXECUTION]');
        
        if (!isToolExecution) {
          // Add user message
          if (item.user_query && item.user_query.trim()) {
            transformedMessages.push({
              id: `${item.id}_user`,
              content: item.user_query,
              isUser: true,
              timestamp: new Date(item.timestamp)
            });
          }
          
          // Add AI response
          if (item.agent_response && item.agent_response.trim()) {
            transformedMessages.push({
              id: `${item.id}_agent`,
              content: item.agent_response,
              isUser: false,
              timestamp: new Date(item.timestamp)
            });
          }
        }
      });

      // Sort messages by timestamp
      transformedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      console.log(`Setting ${transformedMessages.length} messages for conversation ${conversationId}`);
      setMessages(transformedMessages);
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load conversation';
      console.error('Error loading conversation messages:', errorMsg);
      setError(errorMsg);
      setMessages([]); // Clear messages on error
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending message to AI agent
  const handleSendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || isLoading) return;

    if (!userId) {
      toast.error('Please sign in to send messages');
      navigate('/auth');
      return;
    }

    // Use existing conversation ID or null for new conversation
    let conversationId = currentConversationId;

    console.log('Sending message:', {
      conversationId: conversationId || 'NEW_CONVERSATION',
      hasExistingMessages: messages.length > 0,
      messageCount: messages.length
    });

    setIsLoading(true);
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
      // Call backend - let it create conversation ID if needed
      const response = await fetch(`http://localhost:5000/api/chat/${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage.trim(),
          conversation_id: conversationId // null for new conversation, UUID for existing
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const aiResponse = result.response;
      const returnedConversationId = result.conversation_id;

      // Update conversation ID if this was a new conversation
      if (!currentConversationId && returnedConversationId) {
        console.log('Setting conversation ID from backend:', returnedConversationId);
        setCurrentConversationId(returnedConversationId);
        
        // Update current conversation object
        if (currentConversation) {
          setCurrentConversation(prev => prev ? {...prev, id: returnedConversationId} : null);
        }
      }

      console.log('AI response received:', {
        responseLength: aiResponse?.length || 0,
        conversationId: returnedConversationId,
        hasContext: messages.length > 0
      });

      if (aiResponse && aiResponse.trim()) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prevMessages => [...prevMessages, aiMessage]);

        console.log('Messages updated, total count:', messages.length + 2);
        
        if (user) {
          logAuditEvent({
            action: 'ai_message_sent',
            resourceType: 'chat',
            resourceId: returnedConversationId,
            metadata: { 
              messageLength: newMessage.length,
              responseLength: aiResponse.length,
              conversationId: returnedConversationId,
              hasContext: messages.length > 0
            },
            severity: 'low'
          });
        }
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I received an empty response. Please try rephrasing your message.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Connection Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your connection and try again.`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileAction = (file: any) => {
    console.log("File action triggered:", file);
    
    // Log file access with authenticated user using correct API
    if (user && file?.id) {
      logFileAccess(file.id, file.name || 'Unknown file');
    }
  };

  // Handle conversation selection from sidebar - FIXED VERSION
  const handleConversationSelect = async (conversation: Conversation) => {
    console.log('Selecting conversation in ChatInterface:', conversation);
    console.log('Conversation messages count:', conversation.messages?.length || 0);
    
    // CRITICAL FIX: Set conversation state first
    setCurrentConversationId(conversation.id);
    setCurrentConversation(conversation);
    
    // Clear any errors when switching conversations
    clearError();

    // CRITICAL FIX: Load fresh messages from backend instead of using passed messages
    // This ensures we get the most up-to-date conversation history
    await loadConversationMessages(conversation.id);

    // Log conversation selection
    if (user) {
      logAuditEvent({
        action: 'conversation_selected',
        resourceType: 'chat',
        resourceId: conversation.id,
        metadata: { 
          conversationId: conversation.id,
          messageCount: conversation.messages?.length || 0
        },
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
          apiBaseUrl="http://localhost:5000"
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <ChatHeader />
          
          <div className="flex-1 flex flex-col min-h-0">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground mb-3">
                    Welcome back, {user.email?.split('@')[0] || 'User'}!
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    How can I help you today? Ask me anything about your files, documents, or any questions you have.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                    <Button
                      variant="outline"
                      className="text-left h-auto p-4 justify-start"
                      onClick={() => handleSendMessage("Analyze my files and provide a summary")}
                      disabled={isLoading}
                    >
                      <div>
                        <p className="font-medium">File Analysis</p>
                        <p className="text-sm text-muted-foreground">Analyze documents</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-left h-auto p-4 justify-start"
                      onClick={() => handleSendMessage("Help me organize my workspace")}
                      disabled={isLoading}
                    >
                      <div>
                        <p className="font-medium">Workspace Organization</p>
                        <p className="text-sm text-muted-foreground">Get help organizing files</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-left h-auto p-4 justify-start"
                      onClick={() => handleSendMessage("What can you help me with?")}
                      disabled={isLoading}
                    >
                      <div>
                        <p className="font-medium">Capabilities</p>
                        <p className="text-sm text-muted-foreground">Learn what I can do</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-left h-auto p-4 justify-start"
                      onClick={() => handleSendMessage("Show me my recent activity")}
                      disabled={isLoading}
                    >
                      <div>
                        <p className="font-medium">Recent Activity</p>
                        <p className="text-sm text-muted-foreground">View recent actions</p>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-border">
                    <Dialog open={showConnectServices} onOpenChange={setShowConnectServices}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="lg" className="w-full">
                          <Settings className="w-4 h-4 mr-2" />
                          Connect Services
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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
            
            <div className="border-t border-border bg-background p-4">
              <div className="max-w-4xl mx-auto">
                <ImprovedChatInput 
                  onSendMessage={handleSendMessage} 
                  disabled={isLoading || !userId} 
                />
                
                {/* Show authentication warning if no userId */}
                {!userId && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-sm">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    Please sign in to send messages
                  </div>
                )}
                
                {/* Show error if there's an error */}
                {error && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    <span>Error: {error}</span>
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