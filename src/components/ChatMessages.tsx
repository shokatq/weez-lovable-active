
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
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary text-primary-foreground">
                        AI
                      </div>
                    )}

                    <div className={`max-w-[90%] md:max-w-[75%] ${message.isUser ? 'flex flex-col items-end' : ''}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl transition-all duration-200 ${
                          message.isUser
                            ? "bg-primary text-primary-foreground ml-12"
                            : "bg-card border border-border text-foreground hover:bg-card/90"
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
                        
                        <div className="text-[15px] leading-6 whitespace-pre-wrap text-foreground">
                          <MarkdownContent text={message.content} />
                        </div>
                        
                        {message.files && message.files.length > 0 && (
                          <div className="mt-3 space-y-2 border-t border-border pt-3">
                            {message.files.map((file) => (
                              <div key={file.id} className="bg-muted rounded-lg p-3 flex items-center gap-3 border border-border hover:bg-muted/80 transition-colors duration-200">
                                <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                  <p className="font-medium text-foreground text-sm truncate">{file.name}</p>
                                  <span className="text-xs text-muted-foreground">{file.platform} • {file.size}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className={`text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                        message.isUser ? 'text-right' : 'text-left'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {message.isUser && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-foreground">
                        <User className="w-4 h-4 text-background" />
                      </div>
                    )}
                  </div>
                ))}
      
                {isThinking && (
                  <div className="flex gap-4 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-sm">
                      AI
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3 max-w-[85%] md:max-w-[70%]">
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
