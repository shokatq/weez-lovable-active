import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import EnhancedTeamManagement from './EnhancedTeamManagement';
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
  Plus
} from 'lucide-react';

const RoleBasedDashboard = () => {
  const { user, signOut } = useAuth();
  const { userRole, hasTeam, loading, isAdmin, canManageTeam } = useUserRole();
  const navigate = useNavigate();

  // Redirect to workspace if user has no team (will show team creation screen)
  useEffect(() => {
    if (!loading && !hasTeam) {
      navigate('/workspace-new');
    }
  }, [loading, hasTeam, navigate]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4" />;
      case 'team_lead': return <Shield className="w-4 h-4" />;
      case 'employee': return <User className="w-4 h-4" />;
      case 'viewer': return <Eye className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'team_lead': return 'secondary';
      case 'employee': return 'outline';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  const getQuickActions = () => {
    const actions = [
      {
        title: 'AI Chat',
        description: 'Chat with AI assistants',
        icon: MessageSquare,
        href: '/chat',
        available: true,
      },
      {
        title: 'Notion Interface',
        description: 'Manage your workspace',
        icon: Building2,
        href: '/notion',
        available: true,
      },
    ];

    if (canManageTeam) {
      actions.unshift({
        title: 'Team Management',
        description: 'Manage team members and roles',
        icon: Users,
        href: '#team',
        available: true,
      });
    }

    if (isAdmin) {
      actions.push({
        title: 'Workspace Settings',
        description: 'Configure workspace settings',
        icon: Settings,
        href: '/workspace',
        available: true,
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

  if (!hasTeam) {
    return null; // Will redirect to workspace setup
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
                  <p className="text-sm text-muted-foreground">{userRole?.teamName}</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <Badge variant={getRoleBadgeVariant(userRole?.role || 'employee')} className="flex items-center gap-1">
                {getRoleIcon(userRole?.role || 'employee')}
                {userRole?.role || 'Employee'}
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

        {/* Role-specific content */}
        {canManageTeam && (
          <div id="team-management" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Team Management</h3>
              {isAdmin && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/workspace')}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Advanced Settings
                </Button>
              )}
            </div>
            <Card>
              <CardContent className="p-6">
                <EnhancedTeamManagement />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Regular employee view */}
        {!canManageTeam && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Your Workspace</h3>
            <div className="grid gap-4 md:grid-cols-2">
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
                  <Button onClick={() => navigate('/workspace-new')} variant="outline" className="w-full">
                    Open Workspace
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleBasedDashboard;