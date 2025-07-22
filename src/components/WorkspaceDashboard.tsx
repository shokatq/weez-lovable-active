import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  FileText, 
  Upload, 
  Search, 
  Settings, 
  Plus,
  TrendingUp,
  Clock,
  Star,
  Filter,
  MoreHorizontal,
  Folder,
  Download
} from "lucide-react";
import { workspaceStats, recentFiles, teamMembers } from "@/data/workspaceData";
import AddMemberDialog from "./AddMemberDialog";

const WorkspaceDashboard = () => {
  const [showAddMember, setShowAddMember] = useState(false);

  const handleAddMember = (member: { name: string; email: string; role: string; department: string }) => {
    console.log('Adding new member:', member);
    // Here you would typically add the member to your data store
    // For now, we'll just log it
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Google Drive': return 'text-blue-600';
      case 'Slack': return 'text-purple-600';
      case 'Notion': return 'text-gray-800';
      case 'Dropbox': return 'text-blue-500';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 text-gray-900">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Workspace Dashboard</h1>
            <p className="text-gray-600 font-medium">Manage your team's files and integrations</p>
          </div>
          <div className="flex items-center gap-3 animate-slide-in-right">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gray-700 border-gray-300 hover:bg-gray-50 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button 
              onClick={() => setShowAddMember(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {workspaceStats.map((stat, index) => (
            <Card 
              key={stat.title} 
              className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-fade-in card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shadow-sm`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Files */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <CardHeader className="pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Recent Files</CardTitle>
                    <CardDescription className="text-gray-600 font-medium">Latest documents across all platforms</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-50 font-medium">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-50 font-medium">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="p-6 space-y-4">
                    {recentFiles.map((file, index) => (
                      <div 
                        key={file.name} 
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-200 border border-gray-100 hover:border-gray-200 group animate-fade-in"
                        style={{ animationDelay: `${500 + index * 50}ms` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{file.name}</h4>
                            <div className="flex items-center gap-3 text-sm">
                              <span className={`font-medium ${getPlatformColor(file.platform)}`}>
                                {file.platform}
                              </span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600 font-medium">{file.size}</span>
                              <span className="text-gray-500">•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-500" />
                                <span className="text-gray-600 font-medium">{file.lastModified}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(file.status)} font-medium`}>
                            {file.status}
                          </Badge>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Team Members */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900">Team Members</CardTitle>
                <CardDescription className="text-gray-600 font-medium">Active workspace users</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {teamMembers.map((member, index) => (
                    <div 
                      key={member.name} 
                      className="flex items-center gap-3 animate-fade-in"
                      style={{ animationDelay: `${700 + index * 100}ms` }}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600 font-medium">{member.role}</p>
                      </div>
                      <Badge className={`${getStatusColor(member.status)} text-xs font-medium`}>
                        {member.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Storage Usage */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '800ms' }}>
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900">Storage Usage</CardTitle>
                <CardDescription className="text-gray-600 font-medium">Across all platforms</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Used Storage</span>
                    <span className="text-sm font-semibold text-gray-900">847 GB / 2 TB</span>
                  </div>
                  <Progress value={42} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">1,247</p>
                      <p className="text-sm text-gray-600 font-medium">Total Files</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">5</p>
                      <p className="text-sm text-gray-600 font-medium">Platforms</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AddMemberDialog 
        open={showAddMember} 
        onOpenChange={setShowAddMember} 
        onAddMember={handleAddMember}
      />
    </div>
  );
};

export default WorkspaceDashboard;
