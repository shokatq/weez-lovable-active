
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
      icon: "/lovable-uploads/ae039732-12c4-43f6-9bb0-7637273d577c.png",
      connected: false,
      color: "bg-white"
    },
    {
      id: "onedrive",
      name: "OneDrive",
      description: "Sync files from Microsoft OneDrive",
      icon: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg",
      connected: false,
      color: "bg-blue-600"
    },
    {
      id: "dropbox",
      name: "Dropbox",
      description: "Connect to your Dropbox storage",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Dropbox_logo_2017.svg",
      connected: false,
      color: "bg-blue-500"
    },
    {
      id: "slack",
      name: "Slack",
      description: "Integrate with your team communications", 
      icon: "/lovable-uploads/2b21fecb-5fe6-44fb-8e1a-ac8d0a358617.png",
      connected: false,
      color: "bg-white"
    },
    {
      id: "notion",
      name: "Notion", 
      description: "Connect your workspace and databases",
      icon: "/lovable-uploads/ff191e8c-d8df-45af-a5da-a8f49ee636ee.png",
      connected: false,
      color: "bg-white"
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
    <Card className="w-full bg-black border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white">Connected Services</CardTitle>
        <CardDescription className="text-sm text-gray-400">
          Connect your favorite platforms to enhance Weezy's capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {integrations.map((integration) => (
          <div key={integration.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${integration.color} p-1 flex items-center justify-center`}>
                <img 
                  src={integration.icon} 
                  alt={integration.name}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-white text-sm">{integration.name}</h3>
                  {integration.connected && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs border-green-500/30">
                      Connected
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-400">{integration.description}</p>
              </div>
            </div>
            <Button
              onClick={() => handleConnect(integration.id)}
              variant={integration.connected ? "outline" : "default"}
              size="sm"
              className={integration.connected ? 
                "text-gray-400 border-gray-700 hover:bg-gray-800 text-xs h-7 px-2 bg-black" : 
                "bg-white hover:bg-gray-200 text-black text-xs h-7 px-2"
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
