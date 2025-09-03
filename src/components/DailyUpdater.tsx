import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  FolderOpen,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowUp
} from 'lucide-react';

interface DailyUpdate {
  label: string;
  value: number;
  change: number;
  icon: React.ElementType;
  color: string;
  description: string;
}

const DailyUpdater = () => {
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
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Daily Update</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {currentTime}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {updates.map((update, index) => (
          <Card key={index} className="bg-card/50 border-border hover:bg-card transition-colors">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <update.icon className={`w-4 h-4 ${update.color}`} />
                <div className="text-lg font-bold text-foreground">{update.value}</div>
              </div>
              <div className="text-xs font-medium text-foreground mb-1">{update.label}</div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">{update.description}</div>
                {update.change > 0 && (
                  <Badge variant="outline" className="text-xs px-1 py-0 h-4 bg-green-500/10 text-green-600 border-green-500/20">
                    <ArrowUp className="w-2 h-2 mr-0.5" />
                    {update.change}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground mb-1">Today's Summary</h4>
              <p className="text-sm text-muted-foreground">
                Your team processed {updates[0]?.value} files and gained {updates[5]?.value}% efficiency
              </p>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">+{updates.reduce((acc, curr) => acc + curr.change, 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyUpdater;