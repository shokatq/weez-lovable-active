import React, { useState } from 'react';
import { Send, Sparkles, FileText, Code, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface SpaceAIPromptProps {
  spaceId: string;
  onAIOperation?: (operation: string, prompt: string) => void;
}

export const SpaceAIPrompt: React.FC<SpaceAIPromptProps> = ({
  spaceId,
  onAIOperation
}) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);
    try {
      // Here you would implement AI operations
      // For now, we'll just show a toast
      toast({
        title: "AI Operation Started",
        description: `Processing: "${prompt}"`,
      });

      if (onAIOperation) {
        onAIOperation('general', prompt);
      }

      setPrompt('');
    } catch (error) {
      console.error('Error processing AI operation:', error);
      toast({
        title: "Error",
        description: "Failed to process AI operation",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const quickActions = [
    { icon: FileText, label: 'Summarize files', prompt: 'Summarize all the files in this space' },
    { icon: Search, label: 'Find documents', prompt: 'Find documents related to' },
    { icon: Code, label: 'Extract data', prompt: 'Extract key data from uploaded documents' },
  ];

  return (
    <Card className="border-t bg-background p-4">
      <div className="space-y-3">
        {/* Quick Actions */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Assistant
          </Badge>
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => setPrompt(action.prompt)}
            >
              <action.icon className="h-3 w-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AI to help with files, summarize documents, extract data..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="pr-12"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={!prompt.trim() || isProcessing}
            size="sm"
          >
            {isProcessing ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          AI can help you organize files, extract information, and manage documents in this space.
        </p>
      </div>
    </Card>
  );
};