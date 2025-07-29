
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Plus, MessageSquare, Building2, Clock } from "lucide-react";
import { Conversation } from "@/types/chat";
import UserProfile from "./UserProfile";

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  onNavigateToWorkspace: () => void;
}

const ChatSidebar = ({ 
  conversations, 
  currentConversationId, 
  onConversationSelect, 
  onNewConversation,
  onNavigateToWorkspace 
}: ChatSidebarProps) => {
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

  const getConversationPreview = (conversation: Conversation) => {
    if (conversation.messages.length === 0) return "New conversation";
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage.isUser ? `You: ${lastMessage.content}` : lastMessage.content;
  };

  return (
    <Sidebar 
      className="w-72 bg-gradient-to-b from-background to-muted/20 border-r border-border shadow-lg data-[state=collapsed]:w-0 data-[state=collapsed]:overflow-hidden data-[state=collapsed]:transition-all transition-all duration-300" 
      collapsible="offcanvas"
    >
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4 fade-in">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
            <MessageSquare className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Weez AI</h2>
            <p className="text-xs text-muted-foreground">File Assistant</p>
          </div>
        </div>
        
        <Button
          onClick={onNewConversation}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium py-2.5 px-4 rounded-xl text-sm h-auto shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-3">
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
            Recent Conversations
          </h3>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-1 pb-4">
            {conversations.map((conversation, index) => (
              <Button
                key={conversation.id}
                variant="ghost"
                onClick={() => onConversationSelect(conversation.id)}
        className={`w-full justify-start text-left p-3 h-auto rounded-xl text-sm transition-all duration-300 slide-in-right ${
          currentConversationId === conversation.id 
            ? 'bg-primary/10 border border-primary/20 text-primary shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-border border border-transparent'
        }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="font-medium line-clamp-2 leading-tight mb-1 truncate text-sm">
                    {getConversationPreview(conversation)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">
                      {formatTime(conversation.timestamp)}
                    </span>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border space-y-3">
        <Button
          onClick={() => window.location.href = '/workspace-new'}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium py-2.5 px-4 rounded-xl text-sm h-auto shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <Building2 className="w-4 h-4 mr-2" />
          Workspace
        </Button>
        
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
};

export default ChatSidebar;
