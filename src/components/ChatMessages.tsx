
import { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import ThinkingAnimation from "./ThinkingAnimation";
import SuggestionBubbles from "./SuggestionBubbles";
import { FileText, User, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const renderFormattedText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-bold text-gray-900">{boldText}</strong>;
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
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages, isThinking]);

  const suggestions = [
    "Search for project files in Notion",
    "Find contract documents from Slack", 
    "Summarize quarterly reports from Google Drive",
    "Show me design files from Dropbox",
    "Locate meeting notes from OneDrive",
    "Search financial documents across platforms"
  ];

  return (
    <div className="flex-1 w-full h-full max-h-[calc(100vh-200px)] min-h-64 flex flex-col bg-white">
      {
        (messages.length === 0 && !isThinking) ? (
          <div className="flex-1 flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto p-8">
            <div className="w-24 h-24 rounded-full bg-white shadow-2xl flex items-center justify-center mb-8 animate-pulse-glow border border-gray-100">
              <img 
                src="/lovable-uploads/68bbde77-894e-4452-af90-9524035d0b7a.png" 
                alt="Weezy AI Logo" 
                className="w-16 h-16 object-contain p-2"
              />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">Hey there! 👋</h2>
            <p className="text-gray-600 text-xl mb-12 font-medium animate-fade-in" style={{ animationDelay: '0.2s' }}>I'm Weezy, your AI assistant. How can I help you today?</p>
            
            <div className="w-full max-w-4xl mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>Try these suggestions:</h3>
              <SuggestionBubbles suggestions={suggestions} onSendMessage={onSendMessage} />
            </div>
          </div>
        ) : (
          <ScrollArea className="flex-1 w-full h-full">
            <div className="px-8 py-8">
              <div className="space-y-8 max-w-4xl mx-auto w-full">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-6 items-start animate-fade-in ${
                      message.isUser ? "flex-row-reverse" : ""
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                      message.isUser 
                        ? "bg-gray-900" 
                        : "bg-white border-2 border-gray-100"
                    }`}>
                      {message.isUser ? (
                        <User className="w-6 h-6 text-white" />
                      ) : (
                        <img 
                          src="/lovable-uploads/68bbde77-894e-4452-af90-9524035d0b7a.png" 
                          alt="Weezy AI" 
                          className="w-6 h-6 object-contain p-1"
                        />
                      )}
                    </div>

                    <div className={`flex flex-col gap-2 max-w-[80%] ${message.isUser ? 'items-end' : 'items-start'}`}>
                      <div className={`text-xs font-semibold ${message.isUser ? 'text-gray-900' : 'text-gray-600'} mb-2`}>
                        {message.isUser ? 'You' : 'Weezy'}
                      </div>
                      
                      <div
                        className={`rounded-2xl px-6 py-4 text-left shadow-lg border transition-all duration-300 hover:shadow-xl ${
                          message.isUser
                            ? "bg-gray-900 text-white border-gray-800"
                            : "bg-white text-gray-800 border-gray-200"
                        } ${message.isUploading ? 'animate-pulse' : ''}`}
                      >
                        {message.isUploading && (
                          <div className="flex items-center gap-3 mb-4">
                            <Upload className="w-5 h-5 text-blue-500 animate-bounce" />
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="text-base font-medium whitespace-pre-wrap leading-relaxed">
                          {renderFormattedText(message.content)}
                        </div>
                        
                        {message.files && message.files.length > 0 && (
                          <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                            {message.files.map((file) => (
                              <div key={file.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                  <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                  <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                                  <span className="text-sm text-gray-600 font-medium">{file.platform} • {file.size}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500 font-medium">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
      
                {isThinking && (
                  <div className="flex gap-6 items-start animate-fade-in">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <img 
                        src="/lovable-uploads/68bbde77-894e-4452-af90-9524035d0b7a.png" 
                        alt="Weezy AI" 
                        className="w-6 h-6 object-contain p-1"
                      />
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg">
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
