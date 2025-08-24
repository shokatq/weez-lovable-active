
import { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import ThinkingAnimation from "./ThinkingAnimation";
import SuggestionBubbles from "./SuggestionBubbles";
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

  const suggestions = [
    "🔎 Search files across the workspace",
    "💬 Find conversations in Slack channels",
    "📊 Show me reports from Google Drive",
    "🎨 Locate assets from Dropbox",
    "📝 Find documents in OneDrive",
    "💰 Search financial data across platforms",
    "🔍 Help me find specific files",
    "📋 Summarize my uploaded documents"
  ];

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-background relative overflow-hidden">
      {
        (messages.length === 0 && !isThinking) ? (
          <div className="flex-1 flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-semibold text-foreground mb-3 animate-fade-in">How can I help you today?</h1>
            
            <div className="w-full max-w-3xl mt-8">
              <SuggestionBubbles suggestions={suggestions} onSendMessage={onSendMessage} />
            </div>
          </div>
        ) : (
          <ScrollArea className="flex-1 w-full h-full">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`group flex gap-4 items-start ${
                      message.isUser ? "justify-end" : "justify-start"
                    } animate-slide-up opacity-0`}
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    {!message.isUser && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 mt-1 border border-primary/20">
                        <img 
                          src="/lovable-uploads/92fd1f43-ec1e-4562-9a19-fd70618ad920.png" 
                          alt="Weez AI" 
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                    )}

                    <div className={`max-w-[85%] ${message.isUser ? 'flex flex-col items-end' : ''}`}>
                      <div
                        className={`px-5 py-4 transition-all duration-200 ${
                          message.isUser
                            ? "bg-primary text-primary-foreground rounded-3xl rounded-br-lg"
                            : "bg-background border border-border rounded-3xl rounded-bl-lg shadow-sm"
                        } ${message.isUploading ? 'animate-pulse' : ''}`}
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
                        
                        <div className="text-[15px] leading-7 whitespace-pre-wrap">
                          <MarkdownContent text={message.content} />
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

                    {message.isUser && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 mt-1 text-primary-foreground">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                ))}
      
                {isThinking && (
                  <div className="flex gap-4 animate-fade-in">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 mt-1 border border-primary/20">
                      <img 
                        src="/lovable-uploads/92fd1f43-ec1e-4562-9a19-fd70618ad920.png" 
                        alt="Weez AI" 
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div className="bg-background border border-border rounded-3xl rounded-bl-lg shadow-sm px-5 py-4 max-w-[85%]">
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
