
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
    <div className="p-6 bg-weezy-dark">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3 p-4 bg-weezy-dark-secondary rounded-3xl border border-weezy-dark-tertiary shadow-sm">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-weezy-dark-tertiary rounded-full p-2 h-9 w-9"
              onClick={() => console.log('Attach file')}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-weezy-dark-tertiary rounded-full p-2 h-9 w-9"
              onClick={() => console.log('Search')}
            >
              <Globe className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-weezy-dark-tertiary rounded-full p-2 h-9 w-9"
              onClick={() => console.log('Reason')}
            >
              <Lightbulb className="w-4 h-4" />
            </Button>
          </div>

          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything"
            className="flex-1 min-h-[24px] max-h-[120px] bg-transparent border-none resize-none text-white placeholder:text-white/50 focus:ring-0 focus:ring-offset-0 text-sm p-0 leading-relaxed"
            style={{ height: 'auto' }}
          />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`text-white/60 hover:text-white rounded-full p-2 h-9 w-9 ${
                isRecording ? "text-red-400 hover:text-red-300" : ""
              }`}
              onClick={toggleRecording}
            >
              <Mic className="w-4 h-4" />
            </Button>

            {message.trim() && (
              <Button
                onClick={handleSend}
                size="sm"
                className="bg-white text-black hover:bg-gray-200 rounded-full p-2 h-9 w-9"
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-white/40 mt-3">
          Weezy can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
