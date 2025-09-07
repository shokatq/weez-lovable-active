import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FolderOpen, Plus, ChevronDown, Settings, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const SpacesSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const spaces = [
    { name: 'Marketing', path: '/spaces/marketing' },
    { name: 'Finance', path: '/spaces/finance' },
    { name: 'Backend', path: '/spaces/backend' },
    { name: 'Frontend', path: '/spaces/frontend' },
    { name: 'Operations', path: '/spaces/operations' }
  ];

  const handleSpaceSettings = (spaceName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle space settings
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm h-auto hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            <span>Spaces</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="px-1 pb-1">
        <div className="space-y-0.5 mt-1 ml-3">
          {spaces.map((space) => (
            <div key={space.name} className="group relative flex items-center">
            <Button
              variant="ghost"
              onClick={() => window.location.href = `${space.path}`}
              className="flex-1 justify-start text-left py-1.5 px-3 rounded-md text-xs h-auto hover:bg-muted/50"
            >
                {space.name}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    Mark as unread
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Add to favorites
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Sharing & Permissions
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Add members
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Delete space
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
          
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/spaces/new'}
            className="w-full justify-start text-left py-1.5 px-3 rounded-md text-xs h-auto hover:bg-muted/50 text-muted-foreground"
          >
            <Plus className="w-3 h-3 mr-2" />
            New Space
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SpacesSection;