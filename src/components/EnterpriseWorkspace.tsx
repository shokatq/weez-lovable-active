import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, Users, MessageCircle, Settings, Search, Plus, UserPlus, Building2, Briefcase, BarChart3, FileText, ArrowLeft, Menu, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const EnterpriseWorkspace = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showTeamSetup, setShowTeamSetup] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock user data
  const user = { email: "admin@company.com" };
  const userRole = { role: "admin", teamName: "Enterprise Team" };
  const hasTeam = true;
  const canManageTeam = true;

  // Mock analytics data
  const quickStats = [
    { label: "Team Members", value: "24", icon: Users, color: "text-blue-400" },
    { label: "Active Projects", value: "8", icon: Briefcase, color: "text-green-400" },
    { label: "AI Queries Today", value: "156", icon: MessageCircle, color: "text-purple-400" },
    { label: "Departments", value: "6", icon: Building2, color: "text-orange-400" },
  ];

  const signOut = () => {
    console.log("Sign out");
  };

  const handleCreateTeam = async () => {
    console.log("Creating team...");
  };

  if (!hasTeam) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg sm:text-xl font-semibold text-foreground">Enterprise Workspace</h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Team Setup Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="p-6 sm:p-8 bg-card border-border">
            <div className="text-center mb-8">
              <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Create Your Enterprise Workspace</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Set up your team workspace to start collaborating with AI-powered tools.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Workspace Name *</label>
                <Input
                  placeholder="Enter your workspace name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  placeholder="Describe your workspace purpose..."
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  className="bg-background border-border min-h-[100px]"
                />
              </div>

              <Button 
                onClick={handleCreateTeam}
                disabled={isCreatingTeam || !teamName.trim()}
                className="w-full"
              >
                {isCreatingTeam ? "Creating..." : "Create Workspace"}
              </Button>

              {/* Features Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-border">
                <div className="text-center p-4">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-medium text-foreground text-sm sm:text-base">AI Assistant</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Intelligent chat interface</p>
                </div>
                <div className="text-center p-4">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-medium text-foreground text-sm sm:text-base">Team Management</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Organize your workforce</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.href = '/chat'}
                className="flex items-center gap-1 sm:gap-2 p-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Back to Chat</span>
              </Button>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <h1 className="text-sm sm:text-xl font-semibold text-foreground hidden sm:block">Enterprise Workspace</h1>
              <h1 className="text-sm font-semibold text-foreground sm:hidden">Workspace</h1>
              <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                {userRole?.role || 'member'}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden lg:flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search workspace..." 
                  className="w-48 xl:w-64 bg-background border-border"
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground hidden md:block">{user?.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Mobile Tab Selector */}
          <div className="block sm:hidden">
            <select 
              value={activeTab} 
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-card text-foreground"
            >
              <option value="overview">Overview</option>
              <option value="analytics"> Analytics</option>
              <option value="documents">Documents</option>
              {canManageTeam && <option value="team"> Team Management</option>}
              <option value="settings"> Settings</option>
            </select>
          </div>

          {/* Desktop/Tablet Tab List */}
          <TabsList className="hidden sm:grid w-full grid-cols-4 lg:grid-cols-5 bg-card border border-border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
              <Briefcase className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
              <BarChart3 className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden md:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
              <FileText className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden md:inline">Documents</span>
            </TabsTrigger>
            {canManageTeam && (
              <TabsTrigger value="team" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
                <Users className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden lg:inline">Team</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
              <Settings className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Workspace Overview</h2>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                {quickStats.map((stat, index) => (
                  <Card key={index} className="p-4 sm:p-6 bg-card border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card className="p-4 sm:p-6 bg-card border-border">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2 border-border hover:bg-muted"
                    onClick={() => window.location.href = '/chat'}
                  >
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    <span className="text-sm sm:text-base text-foreground">AI Chat</span>
                    <span className="text-xs text-muted-foreground text-center">Interact with AI Assistant</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2 border-border hover:bg-muted"
                    onClick={() => setActiveTab("analytics")}
                  >
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    <span className="text-sm sm:text-base text-foreground">Advanced Analytics</span>
                    <span className="text-xs text-muted-foreground text-center">Performance insights & metrics</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2 border-border hover:bg-muted"
                    onClick={() => setActiveTab("documents")}
                  >
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    <span className="text-sm sm:text-base text-foreground">Document Hub</span>
                    <span className="text-xs text-muted-foreground text-center">Manage files & knowledge base</span>
                  </Button>
                  
                  {canManageTeam && (
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex flex-col items-center space-y-2 border-border hover:bg-muted"
                      onClick={() => setActiveTab("team")}
                    >
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      <span className="text-sm sm:text-base text-foreground">Manage Team</span>
                      <span className="text-xs text-muted-foreground text-center">Add and organize members</span>
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2 border-border hover:bg-muted sm:col-span-1 lg:col-span-1"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    <span className="text-sm sm:text-base text-foreground">Workspace Settings</span>
                    <span className="text-xs text-muted-foreground text-center">Configure your workspace</span>
                  </Button>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-4 sm:p-6 bg-card border-border">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">AI Query processed</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">New team member added</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">Document uploaded</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6 bg-card border-border">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Advanced Analytics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="h-48 sm:h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Chart placeholder</p>
                </div>
                <div className="h-48 sm:h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Graph placeholder</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6 bg-card border-border">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Document Management</h2>
              <div className="space-y-4">
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border border-border rounded-lg">
                      <FileText className="w-8 h-8 text-primary mb-2" />
                      <h4 className="font-medium text-foreground">Document {i}</h4>
                      <p className="text-sm text-muted-foreground">Updated 2 days ago</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Team Management Tab */}
          {canManageTeam && (
            <TabsContent value="team" className="space-y-4 sm:space-y-6">
              <Card className="p-4 sm:p-6 bg-card border-border">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Team Management</h2>
                <div className="space-y-4">
                  <Button className="w-full sm:w-auto">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Team Member
                  </Button>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-2 text-sm font-medium text-foreground">Name</th>
                          <th className="text-left p-2 text-sm font-medium text-foreground">Role</th>
                          <th className="text-left p-2 text-sm font-medium text-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "John Doe", role: "Admin", status: "Active" },
                          { name: "Jane Smith", role: "Member", status: "Active" },
                          { name: "Mike Johnson", role: "Team Lead", status: "Active" }
                        ].map((member, i) => (
                          <tr key={i} className="border-b border-border">
                            <td className="p-2 text-sm text-foreground">{member.name}</td>
                            <td className="p-2 text-sm text-muted-foreground">{member.role}</td>
                            <td className="p-2">
                              <Badge variant="secondary" className="bg-green-500/20 text-green-500 text-xs">
                                {member.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </TabsContent>
          )}

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="p-4 sm:p-6 bg-card border-border">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Workspace Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Workspace Name</label>
                    <Input 
                      value={userRole?.teamName || "Enterprise Workspace"}
                      disabled
                      className="mt-1 bg-muted border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Your Role</label>
                    <Input 
                      value={userRole?.role || "member"}
                      disabled
                      className="mt-1 bg-muted border-border"
                    />
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Contact your workspace administrator to modify settings or request role changes.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 sm:p-6 bg-card border-border">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">User Preferences</h3>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">App Language</label>
                    <select className="w-full p-2 rounded-md border border-border bg-background text-foreground">
                      <option value="english">English</option>
                      <option value="spanish">Español</option>
                      <option value="french">Français</option>
                      <option value="german">Deutsch</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-foreground">Email Notifications</span>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-foreground">Auto-save Documents</span>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={signOut}
                      className="w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnterpriseWorkspace;