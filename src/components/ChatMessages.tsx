
import { useEffect, useRef } from "react";
import { Message } from "./ChatInterface";
import ThinkingAnimation from "./ThinkingAnimation";
import { FileText, Bot, User, Upload } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  isThinking: boolean;
  thinkingType?: 'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general';
}

const ChatMessages = ({ messages, isThinking, thinkingType }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  if (messages.length === 0 && !isThinking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto p-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mb-6">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Weezy AI</h2>
        <p className="text-gray-400 text-lg">How can I help you today?</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 py-8 space-y-8 max-w-3xl mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 items-start ${
              message.isUser ? "" : ""
            }`}
          >
            {!message.isUser && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
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
                
                <div className="prose prose-sm prose-invert max-w-none prose-p:my-0 prose-p:text-gray-200 whitespace-pre-wrap font-medium">
                  {message.content}
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
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-800 rounded-2xl">
              <ThinkingAnimation type={thinkingType} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
