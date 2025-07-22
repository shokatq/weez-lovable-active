
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Plus } from "lucide-react";
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
    <div className="p-8 border-t border-gray-100 bg-white">
      {uploadingFiles.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-blue-700">Uploading files...</span>
          </div>
          {uploadingFiles.map((file, index) => (
            <div key={index} className="text-xs text-blue-600 ml-5 flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          ))}
        </div>
      )}
      
      {/* ChatGPT-style Input Container */}
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-center w-full bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-300 focus-within:border-blue-500 focus-within:shadow-xl">
          {/* Left side icons */}
          <div className="flex items-center gap-2 px-4 py-3">
            <FileUpload onFileSelect={handleFileSelect} />
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Message input area */}
          <div className="flex-1 min-w-0 py-3">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Message Weezy AI..."
              className="w-full min-h-[20px] max-h-[120px] bg-transparent border-none resize-none text-gray-900 placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 text-base leading-6 px-0 py-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={1}
            />
          </div>

          {/* Send button */}
          <div className="flex items-center px-4 py-3">
            <Button
              onClick={handleSend}
              size="icon"
              className={`w-10 h-10 rounded-xl transition-all duration-300 ${
                message.trim() 
                  ? 'bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg hover:scale-105' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!message.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Helper text */}
        <p className="text-center text-xs text-gray-500 mt-4 font-medium animate-fade-in">
          Weezy AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
