
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    <Card className="w-full bg-white border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">Connected Services</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Connect your favorite platforms to enhance Weezy's capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {integrations.map((integration, index) => (
          <div key={integration.id}>
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${integration.color} flex items-center justify-center text-white text-xl`}>
                  {integration.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{integration.name}</h3>
                    {integration.connected && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        Connected
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              <Button
                onClick={() => handleConnect(integration.id)}
                variant={integration.connected ? "outline" : "default"}
                size="sm"
                className={integration.connected ? 
                  "text-gray-600 border-gray-300 hover:bg-gray-50" : 
                  "bg-gray-900 hover:bg-gray-800 text-white"
                }
              >
                {integration.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
            {index < integrations.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ConnectivityPanel;
