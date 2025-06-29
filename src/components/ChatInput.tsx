
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
    <div className="p-6 border-t border-slate-200/60 bg-white/30 backdrop-blur-sm">
      {uploadingFiles.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-xl notification-enter">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700">Uploading files...</span>
          </div>
          {uploadingFiles.map((file, index) => (
            <div key={index} className="text-xs text-blue-600 ml-5 flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          ))}
        </div>
      )}
      
      <div className="relative flex items-end w-full p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:border-slate-300/80">
        <div className="flex items-center gap-2 pr-3">
          <FileUpload onFileSelect={handleFileSelect} />
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 mx-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask Weezy anything about your files..."
            className="w-full min-h-[40px] max-h-[120px] bg-transparent border-none resize-none text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:ring-offset-0 text-base p-0 leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0 input-focus"
            rows={1}
          />
        </div>

        <div className="flex items-center pl-3">
          <Button
            onClick={handleSend}
            size="icon"
            className={`w-10 h-10 rounded-xl transition-all duration-300 ${
              message.trim() 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <p className="text-center text-xs text-slate-500 mt-4 fade-in">
        Try: "Find my Q4 reports", "Summarize the APAC strategy", "Upload to Google Drive"
      </p>
    </div>
  );
};

export default ChatInput;
