
import { useEffect, useRef } from "react";
import { Message } from "./ChatInterface";
import ThinkingAnimation from "./ThinkingAnimation";

interface ChatMessagesProps {
  messages: Message[];
  isThinking: boolean;
}

const ChatMessages = ({ messages, isThinking }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-weezy-accent to-weezy-accent-light flex items-center justify-center mb-6 animate-float">
            <span className="text-white font-bold text-2xl">W</span>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Welcome to Weezy</h2>
          <p className="text-white/60 max-w-md">
            I'm your intelligent AI assistant. Ask me anything, upload documents, or let me help you with your tasks.
          </p>
        </div>
      )}

      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex gap-4 animate-fade-in ${
            message.isUser ? "justify-end" : "justify-start"
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {!message.isUser && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-weezy-accent to-weezy-accent-light flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">W</span>
            </div>
          )}
          
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.isUser
                ? "bg-weezy-accent text-white ml-auto"
                : "bg-weezy-dark-secondary text-white border border-weezy-dark-tertiary"
            }`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
            <span className="text-xs opacity-60 mt-2 block">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {message.isUser && (
            <div className="w-8 h-8 rounded-lg bg-weezy-dark-secondary flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">U</span>
            </div>
          )}
        </div>
      ))}

      {isThinking && (
        <div className="flex gap-4 justify-start animate-slide-up">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-weezy-accent to-weezy-accent-light flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          
          <div className="bg-weezy-dark-secondary text-white border border-weezy-dark-tertiary rounded-2xl px-4 py-3">
            <ThinkingAnimation />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
