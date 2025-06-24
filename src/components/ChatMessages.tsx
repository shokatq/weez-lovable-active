
import { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { MessageSquare, Download, ExternalLink, Copy } from "lucide-react";
import ThinkingAnimation from "./ThinkingAnimation";
import SuggestionBubbles from "./SuggestionBubbles";

interface ChatMessagesProps {
  messages: Message[];
  isThinking: boolean;
  thinkingType: 'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general' | 'delete';
  onSendMessage: (message: string) => void;
}

const ChatMessages = ({ messages, isThinking, thinkingType, onSendMessage }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const formatMessageContent = (content: string) => {
    // Convert markdown-style formatting to HTML
    let formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/#{3}\s(.*?)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-900">$1</h3>')
      .replace(/#{2}\s(.*?)$/gm, '<h2 class="text-xl font-semibold mt-6 mb-3 text-gray-900">$1</h2>')
      .replace(/#{1}\s(.*?)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-gray-900">$1</h1>')
      .replace(/^• (.*?)$/gm, '<li class="ml-4">$1</li>')
      .replace(/^\* (.*?)$/gm, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br>');

    // Wrap in paragraph tags
    if (!formatted.includes('<h1>') && !formatted.includes('<h2>') && !formatted.includes('<h3>')) {
      formatted = `<p class="mb-3">${formatted}</p>`;
    }

    return formatted;
  };

  if (messages.length === 0 && !isThinking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <div className="text-center max-w-2xl">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">Weezy AI</h1>
          <p className="text-lg text-gray-600 mb-8">How can I help you today?</p>
          
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Try these suggestions:</h2>
            <SuggestionBubbles onSuggestionClick={onSendMessage} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            {!message.isUser && (
              <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-1">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-3xl ${message.isUser ? 'order-first' : ''}`}>
              <div className={`rounded-2xl px-4 py-3 ${
                message.isUser 
                  ? 'bg-gray-900 text-white ml-auto' 
                  : 'bg-gray-50 text-gray-900'
              }`}>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                />
              </div>
              
              {message.files && message.files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.files.map((file, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.platform} • {file.size}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!message.isUser && (
                <div className="text-xs text-gray-400 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
            
            {message.isUser && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-medium text-gray-700">U</span>
              </div>
            )}
          </div>
        ))}
        
        {isThinking && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-1">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div className="max-w-3xl">
              <div className="rounded-2xl px-4 py-3 bg-gray-50">
                <ThinkingAnimation type={thinkingType} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
