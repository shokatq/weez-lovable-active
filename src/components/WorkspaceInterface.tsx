import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, TrendingUp, Settings, Plus, Search, Filter, ArrowRight, Zap, Target, Globe, Calendar, Download, Eye, ArrowLeft, Star, Clock, Share, MoreHorizontal, FolderOpen, User, UserPlus, Activity, Database, Shield } from "lucide-react";
import { demoWorkspace, sampleFiles } from "@/data/workspaceData";
import AddMemberDialog from "./AddMemberDialog";
import { useToast } from "@/hooks/use-toast";

const WorkspaceInterface = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState(demoWorkspace.employees);
  const navigate = useNavigate();
  const { toast } = useToast();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'files', label: 'File Management', icon: FileText },
    { id: 'team', label: 'Team Management', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const quickStats = [
    { label: 'Total Employees', value: teamMembers.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Total Files', value: demoWorkspace.stats.totalFiles.toLocaleString(), icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Active Projects', value: '15', icon: Target, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { label: 'Storage Used', value: '487.2 GB', icon: Database, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' }
  ];

  const handleAddMember = (member: { name: string; email: string; role: string; department: string }) => {
    const newMember = {
      id: Date.now().toString(),
      name: member.name,
      email: member.email,
      role: member.role as 'admin' | 'employee',
      department: member.department,
      joinDate: new Date(),
      lastActive: new Date(),
    };
    
    setTeamMembers(prev => [...prev, newMember]);
    toast({
      title: "Member Added Successfully",
      description: `${member.name} has been added to your workspace.`,
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'xlsx': return '📊';
      case 'pptx': return '📈';
      case 'md': return '📋';
      default: return '📁';
    }
  };

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case 'Google Drive': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'OneDrive': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'Notion': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'Dropbox': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Slack': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'docx': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'xlsx': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'pptx': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'md': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const filteredFiles = sampleFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || file.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const platforms = ['all', ...Array.from(new Set(sampleFiles.map(file => file.platform)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.15),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
      
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                onClick={() => navigate("/home")}
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 p-3 rounded-xl transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-gray-300 bg-clip-text text-transparent mb-3">
                  Enterprise Workspace
                </h1>
                <p className="text-gray-400 text-xl font-medium">Advanced workspace management with enhanced analytics and team collaboration</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate("/workspace")}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/20"
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                Dashboard
              </Button>
              <Button 
                onClick={() => setIsAddMemberOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/20"
              >
                <UserPlus className="w-5 h-5 mr-3" />
                Add Member
              </Button>
            </div>
          </div>

          <div className="flex gap-3 mb-10 bg-gray-900/30 p-3 rounded-2xl backdrop-blur-md border border-gray-800/50 shadow-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 transform scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {quickStats.map((stat, index) => (
              <Card key={index} className={`bg-gray-900/40 ${stat.border} border backdrop-blur-md hover:bg-gray-800/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl shadow-lg`}>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">{stat.label}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`w-16 h-16 rounded-2xl ${stat.bg} border ${stat.border} flex items-center justify-center`}>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-md shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-white font-bold text-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {demoWorkspace.stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-6 p-6 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 hover:bg-gray-800/50">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse shadow-lg shadow-blue-400/50"></div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-base">{activity.action}</p>
                        <p className="text-gray-400 text-sm">by {activity.user}</p>
                        {activity.file && (
                          <Badge variant="secondary" className="mt-2 bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">
                            {activity.file}
                          </Badge>
                        )}
                      </div>
                      <span className="text-gray-500 text-sm font-medium">
                        {activity.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-md shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-white font-bold text-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    Platform Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {demoWorkspace.stats.filesByPlatform.map((platform, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold text-lg">{platform.platform}</span>
                        <span className="text-gray-400 font-bold text-lg">{platform.totalFiles.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden border border-gray-700/30">
                        <div 
                          className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 h-3 rounded-full transition-all duration-1000 shadow-lg"
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
            <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-md shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-white font-bold text-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  Team Members ({teamMembers.length})
                </CardTitle>
                <CardDescription className="text-gray-400 text-lg">
                  Manage your workspace team and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {teamMembers.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-6 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 hover:bg-gray-800/50">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center font-bold text-white text-xl shadow-lg">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg">{employee.name}</p>
                          <p className="text-gray-400 text-base">{employee.email}</p>
                          <p className="text-gray-500 text-sm">{employee.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <Badge variant={employee.role === 'admin' ? 'default' : 'secondary'} 
                               className={employee.role === 'admin' ? 'bg-blue-600/20 text-blue-400 border-blue-500/30 font-semibold' : 'bg-gray-700/30 text-gray-300 border-gray-600/30'}>
                          {employee.role}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700/50 p-3 rounded-lg">
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'files' && (
            <div className="space-y-8">
              <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-md shadow-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search files, owners, or content..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <select
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                        className="px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                      >
                        {platforms.map(platform => (
                          <option key={platform} value={platform} className="bg-gray-800">
                            {platform === 'all' ? 'All Platforms' : platform}
                          </option>
                        ))}
                      </select>
                      <Button variant="outline" className="border-gray-700/50 text-gray-300 hover:bg-gray-800/50 hover:border-gray-600 px-6 py-3 rounded-xl">
                        <Filter className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6">
                {filteredFiles.map((file) => (
                  <Card key={file.id} className="bg-gray-900/40 border-gray-800/50 backdrop-blur-md hover:border-gray-600/50 transition-all duration-300 hover:bg-gray-800/50 shadow-lg hover:shadow-xl group">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                          <div className="relative">
                            <div className="text-5xl mb-2">{getFileIcon(file.type)}</div>
                            <Badge className={`absolute -bottom-2 -right-2 text-xs font-bold ${getFileTypeColor(file.type)} px-2 py-1`}>
                              {file.type.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-white font-bold text-xl mb-1 group-hover:text-blue-400 transition-colors duration-300">
                                {file.name}
                              </h3>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-400">
                                  <User className="w-4 h-4" />
                                  <span className="font-medium">{file.owner}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                  <Clock className="w-4 h-4" />
                                  <span>{file.lastModified.toLocaleDateString()}</span>
                                </div>
                                <Badge className={`${getPlatformBadgeColor(file.platform)} font-semibold`}>
                                  {file.platform}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span className="text-gray-300 font-medium">Size: {file.size}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                <span className="text-gray-300 font-medium">Modified: {file.lastModified.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 p-3 rounded-xl transition-all duration-300" title="Preview">
                              <Eye className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 p-3 rounded-xl transition-all duration-300" title="Download">
                              <Download className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 p-3 rounded-xl transition-all duration-300" title="Share">
                              <Share className="w-5 h-5" />
                            </Button>
                          </div>
                          <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-blue-400 transition-colors duration-300" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white font-bold text-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                      <span className="text-gray-300">File Access Rate</span>
                      <span className="text-emerald-400 font-bold">87.3%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                      <span className="text-gray-300">Team Productivity</span>
                      <span className="text-blue-400 font-bold">94.1%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                      <span className="text-gray-300">Storage Efficiency</span>
                      <span className="text-violet-400 font-bold">91.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white font-bold text-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    Security Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                      <span className="text-gray-300">Security Score</span>
                      <span className="text-emerald-400 font-bold">98.5%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                      <span className="text-gray-300">Active Sessions</span>
                      <span className="text-blue-400 font-bold">24</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                      <span className="text-gray-300">Last Backup</span>
                      <span className="text-violet-400 font-bold">2 hrs ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <AddMemberDialog 
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        onAddMember={handleAddMember}
      />
    </div>
  );
};

export default WorkspaceInterface;
