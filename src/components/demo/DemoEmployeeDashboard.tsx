import { FileText, MessageSquare, CheckCircle, Clock, Building2, AlertCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { demoTasks, demoActivities, demoSpaces, DemoUser } from '@/data/comprehensiveDemoData';

interface DemoEmployeeDashboardProps {
  currentUser: DemoUser;
}

const DemoEmployeeDashboard = ({ currentUser }: DemoEmployeeDashboardProps) => {
  const userTasks = demoTasks.filter(task => task.assignedTo === currentUser.email);
  const completedTasks = userTasks.filter(task => task.status === 'completed');
  const pendingTasks = userTasks.filter(task => task.status !== 'completed');

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Welcome back, {currentUser.name}!
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here's your personalized workspace with all the tools you need to be productive.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border hover:border-primary/20 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">12</div>
              <div className="text-sm text-muted-foreground">Active Chats</div>
            </CardContent>
          </Card>
          
          <Card className="border-border hover:border-primary/20 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-foreground">{completedTasks.length}</div>
              <div className="text-sm text-muted-foreground">Completed Tasks</div>
            </CardContent>
          </Card>
          
          <Card className="border-border hover:border-primary/20 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-foreground">{pendingTasks.length}</div>
              <div className="text-sm text-muted-foreground">Pending Tasks</div>
            </CardContent>
          </Card>
          
          <Card className="border-border hover:border-primary/20 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-foreground">2</div>
              <div className="text-sm text-muted-foreground">Notifications</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* AI Chat Assistant */}
          <Card className="border-border hover:border-primary/20 transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    AI Chat Assistant
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get instant help with your tasks using AI-powered assistance
                  </p>
                  <Button size="sm" className="w-full">
                    Start Chatting
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Spaces */}
          <Card className="border-border hover:border-primary/20 transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Building2 className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-blue-500 transition-colors mb-2">
                    My Spaces
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Collaborate in project spaces with your team
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Spaces ({demoSpaces.length})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Management */}
          <Card className="border-border hover:border-primary/20 transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-green-500 transition-colors mb-2">
                    My Tasks
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track your progress and manage assignments
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Tasks ({userTasks.length})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  My Tasks
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userTasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge
                        variant={task.status === 'completed' ? 'default' : 
                               task.status === 'in-progress' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Due: {task.dueDate}</span>
                      <Badge
                        variant={task.priority === 'high' ? 'destructive' : 
                               task.priority === 'medium' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
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
                <AlertCircle className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoActivities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'message' ? 'bg-primary/10' :
                      activity.type === 'task_completed' ? 'bg-green-500/10' :
                      activity.type === 'file_upload' ? 'bg-blue-500/10' :
                      'bg-orange-500/10'
                    }`}>
                      {activity.type === 'message' && <MessageSquare className="w-5 h-5 text-primary" />}
                      {activity.type === 'task_completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {activity.type === 'file_upload' && <FileText className="w-5 h-5 text-blue-500" />}
                      {activity.type === 'space_created' && <Building2 className="w-5 h-5 text-orange-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp.toLocaleTimeString()} • {activity.user.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DemoEmployeeDashboard;