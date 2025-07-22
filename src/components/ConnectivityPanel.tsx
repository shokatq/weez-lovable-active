
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
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
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
    <Card className="w-full bg-white border-gray-200 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="text-xl font-semibold text-gray-900">Connected Services</CardTitle>
        <CardDescription className="text-gray-600 font-medium">
          Connect your favorite platforms to enhance Weezy's capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-6 max-h-80 overflow-y-auto">
        {integrations.map((integration, index) => (
          <div 
            key={integration.id} 
            className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-300 hover:shadow-md border border-gray-100 hover:border-gray-200 group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${integration.color} p-2 flex items-center justify-center relative shadow-sm group-hover:shadow-md transition-all duration-300`}>
                {integration.isCustomRequest ? (
                  <Plus className="w-6 h-6 text-white" />
                ) : (
                  <>
                    <img 
                      src={integration.icon} 
                      alt={integration.name}
                      className="w-8 h-8 object-contain"
                    />
                    {integration.connected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </>
                )}
                {integration.isConnecting && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded-xl animate-pulse"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900 text-base">{integration.name}</h3>
                  {integration.connected && !integration.isCustomRequest && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs border-green-200 animate-pulse font-medium">
                      Connected
                    </Badge>
                  )}
                  {integration.isConnecting && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs border-blue-200 animate-pulse font-medium">
                      Connecting...
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-medium mt-1">{integration.description}</p>
              </div>
            </div>
            <Button
              onClick={() => handleConnect(integration.id)}
              disabled={integration.isConnecting}
              variant={integration.connected && !integration.isCustomRequest ? "outline" : "default"}
              size="sm"
              className={
                integration.isCustomRequest 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200" 
                  : integration.connected 
                    ? "text-gray-700 border-gray-300 hover:bg-gray-50 font-medium px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200" 
                    : integration.isConnecting
                      ? "bg-blue-500 text-white font-medium px-4 py-2 rounded-lg animate-pulse shadow-sm"
                      : "bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
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
