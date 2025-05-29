
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
  const generateSmartTitle = (firstMessage: string) => {
    if (!firstMessage) return "New conversation";
    
    // Take first 30-40 characters for a cleaner look
    const title = firstMessage.length > 35 
      ? firstMessage.substring(0, 35) + "..." 
      : firstMessage;
    
    return title;
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
      <SidebarHeader className="p-3 border-b border-weezy-dark-tertiary">
        <Button
          onClick={onNewConversation}
          className="w-full bg-transparent hover:bg-weezy-dark-secondary text-white/80 hover:text-white border border-weezy-dark-tertiary font-normal rounded-lg h-10 justify-start text-sm"
        >
          <Plus className="w-4 h-4 mr-3" />
          New chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {recentConversations.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-white/50 font-normal text-xs mb-2 px-2">
              Recent
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {recentConversations.map((conversation) => {
                  const userMessages = conversation.messages.filter(msg => msg.isUser);
                  const firstUserMessage = userMessages.length > 0 ? userMessages[0].content : "";
                  const smartTitle = generateSmartTitle(firstUserMessage);
                  
                  return (
                    <SidebarMenuItem key={conversation.id}>
                      <SidebarMenuButton
                        onClick={() => onConversationSelect(conversation.id)}
                        className={`w-full p-2 rounded-lg transition-colors text-left ${
                          currentConversationId === conversation.id
                            ? "bg-weezy-dark-secondary text-white"
                            : "hover:bg-weezy-dark-secondary text-white/70 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3 w-full min-w-0">
                          <MessageSquare className="w-4 h-4 text-white/50 flex-shrink-0" />
                          <span className="text-sm truncate font-normal">
                            {smartTitle}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {olderConversations.length > 0 && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="text-white/50 font-normal text-xs mb-2 px-2">
              Previous 7 days
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {olderConversations.map((conversation) => {
                  const userMessages = conversation.messages.filter(msg => msg.isUser);
                  const firstUserMessage = userMessages.length > 0 ? userMessages[0].content : "";
                  const smartTitle = generateSmartTitle(firstUserMessage);
                  
                  return (
                    <SidebarMenuItem key={conversation.id}>
                      <SidebarMenuButton
                        onClick={() => onConversationSelect(conversation.id)}
                        className={`w-full p-2 rounded-lg transition-colors text-left ${
                          currentConversationId === conversation.id
                            ? "bg-weezy-dark-secondary text-white"
                            : "hover:bg-weezy-dark-secondary text-white/70 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3 w-full min-w-0">
                          <MessageSquare className="w-4 h-4 text-white/50 flex-shrink-0" />
                          <span className="text-sm truncate font-normal">
                            {smartTitle}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default ChatSidebar;
