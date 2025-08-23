
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Plus, MessageSquare, Building2, Clock, Settings, Trash2 } from "lucide-react";
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
      className="w-16 bg-gray-50 border-r border-gray-200 hover:w-64 transition-all duration-300 group" 
      collapsible="offcanvas"
    >
      <SidebarHeader className="p-4">
        <div className="flex flex-col items-center group-hover:items-start space-y-4">
          {/* Compact logo */}
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
          </div>
          
          {/* New Chat - only show on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity w-full">
            <Button
              onClick={onNewConversation}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg text-sm h-auto shadow-sm transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-3">
        {/* Sidebar icons - always visible */}
        <div className="flex flex-col items-center group-hover:items-start space-y-3">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg group-hover:w-full group-hover:justify-start"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">Chat</span>
          </Button>
          
          <Button
            onClick={onNavigateToWorkspace}
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg group-hover:w-full group-hover:justify-start"
          >
            <Building2 className="w-4 h-4" />
            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">Workspace</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg group-hover:w-full group-hover:justify-start"
          >
            <Clock className="w-4 h-4" />
            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">History</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg group-hover:w-full group-hover:justify-start"
          >
            <Settings className="w-4 h-4" />
            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">Settings</span>
          </Button>
        </div>

        {/* Conversations - only show on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-6">
          <ScrollArea className="flex-1">
            <div className="space-y-1 pb-4">
              {conversations.map((conversation, index) => (
                <div key={conversation.id} className="group/item relative">
                  <Button
                    variant="ghost"
                    onClick={() => onConversationSelect(conversation.id)}
                    className={`w-full justify-start text-left p-3 h-auto rounded-lg text-sm transition-all duration-200 ${
                      currentConversationId === conversation.id 
                        ? 'bg-gray-200 text-gray-900' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="font-medium line-clamp-1 leading-tight mb-1 text-sm">
                        {getConversationPreview(conversation)}
                      </p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-400">
                          {formatTime(conversation.timestamp)}
                        </span>
                      </div>
                    </div>
                  </Button>
                  {currentConversationId === conversation.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 p-0 opacity-0 group-hover/item:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {/* User profile - only show on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <UserProfile />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ChatSidebar;
