
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
      color: "#374151",
    },
  };

  const pieChartData = workspace.stats.filesByPlatform.map((platform, index) => ({
    name: platform.platform,
    value: platform.totalFiles,
    fill: ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB'][index % 5],
    color: ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB'][index % 5]
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
    { label: 'Total Employees', value: workspace.stats.totalEmployees, icon: Users, color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', change: '+2 from last month' },
    { label: 'Total Files', value: workspace.stats.totalFiles.toLocaleString(), icon: FileText, color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', change: '+12% from last month' },
    { label: 'Active Platforms', value: workspace.stats.filesByPlatform.length, icon: TrendingUp, color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', change: 'All platforms connected' },
    { label: 'Avg Files/Employee', value: Math.round(workspace.stats.totalFiles / workspace.stats.totalEmployees), icon: Activity, color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', change: '+8% efficiency' }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              {workspace.name}
            </h1>
            <p className="text-gray-600 text-xl font-medium">Your command center for analytics and team management.</p>
          </div>
        </div>

        <div className="flex gap-2 mb-10 bg-gray-50 p-2 rounded-xl border border-gray-200">
          <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'dashboard'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
          >
              <Activity className="w-4 h-4" />
              Dashboard
          </button>
          <button
              onClick={() => setActiveTab('employees')}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'employees'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
          >
              <Users className="w-4 h-4" />
              Employees
          </button>
        </div>
        
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {quickStats.map((stat, index) => (
                  <Card key={index} className={`${stat.bg} ${stat.border} border hover:shadow-md transition-all duration-200 hover:transform hover:scale-[1.02]`}>
                      <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                              <div>
                                  <p className="text-gray-600 text-sm font-medium mb-2 uppercase tracking-wide">{stat.label}</p>
                                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                              </div>
                              <div className={`w-12 h-12 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center`}>
                                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                              </div>
                          </div>
                      </CardContent>
                  </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-6">
                  <CardTitle className="text-gray-900 font-bold text-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                          <BarChart2 className="w-5 h-5 text-gray-700" />
                      </div>
                      Files by Platform
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                      Distribution of files across connected services.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={workspace.stats.filesByPlatform} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="platform" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <ChartTooltip cursor={{fill: 'rgba(55, 65, 81, 0.1)'}} content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="totalFiles" fill="var(--color-files)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-6">
                  <CardTitle className="text-gray-900 font-bold text-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                          <PieChartIcon className="w-5 h-5 text-gray-700" />
                      </div>
                      Platform Distribution
                  </CardTitle>
                  <CardDescription className="text-gray-600">
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
                        <ChartTooltip cursor={{fill: 'rgba(55, 65, 81, 0.1)'}} content={<ChartTooltipContent indicator="dot" />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* File Types and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-6">
                  <CardTitle className="text-gray-900 font-bold text-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                          <FileText className="w-5 h-5 text-gray-700" />
                      </div>
                      File Types Distribution
                  </CardTitle>
                   <CardDescription className="text-gray-600">
                      Breakdown of file types across all platforms.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {fileTypeData.map((fileType) => (
                    <div key={fileType.type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <span className="text-gray-700 font-medium">{fileType.type.toUpperCase()}</span>
                      </div>
                      <div className="text-gray-900 font-bold">{fileType.count.toLocaleString()}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-6">
                   <CardTitle className="text-gray-900 font-bold text-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                          <History className="w-5 h-5 text-gray-700" />
                      </div>
                      Recent Activity
                  </CardTitle>
                   <CardDescription className="text-gray-600">
                      Latest activities in the workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {workspace.stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                      <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                      <div className="flex-1">
                        <p className="text-gray-900 text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                          {activity.file && <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700 border border-gray-200">{activity.file}</Badge>}
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
