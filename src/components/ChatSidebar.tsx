
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Plus, MessageSquare, Building2, Clock, Settings, Trash2 } from "lucide-react";
import { Conversation } from "@/types/chat";
import UserProfile from "./UserProfile";
import ThemeToggle from "./ThemeToggle";

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
          <ThemeToggle />
        </div>
        
        <Button
          onClick={onNewConversation}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-4 rounded-lg text-sm h-auto shadow-sm transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-3">
        <ScrollArea className="flex-1">
          <div className="space-y-1 pb-4">
            {conversations.map((conversation, index) => (
              <div key={conversation.id} className="group relative">
                <Button
                  variant="ghost"
                  onClick={() => onConversationSelect(conversation.id)}
                  className={`w-full justify-start text-left p-3 h-auto rounded-lg text-sm transition-all duration-200 ${
                    currentConversationId === conversation.id 
                      ? 'bg-muted text-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="font-medium line-clamp-1 leading-tight mb-1 text-sm">
                      {getConversationPreview(conversation)}
                    </p>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conversation.timestamp)}
                      </span>
                    </div>
                  </div>
                </Button>
                {currentConversationId === conversation.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border space-y-3">
        <Button
          onClick={() => window.location.href = '/workspace-new'}
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
