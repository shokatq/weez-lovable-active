
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Plus, MessageSquare, Building2, Sparkles, Clock, Trash2, Edit, MoreHorizontal } from "lucide-react";
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
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getConversationPreview = (conversation: Conversation) => {
    if (conversation.messages.length === 0) return "New conversation";
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage.content.slice(0, 60) + (lastMessage.content.length > 60 ? "..." : "");
  };

  return (
    <Sidebar className="w-80 bg-gray-950/95 border-r border-gray-800/50 backdrop-blur-xl">
      <SidebarHeader className="p-6 border-b border-gray-800/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Weezy AI
            </h2>
            <p className="text-xs text-gray-400 font-medium">File Assistant</p>
          </div>
        </div>
        
        <Button
          onClick={onNewConversation}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg border border-blue-500/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 px-2">
            Recent Conversations
          </h3>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onMouseEnter={() => setHoveredConversation(conversation.id)}
                onMouseLeave={() => setHoveredConversation(null)}
                className="relative group"
              >
                <Button
                  variant="ghost"
                  onClick={() => onConversationSelect(conversation.id)}
                  className={`w-full justify-start text-left p-4 h-auto rounded-xl transition-all duration-300 hover:bg-gray-800/50 border ${
                    currentConversationId === conversation.id 
                      ? 'bg-blue-600/20 border-blue-500/30 text-white shadow-lg' 
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-700/50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className={`w-4 h-4 flex-shrink-0 ${
                        currentConversationId === conversation.id ? 'text-blue-400' : 'text-gray-500'
                      }`} />
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500 font-medium">
                        {formatTime(conversation.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2 leading-relaxed">
                      {getConversationPreview(conversation)}
                    </p>
                  </div>
                </Button>
                
                {hoveredConversation === conversation.id && (
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-7 h-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-7 h-7 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-800/50">
        <Button
          onClick={onNavigateToWorkspace}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg border border-emerald-500/20"
        >
          <Building2 className="w-5 h-5 mr-2" />
          Workspace Dashboard
          <Sparkles className="w-4 h-4 ml-2 opacity-70" />
        </Button>
        
        <div className="mt-4 p-3 bg-gray-800/30 rounded-xl border border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
              U
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">User Account</p>
              <p className="text-xs text-gray-400">Premium Plan</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-7 h-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ChatSidebar;
