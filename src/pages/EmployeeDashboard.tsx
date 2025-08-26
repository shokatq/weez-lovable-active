
import { useState, useEffect } from "react";
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, FileText as FileIcon, MessageSquare, CheckCircle, Clock, Building2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import EmployeeChatCard from '@/components/employee/EmployeeChatCard';
import EmployeeSharedFiles from '@/components/employee/EmployeeSharedFiles';
import EmployeeTasks from '@/components/employee/EmployeeTasks';
import ThemeToggle from "@/components/ThemeToggle";
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { user, signOut } = useAuth();
  const { userRole, loading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Employee Dashboard • Weez AI';
    const desc = 'Chat with your workspace assistant, see shared files, and view your assigned tasks.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', window.location.href);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <FileIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">Employee Dashboard</h1>
              <Badge variant="secondary" className="bg-primary/20 text-primary text-xs sm:text-sm">
                {userRole?.teamName || 'Team'}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-medium text-primary">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
              </div>
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={signOut} className="text-xs sm:text-sm">
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Welcome, {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Employee'}!
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Here's your personalized workspace with all the tools you need to be productive.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="border-border hover:border-primary/20 transition-colors">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground">12</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Active Chats</div>
            </CardContent>
          </Card>
          <Card className="border-border hover:border-primary/20 transition-colors">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground">8</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Completed Tasks</div>
            </CardContent>
          </Card>
          <Card className="border-border hover:border-primary/20 transition-colors">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground">3</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Pending Tasks</div>
            </CardContent>
          </Card>
          <Card className="border-border hover:border-primary/20 transition-colors">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground">2</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Notifications</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Chat */}
          <Card className="border-border hover:border-primary/20 transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                    AI Chat Assistant
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Get help with your tasks using AI-powered assistance
                  </p>
                  <Button 
                    onClick={() => navigate('/chat')} 
                    size="sm" 
                    className="mt-3 text-xs sm:text-sm"
                  >
                    Start Chatting
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workspace */}
          <Card className="border-border hover:border-primary/20 transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-blue-500 transition-colors">
                    Enterprise Workspace
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Access your enterprise workspace with AI-powered tools
                  </p>
                  <Button 
                    onClick={() => navigate('/workspace-new')} 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 text-xs sm:text-sm"
                  >
                    Open Workspace
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card className="border-border hover:border-primary/20 transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-green-500 transition-colors">
                    Task Management
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Manage your tasks and track your progress
                  </p>
                  <Button 
                    onClick={() => navigate('/tasks')} 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 text-xs sm:text-sm"
                  >
                    View Tasks
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                    <p className="text-sm sm:text-base font-medium text-foreground">Started new conversation</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-foreground">Completed task: Review documents</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-foreground">Accessed workspace</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
