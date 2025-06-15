
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Plus, MessageSquare, Building2, Clock, MoreHorizontal } from "lucide-react";
import { Conversation } from "./ChatInterface";

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
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const getConversationPreview = (conversation: Conversation) => {
    if (conversation.messages.length === 0) return "New conversation";
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage.isUser ? `You: ${lastMessage.content}` : lastMessage.content;
  };

  return (
    <Sidebar className="w-64 bg-black border-r border-gray-800/50">
      <SidebarHeader className="p-3 border-b border-gray-800/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Weezy AI</h2>
            <p className="text-xs text-gray-400">File Assistant</p>
          </div>
        </div>
        
        <Button
          onClick={onNewConversation}
          size="sm"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded-lg text-xs h-8"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-2">
        <div className="my-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
            Conversations
          </h3>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-1 pb-4">
            {conversations.map((conversation) => (
              <Button
                key={conversation.id}
                variant="ghost"
                onClick={() => onConversationSelect(conversation.id)}
                size="sm"
                className={`w-full justify-start text-left p-2 h-auto rounded-md text-xs ${
                  currentConversationId === conversation.id 
                    ? 'bg-slate-800 border border-blue-600 text-white' 
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="font-medium line-clamp-2 leading-tight mb-1 truncate text-xs">
                    {getConversationPreview(conversation)}
                  </p>
                  <div className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-gray-500 flex-shrink-0" />
                    <span className="text-xs text-gray-500 truncate">
                      {formatTime(conversation.timestamp)}
                    </span>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-gray-800/50 space-y-2">
        <Button
          onClick={onNavigateToWorkspace}
          size="sm"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-1.5 px-3 rounded-lg text-xs h-8"
        >
          <Building2 className="w-3.5 h-3.5 mr-1.5" />
          Workspace
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">User</p>
            <p className="text-xs text-gray-400 truncate">Premium</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg flex-shrink-0"
          >
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ChatSidebar;
