
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
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-white">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
            <span className="text-white font-bold text-xl">W</span>
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">How can Weezy help you today?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
            {welcomeQuestions.slice(1, 5).map((question, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm hover:bg-gray-100 transition-colors cursor-pointer"
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">W</span>
            </div>
          )}
          
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.isUser
                ? "bg-gray-900 text-white ml-auto"
                : "bg-gray-50 text-gray-900 border border-gray-200"
            }`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
            <span className={`text-xs mt-2 block ${
              message.isUser ? "text-gray-300" : "text-gray-500"
            }`}>
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {message.isUser && (
            <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-gray-600 font-bold text-sm">U</span>
            </div>
          )}
        </div>
      ))}

      {isThinking && (
        <div className="flex gap-4 justify-start">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          
          <div className="bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl px-4 py-3">
            <ThinkingAnimation />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
