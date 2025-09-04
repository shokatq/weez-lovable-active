import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { sanitizeUserInput, checkRateLimit } from "@/lib/security";
import { supabase } from "@/integrations/supabase/client";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!message.trim() || disabled) return;

    // Get current user for rate limiting
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to send messages');
      return;
    }

    // Rate limiting check
    const rateLimitKey = `chat_${user.id}`;
    if (!checkRateLimit(rateLimitKey, 10, 60000)) { // 10 messages per minute
      toast.error('Please wait before sending another message');
      return;
    }

    // Input sanitization and validation
    const sanitizedMessage = sanitizeUserInput(message);
    if (sanitizedMessage.length === 0) {
      toast.error('Message cannot be empty after sanitization');
      return;
    }

    if (sanitizedMessage.length > 1000) {
      toast.error('Message too long. Please keep it under 1000 characters');
      return;
    }

    onSendMessage(sanitizedMessage);
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Basic input length validation
    if (value.length > 1000) {
      toast.warning('Message is getting long. Consider keeping it under 1000 characters.');
      return;
    }
    
    setMessage(value);
    
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur px-4 py-4">
      <div className="max-w-2xl mx-auto">
        <div className="relative flex items-center w-full bg-background rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-md min-h-[44px]">
          {/* Message input area */}
          <div className="flex-1 min-w-0 px-3 py-2">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Message Weez AI..."
              disabled={disabled}
              className="w-full min-h-[32px] max-h-[120px] bg-transparent border-none resize-none text-foreground placeholder:text-muted-foreground focus:ring-0 focus:ring-offset-0 text-sm leading-5 px-0 py-0 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none"
              rows={1}
            />
          </div>

          {/* Send button */}
          <div className="flex items-center pr-3">
            <Button
              onClick={handleSend}
              size="icon"
              variant="ghost"
              className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                message.trim() 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted'
              }`}
              disabled={!message.trim() || disabled}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Helper text */}
        <p className="text-center text-xs text-muted-foreground mt-2">
          Weez AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;