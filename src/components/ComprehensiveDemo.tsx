import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { demoUsers, getDemoStats } from "@/data/comprehensiveDemoData";
import DemoEmployeeDashboard from "./demo/DemoEmployeeDashboard";
import DemoChatInterface from "./demo/DemoChatInterface";
import DemoSpaceManagement from "./demo/DemoSpaceManagement";
import DemoWorkspaceManagement from "./demo/DemoWorkspaceManagement";
import DemoAdminDashboard from "./demo/DemoAdminDashboard";

interface ComprehensiveDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

type DemoView = 'dashboard' | 'chat' | 'spaces' | 'workspaces' | 'admin' | 'landing';

const ComprehensiveDemo = ({ isOpen, onClose }: ComprehensiveDemoProps) => {
  const [currentView, setCurrentView] = useState<DemoView>('dashboard');
  const [currentUser, setCurrentUser] = useState(demoUsers[2]); // Demo User
  const [runTour, setRunTour] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tourSteps: Step[] = [
    {
      target: '.demo-user-switcher',
      content: 'Switch between different user roles (Employee, Manager, Admin) to see different experiences.',
      disableBeacon: true,
    },
    {
      target: '.demo-navigation',
      content: 'Navigate through different areas of the product - Dashboard, Chat, Spaces, and Workspaces.',
    },
    {
      target: '.demo-main-content',
      content: 'This shows the actual product interface with real-looking data. Everything is interactive but uses demo data.',
    },
    {
      target: '.demo-stats',
      content: 'All statistics and data are dynamically generated from our demo dataset.',
    },
    {
      target: '.demo-exit',
      content: 'Ready to try the real product? Exit the demo to sign up for your own workspace!',
    },
  ];

  useEffect(() => {
    if (isOpen) {
      // Start tour after a brief delay
      setTimeout(() => setRunTour(true), 1500);
    } else {
      setRunTour(false);
    }
  }, [isOpen]);

  const handleTourCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
    }
  };

  const handleUserSwitch = (user: typeof demoUsers[0]) => {
    setCurrentUser(user);
    // Switch to appropriate default view based on role
    if (user.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
  };

  const renderNavigation = () => (
    <div className={`demo-navigation bg-card border-r border-border transition-all duration-300 ${
      sidebarOpen ? 'w-64' : 'w-16'
    } flex flex-col h-full`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <img 
                  src="/lovable-uploads/92fd1f43-ec1e-4562-9a19-fd70618ad920.png" 
                  alt="Weez AI" 
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Weez AI</h2>
                <Badge variant="secondary" className="text-xs bg-yellow-500/10 text-yellow-600">
                  DEMO
                </Badge>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* User Switcher */}
      {sidebarOpen && (
        <div className="demo-user-switcher p-4 border-b border-border">
          <h3 className="text-sm font-medium mb-3">Switch User Role</h3>
          <div className="space-y-2">
            {demoUsers.slice(0, 3).map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserSwitch(user)}
                className={`w-full p-2 rounded-lg border text-left transition-colors ${
                  currentUser.id === user.id 
                    ? 'bg-primary/10 border-primary/20 text-primary' 
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{user.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'chat', label: 'AI Chat', icon: '💬' },
            { id: 'spaces', label: 'Spaces', icon: '🏢' },
            { id: 'workspaces', label: 'Workspaces', icon: '📁' },
            ...(currentUser.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: '⚙️' }] : [])
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as DemoView)}
              className={`w-full p-3 rounded-lg transition-colors text-left ${
                currentView === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Demo Stats */}
      {sidebarOpen && (
        <div className="demo-stats p-4 border-t border-border">
          <h3 className="text-sm font-medium mb-2">Demo Stats</h3>
          <div className="space-y-1 text-xs text-muted-foreground">
            {(() => {
              const stats = getDemoStats();
              return (
                <>
                  <div>Files: {stats.totalFiles}</div>
                  <div>Conversations: {stats.totalConversations}</div>
                  <div>Spaces: {stats.totalSpaces}</div>
                  <div>Tasks: {stats.completedTasks}/{stats.totalTasks}</div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );

  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DemoEmployeeDashboard currentUser={currentUser} />;
      case 'chat':
        return <DemoChatInterface currentUser={currentUser} />;
      case 'spaces':
        return <DemoSpaceManagement currentUser={currentUser} />;
      case 'workspaces':
        return <DemoWorkspaceManagement currentUser={currentUser} />;
      case 'admin':
        return <DemoAdminDashboard currentUser={currentUser} />;
      default:
        return <DemoEmployeeDashboard currentUser={currentUser} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        callback={handleTourCallback}
        styles={{
          options: {
            primaryColor: 'hsl(var(--primary))',
            backgroundColor: 'hsl(var(--background))',
            textColor: 'hsl(var(--foreground))',
            arrowColor: 'hsl(var(--background))',
          }
        }}
      />
      
      <div className="h-full w-full bg-background flex flex-col">
        {/* Demo Header */}
        <header className="bg-background/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Weez AI - Complete Product Demo</h1>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                {currentUser.avatar}
              </div>
              <span className="text-sm">{currentUser.name}</span>
              <Badge variant="outline" className="text-xs capitalize">
                {currentUser.role}
              </Badge>
            </div>
          </div>
          
          <Button 
            onClick={onClose}
            variant="ghost" 
            size="sm"
            className="demo-exit"
          >
            <X className="w-4 h-4 mr-2" />
            Exit Demo & Try Real Product
          </Button>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {renderNavigation()}
          
          <div className="demo-main-content flex-1 overflow-auto">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveDemo;