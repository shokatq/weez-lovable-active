
import { MessageSquare, Plus } from "lucide-react";
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
    <Sidebar className="border-r border-weezy-dark-tertiary bg-weezy-dark">
      <SidebarHeader className="p-4 border-b border-weezy-dark-tertiary">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-weezy-accent flex items-center justify-center">
            <span className="text-white font-semibold text-sm">W</span>
          </div>
          <div>
            <h1 className="font-semibold text-white">Weezy AI</h1>
            <p className="text-xs text-white/60">Your intelligent assistant</p>
          </div>
        </div>
        
        <Button
          onClick={onNewConversation}
          className="w-full bg-weezy-accent hover:bg-weezy-accent-light text-white font-medium rounded-lg h-10"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="p-3">
        {recentConversations.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-white/70 font-medium text-xs mb-2 px-2">
              Recent
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {recentConversations.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton
                      onClick={() => onConversationSelect(conversation.id)}
                      className={`w-full p-3 rounded-lg transition-colors group ${
                        currentConversationId === conversation.id
                          ? "bg-weezy-dark-secondary text-white"
                          : "hover:bg-weezy-dark-secondary text-white/80 hover:text-white"
                      }`}
                    >
                      <div className="flex items-start gap-3 w-full min-w-0">
                        <MessageSquare className="w-4 h-4 mt-0.5 text-weezy-accent flex-shrink-0" />
                        <div className="flex-1 min-w-0 text-left">
                          <h3 className="font-medium text-sm truncate">
                            {conversation.title}
                          </h3>
                          <p className="text-xs text-white/50 truncate mt-0.5">
                            {conversation.lastMessage}
                          </p>
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
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="text-white/70 font-medium text-xs mb-2 px-2">
              Previous 7 days
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {olderConversations.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton
                      onClick={() => onConversationSelect(conversation.id)}
                      className={`w-full p-3 rounded-lg transition-colors group ${
                        currentConversationId === conversation.id
                          ? "bg-weezy-dark-secondary text-white"
                          : "hover:bg-weezy-dark-secondary text-white/80 hover:text-white"
                      }`}
                    >
                      <div className="flex items-start gap-3 w-full min-w-0">
                        <MessageSquare className="w-4 h-4 mt-0.5 text-weezy-accent flex-shrink-0" />
                        <div className="flex-1 min-w-0 text-left">
                          <h3 className="font-medium text-sm truncate">
                            {conversation.title}
                          </h3>
                          <p className="text-xs text-white/50 truncate mt-0.5">
                            {conversation.lastMessage}
                          </p>
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
