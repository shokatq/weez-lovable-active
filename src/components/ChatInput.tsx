
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send } from "lucide-react";
import FileUpload from "./FileUpload";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
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
    
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const handleFileSelect = (files: FileList) => {
    console.log('Files selected:', Array.from(files).map(f => f.name));
  };

  return (
    <div className="pt-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-center w-full p-2 bg-gray-950/80 rounded-2xl border border-gray-700/80 shadow-lg backdrop-blur-sm">
          <div className="pl-2">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>

          <div className="flex-1 mx-2">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything..."
              className="w-full min-h-[28px] max-h-[120px] bg-transparent border-none resize-none text-white placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 text-base p-0 leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={1}
            />
          </div>

          <div className="flex items-center gap-2 pr-1">
            {message.trim() ? (
              <Button
                onClick={handleSend}
                size="icon"
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg h-9 w-9 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white rounded-lg h-9 w-9 flex-shrink-0"
              >
                <Mic className="w-4 h-4" />
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
