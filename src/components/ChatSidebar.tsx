
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Plus, MessageSquare, Building2, Clock, Trash2, Loader2 } from "lucide-react";
import UserProfile from "./UserProfile";
import { useAuth } from "@/hooks/useAuth";
import { useConversationManager } from "@/hooks/ConvoManagement";
import { type Conversation } from "@/services/ConversationService";

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
  apiBaseUrl = "http://localhost:5000",
  onSendMessage,
  filterToolExecution = true
}: ChatSidebarProps) => {
  // Get authenticated user from useAuth hook
  const { user, loading: authLoading } = useAuth();
  
  // Use the conversation manager hook
  const {
    currentConversation,
    conversations,
    loading,
    error,
    createNewConversation,
    selectConversation,
    deleteConversation,
    refreshConversations
  } = useConversationManager({
    apiBaseUrl,
    onSendMessage,
    filterToolExecution
  });

  // Handle new conversation creation
  const handleNewConversation = () => {
    createNewConversation();
    onNewConversation();
  };

  // Handle conversation selection
  const handleConversationSelect = async (conversation: Conversation) => {
    try {
      await selectConversation(conversation);
      onConversationSelect(conversation);
    } catch (error) {
      console.error('Failed to select conversation:', error);
    }
  };

  // Handle conversation deletion
  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
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

  // Get conversation preview text
  const getConversationPreviewText = (conversation: Conversation) => {
    if (conversation.lastMessage) {
      return conversation.lastMessage.length > 60 
        ? conversation.lastMessage.substring(0, 60) + "..."
        : conversation.lastMessage;
    }
    return conversation.title || "New conversation";
  };

  // Determine current conversation ID - use prop or hook's current conversation
  const activeConversationId = currentConversationId || currentConversation?.id;

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

      <SidebarContent className="flex-1 p-3">
        <ScrollArea className="flex-1">
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
                onClick={refreshConversations} 
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
            <div className="space-y-1 pb-4">
              {conversations.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">No conversations yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Start a new chat to begin</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div key={conversation.id} className="group relative">
                    <Button
                      variant="ghost"
                      onClick={() => handleConversationSelect(conversation)}
                      className={`w-full justify-start text-left p-3 h-auto rounded-lg text-sm transition-all duration-200 ${
                        activeConversationId === conversation.id 
                          ? 'bg-muted text-foreground' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p className="font-medium line-clamp-1 leading-tight mb-1 text-sm">
                          {getConversationPreviewText(conversation)}
                        </p>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.timestamp)}
                          </span>
                          {conversation.messageCount && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                {conversation.messageCount} messages
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </Button>
                    
                    {activeConversationId === conversation.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conversation.id);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border space-y-3">
        <Button
          onClick={onNavigateToWorkspace}
          variant="outline"
          className="w-full justify-start text-left py-2.5 px-4 rounded-lg text-sm h-auto"
        >
          <Building2 className="w-4 h-4 mr-2" />
          Marketing Workspace
        </Button>
        
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
};

export default ChatSidebar;


