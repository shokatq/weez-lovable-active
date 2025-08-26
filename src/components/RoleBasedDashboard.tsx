import { useState, useEffect } from "react";
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
import ThemeToggle from "./ThemeToggle";

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
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
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
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-foreground">Weez.AI</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{userRole?.teamName}</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-6 sm:h-8 hidden sm:block" />
              <Badge variant={getRoleBadgeVariant(userRole?.role || 'employee')} className="flex items-center gap-1 text-xs sm:text-sm">
                {getRoleIcon(userRole?.role || 'employee')}
                <span className="hidden sm:inline">{userRole?.role || 'Employee'}</span>
                <span className="sm:hidden">{userRole?.role?.charAt(0).toUpperCase() || 'E'}</span>
              </Badge>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="outline" size="sm" onClick={signOut} className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">Out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Welcome back, {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'}!
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Here's what's happening with your team and workspace today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Quick Actions</h3>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getQuickActions().map((action) => (
              <Card
                key={action.title}
                className="hover:shadow-md transition-all duration-200 cursor-pointer group border-border hover:border-primary/20"
                onClick={() => action.href.startsWith('#') ?
                  document.getElementById('team-management')?.scrollIntoView({ behavior: 'smooth' }) :
                  navigate(action.href)
                }
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Management Section */}
        {canManageTeam && (
          <div id="team-management" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">Team Management</h3>
              <Button
                onClick={() => navigate('/workspace')}
                size="sm"
                className="text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add Member</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
            <EnhancedTeamManagement />
          </div>
        )}

        {/* Recent Activity */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Recent Activity</h3>
          <Card className="border-border">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-foreground">New conversation started</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-foreground">Team member joined</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-foreground">Workspace updated</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedDashboard;