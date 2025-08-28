
import { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import ThinkingAnimation from "./ThinkingAnimation";
import { FileText, User, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
const MarkdownContent = ({ text }: { text: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({ node, ...props }) => <h1 className="text-xl font-semibold text-foreground mb-2" {...props} />,
      h2: ({ node, ...props }) => <h2 className="text-lg font-semibold text-foreground mt-3 mb-1" {...props} />,
      h3: ({ node, ...props }) => <h3 className="text-base font-semibold text-foreground mt-2" {...props} />,
      p: ({ node, ...props }) => <p className="leading-7 text-foreground" {...props} />,
      strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
      ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 text-foreground" {...props} />,
      ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1 text-foreground" {...props} />,
      li: ({ node, ...props }) => <li className="text-foreground" {...props} />,
      a: ({ node, ...props }) => <a className="text-primary underline" target="_blank" rel="noreferrer" {...props} />,
      code: ({ node, className, children, ...props }) => (
        <code className="bg-muted px-1 py-0.5 rounded text-foreground" {...props}>{children}</code>
      ),
      pre: ({ node, ...props }) => (
        <pre className="bg-muted border border-border rounded-lg p-3 overflow-x-auto" {...props} />
      ),
      blockquote: ({ node, ...props }) => (
        <blockquote className="border-l-2 border-border pl-3 text-muted-foreground italic" {...props} />
      )
    }}
  >
    {text}
  </ReactMarkdown>
);

interface ChatMessagesProps {
  messages: Message[];
  isThinking: boolean;
  thinkingType?: 'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general' | 'delete';
  onSendMessage: (message: string) => void;
}

const ChatMessages = ({ messages, isThinking, thinkingType, onSendMessage }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 50);
    
    return () => clearTimeout(timer);
  }, [messages, isThinking]);

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-background relative overflow-hidden">
      {
        (messages.length === 0 && !isThinking) ? (
          <div className="flex-1 flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-semibold text-foreground mb-3 animate-fade-in">How can I help you today?</h1>
            <p className="text-muted-foreground">Ask me anything about your files, documents, or any questions you have.</p>
          </div>
        ) : (
          <ScrollArea className="flex-1 w-full h-full">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`group flex items-start ${
                      message.isUser ? "justify-end" : "justify-start"
                    } animate-slide-up opacity-0`}
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <div className={`max-w-[85%] ${message.isUser ? 'flex flex-col items-end' : ''}`}>
                      <div
                        className={`${message.isUser ? '' : 'py-1'} ${message.isUploading ? 'animate-pulse' : ''}`}
                      >
                        {message.isUploading && (
                          <div className="flex items-center gap-2 mb-3">
                            <Upload className="w-4 h-4 text-primary animate-bounce" />
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                            </div>
                            <span className="text-sm text-primary">Uploading...</span>
                          </div>
                        )}
                        
                        <div className={`text-[15px] leading-7 whitespace-pre-wrap ${
                          message.isUser 
                            ? "bg-primary text-primary-foreground rounded-3xl rounded-br-lg px-5 py-4" 
                            : "text-foreground"
                        }`}>
                          {message.isUser ? message.content : <MarkdownContent text={message.content} />}
                        </div>
                        
                        {message.files && message.files.length > 0 && (
                          <div className="mb-4 space-y-2">
                            {message.files.map((file, fileIndex) => (
                              <div key={fileIndex} className="flex items-center gap-2 text-sm bg-muted/50 rounded-xl p-3 border">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium text-foreground">{file.name}</span>
                                <span className="text-xs text-muted-foreground">({file.platform})</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className={`text-xs mt-3 ${
                        message.isUser ? 'text-primary-foreground/60 text-right' : 'text-muted-foreground'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
      
                {isThinking && (
                  <div className="flex animate-fade-in">
                    <div className="py-1 max-w-[85%]">
                      <ThinkingAnimation type={thinkingType} />
                    </div>
                  </div>
                )}
      
                <div ref={messagesEndRef} />
              </div>
            </div>
          </ScrollArea>
        )
      }
    </div>
  );
};

export default ChatMessages;
