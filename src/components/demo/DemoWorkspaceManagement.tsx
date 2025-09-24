import { useState } from 'react';
import { Plus, Users, Building2, Settings, Search, Calendar, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { demoWorkspaces, DemoUser } from '@/data/comprehensiveDemoData';

interface DemoWorkspaceManagementProps {
  currentUser: DemoUser;
}

const DemoWorkspaceManagement = ({ currentUser }: DemoWorkspaceManagementProps) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState(demoWorkspaces[0]);
  const [activeTab, setActiveTab] = useState('overview');

  const userWorkspaces = demoWorkspaces.filter(workspace => 
    workspace.members.some(member => member.id === currentUser.id)
  );

  return (
    <div className="h-full flex bg-background">
      {/* Workspaces Sidebar */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Workspaces</h2>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search workspaces..." className="pl-9" />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-3">
            {userWorkspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => setSelectedWorkspace(workspace)}
                className={`w-full p-4 rounded-lg text-left transition-colors ${
                  selectedWorkspace.id === workspace.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted/50 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1">{workspace.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {workspace.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {workspace.members.length}
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {workspace.spaces.length}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{selectedWorkspace.name}</h1>
                <p className="text-muted-foreground">{selectedWorkspace.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="default">Active</Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="spaces">Spaces</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Workspace Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Spaces</span>
                        <span className="font-medium">{selectedWorkspace.spaces.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Team Members</span>
                        <span className="font-medium">{selectedWorkspace.members.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Created</span>
                        <span className="font-medium">{selectedWorkspace.createdAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Spaces */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Recent Spaces
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedWorkspace.spaces.map((space) => (
                        <div key={space.id} className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{space.name}</p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {space.description}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span>{space.members.length} members</span>
                                <span>{space.files.length} files</span>
                              </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${
                              space.isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Team Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New space created</p>
                          <p className="text-xs text-muted-foreground">3 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Member added</p>
                          <p className="text-xs text-muted-foreground">5 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                          <Settings className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Settings updated</p>
                          <p className="text-xs text-muted-foreground">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="spaces" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Workspace Spaces</CardTitle>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Space
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedWorkspace.spaces.map((space) => (
                      <Card key={space.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div className={`w-2 h-2 rounded-full ${
                              space.isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                          </div>
                          <h3 className="font-semibold mb-2">{space.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {space.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {space.members.length}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {space.files.length} files
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            Open Space
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Team Members</CardTitle>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Invite Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedWorkspace.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-medium">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                            <p className="text-xs text-muted-foreground">{member.department}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="capitalize">
                            {member.role}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Usage Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Active Users</span>
                          <span>85%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Storage Used</span>
                          <span>62%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Space Utilization</span>
                          <span>73%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Messages</span>
                        <span className="font-medium">1,247</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Files Shared</span>
                        <span className="font-medium">89</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg Response Time</span>
                        <span className="font-medium">2.3s</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Uptime</span>
                        <span className="font-medium">99.8%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DemoWorkspaceManagement;