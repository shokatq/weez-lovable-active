import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Plus, MessageSquare, Building2, Clock, Trash2, Loader2 } from "lucide-react";
import UserProfile from "./UserProfile";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  lastMessage: string;
  messageCount?: number;
}

interface BackendConversationSummary {
  conversation_id: string;
  first_message_time: string;
  last_message_time: string;
  message_count: number;
  latest_user_query?: string;
  latest_agent_response?: string;
}

interface ChatSidebarProps {
  currentConversationId?: string;
  onConversationSelect: (conversation: Conversation) => void;
  onNewConversation: () => void;
  onNavigateToWorkspace: () => void;
  apiBaseUrl?: string;
  onSendMessage?: (message: string, conversationId: string) => Promise<string>;
  filterToolExecution?: boolean;
}

const ChatSidebar = ({ 
  currentConversationId,
  onConversationSelect, 
  onNewConversation,
  onNavigateToWorkspace,
  apiBaseUrl = "https://chat-api-weez-cjfzftg4aedgg6h2.canadacentral-01.azurewebsites.net",
  onSendMessage,
  filterToolExecution = true
}: ChatSidebarProps) => {
  // Get authenticated user from useAuth hook
  const { user, loading: authLoading } = useAuth();
  
  // Local state for conversation management
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get conversation preview text
  const getConversationPreviewText = (summary: BackendConversationSummary) => {
    if (summary.latest_user_query) {
      return summary.latest_user_query.length > 60 
        ? summary.latest_user_query.substring(0, 60) + "..."
        : summary.latest_user_query;
    }
    return "New conversation";
  };

  // Convert backend conversation summary to frontend conversation
  const convertToFrontendConversation = (summary: BackendConversationSummary): Conversation | null => {
    if (!summary.conversation_id) {
      console.warn('Conversation summary missing conversation_id:', summary);
      return null;
    }

    const preview = getConversationPreviewText(summary);
    
    return {
      id: summary.conversation_id,
      title: preview,
      messages: [], // Messages loaded on demand
      timestamp: new Date(summary.last_message_time),
      lastMessage: preview,
      messageCount: summary.message_count
    };
  };

  // Load conversations from backend
  const loadConversations = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Loading conversations for user:', user.email);

      const response = await fetch(
        `${apiBaseUrl}/api/conversations/${encodeURIComponent(user.email)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch conversations: ${response.status}`);
      }

      const summaries: BackendConversationSummary[] = await response.json();
      console.log(`Fetched ${summaries.length} conversation summaries`);

      // Convert summaries to frontend format, filtering out invalid ones
      const frontendConversations = summaries
        .map(summary => convertToFrontendConversation(summary))
        .filter((conversation): conversation is Conversation => conversation !== null);

      // Sort by timestamp (newest first)
      frontendConversations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      console.log(`Successfully loaded ${frontendConversations.length} valid conversations`);
      setConversations(frontendConversations);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to load conversations:', errorMessage);
      setError(`Failed to load conversations: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Load conversations when user changes
  useEffect(() => {
    if (user?.email && !authLoading) {
      loadConversations();
    }
  }, [user?.email, authLoading]);

  // Handle new conversation creation
  const handleNewConversation = () => {
    onNewConversation();
    // Don't create a local conversation here - let parent handle it
  };

  // Handle conversation selection - SIMPLIFIED VERSION
  const handleConversationSelect = (conversation: Conversation) => {
    console.log('ChatSidebar: Selecting conversation:', conversation.id);
    
    // Simply pass the conversation to parent - let parent handle loading messages
    onConversationSelect(conversation);
  };

  // Handle conversation deletion
  const handleDeleteConversation = async (conversationId: string) => {
    if (!user?.email) return;

    try {
      setLoading(true);
      
      const response = await fetch(
        `${apiBaseUrl}/api/conversations/${encodeURIComponent(user.email)}/${encodeURIComponent(conversationId)}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete conversation: ${response.status}`);
      }

      // Remove from local state
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      console.log(`Successfully deleted conversation: ${conversationId}`);

      // If the deleted conversation was currently selected, trigger new conversation
      if (currentConversationId === conversationId) {
        handleNewConversation();
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to delete conversation:', errorMessage);
      setError(`Failed to delete conversation: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Format time helper
  const formatTime = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const chatDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (chatDate.getTime() === today.getTime()) {
      return "Today";
    } else if (chatDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <Sidebar 
        className="w-64 bg-sidebar-background border-r border-sidebar-border data-[state=collapsed]:w-0 data-[state=collapsed]:overflow-hidden transition-all duration-300" 
        collapsible="offcanvas"
      >
        <SidebarContent className="flex-1 p-3">
          <div className="flex items-center justify-center p-4">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Show auth required message if not authenticated
  if (!user) {
    return (
      <Sidebar 
        className="w-64 bg-sidebar-background border-r border-sidebar-border data-[state=collapsed]:w-0 data-[state=collapsed]:overflow-hidden transition-all duration-300" 
        collapsible="offcanvas"
      >
        <SidebarContent className="flex-1 p-3">
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Please sign in to access your conversations</p>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar 
      className="w-64 bg-sidebar-background border-r border-sidebar-border data-[state=collapsed]:w-0 data-[state=collapsed]:overflow-hidden transition-all duration-300" 
      collapsible="offcanvas"
    >
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-sidebar-foreground">Weez AI</h2>
              <p className="text-xs text-muted-foreground">Marketing Assistant</p>
            </div>
          </div>
        </div>
        
        <Button
          onClick={handleNewConversation}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-4 rounded-lg text-sm h-auto shadow-sm transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-3">
            {loading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Loading conversations...</span>
              </div>
            )}
            
            {error && (
              <div className="p-4">
                <p className="text-sm text-red-500 mb-2">{error}</p>
                <Button 
                  onClick={loadConversations} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin mr-2" />
                      Retrying...
                    </>
                  ) : (
                    "Retry"
                  )}
                </Button>
              </div>
            )}
            
            {!loading && !error && (
              <div className="space-y-2">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">No conversations yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Start a new chat to begin</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div 
                      key={conversation.id} 
                      className="group relative"
                    >
                      <div
                        onClick={() => handleConversationSelect(conversation)}
                        className={`block w-full p-3 pr-8 cursor-pointer rounded-lg transition-all duration-200 border ${
                          currentConversationId === conversation.id 
                            ? 'bg-gray-800/60 border-gray-700 text-white shadow-sm' 
                            : 'bg-gray-900/40 border-gray-800 text-gray-300 hover:bg-gray-800/40 hover:border-gray-700 hover:text-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-medium truncate leading-tight">
                            {conversation.title}
                          </h4>
                        </div>
                        
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="text-xs text-gray-400 truncate leading-relaxed">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(conversation.timestamp)}</span>
                          </div>
                          
                          {conversation.messageCount && (
                            <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-0.5 rounded-full shrink-0 font-medium">
                              {conversation.messageCount}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Delete button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conversation.id);
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0 hover:bg-red-500/20 hover:text-red-400 rounded-md"
                        disabled={loading}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="space-y-2">
          <Button
            onClick={onNavigateToWorkspace}
            variant="outline"
            className="w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground border-sidebar-border hover:bg-sidebar-accent"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Workspace
          </Button>
          
          <UserProfile />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ChatSidebar;