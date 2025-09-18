import React from 'react';
import { MessageCircle, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SpaceSidebarProps {
  activeSection: 'chat' | 'documents';
  onSectionChange: (section: 'chat' | 'documents') => void;
  chatExpanded: boolean;
  documentsExpanded: boolean;
  onToggleChat: () => void;
  onToggleDocuments: () => void;
  spaceName: string;
}

export const SpaceSidebar: React.FC<SpaceSidebarProps> = ({
  activeSection,
  onSectionChange,
  chatExpanded,
  documentsExpanded,
  onToggleChat,
  onToggleDocuments,
  spaceName
}) => {
  return (
    <Card className="w-64 h-full p-3 border-r bg-muted/20">
      <div className="space-y-2">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground truncate">{spaceName}</h2>
          <p className="text-sm text-muted-foreground">Workspace</p>
        </div>

        {/* Chat Section */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between p-2 h-auto",
              activeSection === 'chat' && chatExpanded && "bg-muted"
            )}
            onClick={onToggleChat}
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Chat</span>
            </div>
            {chatExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          
          {chatExpanded && (
            <div className="ml-6 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start text-sm",
                  activeSection === 'chat' && "bg-accent text-accent-foreground"
                )}
                onClick={() => onSectionChange('chat')}
              >
                # General
              </Button>
            </div>
          )}
        </div>

        {/* Documents Section */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between p-2 h-auto",
              activeSection === 'documents' && documentsExpanded && "bg-muted"
            )}
            onClick={onToggleDocuments}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">Documents</span>
            </div>
            {documentsExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          
          {documentsExpanded && (
            <div className="ml-6 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start text-sm",
                  activeSection === 'documents' && "bg-accent text-accent-foreground"
                )}
                onClick={() => onSectionChange('documents')}
              >
                📁 All Files
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};