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
      
      <CollapsibleContent className="px-2 pb-2">
        <div className="space-y-3 mt-2">
          <div className="text-xs text-muted-foreground px-2">
            Last updated: {currentTime}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {updates.slice(0, 4).map((update, index) => (
              <Card key={index} className="bg-card/50 border-border">
                <CardContent className="p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <update.icon className={`w-3 h-3 ${update.color}`} />
                    <div className="text-sm font-bold text-foreground">{update.value}</div>
                  </div>
                  <div className="text-xs font-medium text-foreground mb-1">{update.label}</div>
                  {update.change > 0 && (
                    <Badge variant="outline" className="text-xs px-1 py-0 h-3 bg-green-500/10 text-green-600 border-green-500/20">
                      <ArrowUp className="w-2 h-2 mr-0.5" />
                      {update.change}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Summary */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-foreground mb-1">Today's Summary</h4>
                  <p className="text-xs text-muted-foreground">
                    {updates[0]?.value} files, {updates[5]?.value}% efficiency
                  </p>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-semibold">+{updates.reduce((acc, curr) => acc + curr.change, 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DailyUpdatesSection;