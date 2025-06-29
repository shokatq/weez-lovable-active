
import { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import ThinkingAnimation from "./ThinkingAnimation";
import SuggestionBubbles from "./SuggestionBubbles";
import { FileText, User, Upload, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const renderFormattedText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-bold text-slate-900">{boldText}</strong>;
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
    "Find my strategic reports from Q4",
    "Summarize the latest project proposal", 
    "What's our APAC expansion strategy?",
    "Upload client brief to Google Drive",
    "Show me blockchain KYC documentation",
    "Locate the compliance readiness plan"
  ];

  return (
    <div className="flex-1 w-full h-full max-h-[80vh] min-h-64 flex flex-col bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-2xl mx-4 my-2 shadow-sm overflow-hidden">
      {
        (messages.length === 0 && !isThinking) ? (
          <div className="flex-1 flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto p-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg pulse-glow">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3 fade-in">Hey there! 👋</h2>
            <p className="text-slate-600 text-lg mb-8 fade-in" style={{ animationDelay: '0.2s' }}>I'm Weezy, your AI assistant. How can I help you today?</p>
            
            <div className="w-full max-w-2xl mb-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 fade-in" style={{ animationDelay: '0.4s' }}>Try these suggestions:</h3>
              <SuggestionBubbles suggestions={suggestions} onSendMessage={onSendMessage} />
            </div>
          </div>
        ) : (
          <ScrollArea className="flex-1 w-full h-full">
            <div className="px-6 py-8">
              <div className="space-y-6 max-w-4xl mx-auto w-full">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 items-start message-bubble ${
                      message.isUser ? "flex-row-reverse" : ""
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                      message.isUser 
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600" 
                        : "bg-gradient-to-br from-slate-100 to-slate-200"
                    }`}>
                      {message.isUser ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-slate-600" />
                      )}
                    </div>

                    <div className={`flex flex-col gap-2 max-w-[75%] ${message.isUser ? 'items-end' : 'items-start'}`}>
                      <div className={`text-xs font-medium ${message.isUser ? 'text-blue-600' : 'text-slate-500'} mb-1`}>
                        {message.isUser ? 'You' : 'Weezy'}
                      </div>
                      
                      <div
                        className={`rounded-2xl px-6 py-4 text-left shadow-sm border transition-all duration-300 hover:shadow-md ${
                          message.isUser
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-200"
                            : "bg-white/80 backdrop-blur-sm text-slate-800 border-slate-200/80"
                        } ${message.isUploading ? 'shimmer' : ''}`}
                      >
                        {message.isUploading && (
                          <div className="flex items-center gap-3 mb-3">
                            <Upload className="w-5 h-5 text-blue-400 animate-bounce" />
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full typing-indicator"></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full typing-indicator" style={{animationDelay: '0.2s'}}></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full typing-indicator" style={{animationDelay: '0.4s'}}></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="text-sm font-medium whitespace-pre-wrap leading-relaxed">
                          {renderFormattedText(message.content)}
                        </div>
                        
                        {message.files && message.files.length > 0 && (
                          <div className="mt-4 space-y-2 border-t border-slate-200/50 pt-3">
                            {message.files.map((file) => (
                              <div key={file.id} className={`bg-slate-50/80 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 border border-slate-200/60 transition-all duration-300 hover:bg-slate-100/80 hover:shadow-sm ${message.isUploading ? 'shimmer' : ''}`}>
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                  <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                                  <span className="text-xs text-slate-500">{file.platform} • {file.size}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-slate-400">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
      
                {isThinking && (
                  <div className="flex gap-4 items-start message-bubble">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-sm">
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
