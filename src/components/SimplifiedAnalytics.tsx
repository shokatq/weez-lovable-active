import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  TrendingUp, 
  FileText,
  CheckCircle,
  FolderOpen,
  Target,
  DollarSign,
  PercentCircle
} from 'lucide-react';

const SimplifiedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Simplified data structure focused on file management
  const analytics = {
    timeMetrics: {
      timeSaved: 127.5,
      efficiencyGain: 34
    },
    fileAnalytics: {
      documentsProcessed: 2456,
      queryAccuracy: 96,
      fileOrganizationIndex: 87,
      duplicateReductionRate: 73
    },
    businessImpact: {
      costSavings: 48750,
      roiPercentage: 340,
      adoptionGrowth: 12.5
    }
  };

  const timeMetrics = [
    {
      title: 'Time Saved',
      value: `${analytics.timeMetrics.timeSaved}h`,
      change: '+12%',
      icon: Clock,
      description: 'Hours saved through automation'
    },
    {
      title: 'Efficiency Gained',
      value: `${analytics.timeMetrics.efficiencyGain}%`,
      change: '+8%',
      icon: TrendingUp,
      description: 'Overall efficiency improvement'
    }
  ];

  const fileMetrics = [
    {
      title: 'Documents Processed',
      value: analytics.fileAnalytics.documentsProcessed,
      icon: FileText,
      description: 'Files analyzed and indexed'
    },
    {
      title: 'Query Accuracy',
      value: `${analytics.fileAnalytics.queryAccuracy}%`,
      icon: CheckCircle,
      description: 'Accuracy of search results'
    },
    {
      title: 'File Organization',
      value: `${analytics.fileAnalytics.fileOrganizationIndex}%`,
      icon: FolderOpen,
      description: 'Files properly categorized'
    },
    {
      title: 'Duplicate Reduction',
      value: `${analytics.fileAnalytics.duplicateReductionRate}%`,
      icon: Target,
      description: 'Duplicates identified & removed'
    }
  ];

  const businessMetrics = [
    {
      title: 'Cost Savings',
      value: `$${analytics.businessImpact.costSavings.toLocaleString()}`,
      icon: DollarSign,
      description: 'Monthly cost reduction'
    },
    {
      title: 'ROI',
      value: `${analytics.businessImpact.roiPercentage}%`,
      icon: PercentCircle,
      description: 'Return on investment'
    },
    {
      title: 'Adoption Growth',
      value: `${analytics.businessImpact.adoptionGrowth}%`,
      icon: TrendingUp,
      description: 'User adoption increase'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
          <p className="text-muted-foreground">File management & productivity insights</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded-md text-foreground"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 3 months</option>
        </select>
      </div>

      <Tabs defaultValue="time" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="time">Time & Efficiency</TabsTrigger>
          <TabsTrigger value="files">File Analytics</TabsTrigger>
          <TabsTrigger value="business">Business Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="time" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {timeMetrics.map((metric, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <metric.icon className="w-8 h-8 text-primary" />
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                      <div className="text-sm text-green-600 font-medium">{metric.change}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{metric.title}</h3>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fileMetrics.map((metric, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <metric.icon className="w-5 h-5 text-primary" />
                    <div className="text-lg font-bold text-foreground">{metric.value}</div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{metric.title}</h4>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businessMetrics.map((metric, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <metric.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{metric.title}</h3>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimplifiedAnalytics;