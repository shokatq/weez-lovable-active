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
    <div className="bg-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* File upload indicator */}
        {uploadingFiles.length > 0 && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span>Uploading {uploadingFiles.length} file(s)...</span>
            </div>
          </div>
        )}

        {/* Input area matching the design */}
        <div className="relative">
          <div className="flex items-center gap-3 p-4 bg-white border border-gray-300 rounded-2xl shadow-sm hover:border-gray-400 transition-all duration-200 focus-within:border-blue-500 focus-within:shadow-lg min-h-[56px]">
            {/* File upload button */}
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              <Paperclip className="w-5 h-5" />
            </Button>

            {/* Text input */}
            <Textarea
              ref={textareaRef}
              placeholder="Ask me anything"
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyPress}
              disabled={disabled}
              className={cn(
                "min-h-[24px] max-h-[120px] resize-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-500 text-gray-900 text-base leading-6 p-0",
                "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              )}
              style={{ height: "24px" }}
            />

            {/* Send button */}
            <div className="flex-shrink-0">
              <Button
                onClick={handleSend}
                disabled={disabled || !message.trim()}
                className={cn(
                  "h-10 w-10 rounded-xl shadow-sm transition-all duration-200",
                  message.trim() 
                    ? "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-md" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
                size="icon"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Footer text */}
          <p className="text-center text-xs text-gray-500 mt-3">
            Centria may display inaccurate info, so please double check the response. <span className="text-gray-700 font-medium">Your Privacy & Centria AI</span>
          </p>
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