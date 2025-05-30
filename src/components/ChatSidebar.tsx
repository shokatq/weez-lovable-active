
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
    <Sidebar className="border-r border-gray-200 bg-gray-50">
      <SidebarHeader className="p-3 border-b border-gray-200">
        <Button
          onClick={onNewConversation}
          className="w-full bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-300 font-normal rounded-lg h-10 justify-start text-sm shadow-sm"
        >
          <Plus className="w-4 h-4 mr-3" />
          New chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {recentConversations.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-600 font-medium text-xs mb-2 px-2">
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
                            ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                            : "hover:bg-white text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-3 w-full min-w-0">
                          <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
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
            <SidebarGroupLabel className="text-gray-600 font-medium text-xs mb-2 px-2">
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
                            ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                            : "hover:bg-white text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-3 w-full min-w-0">
                          <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
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
