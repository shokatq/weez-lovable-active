import TeamChatInterface from '@/components/TeamChatInterface';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TeamChat = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.location.href = '/workspace'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Workspace</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TeamChatInterface />
      </div>
    </div>
  );
};

export default TeamChat;