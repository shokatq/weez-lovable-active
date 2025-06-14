
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, TrendingUp, Settings, Plus, Search, Filter, ArrowRight, Zap, Target, Globe } from "lucide-react";
import { demoWorkspace } from "@/data/workspaceData";

const WorkspaceInterface = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'team', label: 'Team Management', icon: Users },
    { id: 'files', label: 'File Analytics', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const quickStats = [
    { label: 'Total Employees', value: demoWorkspace.stats.totalEmployees, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: 'Total Files', value: demoWorkspace.stats.totalFiles.toLocaleString(), icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { label: 'Active Projects', value: '12', icon: Target, color: 'text-violet-400', bg: 'bg-violet-500/20' },
    { label: 'Storage Used', value: '387.2 GB', icon: Globe, color: 'text-orange-400', bg: 'bg-orange-500/20' }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Enterprise Workspace
            </h1>
            <p className="text-gray-400 text-lg">Manage your team, files, and workspace analytics</p>
          </div>
          <div className="flex gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Member
            </Button>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 px-6 py-3 rounded-xl transition-all duration-300">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-900/50 p-2 rounded-2xl backdrop-blur-sm border border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {quickStats.map((stat, index) => (
            <Card key={index} className="bg-gray-900/80 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white font-bold text-xl flex items-center gap-3">
                  <Zap className="w-6 h-6 text-blue-400" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Latest workspace activities and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoWorkspace.stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all duration-300">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{activity.action}</p>
                      <p className="text-gray-400 text-xs">by {activity.user}</p>
                      {activity.file && (
                        <Badge variant="secondary" className="mt-1 bg-blue-500/20 text-blue-400 text-xs">
                          {activity.file}
                        </Badge>
                      )}
                    </div>
                    <span className="text-gray-500 text-xs">
                      {activity.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Platform Distribution */}
            <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white font-bold text-xl flex items-center gap-3">
                  <Globe className="w-6 h-6 text-emerald-400" />
                  Platform Distribution
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Files distributed across connected platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoWorkspace.stats.filesByPlatform.map((platform, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">{platform.platform}</span>
                      <span className="text-gray-400 font-medium">{platform.totalFiles.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(platform.totalFiles / Math.max(...demoWorkspace.stats.filesByPlatform.map(p => p.totalFiles))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'team' && (
          <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white font-bold text-xl flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-400" />
                Team Members
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your workspace team and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {demoWorkspace.employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center font-bold text-white">
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{employee.name}</p>
                        <p className="text-gray-400 text-sm">{employee.email}</p>
                        <p className="text-gray-500 text-xs">{employee.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={employee.role === 'admin' ? 'default' : 'secondary'} 
                             className={employee.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}>
                        {employee.role}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkspaceInterface;
