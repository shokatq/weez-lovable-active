
import { useEffect, useRef, useState } from "react";
import { Message } from "./ChatInterface";
import ThinkingAnimation from "./ThinkingAnimation";
import { Badge } from "@/components/ui/badge";
import { FileText, Bot, User, Clock, CheckCircle, Sparkles } from "lucide-react";

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
    
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      setAnimatingMessageId(lastMessage.id);
      setTimeout(() => setAnimatingMessageId(null), 800);
    }
  }, [messages, isThinking]);

  const welcomeQuestions = [
    { icon: "🔍", text: "Find my machine learning research papers", gradient: "from-blue-500/20 to-blue-600/20 border-blue-500/30" },
    { icon: "📊", text: "Summarize my latest quarterly financial report", gradient: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30" },
    { icon: "🧠", text: "Explain neural network architecture from my files", gradient: "from-violet-500/20 to-violet-600/20 border-violet-500/30" },
    { icon: "📈", text: "Show me marketing performance analytics", gradient: "from-orange-500/20 to-orange-600/20 border-orange-500/30" },
    { icon: "👥", text: "Add new team member to workspace", gradient: "from-rose-500/20 to-rose-600/20 border-rose-500/30" },
    { icon: "☁️", text: "Upload presentation to Google Drive", gradient: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30" }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 bg-black">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto">
          <div className="relative mb-10">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-2xl border border-gray-200 animate-float">
              <Sparkles className="w-10 h-10 text-black" />
            </div>
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/30 to-violet-500/30 rounded-3xl opacity-50 animate-pulse-glow"></div>
          </div>
          
          <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent mb-6 animate-fade-in">
            How can I help you today?
          </h2>
          <p className="text-gray-400 mb-12 text-xl font-medium animate-fade-in" style={{animationDelay: '200ms'}}>
            Try these example queries to get started
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            {welcomeQuestions.map((question, index) => (
              <div
                key={index}
                className={`group p-6 bg-gradient-to-br ${question.gradient} border rounded-3xl text-gray-300 hover:text-white transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl animate-fade-in backdrop-blur-sm`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{question.icon}</span>
                  <span className="font-semibold text-sm leading-relaxed">{question.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex gap-6 ${
            message.isUser ? "justify-end" : "justify-start"
          } ${animatingMessageId === message.id ? (message.isUser ? 'animate-slide-up' : 'animate-fade-in') : ''}`}
        >
          {!message.isUser && (
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl border border-blue-400/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-blue-600/30 rounded-2xl opacity-60 animate-pulse"></div>
            </div>
          )}
          
          <div
            className={`max-w-[85%] rounded-3xl px-7 py-5 transition-all duration-500 ${
              message.isUser
                ? "bg-gradient-to-br from-gray-700/90 to-gray-800/90 text-white ml-auto shadow-2xl border border-gray-600/30 backdrop-blur-sm"
                : "bg-gradient-to-br from-gray-900/95 to-gray-800/95 text-white border border-gray-700/40 shadow-2xl backdrop-blur-sm hover:border-gray-600/50"
            }`}
          >
            <div className="prose prose-sm max-w-none">
              <div className="text-sm leading-relaxed whitespace-pre-line font-medium">
                {message.content}
              </div>
            </div>
            
            {message.files && message.files.length > 0 && (
              <div className="mt-8 space-y-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <h4 className="text-sm font-bold text-gray-200">Related Files</h4>
                </div>
                {message.files.map((file, fileIndex) => (
                  <div 
                    key={file.id} 
                    className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-2xl p-5 flex items-center gap-4 border border-gray-600/30 hover:border-blue-500/40 transition-all duration-400 animate-fade-in hover:shadow-xl backdrop-blur-sm transform hover:scale-[1.02]"
                    style={{ animationDelay: `${(fileIndex + 1) * 150}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{file.name}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs border-blue-500/40 font-semibold">
                          {file.platform}
                        </Badge>
                        <span className="text-gray-400 text-xs flex items-center gap-2 font-medium">
                          <Clock className="w-3 h-3" />
                          {file.size}
                        </span>
                      </div>
                    </div>
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                ))}
              </div>
            )}
            
            <div className={`flex items-center gap-3 mt-6 pt-4 border-t ${
              message.isUser ? "border-gray-600/40" : "border-gray-700/40"
            }`}>
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400 font-medium">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {message.isUser && (
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-xl border border-gray-500/30">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </div>
      ))}

      {isThinking && (
        <div className="flex gap-6 justify-start animate-fade-in">
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/40 to-blue-600/40 rounded-2xl opacity-70 animate-pulse-glow"></div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 text-white border border-gray-700/40 rounded-3xl px-7 py-5 shadow-2xl backdrop-blur-sm">
            <ThinkingAnimation type={thinkingType} />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
