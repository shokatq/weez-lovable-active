import React, { useState } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface FloatingWeezAssistantProps {
  spaceId: string;
}

export const FloatingWeezAssistant: React.FC<FloatingWeezAssistantProps> = ({
  spaceId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!prompt.trim() || isProcessing) return;

    const userMessage = prompt.trim();
    setPrompt('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsProcessing(true);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const responses = [
        "I'm analyzing the documents in your space. Let me help you with that.",
        "I can see the files you've uploaded. Here's what I found relevant to your query.",
        "Based on the documents in this space, I can provide you with the following insights.",
        "I've processed your request and found some interesting patterns in your documents."
      ];
      
      const aiResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);

      toast({
        title: "Weez has responded",
        description: "Your AI assistant has analyzed your request",
      });

    } catch (error) {
      console.error('Error processing AI request:', error);
      toast({
        title: "Error",
        description: "Failed to process your request",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setMessages([]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={toggleAssistant}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          size="lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-2xl border-0 bg-background/95 backdrop-blur-md">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Ask Weez for Help</h3>
                    <p className="text-xs opacity-90">AI Document Assistant</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAssistant}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-6">
                    <Bot className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Hi! I'm Weez, your AI assistant. I can help you analyze documents, extract information, and answer questions about your files.
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] p-2 rounded-lg text-sm ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))
                )}

                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full"></div>
                        <span className="text-xs text-muted-foreground">Weez is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            {!isProcessing && (
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask about your documents..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={!prompt.trim()}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </>
  );
};