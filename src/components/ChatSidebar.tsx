
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Plus, MessageSquare, Building2, Clock, MoreHorizontal, User } from "lucide-react";
import { Conversation } from "@/types/chat";

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
    <Sidebar 
      className="w-72 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 shadow-lg data-[state=collapsed]:w-0 transition-all duration-300 ease-in-out" 
      collapsible="offcanvas"
    >
      <SidebarHeader className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-4 fade-in">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Weezy AI</h2>
            <p className="text-xs text-slate-500">File Assistant</p>
          </div>
        </div>
        
        <Button
          onClick={onNewConversation}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm h-auto shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-3">
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
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
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="font-medium line-clamp-2 leading-tight mb-1 truncate text-sm">
                    {getConversationPreview(conversation)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="text-xs text-slate-400 truncate">
                      {formatTime(conversation.timestamp)}
                    </span>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-100 space-y-3">
        <Button
          onClick={onNavigateToWorkspace}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm h-auto shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <Building2 className="w-4 h-4 mr-2" />
          Workspace
        </Button>
        
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">User</p>
            <p className="text-xs text-slate-500 truncate">Premium Plan</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg flex-shrink-0 transition-colors duration-200"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ChatSidebar;
