import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { SpaceSidebar } from '@/components/space/SpaceSidebar';
import { SpaceChatInterface } from '@/components/space/SpaceChatInterface';
import { SpaceDocumentManager } from '@/components/space/SpaceDocumentManager';
import { SpaceAIPrompt } from '@/components/space/SpaceAIPrompt';
import { useSpaceData } from '@/hooks/useSpaceData';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function SpacePage() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const [activeSection, setActiveSection] = useState<'chat' | 'documents'>('chat');
  const [chatExpanded, setChatExpanded] = useState(true);
  const [documentsExpanded, setDocumentsExpanded] = useState(false);
  
  const { space, members, userRole, loading, error } = useSpaceData(spaceId);

  const handleSectionChange = (section: 'chat' | 'documents') => {
    setActiveSection(section);
    if (section === 'chat') {
      setChatExpanded(true);
      setDocumentsExpanded(false);
    } else {
      setDocumentsExpanded(true);
      setChatExpanded(false);
    }
  };

  const handleToggleChat = () => {
    setChatExpanded(!chatExpanded);
    if (!chatExpanded) {
      setActiveSection('chat');
      setDocumentsExpanded(false);
    }
  };

  const handleToggleDocuments = () => {
    setDocumentsExpanded(!documentsExpanded);
    if (!documentsExpanded) {
      setActiveSection('documents');
      setChatExpanded(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading space...</span>
        </div>
      </div>
    );
  }

  if (error || !space || !spaceId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Space Not Found</h2>
          <p className="text-muted-foreground">
            {error || 'The space you are looking for does not exist or you do not have access to it.'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <SpaceSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        chatExpanded={chatExpanded}
        documentsExpanded={documentsExpanded}
        onToggleChat={handleToggleChat}
        onToggleDocuments={handleToggleDocuments}
        spaceName={space.name}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          {activeSection === 'chat' ? (
            <SpaceChatInterface
              spaceId={spaceId}
              members={members}
            />
          ) : (
            <SpaceDocumentManager
              spaceId={spaceId}
              userRole={userRole}
            />
          )}
        </div>
        
        {/* AI Prompt Bar */}
        <SpaceAIPrompt
          spaceId={spaceId}
        />
      </div>
    </div>
  );
}



