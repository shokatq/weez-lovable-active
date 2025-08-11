import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, FileText as FileIcon, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ProjectSpaces from '@/components/employee/ProjectSpaces';
import GlobalSearch from '@/components/employee/GlobalSearch';
import ConnectedPlatforms from '@/components/employee/ConnectedPlatforms';
import PinnedSection from '@/components/employee/PinnedSection';
import ActivityFeed from '@/components/employee/ActivityFeed';
import ContentLibrary from '@/components/employee/ContentLibrary';
import MyTasks from '@/components/employee/MyTasks';
import AskAIBox from '@/components/employee/AskAIBox';
import Recommendations from '@/components/employee/Recommendations';
const EmployeeDashboard = () => {
  const { user, signOut } = useAuth();
  const { userRole, loading } = useUserRole();

  useEffect(() => {
    document.title = 'Employee Dashboard • Weez AI';
    const desc = 'Access workspace documents, upload files, search, and view your tasks.';
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
              <h1 className="text-xl font-semibold text-foreground">Employee Workspace</h1>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {userRole?.role || 'employee'}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search documents..." 
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
          {/* 3-column responsive layout: left (spaces), center (main), right (AI) */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_340px] gap-6">
            {/* Left: Project Spaces */}
            <div>
              <ProjectSpaces />
            </div>

            {/* Center: Main Tabs */}
            <div>
              <Tabs defaultValue="dashboard" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 bg-card border border-border">
                  <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Dashboard</TabsTrigger>
                  <TabsTrigger value="library" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Library</TabsTrigger>
                  <TabsTrigger value="tasks" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">My Tasks</TabsTrigger>
                  <TabsTrigger value="search" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Search</TabsTrigger>
                </TabsList>

                {/* Unified Dashboard */}
                <TabsContent value="dashboard" className="space-y-6">
                  <GlobalSearch />
                  <ConnectedPlatforms />
                  <PinnedSection />
                  <ActivityFeed />
                </TabsContent>

                {/* Content & Asset Library */}
                <TabsContent value="library" className="space-y-6">
                  <ContentLibrary />
                </TabsContent>

                {/* My Tasks */}
                <TabsContent value="tasks" className="space-y-6">
                  <MyTasks />
                </TabsContent>

                {/* Global Search dedicated */}
                <TabsContent value="search" className="space-y-6">
                  <GlobalSearch />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right: Ask AI and Recommendations */}
            <div className="space-y-6">
              <AskAIBox />
              <Recommendations />
            </div>
          </div>
        </div>
    </div>
  );
};

export default EmployeeDashboard;
