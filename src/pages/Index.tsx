
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, FolderOpen, Search, FileText, ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const quickActions = [
    {
      icon: MessageSquare,
      title: "Chat with Files",
      description: "Ask questions about your documents",
      action: () => navigate('/chat'),
      primary: true
    },
    {
      icon: FolderOpen,
      title: "Browse Workspace",
      description: "Explore your connected platforms",
      action: () => navigate('/workspace')
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find documents instantly",
      action: () => navigate('/chat')
    }
  ];

  const recentActivity = [
    { name: "Q4 Strategy.pdf", platform: "Google Drive", time: "2 hours ago" },
    { name: "Team Meeting Notes", platform: "Notion", time: "1 day ago" },
    { name: "API Documentation", platform: "Slack", time: "2 days ago" },
    { name: "Budget Analysis.xlsx", platform: "Dropbox", time: "3 days ago" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className={`mb-12 transition-all duration-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">
                Good morning! 👋
              </h1>
              <p className="text-gray-600">
                Here's your knowledge workspace overview
              </p>
            </div>
            <Button 
              onClick={() => navigate('/workspace-new')}
              className="notion-button-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Workspace
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-black mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={action.title}
                className={`notion-card cursor-pointer hover-lift transition-all duration-500 ${
                  action.primary ? 'border-black' : ''
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onClick={action.action}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    action.primary ? 'bg-black' : 'bg-gray-100'
                  }`}>
                    <action.icon className={`w-6 h-6 ${
                      action.primary ? 'text-white' : 'text-black'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {action.description}
                    </p>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-black mb-6">Recent Activity</h2>
          <Card className="notion-card">
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 transition-all duration-400 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-black">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.platform}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: "Connected Platforms", value: "5" },
            { label: "Total Documents", value: "1,247" },
            { label: "Searches This Week", value: "89" },
            { label: "Time Saved", value: "12h" }
          ].map((stat, index) => (
            <Card
              key={stat.label}
              className={`notion-card text-center transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${800 + index * 100}ms` }}
            >
              <div className="text-2xl font-bold text-black mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
