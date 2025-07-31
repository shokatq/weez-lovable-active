import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";
import FileUpload from "./FileUpload";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
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

  const handleFileSelect = async (files: FileList) => {
    const fileArray = Array.from(files);
    setUploadingFiles(fileArray);
    
    const uploadMessage = `Uploading ${fileArray.length} file(s): ${fileArray.map(f => f.name).join(', ')}`;
    onSendMessage(uploadMessage);
    
    setTimeout(() => {
      setUploadingFiles([]);
    }, 2000);
  };

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur px-4 py-4">
      {uploadingFiles.length > 0 && (
        <div className="mb-4 p-3 bg-card border border-border rounded-lg animate-fade-in max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-foreground">Uploading files...</span>
          </div>
          {uploadingFiles.map((file, index) => (
            <div key={index} className="text-xs text-muted-foreground ml-4 flex items-center gap-2">
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          ))}
        </div>
      )}
      
      {/* Slim Input Container */}
      <div className="max-w-2xl mx-auto">
        <div className="relative flex items-center w-full bg-background rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-md min-h-[44px]">
          {/* Left side file upload */}
          <div className="flex items-center pl-3">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>

          {/* Message input area */}
          <div className="flex-1 min-w-0 px-2 py-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Message Weez AI..."
              className="w-full min-h-[32px] max-h-[120px] bg-transparent border-none resize-none text-foreground placeholder:text-muted-foreground focus:ring-0 focus:ring-offset-0 text-sm leading-5 px-2 py-1 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none"
              rows={1}
            />
          </div>

          {/* Send button */}
          <div className="flex items-center pr-3">
            <Button
              onClick={handleSend}
              size="icon"
              variant="ghost"
              className={`w-7 h-7 rounded-lg transition-all duration-200 ${
                message.trim() 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted'
              }`}
              disabled={!message.trim()}
            >
              <Send className="w-3.5 h-3.5" />
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