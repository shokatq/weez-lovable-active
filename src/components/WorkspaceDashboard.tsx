
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileText, TrendingUp, Activity, Plus, Shield, UserMinus, Crown } from "lucide-react";
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
      color: "#3b82f6",
    },
  };

  const pieChartData = workspace.stats.filesByPlatform.map((platform, index) => ({
    name: platform.platform,
    value: platform.totalFiles,
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

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{workspace.name}</h1>
            <p className="text-gray-400 mt-2">Enterprise Workspace Dashboard</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveTab('dashboard')}
              className="bg-white text-black hover:bg-gray-200"
            >
              <Activity className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'employees' ? 'default' : 'outline'}
              onClick={() => setActiveTab('employees')}
              className="bg-white text-black hover:bg-gray-200"
            >
              <Users className="w-4 h-4 mr-2" />
              Employees
            </Button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Employees</CardTitle>
                  <Users className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{workspace.stats.totalEmployees}</div>
                  <p className="text-xs text-gray-400">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Files</CardTitle>
                  <FileText className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{workspace.stats.totalFiles.toLocaleString()}</div>
                  <p className="text-xs text-gray-400">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Active Platforms</CardTitle>
                  <TrendingUp className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{workspace.stats.filesByPlatform.length}</div>
                  <p className="text-xs text-gray-400">
                    All platforms connected
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Avg Files/Employee</CardTitle>
                  <Activity className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {Math.round(workspace.stats.totalFiles / workspace.stats.totalEmployees)}
                  </div>
                  <p className="text-xs text-gray-400">
                    +8% efficiency
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Files by Platform</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={workspace.stats.filesByPlatform}>
                        <XAxis dataKey="platform" className="text-gray-400" />
                        <YAxis className="text-gray-400" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="totalFiles" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Platform Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* File Types and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">File Types Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fileTypeData.map((fileType) => (
                      <div key={fileType.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-300">{fileType.type}</span>
                        </div>
                        <div className="text-white font-medium">{fileType.count.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workspace.stats.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-gray-300 text-sm">
                            <span className="text-white font-medium">{activity.user}</span> {activity.action}
                            {activity.file && <span className="text-blue-400"> {activity.file}</span>}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {activity.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
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
