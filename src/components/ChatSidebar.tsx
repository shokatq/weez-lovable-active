
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
    return lastMessage.isUser ? `You: ${lastMessage.content}` : lastMessage.content;
  };

  return (
    <Sidebar className="w-80 bg-black border-r border-gray-800/50 backdrop-blur-xl">
      <SidebarHeader className="p-4 border-b border-gray-800/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Weezy AI
            </h2>
            <p className="text-xs text-gray-400 font-medium">File Assistant</p>
          </div>
        </div>
        
        <Button
          onClick={onNewConversation}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 shadow-[0_4px_14px_0_rgb(59,130,246,0.39)] hover:shadow-[0_6px_20px_0_rgb(59,130,246,0.23)]"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-2">
        <div className="my-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
            Recent Conversations
          </h3>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-1 px-2 pb-4">
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
                  className={`w-full justify-start text-left p-2 h-auto rounded-lg transition-all duration-200 border ${
                    currentConversationId === conversation.id 
                      ? 'bg-blue-900/40 border-blue-600 text-white' 
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2 leading-snug mb-1">
                      {getConversationPreview(conversation)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500 font-medium">
                        {formatTime(conversation.timestamp)}
                      </span>
                    </div>
                  </div>
                </Button>
                
                {hoveredConversation === conversation.id && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-800/50 space-y-3">
        <Button
          onClick={onNavigateToWorkspace}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 shadow-lg shadow-emerald-500/20"
        >
          <Building2 className="w-5 h-5 mr-2" />
          Workspace Dashboard
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
            U
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">User Account</p>
            <p className="text-xs text-gray-400">Premium Plan</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ChatSidebar;
