import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileText, TrendingUp, Activity, BarChart2, PieChart as PieChartIcon, History } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { demoWorkspace } from "@/data/workspaceData";
import { Employee } from "@/types/workspace";
import EmployeeManagement from "./EmployeeManagement";

const WorkspaceDashboard = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees'>('dashboard');
  const [workspace, setWorkspace] = useState(demoWorkspace);

  const chartConfig = {
    files: {
      label: "Files",
      color: "hsl(221.2 83.2% 53.3%)",
    },
  };

  const pieChartData = workspace.stats.filesByPlatform.map((platform, index) => ({
    name: platform.platform,
    value: platform.totalFiles,
    fill: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5],
    color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
  }));

  const fileTypeData = workspace.stats.filesByPlatform.flatMap(platform =>
    Object.entries(platform.fileTypes).map(([type, count]) => ({
      type,
      count,
      platform: platform.platform
    }))
  ).reduce((acc, curr) => {
    const existing = acc.find(item => item.type === curr.type);
    if (existing) {
      existing.count += curr.count;
    } else {
      acc.push({ type: curr.type, count: curr.count });
    }
    return acc;
  }, [] as { type: string; count: number }[]);

  const handleEmployeeUpdate = (updatedEmployees: Employee[]) => {
    setWorkspace(prev => ({
      ...prev,
      employees: updatedEmployees,
      stats: {
        ...prev.stats,
        totalEmployees: updatedEmployees.length
      }
    }));
  };

  const quickStats = [
    { label: 'Total Employees', value: workspace.stats.totalEmployees, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', change: '+2 from last month' },
    { label: 'Total Files', value: workspace.stats.totalFiles.toLocaleString(), icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', change: '+12% from last month' },
    { label: 'Active Platforms', value: workspace.stats.filesByPlatform.length, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', change: 'All platforms connected' },
    { label: 'Avg Files/Employee', value: Math.round(workspace.stats.totalFiles / workspace.stats.totalEmployees), icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', change: '+8% efficiency' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-gray-300 bg-clip-text text-transparent mb-3">
              {workspace.name}
            </h1>
            <p className="text-gray-400 text-xl font-medium">Your command center for analytics and team management.</p>
          </div>
        </div>

        <div className="flex gap-3 mb-10 bg-gray-900/30 p-3 rounded-2xl backdrop-blur-md border border-gray-800/50 shadow-xl">
          <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
          >
              <Activity className="w-5 h-5" />
              Dashboard
          </button>
          <button
              onClick={() => setActiveTab('employees')}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'employees'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
          >
              <Users className="w-5 h-5" />
              Employees
          </button>
        </div>
        
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {quickStats.map((stat, index) => (
                  <Card key={index} className={`bg-gray-900/40 ${stat.border} border backdrop-blur-md hover:bg-gray-800/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl shadow-lg`}>
                      <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                              <div>
                                  <p className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">{stat.label}</p>
                                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                                  <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                              </div>
                              <div className={`w-14 h-14 rounded-2xl ${stat.bg} border ${stat.border} flex items-center justify-center`}>
                                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                              </div>
                          </div>
                      </CardContent>
                  </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-md shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-white font-bold text-2xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <BarChart2 className="w-6 h-6 text-white" />
                      </div>
                      Files by Platform
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-lg">
                      Distribution of files across connected services.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={workspace.stats.filesByPlatform} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="platform" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <ChartTooltip cursor={{fill: 'rgba(120, 119, 198, 0.1)'}} content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="totalFiles" fill="var(--color-files)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-md shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-white font-bold text-2xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                          <PieChartIcon className="w-6 h-6 text-white" />
                      </div>
                      Platform Distribution
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-lg">
                      Percentage of files from each platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false}>
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip cursor={{fill: 'rgba(120, 119, 198, 0.1)'}} content={<ChartTooltipContent indicator="dot" />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* File Types and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-md shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-white font-bold text-2xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                      </div>
                      File Types Distribution
                  </CardTitle>
                   <CardDescription className="text-gray-400 text-lg">
                      Breakdown of file types across all platforms.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {fileTypeData.map((fileType) => (
                    <div key={fileType.type} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                        <span className="text-gray-300 font-medium">{fileType.type.toUpperCase()}</span>
                      </div>
                      <div className="text-white font-bold">{fileType.count.toLocaleString()}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-md shadow-xl">
                <CardHeader className="pb-6">
                   <CardTitle className="text-white font-bold text-2xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                          <History className="w-6 h-6 text-white" />
                      </div>
                      Recent Activity
                  </CardTitle>
                   <CardDescription className="text-gray-400 text-lg">
                      Latest activities in the workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {workspace.stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse shadow-lg shadow-blue-400/50"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          <span className="font-bold">{activity.user}</span> {activity.action}
                          {activity.file && <Badge variant="secondary" className="ml-2 bg-blue-500/10 text-blue-400 border border-blue-500/20">{activity.file}</Badge>}
                        </p>
                      </div>
                      <span className="text-gray-500 text-sm font-medium">
                        {activity.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'employees' && (
          <EmployeeManagement 
            employees={workspace.employees} 
            onEmployeesUpdate={handleEmployeeUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default WorkspaceDashboard;
