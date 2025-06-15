import { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import ThinkingAnimation from "./ThinkingAnimation";
import SuggestionBubbles from "./SuggestionBubbles";
import { FileText, User, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Helper function to render text with markdown-style bold formatting
const renderFormattedText = (text: string) => {
  // Split text by **text** pattern and render bold parts
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove the ** markers and make bold
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-bold">{boldText}</strong>;
    }
    return part;
  });
};

interface ChatMessagesProps {
  messages: Message[];
  isThinking: boolean;
  thinkingType?: 'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general' | 'delete';
  onSendMessage: (message: string) => void;
}

const ChatMessages = ({ messages, isThinking, thinkingType, onSendMessage }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages, isThinking]);

  const suggestions = [
    "Find my deep learning papers from last year",
    "Give me a detailed summary of the project proposal document", 
    "What is ResNet architecture and how does it work?",
    "Upload this quarterly report to Google Drive",
    "Remove the old marketing presentation from Dropbox",
    "Show me the API integration documentation"
  ];

  // The extra wrapper below gives the chat window a fixed min/max height and makes sure the ScrollArea actually scrolls!
  // On desktop: height is 100% of available area; on mobile, min-h-64 and max-h-[80vh].
  return (
    <div className="flex-1 w-full h-full max-h-[80vh] min-h-64 flex flex-col bg-[#191d23] border border-gray-800 rounded-xl overflow-hidden">
      {
        (messages.length === 0 && !isThinking) ? (
          <div className="flex-1 flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto p-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg mb-6">
              <img 
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=80&h=80&fit=crop&crop=center" 
                alt="Weezy AI Robot"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Weezy AI</h2>
            <p className="text-gray-400 text-lg mb-8">How can I help you today?</p>
            
            <div className="w-full max-w-md mb-4">
              <h3 className="text-lg font-semibold text-white mb-4">Try these suggestions:</h3>
              <SuggestionBubbles suggestions={suggestions} onSendMessage={onSendMessage} />
            </div>
          </div>
        ) : (
          <ScrollArea className="flex-1 w-full h-full">
            <div className="px-6 py-8">
              <div className="space-y-8 max-w-3xl mx-auto w-full">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 items-start ${
                      message.isUser ? "" : ""
                    }`}
                  >
                    {!message.isUser && (
                      <div className="w-9 h-9 rounded-full overflow-hidden shadow-lg flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=36&h=36&fit=crop&crop=center" 
                          alt="Weezy AI"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className={`flex flex-col gap-2 w-full ${message.isUser ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`max-w-[90%] rounded-2xl px-5 py-3 text-left ${
                          message.isUser
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 text-gray-200"
                        } ${message.isUploading ? 'animate-pulse' : ''}`}
                      >
                        {message.isUploading && (
                          <div className="flex items-center gap-3 mb-3">
                            <Upload className="w-5 h-5 text-blue-400 animate-bounce" />
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="text-sm font-medium whitespace-pre-wrap">
                          {renderFormattedText(message.content)}
                        </div>
                        
                        {message.files && message.files.length > 0 && (
                          <div className="mt-4 space-y-2 border-t border-gray-700 pt-3">
                            {message.files.map((file) => (
                              <div key={file.id} className={`bg-gray-700/50 rounded-lg p-3 flex items-center gap-3 border border-gray-600/50 ${message.isUploading ? 'animate-pulse' : ''}`}>
                                <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <div className="flex-1 overflow-hidden">
                                  <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                  <span className="text-xs text-gray-400">{file.platform} - {file.size}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
      
                    {message.isUser && (
                      <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                ))}
      
                {isThinking && (
                  <div className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-full overflow-hidden shadow-lg flex-shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=36&h=36&fit=crop&crop=center" 
                        alt="Weezy AI"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-gray-800 rounded-2xl">
                      <ThinkingAnimation type={thinkingType} />
                    </div>
                  </div>
                )}
      
                <div ref={messagesEndRef} />
              </div>
            </div>
          </ScrollArea>
        )
      }
    </div>
  );
};

export default ChatMessages;
