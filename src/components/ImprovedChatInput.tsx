import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImprovedChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ImprovedChatInput = ({ onSendMessage, disabled = false }: ImprovedChatInputProps) => {
  const [message, setMessage] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
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
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 120; // Reduced max height for slimmer appearance
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(file => file.name);
      setUploadingFiles(fileNames);

      setTimeout(() => {
        onSendMessage(`📎 Uploaded ${fileNames.length} file(s): ${fileNames.join(', ')}`);
        setUploadingFiles([]);
      }, 1500);
    }
  };

  // Auto-focus on mount
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur">
      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* File upload indicator */}
        {uploadingFiles.length > 0 && (
          <div className="mb-3 p-3 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Uploading {uploadingFiles.length} file(s)...</span>
            </div>
          </div>
        )}

        {/* Slim input area */}
        <div className="relative">
          <div className={cn(
            "flex items-center gap-2 p-2 bg-background border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50 min-h-[48px]",
            disabled ? "border-primary/40 animate-pulse-glow" : "border-border"
          )}>
            {/* File upload button */}
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            {/* Text input */}
            <Textarea
              ref={textareaRef}
              placeholder="Message Weez AI..."
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyPress}
              disabled={disabled}
              className={cn(
                "min-h-[32px] max-h-[120px] resize-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-muted-foreground text-sm leading-5 p-1",
                disabled ? "opacity-80" : "",
                "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
              )}
              style={{ height: "32px" }}
            />

            {/* Send button */}
            <div className="flex-shrink-0">
              <Button
                onClick={handleSend}
                disabled={disabled || !message.trim()}
                className={cn(
                  "h-8 w-8 rounded-lg shadow-sm transition-all duration-200",
                  message.trim()
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-md"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
        />
      </div>
    </div>
  );
};

export default ImprovedChatInput;