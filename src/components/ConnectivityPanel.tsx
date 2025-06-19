
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  color: string;
  isCustomRequest?: boolean;
  isConnecting?: boolean;
}

const ConnectivityPanel = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Access your documents and files",
      icon: "/lovable-uploads/ae039732-12c4-43f6-9bb0-7637273d577c.png",
      connected: false,
      color: "bg-white",
      isConnecting: false
    },
    {
      id: "onedrive",
      name: "OneDrive",
      description: "Sync files from Microsoft OneDrive",
      icon: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg",
      connected: false,
      color: "bg-blue-600",
      isConnecting: false
    },
    {
      id: "dropbox",
      name: "Dropbox",
      description: "Connect to your Dropbox storage",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Dropbox_logo_2017.svg",
      connected: false,
      color: "bg-blue-500",
      isConnecting: false
    },
    {
      id: "slack",
      name: "Slack",
      description: "Integrate with your team communications", 
      icon: "/lovable-uploads/2b21fecb-5fe6-44fb-8e1a-ac8d0a358617.png",
      connected: false,
      color: "bg-white",
      isConnecting: false
    },
    {
      id: "notion",
      name: "Notion", 
      description: "Connect your workspace and databases",
      icon: "/lovable-uploads/ff191e8c-d8df-45af-a5da-a8f49ee636ee.png",
      connected: false,
      color: "bg-white",
      isConnecting: false
    },
    {
      id: "confluence",
      name: "Confluence",
      description: "Access team documentation and wikis",
      icon: "https://upload.wikimedia.org/wikipedia/commons/0/09/Confluence_icon.svg",
      connected: false,
      color: "bg-blue-700",
      isConnecting: false
    },
    {
      id: "custom-request",
      name: "Request Customised Connection",
      description: "Need a specific integration? Let us know!",
      icon: "",
      connected: false,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      isCustomRequest: true,
      isConnecting: false
    }
  ]);

  const handleConnect = async (id: string) => {
    if (id === "custom-request") {
      toast({
        title: "Custom Request Submitted",
        description: "We'll get back to you with integration options soon!",
      });
      return;
    }
    
    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    if (integration.connected) {
      // Disconnect
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === id 
            ? { ...integration, connected: false }
            : integration
        )
      );
      
      toast({
        title: `${integration.name} Disconnected`,
        description: "Your account has been safely disconnected.",
        variant: "destructive"
      });
      return;
    }

    // Start connecting animation
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, isConnecting: true }
          : integration
      )
    );

    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Complete connection
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, connected: true, isConnecting: false }
          : integration
      )
    );

    toast({
      title: `${integration.name} Connected Successfully!`,
      description: "Your files are now accessible through Weezy AI.",
    });
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
              <div className={`w-8 h-8 rounded-lg ${integration.color} p-1 flex items-center justify-center relative`}>
                {integration.isCustomRequest ? (
                  <Plus className="w-5 h-5 text-white" />
                ) : (
                  <>
                    <img 
                      src={integration.icon} 
                      alt={integration.name}
                      className="w-6 h-6 object-contain"
                    />
                    {integration.connected && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </>
                )}
                {integration.isConnecting && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded-lg animate-pulse"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-white text-sm">{integration.name}</h3>
                  {integration.connected && !integration.isCustomRequest && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs border-green-500/30 animate-pulse">
                      Connected
                    </Badge>
                  )}
                  {integration.isConnecting && (
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs border-blue-500/30 animate-pulse">
                      Connecting...
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-400">{integration.description}</p>
              </div>
            </div>
            <Button
              onClick={() => handleConnect(integration.id)}
              disabled={integration.isConnecting}
              variant={integration.connected && !integration.isCustomRequest ? "outline" : "default"}
              size="sm"
              className={
                integration.isCustomRequest 
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xs h-7 px-2"
                  : integration.connected 
                    ? "text-gray-400 border-gray-700 hover:bg-gray-800 text-xs h-7 px-2 bg-black" 
                    : integration.isConnecting
                      ? "bg-blue-500 text-white text-xs h-7 px-2 animate-pulse"
                      : "bg-white hover:bg-gray-200 text-black text-xs h-7 px-2"
              }
            >
              {integration.isCustomRequest ? "Request" : 
               integration.isConnecting ? "Connecting..." :
               integration.connected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ConnectivityPanel;
