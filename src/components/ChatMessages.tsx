
import { useEffect, useRef, useState } from "react";
import { Message } from "./ChatInterface";
import ThinkingAnimation from "./ThinkingAnimation";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, Clock, CheckCircle } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  isThinking: boolean;
  thinkingType?: 'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general';
}

const ChatMessages = ({ messages, isThinking, thinkingType }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Animate new messages
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      setAnimatingMessageId(lastMessage.id);
      setTimeout(() => setAnimatingMessageId(null), 1000);
    }
  }, [messages, isThinking]);

  const welcomeQuestions = [
    { icon: "🔍", text: "Find my deep learning files", gradient: "from-blue-500 to-blue-600" },
    { icon: "📄", text: "Summarize my latest financial report", gradient: "from-green-500 to-green-600" },
    { icon: "🧠", text: "Explain ResNet implementation in my files", gradient: "from-purple-500 to-purple-600" },
    { icon: "🏢", text: "Show me the workspace dashboard", gradient: "from-orange-500 to-orange-600" },
    { icon: "👥", text: "Add new employee to our team", gradient: "from-pink-500 to-pink-600" },
    { icon: "☁️", text: "Upload this presentation to Google Drive", gradient: "from-cyan-500 to-cyan-600" }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 bg-gradient-to-br from-black via-gray-900 to-black">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto animate-fade-in">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-2xl">
              <span className="text-black font-bold text-2xl">W</span>
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-weezy-accent to-weezy-glow rounded-3xl opacity-20 animate-pulse-glow"></div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-weezy-accent animate-float" />
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            How can Weezy help you today?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">Try these example queries to get started:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            {welcomeQuestions.map((question, index) => (
              <div
                key={index}
                className={`group p-5 bg-gradient-to-br ${question.gradient} bg-opacity-10 border border-gray-800 rounded-2xl text-gray-300 text-sm hover:bg-opacity-20 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl group-hover:animate-bounce">{question.icon}</span>
                  <span className="group-hover:text-white transition-colors">{question.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex gap-4 animate-fade-in ${
            message.isUser ? "justify-end" : "justify-start"
          } ${animatingMessageId === message.id ? 'animate-slide-up' : ''}`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {!message.isUser && (
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-sm">W</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-weezy-accent to-weezy-glow rounded-xl opacity-30 animate-pulse"></div>
            </div>
          )}
          
          <div
            className={`max-w-[85%] rounded-3xl px-6 py-4 transition-all duration-300 ${
              message.isUser
                ? "bg-gradient-to-br from-white to-gray-100 text-black ml-auto shadow-xl hover:shadow-2xl"
                : "bg-gradient-to-br from-gray-900 to-gray-800 text-white border border-gray-700 shadow-xl hover:shadow-2xl hover:border-gray-600"
            }`}
          >
            <div className="prose prose-sm max-w-none">
              <p className="text-sm leading-relaxed whitespace-pre-line mb-0">
                {message.content}
              </p>
            </div>
            
            {message.files && message.files.length > 0 && (
              <div className="mt-6 space-y-3 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-weezy-accent" />
                  <h4 className="text-sm font-semibold text-gray-300">Related Files:</h4>
                </div>
                {message.files.map((file, fileIndex) => (
                  <div 
                    key={file.id} 
                    className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4 flex items-center gap-3 border border-gray-600 hover:border-weezy-accent transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${(fileIndex + 1) * 100}ms` }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-weezy-accent/20 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-weezy-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{file.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="secondary" className="bg-weezy-accent/20 text-weezy-accent text-xs border-weezy-accent/30">
                          {file.platform}
                        </Badge>
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {file.size}
                        </span>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                ))}
              </div>
            )}
            
            <div className={`flex items-center gap-2 mt-4 pt-2 border-t ${
              message.isUser ? "border-gray-300" : "border-gray-700"
            }`}>
              <Clock className={`w-3 h-3 ${message.isUser ? "text-gray-500" : "text-gray-400"}`} />
              <span className={`text-xs ${
                message.isUser ? "text-gray-500" : "text-gray-400"
              }`}>
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {message.isUser && (
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-lg border border-gray-600">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl opacity-30"></div>
            </div>
          )}
        </div>
      ))}

      {isThinking && (
        <div className="flex gap-4 justify-start animate-fade-in">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-lg">
              <span className="text-black font-bold text-sm">W</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-weezy-accent to-weezy-glow rounded-xl opacity-50 animate-pulse-glow"></div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border border-gray-700 rounded-3xl px-6 py-4 shadow-xl">
            <ThinkingAnimation type={thinkingType} />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
