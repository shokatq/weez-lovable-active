import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Smile, Mic } from "lucide-react";
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
    const maxHeight = 200; // Max height before scrolling
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
    <div className="border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto p-4">
        {/* File upload indicator */}
        {uploadingFiles.length > 0 && (
          <div className="mb-3 p-3 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Uploading {uploadingFiles.length} file(s)...</span>
            </div>
          </div>
        )}

        {/* Main input area */}
        <div className="relative">
          <div className="flex items-end gap-3 p-3 bg-background border border-border rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all duration-200">
            {/* File upload button */}
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
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
                "min-h-[44px] max-h-[200px] resize-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-muted-foreground text-sm leading-6",
                "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
              )}
              style={{ height: "44px" }}
            />

            {/* Action buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                disabled={disabled}
              >
                <Smile className="w-4 h-4" />
              </Button>
              
              {message.trim() ? (
                <Button
                  onClick={handleSend}
                  disabled={disabled}
                  className="h-9 w-9 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  disabled={disabled}
                >
                  <Mic className="w-4 h-4" />
                </Button>
              )}
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