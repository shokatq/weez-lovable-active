
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, MessageSquare, Building2, Settings, ChevronDown, ChevronRight, User } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
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
  const [isConversationsExpanded, setIsConversationsExpanded] = useState(true);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <Sidebar className="w-80 bg-white border-r border-gray-200">
      <SidebarHeader className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">File Assistant</h1>
          </div>
        </div>
        
        <Button 
          onClick={onNewConversation}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 justify-start px-4 py-3 h-auto"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={() => setIsConversationsExpanded(!isConversationsExpanded)}
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg p-2 h-auto"
          >
            {isConversationsExpanded ? (
              <ChevronDown className="w-4 h-4 mr-2" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-2" />
            )}
            <span className="text-sm font-medium">CONVERSATIONS</span>
          </Button>

          {isConversationsExpanded && (
            <div className="space-y-1 mt-2">
              {conversations.map((conversation) => {
                const isActive = conversation.id === currentConversationId;
                const previewText = conversation.messages.length > 0 
                  ? conversation.messages[conversation.messages.length - 1].content.substring(0, 50) + "..."
                  : "New conversation";

                return (
                  <Button
                    key={conversation.id}
                    variant="ghost"
                    onClick={() => onConversationSelect(conversation.id)}
                    className={`w-full justify-start text-left p-3 h-auto rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium truncate">
                          {previewText}
                        </span>
                        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                          {formatTimestamp(conversation.timestamp)}
                        </span>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={onNavigateToWorkspace}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 justify-center py-3 h-auto"
            >
              <Building2 className="w-4 h-4" />
              Workspace
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="flex items-center gap-3 mt-4 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">Premium</div>
          </div>
          <Settings className="w-4 h-4 text-gray-400" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ChatSidebar;
