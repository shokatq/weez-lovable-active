
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
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`; // max height of 128px
  };

  const handleFileSelect = async (files: FileList) => {
    const fileArray = Array.from(files);
    setUploadingFiles(fileArray);
    
    // Simulate file upload process
    const uploadMessage = `Uploading ${fileArray.length} file(s): ${fileArray.map(f => f.name).join(', ')}`;
    onSendMessage(uploadMessage);
    
    // Clear uploading state after a delay
    setTimeout(() => {
      setUploadingFiles([]);
    }, 2000);
  };

  return (
    <div className="p-4">
      {uploadingFiles.length > 0 && (
        <div className="mb-3 p-3 bg-blue-900/30 border border-blue-600/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-300">Uploading files...</span>
          </div>
          {uploadingFiles.map((file, index) => (
            <div key={index} className="text-xs text-gray-400 ml-4">
              📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          ))}
        </div>
      )}
      
      <div className="relative flex items-end w-full p-2 bg-gray-800 rounded-2xl border border-gray-700/80 shadow-lg">
        <div className="pl-2 pb-1.5">
          <FileUpload onFileSelect={handleFileSelect} />
        </div>

        <div className="flex-1 mx-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask Weezy to search, summarize, or analyze your files..."
            className="w-full min-h-[28px] max-h-[128px] bg-transparent border-none resize-none text-white placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 text-base p-0 leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={1}
          />
        </div>

        <div className="flex items-center gap-2 pr-1 pb-1.5">
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg h-9 w-9 flex-shrink-0 disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 mt-3">
        Try: "Find my financial reports", "Summarize project roadmap", "Upload this to Google Drive"
      </p>
    </div>
  );
};

export default ChatInput;
