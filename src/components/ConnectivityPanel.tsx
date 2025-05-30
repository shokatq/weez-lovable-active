
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  color: string;
}

const ConnectivityPanel = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Access your documents and files",
      icon: "📁",
      connected: false,
      color: "bg-blue-500"
    },
    {
      id: "notion",
      name: "Notion",
      description: "Connect your workspace and databases",
      icon: "📝",
      connected: false,
      color: "bg-gray-800"
    },
    {
      id: "slack",
      name: "Slack",
      description: "Integrate with your team communications",
      icon: "💬",
      connected: false,
      color: "bg-purple-600"
    },
    {
      id: "onedrive",
      name: "OneDrive",
      description: "Access Microsoft cloud storage",
      icon: "☁️",
      connected: false,
      color: "bg-blue-600"
    }
  ]);

  const handleConnect = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    );
  };

  return (
    <Card className="w-full bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">Connected Services</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Connect your favorite platforms to enhance Weezy's capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {integrations.map((integration) => (
          <div key={integration.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${integration.color} flex items-center justify-center text-white text-sm`}>
                {integration.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground text-sm">{integration.name}</h3>
                  {integration.connected && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs border-green-500/30">
                      Connected
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{integration.description}</p>
              </div>
            </div>
            <Button
              onClick={() => handleConnect(integration.id)}
              variant={integration.connected ? "outline" : "default"}
              size="sm"
              className={integration.connected ? 
                "text-muted-foreground border-border hover:bg-accent text-xs h-7 px-2" : 
                "bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-7 px-2"
              }
            >
              {integration.connected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ConnectivityPanel;
