
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

  const welcomeQuestions = [
    "What can Weezy help you with today?",
    "Ask me about anything - I'm here to assist!",
    "How can I make your day more productive?",
    "Need help with research, writing, or analysis?",
    "What would you like to explore together?"
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-weezy-accent flex items-center justify-center mb-6">
            <span className="text-white font-bold text-xl">W</span>
          </div>
          <h2 className="text-3xl font-semibold text-white mb-4">How can Weezy help you today?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
            {welcomeQuestions.slice(1, 5).map((question, index) => (
              <div
                key={index}
                className="p-4 bg-weezy-dark-secondary border border-weezy-dark-tertiary rounded-xl text-white/80 text-sm hover:bg-weezy-dark-tertiary transition-colors cursor-pointer"
              >
                {question}
              </div>
            ))}
          </div>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-4 ${
            message.isUser ? "justify-end" : "justify-start"
          }`}
        >
          {!message.isUser && (
            <div className="w-8 h-8 rounded-lg bg-weezy-accent flex items-center justify-center flex-shrink-0">
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
        <div className="flex gap-4 justify-start">
          <div className="w-8 h-8 rounded-lg bg-weezy-accent flex items-center justify-center flex-shrink-0">
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
