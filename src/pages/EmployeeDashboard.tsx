
import { useState, useEffect } from "react";
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, FileText as FileIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import EmployeeChatCard from '@/components/employee/EmployeeChatCard';
import EmployeeSharedFiles from '@/components/employee/EmployeeSharedFiles';
import EmployeeTasks from '@/components/employee/EmployeeTasks';
import ThemeToggle from "@/components/ThemeToggle";

const EmployeeDashboard = () => {
  const { user, signOut } = useAuth();
  const { userRole, loading } = useUserRole();

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
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-4">
              <FileIcon className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">Employee Dashboard</h1>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {userRole?.teamName || 'Team'}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
              </div>
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Chat */}
        <EmployeeChatCard />

        {/* Two-column grid for Tasks and Shared Files */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmployeeTasks />
          <EmployeeSharedFiles />
        </div>

        {/* Focus/help card */}
        <Card className="p-4 bg-card border-dashed border-border">
          <p className="text-sm text-muted-foreground">
            Need anything else added to your dashboard? Ask your admin to share more files or assign tasks.
          </p>
        </Card>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
