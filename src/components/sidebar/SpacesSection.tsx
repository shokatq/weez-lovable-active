import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FolderOpen, Plus, ChevronDown } from 'lucide-react';

const SpacesSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const spaces = [
    { name: 'Marketing', path: '/spaces/marketing' },
    { name: 'Finance', path: '/spaces/finance' },
    { name: 'Backend', path: '/spaces/backend' },
    { name: 'Frontend', path: '/spaces/frontend' },
    { name: 'Operations', path: '/spaces/operations' }
  ];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between py-1.5 px-3 text-xs font-medium text-muted-foreground hover:bg-muted/50 h-auto"
        >
          <div className="flex items-center gap-2">
            <FolderOpen className="w-3 h-3" />
            <span>Spaces</span>
          </div>
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-0.5">
        {spaces.map((space) => (
          <Button
            key={space.name}
            variant="ghost"
            onClick={() => window.location.href = space.path}
            className="w-full justify-start text-left py-1.5 px-6 rounded-md text-xs h-auto hover:bg-muted/50 font-normal"
          >
            {space.name}
          </Button>
        ))}
        
        <Button
          variant="ghost"
          onClick={() => window.location.href = '/spaces/new'}
          className="w-full justify-start text-left py-1.5 px-6 rounded-md text-xs h-auto hover:bg-muted/50 font-normal text-muted-foreground"
        >
          <Plus className="w-3 h-3 mr-2" />
          New Space
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SpacesSection;