import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { FileText, ChevronDown, CheckCircle, Clock, Upload } from 'lucide-react';

const AssetsSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  const assetItems = [
    { name: 'Processed Documents', icon: CheckCircle, path: '/assets?filter=processed' },
    { name: 'Unprocessed Documents', icon: Clock, path: '/assets?filter=unprocessed' },
    { name: 'Upload Files', icon: Upload, path: '/assets?action=upload' }
  ];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm h-auto hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Assets</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="px-1 pb-1">
        <div className="space-y-0.5 mt-1 ml-3">
          {assetItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              onClick={() => window.location.href = item.path}
              className="w-full justify-start text-left py-1.5 px-3 rounded-md text-xs h-auto hover:bg-muted/50"
            >
              <item.icon className="w-3 h-3 mr-2" />
              {item.name}
            </Button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AssetsSection;