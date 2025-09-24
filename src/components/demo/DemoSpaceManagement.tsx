import { useState } from 'react';
import { Plus, Users, MessageSquare, FileText, Settings, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { demoSpaces, DemoUser } from '@/data/comprehensiveDemoData';

interface DemoSpaceManagementProps {
  currentUser: DemoUser;
}

const DemoSpaceManagement = ({ currentUser }: DemoSpaceManagementProps) => {
  const [selectedSpace, setSelectedSpace] = useState(demoSpaces[0]);
  const [activeTab, setActiveTab] = useState('overview');

  const userSpaces = demoSpaces.filter(space => 
    space.members.some(member => member.id === currentUser.id)
  );

  return (
    <div className="h-full flex bg-background">
      {/* Spaces Sidebar */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">My Spaces</h2>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Space
            </Button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search spaces..." className="pl-9" />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-3">
            {userSpaces.map((space) => (
              <button
                key={space.id}
                onClick={() => setSelectedSpace(space)}
                className={`w-full p-4 rounded-lg text-left transition-colors ${
                  selectedSpace.id === space.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted/50 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm">{space.name}</h3>
                  <div className={`w-2 h-2 rounded-full ${
                    space.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {space.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {space.members.length}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {space.files.length}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {space.conversations.length}
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
            <div>
              <h1 className="text-2xl font-bold">{selectedSpace.name}</h1>
              <p className="text-muted-foreground mt-1">{selectedSpace.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={selectedSpace.isActive ? 'default' : 'secondary'}>
                {selectedSpace.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-1 overflow-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedSpace.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                            {member.avatar}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.department}</p>
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">
                            {member.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Files */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Recent Files
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedSpace.files.slice(0, 4).map((file) => (
                        <div key={file.id} className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{file.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">{file.platform}</p>
                              <p className="text-xs text-muted-foreground">Modified {file.lastModified}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New conversation started</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Document uploaded</p>
                          <p className="text-xs text-muted-foreground">5 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Member added to space</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Space Chat</h3>
                    <p className="text-muted-foreground mb-4">
                      Collaborate with your team members in real-time
                    </p>
                    <Button>Start Conversation</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Shared Files</CardTitle>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedSpace.files.map((file) => (
                      <div key={file.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-start gap-3">
                          <FileText className="w-8 h-8 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">{file.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">{file.platform}</Badge>
                              <Badge variant="secondary" className="text-xs">{file.type}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Modified {file.lastModified} • {file.size}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Space Members</CardTitle>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Invite Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedSpace.members.map((member) => (
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DemoSpaceManagement;