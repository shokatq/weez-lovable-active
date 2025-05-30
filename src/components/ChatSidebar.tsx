
import { MessageSquare, Plus, User } from "lucide-react";
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
  SidebarFooter,
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
    <Sidebar className="border-r border-gray-800 bg-black/80 backdrop-blur-xl">
      <SidebarHeader className="p-3 border-b border-gray-800">
        <Button
          onClick={onNewConversation}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 font-normal rounded-lg h-10 justify-start text-sm"
        >
          <Plus className="w-4 h-4 mr-3" />
          New chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {recentConversations.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400 font-medium text-xs mb-2 px-2">
              Today
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
                            ? "bg-gray-800 text-white"
                            : "hover:bg-gray-900 text-gray-300 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3 w-full min-w-0">
                          <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
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
            <SidebarGroupLabel className="text-gray-400 font-medium text-xs mb-2 px-2">
              Yesterday
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
                            ? "bg-gray-800 text-white"
                            : "hover:bg-gray-900 text-gray-300 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3 w-full min-w-0">
                          <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
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

      <SidebarFooter className="p-3 border-t border-gray-800">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-900 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">User Account</p>
            <p className="text-xs text-gray-400 truncate">user@example.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ChatSidebar;
