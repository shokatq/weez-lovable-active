
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Mic, Send, FileText, Image, Paperclip } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
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
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Here you would implement actual voice recording functionality
  };

  const fileUploadOptions = [
    { icon: FileText, label: "Documents", description: "Upload PDFs, Word docs, etc." },
    { icon: Image, label: "Images", description: "Upload photos and images" },
    { icon: Paperclip, label: "Files", description: "Upload any file type" },
  ];

  return (
    <div className="p-4 border-t border-weezy-dark-tertiary bg-weezy-dark/80 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3 p-3 bg-weezy-dark-secondary rounded-2xl border border-weezy-dark-tertiary glow-effect">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-weezy-dark-tertiary rounded-xl p-2 transition-all duration-200 hover:scale-110"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-80 p-4 bg-weezy-dark-secondary border border-weezy-dark-tertiary rounded-xl glass-effect" 
              sideOffset={10}
            >
              <div className="space-y-2">
                <h3 className="font-medium text-white mb-3">Upload Files</h3>
                {fileUploadOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant="ghost"
                    className="w-full justify-start text-left p-3 h-auto hover:bg-weezy-dark-tertiary transition-all duration-200"
                    onClick={() => {
                      // Implement file upload functionality
                      console.log(`Upload ${option.label}`);
                    }}
                  >
                    <option.icon className="w-5 h-5 mr-3 text-weezy-accent" />
                    <div>
                      <div className="font-medium text-white">{option.label}</div>
                      <div className="text-sm text-white/60">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Message Weezy..."
            className="flex-1 min-h-[50px] max-h-[120px] bg-transparent border-none resize-none text-white placeholder:text-white/50 focus:ring-0 focus:ring-offset-0 text-sm leading-relaxed p-2"
          />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`text-white/80 hover:text-white rounded-xl p-2 transition-all duration-200 hover:scale-110 ${
                isRecording ? "bg-red-500/20 text-red-400" : "hover:bg-weezy-dark-tertiary"
              }`}
              onClick={toggleRecording}
            >
              <Mic className={`w-5 h-5 ${isRecording ? "animate-pulse" : ""}`} />
            </Button>

            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              className="bg-weezy-accent hover:bg-weezy-accent-light text-white rounded-xl p-2 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-white/40 mt-2">
          Weezy can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
