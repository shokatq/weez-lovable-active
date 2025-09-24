import { Users, Building2, Settings, Shield, BarChart3, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { demoUsers, demoWorkspaces, demoSpaces, getDemoStats, DemoUser } from '@/data/comprehensiveDemoData';

interface DemoAdminDashboardProps {
  currentUser: DemoUser;
}

const DemoAdminDashboard = ({ currentUser }: DemoAdminDashboardProps) => {
  const stats = getDemoStats();

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your organization's workspaces, users, and settings
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold">{demoUsers.length}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{demoWorkspaces.length}</div>
            <div className="text-sm text-muted-foreground">Workspaces</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{demoSpaces.length}</div>
            <div className="text-sm text-muted-foreground">Active Spaces</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">98.5%</div>
            <div className="text-sm text-muted-foreground">System Uptime</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">API Services</span>
                    </div>
                    <Badge variant="default" className="bg-green-500/10 text-green-600">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Database</span>
                    </div>
                    <Badge variant="default" className="bg-green-500/10 text-green-600">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">File Storage</span>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">Degraded</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Authentication</span>
                    </div>
                    <Badge variant="default" className="bg-green-500/10 text-green-600">Healthy</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Admin Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-muted-foreground">Emily Davis joined Engineering</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Workspace created</p>
                      <p className="text-xs text-muted-foreground">Marketing Department workspace</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                      <Settings className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Security policy updated</p>
                      <p className="text-xs text-muted-foreground">Password requirements changed</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts & Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Storage Warning</p>
                        <p className="text-xs text-muted-foreground">
                          File storage is at 85% capacity
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Security Update</p>
                        <p className="text-xs text-muted-foreground">
                          New security patch available
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Backup Complete</p>
                        <p className="text-xs text-muted-foreground">
                          Daily backup completed successfully
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-medium">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={user.role === 'admin' ? 'destructive' : user.role === 'manager' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {user.role}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workspaces">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Workspace Management</CardTitle>
                <Button>
                  <Building2 className="w-4 h-4 mr-2" />
                  Create Workspace
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demoWorkspaces.map((workspace) => (
                  <Card key={workspace.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <h3 className="font-semibold mb-2">{workspace.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {workspace.description}
                      </p>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Members:</span>
                          <span>{workspace.members.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spaces:</span>
                          <span>{workspace.spaces.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Created:</span>
                          <span>{workspace.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        Manage
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Two-Factor Authentication</span>
                    <Badge variant="default" className="bg-green-500/10 text-green-600">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Password Policy</span>
                    <Badge variant="default" className="bg-green-500/10 text-green-600">Strong</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Session Timeout</span>
                    <Badge variant="secondary">24 hours</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Failed Login Attempts</span>
                    <Badge variant="outline">3 max</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>User login</span>
                      <span className="text-muted-foreground">2m ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground">john.smith@company.com</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Workspace created</span>
                      <span className="text-muted-foreground">1h ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Marketing Department</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>User role changed</span>
                      <span className="text-muted-foreground">3h ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Employee → Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Daily Active Users</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Storage Utilization</span>
                      <span>76%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>API Usage</span>
                      <span>64%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '64%' }}></div>
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
                    <span className="text-sm text-muted-foreground">Average Response Time</span>
                    <span className="font-medium">248ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Requests (24h)</span>
                    <span className="font-medium">12,847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Error Rate</span>
                    <span className="font-medium">0.02%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Uptime (30d)</span>
                    <span className="font-medium">99.97%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Connections</span>
                    <span className="font-medium">847</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DemoAdminDashboard;