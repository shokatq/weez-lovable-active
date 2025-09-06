import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  FolderOpen,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowUp,
  ChevronDown
} from 'lucide-react';

interface DailyUpdate {
  label: string;
  value: number;
  change: number;
  icon: React.ElementType;
  color: string;
  description: string;
}

const DailyUpdatesSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [updates, setUpdates] = useState<DailyUpdate[]>([
    {
      label: 'Files Processed',
      value: 47,
      change: 12,
      icon: FileText,
      color: 'text-blue-600',
      description: 'Documents analyzed today'
    },
    {
      label: 'New Clients',
      value: 3,
      change: 1,
      icon: Users,
      color: 'text-green-600',
      description: 'Clients added to workspace'
    },
    {
      label: 'AI Queries',
      value: 234,
      change: 45,
      icon: MessageSquare,
      color: 'text-purple-600',
      description: 'Questions answered by AI'
    },
    {
      label: 'Spaces Created',
      value: 2,
      change: 2,
      icon: FolderOpen,
      color: 'text-orange-600',
      description: 'New collaborative spaces'
    },
    {
      label: 'Files Organized',
      value: 89,
      change: 23,
      icon: CheckCircle,
      color: 'text-emerald-600',
      description: 'Files auto-categorized'
    },
    {
      label: 'Efficiency Gain',
      value: 18,
      change: 3,
      icon: TrendingUp,
      color: 'text-indigo-600',
      description: 'Percentage improvement'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdates(prev => prev.map(update => ({
        ...update,
        value: update.value + Math.floor(Math.random() * 3),
        change: update.change + Math.floor(Math.random() * 2)
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between w-full py-2.5 px-4 rounded-lg text-sm h-auto hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Daily Updates</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="px-1 pb-1">
        <div className="space-y-1 mt-1">
          {updates.slice(0, 6).map((update, index) => (
            <div key={index} className="flex items-center justify-between py-1.5 px-2 hover:bg-muted/30 rounded-md transition-colors">
              <div className="flex items-center gap-2">
                <update.icon className={`w-3 h-3 ${update.color}`} />
                <span className="text-xs text-foreground">{update.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">{update.value}</span>
                {update.change > 0 && (
                  <span className="text-xs font-medium text-green-600">
                    +{update.change}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DailyUpdatesSection;