import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  BarChart3, 
  PieChart, 
  Activity,
  Zap,
  Brain,
  FileText,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

interface AnalyticsData {
  timeMetrics: {
    timeSaved: number;
    efficiencyGain: number;
    workflowOptimization: number;
    documentProcessingSpeed: number;
  };
  fileAnalytics: {
    documentsProcessed: number;
    queriesProcessed: number;
    queryAccuracy: number;
    fileOrganizationIndex: number;
    duplicateReductionRate: number;
  };
  collaboration: {
    activeMembers: number;
    automationRate: number;
    fileSharingEfficiency: number;
    collaborationScore: number;
  };
  businessImpact: {
    costSavings: number;
    roiPercentage: number;
    adoptionGrowth: number;
  };
}

const AdvancedAnalytics = () => {
  const { userRole } = useUserRole();
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    timeMetrics: {
      timeSaved: 127.5,
      efficiencyGain: 34,
      workflowOptimization: 28,
      documentProcessingSpeed: 89
    },
    fileAnalytics: {
      documentsProcessed: 2456,
      queriesProcessed: 2347,
      queryAccuracy: 96,
      fileOrganizationIndex: 87,
      duplicateReductionRate: 73
    },
    collaboration: {
      activeMembers: 24,
      automationRate: 78,
      fileSharingEfficiency: 92,
      collaborationScore: 89
    },
    businessImpact: {
      costSavings: 48750,
      roiPercentage: 340,
      adoptionGrowth: 12.5
    }
  });

  const timeMetrics = [
    {
      title: 'Time Saved',
      value: `${analytics.timeMetrics.timeSaved}h`,
      change: '+12%',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      title: 'Efficiency Gain',
      value: `${analytics.timeMetrics.efficiencyGain}%`,
      change: '+8%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Workflow Optimization',
      value: `${analytics.timeMetrics.workflowOptimization}%`,
      change: '+15%',
      icon: Zap,
      color: 'text-purple-600'
    },
    {
      title: 'Document Processing Speed',
      value: `${analytics.timeMetrics.documentProcessingSpeed}%`,
      change: '+23%',
      icon: FileText,
      color: 'text-orange-600'
    }
  ];

  const fileMetrics = [
    {
      title: 'Documents Processed',
      value: analytics.fileAnalytics.documentsProcessed,
      max: 3000,
      percentage: (analytics.fileAnalytics.documentsProcessed / 3000) * 100
    },
    {
      title: 'Query Accuracy',
      value: analytics.fileAnalytics.queryAccuracy,
      max: 100,
      percentage: analytics.fileAnalytics.queryAccuracy
    },
    {
      title: 'File Organization Index',
      value: analytics.fileAnalytics.fileOrganizationIndex,
      max: 100,
      percentage: analytics.fileAnalytics.fileOrganizationIndex
    },
    {
      title: 'Duplicate Reduction Rate',
      value: analytics.fileAnalytics.duplicateReductionRate,
      max: 100,
      percentage: analytics.fileAnalytics.duplicateReductionRate
    }
  ];

  const collaborationInsights = [
    {
      title: 'File Sharing Efficiency',
      description: 'Average time to share and access files reduced by 92%',
      impact: 'High',
      metric: '92% faster'
    },
    {
      title: 'Auto-Tagging Accuracy',
      description: 'AI automatically tags files with 94% accuracy rate',
      impact: 'High',
      metric: '94% accurate'
    },
    {
      title: 'Automation Rate',
      description: '78% of file-related tasks are now automated',
      impact: 'Medium',
      metric: '78% automated'
    },
    {
      title: 'Active User Engagement',
      description: '24 members actively using file search and organization features',
      impact: 'Medium',
      metric: '24 active users'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'Low': return 'bg-green-500/10 text-green-700 border-green-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Advanced Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights into your workspace performance</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-md text-foreground"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="productivity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="productivity">Time & Efficiency</TabsTrigger>
          <TabsTrigger value="team">File Analytics</TabsTrigger>
          <TabsTrigger value="ai">Collaboration</TabsTrigger>
          <TabsTrigger value="growth">Business Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="productivity" className="space-y-6">
          {/* Time & Efficiency Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {timeMetrics.map((metric, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                      <Badge variant="outline" className="text-green-600 border-green-600/20 bg-green-600/10">
                        {metric.change}
                      </Badge>
                    </div>
                    <metric.icon className={`w-8 h-8 ${metric.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  File Processing Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{day}</span>
                      <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                        <Progress value={[85, 92, 78, 89, 94][index]} className="flex-1" />
                        <span className="text-sm font-medium">{[85, 92, 78, 89, 94][index]}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  File Management Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Monthly Documents</span>
                      <span>2456/3000</span>
                    </div>
                    <Progress value={81.9} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>File Organization</span>
                      <span>87/90%</span>
                    </div>
                    <Progress value={96.7} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Query Accuracy</span>
                      <span>96/98%</span>
                    </div>
                    <Progress value={97.9} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          {/* File Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fileMetrics.map((metric, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{metric.title}</span>
                      <span className="text-lg font-bold text-foreground">{metric.value}</span>
                    </div>
                    <Progress value={metric.percentage} />
                    <div className="text-xs text-muted-foreground">
                      {metric.value} of {metric.max} ({metric.percentage.toFixed(1)}%)
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* File Type Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                File Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Documents', 'Images', 'Videos', 'Spreadsheets', 'Presentations', 'PDFs'].map((type, index) => (
                  <div key={type} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{type}</span>
                      <Badge variant="outline">{[456, 234, 89, 123, 67, 345][index]} files</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Processing Rate</span>
                        <span className="font-medium">{[94, 87, 91, 89, 92, 85][index]}%</span>
                      </div>
                      <Progress value={[94, 87, 91, 89, 92, 85][index]} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          {/* Collaboration Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{analytics.collaboration.activeMembers}</p>
                    <p className="text-sm text-muted-foreground">Active Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{analytics.collaboration.automationRate}%</p>
                    <p className="text-sm text-muted-foreground">Automation Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{analytics.collaboration.fileSharingEfficiency}%</p>
                    <p className="text-sm text-muted-foreground">File Sharing Efficiency</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Target className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{analytics.collaboration.collaborationScore}%</p>
                    <p className="text-sm text-muted-foreground">Collaboration Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Collaboration Insights */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Collaboration Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collaborationInsights.map((insight, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground">{insight.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact} Impact
                        </Badge>
                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10">
                          {insight.metric}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          {/* Business Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Cost Savings</p>
                  <p className="text-2xl font-bold text-foreground">${analytics.businessImpact.costSavings.toLocaleString()}</p>
                  <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                    This month
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">ROI</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.businessImpact.roiPercentage}%</p>
                  <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">
                    File productivity
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Adoption Growth</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.businessImpact.adoptionGrowth}%</p>
                  <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                    Excellent
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;