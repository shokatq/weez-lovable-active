
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Mic, Send, Globe, Lightbulb } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="p-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-center gap-3 px-4 py-3 bg-white rounded-full shadow-sm border border-gray-200">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 h-8 w-8"
              onClick={() => console.log('Attach file')}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 h-8 w-8"
              onClick={() => console.log('Search')}
            >
              <Globe className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 h-8 w-8"
              onClick={() => console.log('Reason')}
            >
              <Lightbulb className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 relative min-h-[20px]">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything"
              className="w-full min-h-[20px] max-h-[120px] bg-transparent border-none resize-none text-gray-900 placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 text-sm p-0 leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0 overflow-hidden"
              style={{ height: '20px' }}
            />
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`text-gray-500 hover:text-gray-700 rounded-full p-2 h-8 w-8 ${
                isRecording ? "text-red-500 hover:text-red-600" : ""
              }`}
              onClick={toggleRecording}
            >
              <Mic className="w-4 h-4" />
            </Button>

            {message.trim() && (
              <Button
                onClick={handleSend}
                size="sm"
                className="bg-gray-900 text-white hover:bg-gray-800 rounded-full p-2 h-8 w-8"
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-3">
          Weezy can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
