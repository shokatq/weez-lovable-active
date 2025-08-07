import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, Users, MessageCircle, Settings, Search, Plus, UserPlus, Building2, Briefcase, BarChart3, FileText, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import WorkspaceChatInterface from "./WorkspaceChatInterface";
import EnhancedTeamManagement from "./EnhancedTeamManagement";
import AdvancedAnalytics from "./AdvancedAnalytics";
import DocumentManagement from "./DocumentManagement";

const EnterpriseWorkspace = () => {
  const { user, signOut } = useAuth();
  const { userRole, isAdmin, isTeamLead, canManageTeam, hasTeam, loading: roleLoading } = useUserRole();
  const [activeTab, setActiveTab] = useState("overview");
  const [showTeamSetup, setShowTeamSetup] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

  // Mock analytics data
  const quickStats = [
    { label: "Team Members", value: "24", icon: Users, color: "text-blue-400" },
    { label: "Active Projects", value: "8", icon: Briefcase, color: "text-green-400" },
    { label: "AI Queries Today", value: "156", icon: MessageCircle, color: "text-purple-400" },
    { label: "Departments", value: "6", icon: Building2, color: "text-orange-400" },
  ];

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast.error("Team name is required");
      return;
    }

    setIsCreatingTeam(true);
    try {
      const { data, error } = await supabase.rpc('create_team_with_setup', {
        team_name: teamName,
        team_description: teamDescription || null
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };
      
      if (result.success) {
        toast.success("Team created successfully!");
        setShowTeamSetup(false);
        setTeamName("");
        setTeamDescription("");
        // Refresh the page to show the new team
        window.location.reload();
      } else {
        throw new Error(result.error || "Failed to create team");
      }
    } catch (error: any) {
      console.error("Error creating team:", error);
      toast.error(error.message || "Failed to create team");
    } finally {
      setIsCreatingTeam(false);
    }
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!hasTeam) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-foreground">Enterprise Workspace</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">{user?.email}</span>
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
          <Card className="p-8 bg-card border-border">
            <div className="text-center mb-8">
              <Building2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Create Your Enterprise Workspace</h2>
              <p className="text-muted-foreground">Set up your team workspace to start collaborating with AI-powered tools.</p>
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
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border">
                <div className="text-center p-4">
                  <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-medium text-foreground">AI Assistant</h3>
                  <p className="text-sm text-muted-foreground">Intelligent chat interface</p>
                </div>
                <div className="text-center p-4">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-medium text-foreground">Team Management</h3>
                  <p className="text-sm text-muted-foreground">Organize your workforce</p>
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
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.href = '/chat'}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Chat</span>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Building2 className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">Enterprise Workspace</h1>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {userRole?.role || 'member'}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search workspace..." 
                  className="w-64 bg-background border-border"
                />
              </div>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-card border border-border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Briefcase className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
            {canManageTeam && (
            <TabsTrigger value="team" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="w-4 h-4 mr-2" />
                Team Management
              </TabsTrigger>
            )}
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Workspace Overview</h2>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {quickStats.map((stat, index) => (
                  <Card key={index} className="p-6 bg-card border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2 border-border hover:bg-muted"
                    onClick={() => window.location.href = '/chat'}
                  >
                    <MessageCircle className="w-6 h-6 text-primary" />
                    <span className="text-foreground">AI Chat</span>
                    <span className="text-xs text-muted-foreground">Interact with AI Assistant</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2 border-border hover:bg-muted"
                    onClick={() => setActiveTab("analytics")}
                  >
                    <BarChart3 className="w-6 h-6 text-primary" />
                    <span className="text-foreground">Advanced Analytics</span>
                    <span className="text-xs text-muted-foreground">Performance insights & metrics</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2 border-border hover:bg-muted"
                    onClick={() => setActiveTab("documents")}
                  >
                    <FileText className="w-6 h-6 text-primary" />
                    <span className="text-foreground">Document Hub</span>
                    <span className="text-xs text-muted-foreground">Manage files & knowledge base</span>
                  </Button>
                  
                  {canManageTeam && (
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex flex-col items-center space-y-2 border-border hover:bg-muted"
                      onClick={() => setActiveTab("team")}
                    >
                      <Users className="w-6 h-6 text-primary" />
                      <span className="text-foreground">Manage Team</span>
                      <span className="text-xs text-muted-foreground">Add and organize members</span>
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2 border-border hover:bg-muted"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="w-6 h-6 text-primary" />
                    <span className="text-foreground">Workspace Settings</span>
                    <span className="text-xs text-muted-foreground">Configure your workspace</span>
                  </Button>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">AI Query processed</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">New team member added</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">Document uploaded</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>


          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AdvancedAnalytics />
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <DocumentManagement />
          </TabsContent>

          {/* Team Management Tab */}
          {canManageTeam && (
            <TabsContent value="team" className="space-y-6">
              <EnhancedTeamManagement />
            </TabsContent>
          )}

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Workspace Information</h3>
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

              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">User Preferences</h3>
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