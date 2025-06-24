
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-3 p-4 border border-gray-200 rounded-2xl bg-white focus-within:border-gray-300 transition-colors duration-200">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 h-auto"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask Weezy to search, summarize, or analyze your files..."
              className="flex-1 min-h-[24px] max-h-32 resize-none border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-400"
              style={{ height: 'auto' }}
            />
            
            <Button
              type="submit"
              disabled={!message.trim()}
              className="flex-shrink-0 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-lg p-2 h-auto transition-colors duration-200"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            Try: "Find my financial reports", "Summarize project roadmap", "Upload this to Google Drive"
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
