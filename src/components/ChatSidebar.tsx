
import { MessageSquare, Plus, User, Settings, LogOut, Search, ChevronDown, ChevronUp } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Conversation } from "./ChatInterface";
import { useState } from "react";

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
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);

  const generateSmartTitle = (firstMessage: string) => {
    if (!firstMessage) return "New conversation";
    
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
    <Sidebar className="bg-black/80 backdrop-blur-xl">
      <SidebarHeader className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <Button
            onClick={onNewConversation}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 font-normal rounded-lg h-10 justify-start text-sm"
          >
            <Plus className="w-4 h-4 mr-3" />
            New chat
          </Button>
          
          <Button
            onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
            variant="ghost"
            size="sm"
            className="ml-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg p-2 h-10 w-10"
          >
            {isHistoryCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            className="w-full bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 pl-10 h-10 rounded-lg focus:border-gray-600"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {!isHistoryCollapsed && (
          <>
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
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-900 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">User Account</p>
                <p className="text-xs text-gray-400 truncate">user@example.com</p>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0 bg-gray-900 border-gray-700" align="end">
            <div className="p-4 space-y-3">
              <div className="border-b border-gray-700 pb-3">
                <p className="text-sm font-medium text-gray-400 opacity-70">sayyadshokan21@gmail.com</p>
              </div>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Log Out
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ChatSidebar;
