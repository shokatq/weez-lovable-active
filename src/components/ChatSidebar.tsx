
import { Calendar, MessageSquare, Trash2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Conversation } from "./ChatInterface";

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
}

const ChatSidebar = ({
  conversations,
  currentConversationId,
  onConversationSelect,
  onNewConversation,
}: ChatSidebarProps) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const recentConversations = conversations.filter(conv => {
    const diffHours = (new Date().getTime() - conv.timestamp.getTime()) / (1000 * 60 * 60);
    return diffHours < 24;
  });

  const olderConversations = conversations.filter(conv => {
    const diffHours = (new Date().getTime() - conv.timestamp.getTime()) / (1000 * 60 * 60);
    return diffHours >= 24;
  });

  return (
    <Sidebar className="border-r border-weezy-dark-tertiary">
      <SidebarHeader className="p-4 border-b border-weezy-dark-tertiary">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-weezy-accent to-weezy-accent-light flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <div>
            <h1 className="font-semibold text-lg text-white">Weezy AI</h1>
            <p className="text-xs text-white/60">Your intelligent assistant</p>
          </div>
        </div>
        
        <Button
          onClick={onNewConversation}
          className="w-full bg-weezy-accent hover:bg-weezy-accent-light text-white font-medium rounded-lg transition-all duration-200 hover:scale-105"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {recentConversations.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-white/60 font-medium mb-2">
              Recent
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {recentConversations.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton
                      onClick={() => onConversationSelect(conversation.id)}
                      className={`w-full p-3 rounded-lg transition-all duration-200 hover:bg-weezy-dark-secondary group ${
                        currentConversationId === conversation.id
                          ? "bg-weezy-accent/20 border border-weezy-accent/30"
                          : "hover:bg-weezy-dark-secondary"
                      }`}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <MessageSquare className="w-4 h-4 mt-1 text-weezy-accent flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-white truncate">
                            {conversation.title}
                          </h3>
                          <p className="text-xs text-white/60 truncate mt-1">
                            {conversation.lastMessage}
                          </p>
                          <span className="text-xs text-white/40 mt-1 block">
                            {formatTime(conversation.timestamp)}
                          </span>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {olderConversations.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-white/60 font-medium mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Previous
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {olderConversations.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton
                      onClick={() => onConversationSelect(conversation.id)}
                      className={`w-full p-3 rounded-lg transition-all duration-200 hover:bg-weezy-dark-secondary group ${
                        currentConversationId === conversation.id
                          ? "bg-weezy-accent/20 border border-weezy-accent/30"
                          : "hover:bg-weezy-dark-secondary"
                      }`}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <MessageSquare className="w-4 h-4 mt-1 text-weezy-accent flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-white truncate">
                            {conversation.title}
                          </h3>
                          <p className="text-xs text-white/60 truncate mt-1">
                            {conversation.lastMessage}
                          </p>
                          <span className="text-xs text-white/40 mt-1 block">
                            {formatTime(conversation.timestamp)}
                          </span>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default ChatSidebar;
