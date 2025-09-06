import { Button } from '@/components/ui/button';
import { FolderOpen, Plus } from 'lucide-react';

const SpacesSection = () => {
  const spaces = [
    { name: 'All Tasks', path: '/spaces/all-tasks' },
    { name: 'Research And Development', path: '/spaces/research' },
    { name: 'Front-end of Weez AI', path: '/spaces/frontend' },
    { name: 'Marketing Campaigns', path: '/spaces/marketing' },
    { name: 'Customer Support', path: '/spaces/support' }
  ];

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 py-1.5 px-3 text-xs font-medium text-muted-foreground">
        <FolderOpen className="w-3 h-3" />
        <span>Spaces</span>
      </div>
      
      <div className="space-y-0.5">
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
      </div>
    </div>
  );
};

export default SpacesSection;