import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  Users, 
  MessageSquare, 
  Settings, 
  Crown, 
  Shield, 
  User, 
  Eye,
  Sparkles,
  ArrowRight,
  Plus,
  RefreshCw,
  AlertCircle,
  UserPlus
} from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';
import { ProtectedComponent } from '@/components/ProtectedComponent';
import { Role, Permission } from '@/types/rbac';

// Team Management Component
const TeamManagement = () => {
  const { teamMembers, inviteUser, refreshTeamData, loading, error } = useRBAC();
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    setIsInviting(true);
    const success = await inviteUser(inviteEmail, Role.EMPLOYEE);
    if (success) {
      setInviteEmail('');
    }
    setIsInviting(false);
  };

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case Role.ADMIN: return <Crown className="w-4 h-4" />;
      case Role.TEAM_LEAD: return <Shield className="w-4 h-4" />;
      case Role.EMPLOYEE: return <User className="w-4 h-4" />;
      case Role.VIEWER: return <Eye className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="text-xs">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-xs">Pending</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-xs">Inactive</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Invite New Member */}
      <ProtectedComponent permissions={[Permission.INVITE_MEMBERS]}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Invite New Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                disabled={isInviting}
                className="flex-1"
              />
              <Button type="submit" disabled={isInviting || !inviteEmail.trim()}>
                {isInviting ? 'Inviting...' : 'Invite'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </ProtectedComponent>

      {/* Team Members List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Team Members ({teamMembers.length})</CardTitle>
            <CardDescription>Manage your team members and their roles</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshTeamData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getRoleIcon(member.role)}
                  <div>
                    <p className="font-medium">
                      {member.first_name && member.last_name 
                        ? `${member.first_name} ${member.last_name}`
                        : member.email
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="capitalize">
                    {member.role.replace('_', ' ')}
                  </Badge>
                  {getStatusBadge(member.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RoleBasedDashboard = () => {
  const { user, userRole, team, loading, signOut, hasPermission, teamMembers } = useRBAC();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to workspace setup if user doesn't have a team
    if (user && !team && !loading) {
      navigate('/workspace-new');
    }
  }, [user, team, loading, navigate]);

  const getRoleIcon = (role: Role | null) => {
    switch (role) {
      case Role.ADMIN: return <Crown className="w-4 h-4" />;
      case Role.TEAM_LEAD: return <Shield className="w-4 h-4" />;
      case Role.EMPLOYEE: return <User className="w-4 h-4" />;
      case Role.VIEWER: return <Eye className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadgeVariant = (role: Role | null) => {
    switch (role) {
      case Role.ADMIN: return 'default';
      case Role.TEAM_LEAD: return 'secondary';
      case Role.EMPLOYEE: return 'outline';
      case Role.VIEWER: return 'outline';
      default: return 'outline';
    }
  };

  const getQuickActions = () => {
    const actions = [];

    // AI Chat - available to all authenticated users
    if (hasPermission(Permission.USE_AI_CHAT)) {
      actions.push({
        title: 'AI Chat',
        description: 'Chat with AI assistants',
        icon: MessageSquare,
        href: '/chat',
      });
    }

    // Workspace - available to all
    actions.push({
      title: 'Workspace',
      description: 'Access your workspace',
      icon: Building2,
      href: '/workspace',
    });

    // Team Management - only for managers
    if (hasPermission(Permission.MANAGE_TEAM)) {
      actions.unshift({
        title: 'Team Management',
        description: 'Manage team members and roles',
        icon: Users,
        href: '#team',
      });
    }

    // Settings - only for admins
    if (hasPermission(Permission.CONFIGURE_SETTINGS)) {
      actions.push({
        title: 'Settings',
        description: 'Configure workspace settings',
        icon: Settings,
        href: '/settings',
      });
    }

    return actions;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Team Found</CardTitle>
            <CardDescription>You don't belong to any team yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/workspace-new')} className="w-full">
              Create Team
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Weez.AI</h1>
                  <p className="text-sm text-muted-foreground">{team?.name}</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <Badge variant={getRoleBadgeVariant(userRole)} className="flex items-center gap-1">
                {getRoleIcon(userRole)}
                {userRole?.replace('_', ' ') || 'Employee'}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.user_metadata?.first_name || 'there'}! 👋
          </h2>
          <p className="text-muted-foreground text-lg">
            Here's what's happening in your workspace today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Quick Actions</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getQuickActions().map((action) => (
              <Card 
                key={action.title} 
                className="hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => action.href.startsWith('#') ? 
                  document.getElementById('team-management')?.scrollIntoView({ behavior: 'smooth' }) : 
                  navigate(action.href)
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <action.icon className="w-8 h-8 text-primary" />
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Management Section - Only for users with MANAGE_TEAM permission */}
        <ProtectedComponent 
          permissions={[Permission.MANAGE_TEAM]}
          fallback={null}
        >
          <div id="team-management" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Team Management</h3>
              <ProtectedComponent permissions={[Permission.CONFIGURE_SETTINGS]}>
                <Button
                  variant="outline"
                  onClick={() => navigate('/settings')}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Advanced Settings
                </Button>
              </ProtectedComponent>
            </div>
            <Card>
              <CardContent className="p-6">
                <TeamManagement />
              </CardContent>
            </Card>
          </div>
        </ProtectedComponent>

        {/* Employee/Viewer Dashboard - For users without MANAGE_TEAM permission */}
        {!hasPermission(Permission.MANAGE_TEAM) && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Your Workspace</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <ProtectedComponent permissions={[Permission.USE_AI_CHAT]}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      AI Chat Assistant
                    </CardTitle>
                    <CardDescription>
                      Get help with your tasks using AI-powered assistance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => navigate('/chat')} className="w-full">
                      Start Chatting
                    </Button>
                  </CardContent>
                </Card>
              </ProtectedComponent>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Enterprise Workspace
                  </CardTitle>
                  <CardDescription>
                    Access your enterprise workspace with AI-powered tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate('/workspace')} variant="outline" className="w-full">
                    Open Workspace
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Team Overview - Show for all users who can view team */}
        <ProtectedComponent permissions={[Permission.VIEW_TEAM]}>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Team Overview</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {teamMembers.filter(m => m.status === 'active').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Active members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Pending Invites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-500">
                    {teamMembers.filter(m => m.status === 'pending').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Awaiting response</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Your Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(userRole)}
                    <span className="text-lg font-semibold capitalize">
                      {userRole?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Current access level</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </ProtectedComponent>
      </div>
    </div>
  );
};

export default RoleBasedDashboard;