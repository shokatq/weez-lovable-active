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
  productivity: {
    timeSaved: number;
    efficiencyGain: number;
    tasksCompleted: number;
    automationRate: number;
  };
  team: {
    activeMembers: number;
    departments: number;
    collaborationScore: number;
    satisfactionRate: number;
  };
  ai: {
    queriesProcessed: number;
    documentsAnalyzed: number;
    insightsGenerated: number;
    accuracyRate: number;
  };
  growth: {
    monthlyGrowth: number;
    yearlyProjection: number;
    costSavings: number;
    roiPercentage: number;
  };
}

const AdvancedAnalytics = () => {
  const { userRole } = useUserRole();
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    productivity: {
      timeSaved: 127.5,
      efficiencyGain: 34,
      tasksCompleted: 1247,
      automationRate: 78
    },
    team: {
      activeMembers: 24,
      departments: 6,
      collaborationScore: 89,
      satisfactionRate: 94
    },
    ai: {
      queriesProcessed: 2347,
      documentsAnalyzed: 456,
      insightsGenerated: 89,
      accuracyRate: 96
    },
    growth: {
      monthlyGrowth: 12.5,
      yearlyProjection: 145,
      costSavings: 48750,
      roiPercentage: 340
    }
  });

  const productivityMetrics = [
    {
      title: 'Time Saved',
      value: `${analytics.productivity.timeSaved}h`,
      change: '+12%',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      title: 'Efficiency Gain',
      value: `${analytics.productivity.efficiencyGain}%`,
      change: '+8%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Tasks Completed',
      value: analytics.productivity.tasksCompleted.toLocaleString(),
      change: '+23%',
      icon: CheckCircle,
      color: 'text-purple-600'
    },
    {
      title: 'Automation Rate',
      value: `${analytics.productivity.automationRate}%`,
      change: '+15%',
      icon: Zap,
      color: 'text-orange-600'
    }
  ];

  const teamMetrics = [
    {
      title: 'Active Members',
      value: analytics.team.activeMembers,
      max: 30,
      percentage: (analytics.team.activeMembers / 30) * 100
    },
    {
      title: 'Collaboration Score',
      value: analytics.team.collaborationScore,
      max: 100,
      percentage: analytics.team.collaborationScore
    },
    {
      title: 'Satisfaction Rate',
      value: analytics.team.satisfactionRate,
      max: 100,
      percentage: analytics.team.satisfactionRate
    }
  ];

  const aiInsights = [
    {
      title: 'Document Processing Speed',
      description: 'AI processes documents 89% faster than manual review',
      impact: 'High',
      metric: '89% faster'
    },
    {
      title: 'Query Response Accuracy',
      description: 'AI assistant maintains 96% accuracy across all queries',
      impact: 'High',
      metric: '96% accurate'
    },
    {
      title: 'Workflow Optimization',
      description: 'Automated workflows reduced task completion time by 34%',
      impact: 'Medium',
      metric: '34% reduction'
    },
    {
      title: 'Knowledge Discovery',
      description: 'AI identified 23 new optimization opportunities this month',
      impact: 'Medium',
      metric: '23 opportunities'
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
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
          <TabsTrigger value="growth">Growth & ROI</TabsTrigger>
        </TabsList>

        <TabsContent value="productivity" className="space-y-6">
          {/* Productivity Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {productivityMetrics.map((metric, index) => (
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
                  Weekly Productivity Trends
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
                  Goal Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Monthly Tasks</span>
                      <span>847/1000</span>
                    </div>
                    <Progress value={84.7} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>AI Automation</span>
                      <span>78/80%</span>
                    </div>
                    <Progress value={97.5} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Team Satisfaction</span>
                      <span>94/95%</span>
                    </div>
                    <Progress value={98.9} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          {/* Team Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teamMetrics.map((metric, index) => (
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

          {/* Department Performance */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Department Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Marketing', 'Creative', 'Design', 'Content', 'Social Media', 'Client Services'].map((dept, index) => (
                  <div key={dept} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{dept}</span>
                      <Badge variant="outline">{[8, 6, 4, 5, 3, 3][index]} members</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Productivity</span>
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
          {/* AI Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{analytics.ai.queriesProcessed.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Queries Processed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{analytics.ai.documentsAnalyzed}</p>
                    <p className="text-sm text-muted-foreground">Documents Analyzed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Brain className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{analytics.ai.insightsGenerated}</p>
                    <p className="text-sm text-muted-foreground">Insights Generated</p>
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
                    <p className="text-2xl font-bold text-foreground">{analytics.ai.accuracyRate}%</p>
                    <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI-Generated Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
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
          {/* Growth Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Monthly Growth</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.growth.monthlyGrowth}%</p>
                  <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                    +2.3% from last month
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Yearly Projection</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.growth.yearlyProjection}%</p>
                  <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">
                    On track
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Cost Savings</p>
                  <p className="text-2xl font-bold text-foreground">${analytics.growth.costSavings.toLocaleString()}</p>
                  <Badge className="bg-purple-500/10 text-purple-700 border-purple-500/20">
                    This month
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">ROI</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.growth.roiPercentage}%</p>
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