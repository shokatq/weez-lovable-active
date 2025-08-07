import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { syncGoogleDrive, syncSlack } from "@/services/fastApiService";
import { io, Socket } from "socket.io-client";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  color: string;
  isCustomRequest?: boolean;
  isConnecting?: boolean;
  isSyncing?: boolean;
}

interface WebSocketStatus {
  connected: boolean;
  reconnecting: boolean;
}

const ConnectivityPanel = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [wsStatus, setWsStatus] = useState<WebSocketStatus>({ connected: false, reconnecting: false });
  
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Access your documents and files",
      icon: "/lovable-uploads/ae039732-12c4-43f6-9bb0-7637273d577c.png",
      connected: false,
      color: "bg-white",
      isConnecting: false,
      isSyncing: false
    },
    {
      id: "onedrive",
      name: "OneDrive",
      description: "Sync files from Microsoft OneDrive",
      icon: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg",
      connected: false,
      color: "bg-blue-600",
      isConnecting: false,
      isSyncing: false
    },
    {
      id: "dropbox",
      name: "Dropbox",
      description: "Connect to your Dropbox storage",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Dropbox_logo_2017.svg",
      connected: false,
      color: "bg-blue-500",
      isConnecting: false,
      isSyncing: false
    },
    {
      id: "slack",
      name: "Slack",
      description: "Integrate with your team communications", 
      icon: "/lovable-uploads/2b21fecb-5fe6-44fb-8e1a-ac8d0a358617.png",
      connected: false,
      color: "bg-white",
      isConnecting: false,
      isSyncing: false
    },
    {
      id: "notion",
      name: "Notion", 
      description: "Connect your workspace and databases",
      icon: "/lovable-uploads/ff191e8c-d8df-45af-a5da-a8f49ee636ee.png",
      connected: false,
      color: "bg-white",
      isConnecting: false,
      isSyncing: false
    },
    {
      id: "confluence",
      name: "Confluence",
      description: "Access team documentation and wikis",
      icon: "/lovable-uploads/b3623f20-0cca-49eb-bf58-e28d521f52e1.png",
      connected: false,
      color: "bg-blue-700",
      isConnecting: false,
      isSyncing: false
    },
    {
      id: "custom-request",
      name: "Request Customised Connection",
      description: "Need a specific integration? Let us know!",
      icon: "",
      connected: false,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      isCustomRequest: true,
      isConnecting: false,
      isSyncing: false
    }
  ]);

  // Platform mapping for backend endpoints
  const platformMapping = {
    "google-drive": "google",
    "onedrive": "microsoft",
    "dropbox": "dropbox",
    "notion": "notion",
    "slack": "slack"
  };

  // Reverse mapping for WebSocket events
  const reversePlatformMapping = {
    "google_drive": "google-drive",
    "onedrive": "onedrive", 
    "dropbox": "dropbox",
    "notion": "notion",
    "slack": "slack"
  };

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user?.email) return;

    const baseUrl = 'https://platform-connection-api-g0b5c3fve2dfb2ag.canadacentral-01.azurewebsites.net';
    
    // Create socket connection
    const socket = io(baseUrl, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      forceNew: true
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('WebSocket connected');
      setWsStatus({ connected: true, reconnecting: false });
      
      // Join user-specific room for real-time updates
      socket.emit('join_user_room', { user_email: user.email });
      
      toast({
        title: "Real-time Updates Connected",
        description: "You'll now receive live updates for platform connections.",
      });
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setWsStatus({ connected: false, reconnecting: false });
    });

    socket.on('reconnect', () => {
      console.log('WebSocket reconnected');
      setWsStatus({ connected: true, reconnecting: false });
      socket.emit('join_user_room', { user_email: user.email });
    });

    socket.on('reconnect_attempt', () => {
      setWsStatus({ connected: false, reconnecting: true });
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setWsStatus({ connected: false, reconnecting: false });
    });

    // Real-time platform event handlers
    socket.on('platform_connected', (data) => {
      console.log('Platform connected:', data);
      const frontendPlatformId = reversePlatformMapping[data.platform as keyof typeof reversePlatformMapping];
      
      if (frontendPlatformId) {
        setIntegrations(prev => 
          prev.map(i => 
            i.id === frontendPlatformId 
              ? { ...i, connected: true, isConnecting: false }
              : i
          )
        );

        toast({
          title: `${data.platform_name} Connected!`,
          description: data.message || "Platform connected successfully.",
        });
      }
    });

    socket.on('platform_connection_error', (data) => {
      console.log('Platform connection error:', data);
      const frontendPlatformId = reversePlatformMapping[data.platform as keyof typeof reversePlatformMapping];
      
      if (frontendPlatformId) {
        setIntegrations(prev => 
          prev.map(i => 
            i.id === frontendPlatformId 
              ? { ...i, isConnecting: false }
              : i
          )
        );

        toast({
          title: "Connection Failed",
          description: data.error || "Failed to connect platform.",
          variant: "destructive"
        });
      }
    });

    socket.on('platform_disconnected', (data) => {
      console.log('Platform disconnected:', data);
      const frontendPlatformId = reversePlatformMapping[data.platform as keyof typeof reversePlatformMapping];
      
      if (frontendPlatformId) {
        setIntegrations(prev => 
          prev.map(i => 
            i.id === frontendPlatformId 
              ? { ...i, connected: false, isConnecting: false }
              : i
          )
        );

        toast({
          title: "Platform Disconnected",
          description: data.message || "Platform has been disconnected.",
          variant: "destructive"
        });
      }
    });

    socket.on('sync_started', (data) => {
      console.log('Sync started:', data);
      const frontendPlatformId = reversePlatformMapping[data.platform as keyof typeof reversePlatformMapping];
      
      if (frontendPlatformId) {
        setIntegrations(prev => 
          prev.map(i => 
            i.id === frontendPlatformId 
              ? { ...i, isSyncing: true }
              : i
          )
        );

        toast({
          title: "Sync Started",
          description: data.message || "File synchronization has started.",
        });
      }
    });

    socket.on('sync_completed', (data) => {
      console.log('Sync completed:', data);
      const frontendPlatformId = reversePlatformMapping[data.platform as keyof typeof reversePlatformMapping];
      
      if (frontendPlatformId) {
        setIntegrations(prev => 
          prev.map(i => 
            i.id === frontendPlatformId 
              ? { ...i, isSyncing: false }
              : i
          )
        );

        toast({
          title: "Sync Completed",
          description: data.message || `Synchronized ${data.files_synced || 0} files.`,
        });
      }
    });

    socket.on('sync_error', (data) => {
      console.log('Sync error:', data);
      const frontendPlatformId = reversePlatformMapping[data.platform as keyof typeof reversePlatformMapping];
      
      if (frontendPlatformId) {
        setIntegrations(prev => 
          prev.map(i => 
            i.id === frontendPlatformId 
              ? { ...i, isSyncing: false }
              : i
          )
        );

        toast({
          title: "Sync Failed",
          description: data.error || "File synchronization failed.",
          variant: "destructive"
        });
      }
    });

    socket.on('platform_status_changed', (data) => {
      console.log('Platform status changed:', data);
      const frontendPlatformId = reversePlatformMapping[data.platform as keyof typeof reversePlatformMapping];
      
      if (frontendPlatformId) {
        setIntegrations(prev => 
          prev.map(i => 
            i.id === frontendPlatformId 
              ? { ...i, connected: data.connected }
              : i
          )
        );
      }
    });

    socket.on('room_joined', (data) => {
      console.log('Joined room for real-time updates:', data);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.emit('leave_user_room', { user_email: user.email });
        socket.disconnect();
      }
      socketRef.current = null;
    };
  }, [user?.email, toast]);

  // Check platform connection status on component mount
  useEffect(() => {
    if (user?.email) {
      checkPlatformStatuses();
    }
  }, [user?.email]);

  const checkPlatformStatuses = async () => {
    if (!user?.email) return;

    try {
      const baseUrl = 'https://platform-connection-api-g0b5c3fve2dfb2ag.canadacentral-01.azurewebsites.net';
      const response = await fetch(`${baseUrl}/platforms/status?user_email=${encodeURIComponent(user.email)}`);
      
      if (response.ok) {
        const data = await response.json();
        const platformStatuses = data.platforms;

        setIntegrations(prev => 
          prev.map(integration => {
            const platformKey = platformMapping[integration.id as keyof typeof platformMapping];
            if (platformKey && platformStatuses[platformKey]) {
              return {
                ...integration,
                connected: platformStatuses[platformKey].connected
              };
            }
            return integration;
          })
        );
      }
    } catch (error) {
      console.error('Error checking platform statuses:', error);
    }
  };

  // Listen for messages from popup windows
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Ensure the message is from our backend domain
      if (event.origin !== 'https://platform-connection-api-g0b5c3fve2dfb2ag.canadacentral-01.azurewebsites.net') {
        return;
      }

      const { type, platform, success, message, error } = event.data;

      if (type === 'PLATFORM_AUTH_RESULT') {
        const integration = integrations.find(i => platformMapping[i.id as keyof typeof platformMapping] === platform);
        
        if (integration) {
          setIntegrations(prev => 
            prev.map(i => 
              i.id === integration.id 
                ? { ...i, connected: success, isConnecting: false }
                : i
            )
          );

          if (success) {
            toast({
              title: `${integration.name} Connected Successfully!`,
              description: message || "Your account has been connected to Weez AI.",
            });

            // Auto-sync files after successful connection
            if (integration.id === 'google-drive' && user?.email) {
              syncGoogleDrive(user.email).catch(console.error);
            } else if (integration.id === 'slack' && user?.email) {
              syncSlack(user.email).catch(console.error);
            }
          } else {
            toast({
              title: "Connection Failed",
              description: error || `Could not connect to ${integration.name}. Please try again.`,
              variant: "destructive"
            });
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [integrations, user?.email, toast]);

  const handleConnect = async (id: string) => {
    // Check if user is authenticated
    if (!user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect your platforms.",
        variant: "destructive"
      });
      return;
    }

    if (id === "custom-request") {
      const subject = "Custom Integration Request - Weez AI";
      const body = `Hello Weez AI Team,

I would like to request a custom integration for my company.

Company Name: [Your Company Name]
Integration Needed: [Describe the platform/service you want to integrate]
Use Case: [Explain how you plan to use this integration]
Contact Information: [Your contact details]

Please let me know the next steps.

Best regards,
[Your Name]`;
      
      const mailtoLink = `mailto:weatweez@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
      
      toast({
        title: "Email Client Opened",
        description: "Please complete and send the integration request email.",
      });
      return;
    }

    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    // Handle disconnect
    if (integration.connected) {
      try {
        const baseUrl = 'https://platform-connection-api-g0b5c3fve2dfb2ag.canadacentral-01.azurewebsites.net';
        const platformEndpoint = platformMapping[id as keyof typeof platformMapping];
        
        if (platformEndpoint) {
          const response = await fetch(`${baseUrl}/disconnect/${platformEndpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_email: user.email })
          });

          if (response.ok) {
            // The WebSocket will handle the UI update
            return;
          } else {
            throw new Error('Failed to disconnect platform');
          }
        }
      } catch (error) {
        toast({
          title: "Disconnect Failed",
          description: "Could not disconnect platform. Please try again.",
          variant: "destructive"
        });
      }
      return;
    }

    // Handle platforms not yet supported by backend
    if (!platformMapping[id as keyof typeof platformMapping]) {
      // Start connecting animation
      setIntegrations(prev => 
        prev.map(i => 
          i.id === id 
            ? { ...i, isConnecting: true }
            : i
        )
      );

      // Simulate connection process for unsupported platforms
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Complete connection
      setIntegrations(prev => 
        prev.map(i => 
          i.id === id 
            ? { ...i, connected: true, isConnecting: false }
            : i
        )
      );

      toast({
        title: `${integration.name} Connected Successfully!`,
        description: "Your files are now accessible through Weez AI.",
      });
      return;
    }

    // Handle supported platforms with backend integration
    try {
      // Start connecting animation
      setIntegrations(prev => 
        prev.map(i => 
          i.id === id 
            ? { ...i, isConnecting: true }
            : i
        )
      );

      const baseUrl = 'https://platform-connection-api-g0b5c3fve2dfb2ag.canadacentral-01.azurewebsites.net';
      const platformEndpoint = platformMapping[id as keyof typeof platformMapping];
      const params = new URLSearchParams({
        user_email: user.email,
        app_origin: window.location.origin,
        redirect_url: `${window.location.origin}/chat`
      });
      const authUrl = `${baseUrl}/auth/${platformEndpoint}?${params.toString()}`;
      // Open popup window for OAuth
      const popup = window.open(
        authUrl, 
        `${integration.name}_auth`, 
        'width=600,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Monitor popup window
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          
          // If popup was closed without success message, reset connecting state
          setTimeout(() => {
            setIntegrations(prev => 
              prev.map(i => 
                i.id === id && i.isConnecting
                  ? { ...i, isConnecting: false }
                  : i
              )
            );
          }, 1000);
        }
      }, 1000);

      // Set timeout for connection attempt
      setTimeout(() => {
        if (!popup.closed) {
          popup.close();
        }
        clearInterval(checkClosed);
      }, 300000); // 5 minutes timeout

    } catch (error) {
      setIntegrations(prev => 
        prev.map(i => 
          i.id === id 
            ? { ...i, isConnecting: false }
            : i
        )
      );
      
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : `Could not connect to ${integration.name}. Please try again.`,
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (integration: Integration) => {
    if (integration.isConnecting) {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs border-blue-200 animate-pulse font-medium flex-shrink-0">
          Connecting...
        </Badge>
      );
    }
    
    if (integration.isSyncing) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs border-yellow-200 animate-pulse font-medium flex-shrink-0">
          Syncing...
        </Badge>
      );
    }
    
    if (integration.connected && !integration.isCustomRequest) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs border-green-200 font-medium flex-shrink-0">
          Connected
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <Card className="w-full bg-white border-gray-200 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">Connected Services</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Connect your favorite platforms to enhance Weez's capabilities
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {wsStatus.connected ? (
              <div className="flex items-center gap-1 text-green-600">
                <Wifi className="w-4 h-4" />
                <span className="text-xs font-medium">Live</span>
              </div>
            ) : wsStatus.reconnecting ? (
              <div className="flex items-center gap-1 text-yellow-600">
                <WifiOff className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-medium">Reconnecting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600">
                <WifiOff className="w-4 h-4" />
                <span className="text-xs font-medium">Offline</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-6 max-h-80 overflow-y-auto">
        {integrations.map((integration, index) => (
          <div 
            key={integration.id} 
            className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-300 hover:shadow-md border border-gray-100 hover:border-gray-200 group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className={`w-12 h-12 rounded-xl ${integration.color} p-2 flex items-center justify-center relative shadow-sm group-hover:shadow-md transition-all duration-300 flex-shrink-0`}>
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
                {(integration.isConnecting || integration.isSyncing) && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded-xl animate-pulse"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-900 text-base truncate">{integration.name}</h3>
                  {getStatusBadge(integration)}
                </div>
                <p className="text-sm text-gray-600 font-medium">{integration.description}</p>
              </div>
            </div>
            
            <div className="flex-shrink-0 ml-4">
              <Button
                onClick={() => handleConnect(integration.id)}
                disabled={integration.isConnecting || integration.isSyncing}
                variant={integration.connected && !integration.isCustomRequest ? "outline" : "default"}
                size="sm"
                className={cn(
                  "transition-all duration-200 font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md",
                  integration.isCustomRequest 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white" 
                    : integration.connected 
                      ? "text-gray-700 border-gray-300 hover:bg-gray-50 bg-white" 
                      : (integration.isConnecting || integration.isSyncing)
                        ? "bg-blue-500 text-white animate-pulse"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                )}
              >
                {integration.isCustomRequest ? "Request" : 
                 integration.isConnecting ? "Connecting..." :
                 integration.isSyncing ? "Syncing..." :
                 integration.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ConnectivityPanel;
