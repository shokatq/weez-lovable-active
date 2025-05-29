
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
  };

  const fileUploadOptions = [
    { icon: FileText, label: "Documents", description: "Upload PDFs, Word docs, etc." },
    { icon: Image, label: "Images", description: "Upload photos and images" },
    { icon: Paperclip, label: "Files", description: "Upload any file type" },
  ];

  return (
    <div className="p-6 bg-weezy-dark border-t border-weezy-dark-tertiary">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3 p-4 bg-weezy-dark-secondary rounded-2xl border border-weezy-dark-tertiary shadow-lg">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-weezy-dark-tertiary rounded-xl p-2 h-8 w-8"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-72 p-3 bg-weezy-dark-secondary border border-weezy-dark-tertiary rounded-xl shadow-xl" 
              sideOffset={10}
              align="start"
            >
              <div className="space-y-1">
                <h3 className="font-medium text-white text-sm mb-2 px-2">Upload Files</h3>
                {fileUploadOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant="ghost"
                    className="w-full justify-start text-left p-3 h-auto hover:bg-weezy-dark-tertiary rounded-lg"
                    onClick={() => {
                      console.log(`Upload ${option.label}`);
                    }}
                  >
                    <option.icon className="w-4 h-4 mr-3 text-weezy-accent" />
                    <div className="text-left">
                      <div className="font-medium text-white text-sm">{option.label}</div>
                      <div className="text-xs text-white/60">{option.description}</div>
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
            className="flex-1 min-h-[24px] max-h-[120px] bg-transparent border-none resize-none text-white placeholder:text-white/50 focus:ring-0 focus:ring-offset-0 text-sm p-0 leading-relaxed"
            style={{ height: 'auto' }}
          />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`text-white/70 hover:text-white rounded-xl p-2 h-8 w-8 ${
                isRecording ? "text-red-400 hover:text-red-300" : ""
              }`}
              onClick={toggleRecording}
            >
              <Mic className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              size="sm"
              className="bg-weezy-accent hover:bg-weezy-accent-light text-white rounded-xl p-2 h-8 w-8 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-weezy-accent"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-white/40 mt-3">
          Weezy can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
