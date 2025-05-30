
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Globe, Lightbulb } from "lucide-react";
import FileUpload from "./FileUpload";

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

  const handleFileSelect = (files: FileList) => {
    console.log('Files selected:', Array.from(files).map(f => f.name));
    // Handle file upload logic here
  };

  return (
    <div className="p-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-3 px-4 py-3 bg-secondary rounded-2xl">
          <div className="flex items-center gap-1">
            <FileUpload onFileSelect={handleFileSelect} />
            
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-full p-2 h-8 w-8"
              onClick={() => console.log('Search')}
            >
              <Globe className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-full p-2 h-8 w-8"
              onClick={() => console.log('Reason')}
            >
              <Lightbulb className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything"
              className="w-full min-h-[24px] max-h-[120px] bg-transparent border-none resize-none text-foreground placeholder:text-muted-foreground focus:ring-0 focus:ring-offset-0 text-sm p-0 leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0 overflow-hidden"
              style={{ height: '24px' }}
            />
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`text-muted-foreground hover:text-foreground rounded-full p-2 h-8 w-8 ${
                isRecording ? "text-red-500 hover:text-red-400" : ""
              }`}
              onClick={toggleRecording}
            >
              <Mic className="w-4 h-4" />
            </Button>

            {message.trim() && (
              <Button
                onClick={handleSend}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full p-2 h-8 w-8"
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Weezy can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
