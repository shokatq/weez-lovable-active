import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Conversation, Message } from "@/types/chat";
import ChatMessages from "./ChatMessages";
import ImprovedChatInput from "./ImprovedChatInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Search, FileText, Users, Tag } from "lucide-react";
import { useAIAgent } from "@/hooks/aiAgent";
import { toast } from "@/hooks/use-toast";

interface SpaceChatInterfaceProps {
  spaceName: string;
}

const SpaceChatInterface = ({ spaceName }: SpaceChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState("space-default");
  const navigate = useNavigate();
  
  // AI Agent hook
  const { askAgent, isLoading, error: aiError, clearError } = useAIAgent();
  
  // Mock space data - in real app this would come from API
  const spaceData = {
    name: spaceName,
    description: `Collaborative workspace for ${spaceName} team`,
    memberCount: 12,
    fileCount: 47,
    availableFiles: [
      'Marketing Strategy 2024.pdf',
      'Brand Guidelines.docx',
      'Campaign Analytics.xlsx',
      'Content Calendar.pdf'
    ]
  };

  // Handle sending message to AI agent (space-scoped)
  const handleSendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || isLoading) return;

    clearError();

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      // Call AI agent with space context
      const contextPrompt = `[SPACE CONTEXT: ${spaceName} workspace. Available files: ${spaceData.availableFiles.join(', ')}] ${newMessage.trim()}`;
      const aiResponse = await askAgent(contextPrompt, 'space-user');

      if (aiResponse && aiResponse.trim()) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I couldn't process your request in this space context. Please try rephrasing your question.",
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      console.error('Error in space chat:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Connection Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your connection and try again.`,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Chat</span>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Tag className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">{spaceData.name}</h1>
                <p className="text-sm text-muted-foreground">{spaceData.description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search Files
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Space Context Panel */}
      <div className="border-b border-border bg-muted/20 px-6 py-3">
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{spaceData.memberCount} members</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>{spaceData.fileCount} files available</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Files you can search:</span>
            <div className="flex gap-2">
              {spaceData.availableFiles.slice(0, 3).map((file, index) => (
                <span key={index} className="bg-muted px-2 py-1 rounded text-xs">
                  {file}
                </span>
              ))}
              {spaceData.availableFiles.length > 3 && (
                <span className="text-muted-foreground">+{spaceData.availableFiles.length - 3} more</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Welcome to {spaceData.name} Space
              </h2>
              <p className="text-muted-foreground mb-8">
                Ask me anything about the files and documents in this space. I have access to {spaceData.fileCount} files and can help you find information quickly.
              </p>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="bg-card p-4 rounded-lg border">
                  <h3 className="font-medium mb-2">Available Files</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {spaceData.availableFiles.slice(0, 4).map((file, index) => (
                      <li key={index}>• {file}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h3 className="font-medium mb-2">What I can help with</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Search through documents</li>
                    <li>• Answer questions about content</li>
                    <li>• Summarize key information</li>
                    <li>• Find relevant sections</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ChatMessages 
            messages={messages} 
            isThinking={isLoading}
            thinkingType="general"
            onSendMessage={handleSendMessage}
          />
        )}
        
        <div className="border-t border-border bg-background p-4">
          <div className="max-w-4xl mx-auto">
            <ImprovedChatInput 
              onSendMessage={handleSendMessage} 
              disabled={isLoading} 
            />
            
            {/* Show error if there's an AI error */}
            {aiError && (
              <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
                <span>Error: {aiError}</span>
                <button 
                  onClick={clearError} 
                  className="ml-2 text-destructive/70 hover:text-destructive"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceChatInterface;