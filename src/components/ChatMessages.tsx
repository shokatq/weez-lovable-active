import { useEffect, useRef } from "react";
import { Message } from "./ChatInterface";
import ThinkingAnimation from "./ThinkingAnimation";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

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

  const welcomeQuestions = [
    "Find my deep learning files",
    "Summarize my latest financial report", 
    "Explain ResNet implementation in my files",
    "Show me the workspace dashboard",
    "Add new employee to our team",
    "Upload this presentation to Google Drive"
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-black">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-6">
            <span className="text-black font-bold text-xl">W</span>
          </div>
          <h2 className="text-3xl font-semibold text-white mb-4">How can Weezy help you today?</h2>
          <p className="text-gray-400 mb-6">Try these example queries:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
            {welcomeQuestions.map((question, index) => (
              <div
                key={index}
                className="p-4 bg-gray-900 border border-gray-800 rounded-xl text-gray-300 text-sm hover:bg-gray-800 transition-colors cursor-pointer"
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
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold text-sm">W</span>
            </div>
          )}
          
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.isUser
                ? "bg-white text-black ml-auto"
                : "bg-gray-900 text-white border border-gray-800"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
            
            {message.files && message.files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Related Files:</h4>
                {message.files.map((file) => (
                  <div key={file.id} className="bg-gray-800 rounded-lg p-3 flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                          {file.platform}
                        </Badge>
                        <span className="text-gray-400 text-xs">{file.size}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <span className={`text-xs mt-2 block ${
              message.isUser ? "text-gray-600" : "text-gray-400"
            }`}>
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {message.isUser && (
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">U</span>
            </div>
          )}
        </div>
      ))}

      {isThinking && (
        <div className="flex gap-4 justify-start">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
            <span className="text-black font-bold text-sm">W</span>
          </div>
          
          <div className="bg-gray-900 text-white border border-gray-800 rounded-2xl px-4 py-3">
            <ThinkingAnimation type={thinkingType} />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
