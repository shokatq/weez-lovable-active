import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Check, AlertCircle, Wifi, WifiOff, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { syncGoogleDrive, syncSlack } from "@/services/fastApiService";

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
  const socketRef = useRef<WebSocket | null>(null);
  const [wsStatus, setWsStatus] = useState<WebSocketStatus>({ connected: false, reconnecting: false });
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<string | null>(null);

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Access your documents and files",
      icon: "/lovable-uploads/ae039732-12c4-43f6-9bb0-7637273d577c.png",
      connected: false,
      color: "bg-black border border-gray-700",
      isConnecting: false,
      isSyncing: false
    },
    {
      id: "onedrive",
      name: "OneDrive",
      description: "Sync files from Microsoft OneDrive",
      icon: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg",
      connected: false,
      color: "bg-blue-900/50 border border-blue-700",
      isConnecting: false,
      isSyncing: false
    },
    {
      id: "dropbox",
      name: "Dropbox",
      description: "Connect to your Dropbox storage",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Dropbox_logo_2017.svg",
      connected: false,
      color: "bg-blue-800/50 border border-blue-600",
      isConnecting: false,
      isSyncing: false
    },
    {
      id: "slack",
      name: "Slack",
      description: "Integrate with your team communications",
      icon: "/lovable-uploads/2b21fecb-5fe6-44fb-8e1a-ac8d0a358617.png",
      connected: false,
      color: "bg-black border border-gray-700",
      isConnecting: false,
      isSyncing: false
    },
    {
      id: "notion",
      name: "Notion",
      description: "Connect your workspace and databases",
      icon: "/lovable-uploads/ff191e8c-d8df-45af-a5da-a8f49ee636ee.png",
      connected: false,
      color: "bg-black border border-gray-700",
      isConnecting: false,
      isSyncing: false
    },
    {
      id: "confluence",
      name: "Confluence",
      description: "Access team documentation and wikis",
      icon: "/lovable-uploads/b3623f20-0cca-49eb-bf58-e28d521f52e1.png",
      connected: false,
      color: "bg-blue-900/50 border border-blue-700",
      isConnecting: false,
      isSyncing: false
    },
    {
      id: "custom-request",
      name: "Request Custom Connection",
      description: "Need a specific integration? Let us know!",
      icon: "",
      connected: false,
      color: "bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600",
      isCustomRequest: true,
      isConnecting: false,
      isSyncing: false
    }
  ]);

  // --- Start of Unchanged Logic ---
  // (All the existing hooks, functions like handleConnect, handleWebSocketMessage, etc., remain here without any changes to their logic.)

  const platformMapping = {
    "google-drive": "google",
    "onedrive": "microsoft",
    "dropbox": "dropbox",
    "notion": "notion",
    "slack": "slack",
    "confluence": "confluence"
  };

  const reversePlatformMapping = {
    "google_drive": "google-drive",
    "google": "google-drive",
    "microsoft": "onedrive",
    "onedrive": "onedrive",
    "dropbox": "dropbox",
    "notion": "notion",
    "slack": "slack",
    "confluence": "confluence"
  };

  const baseUrl = 'https://platform-connection-api-g0b5c3fve2dfb2ag.canadacentral-01.azurewebsites.net';

  useEffect(() => {
    if (!user?.email) return;

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connectWebSocket = () => {
      try {
        const wsUrl = baseUrl.replace('https://', 'wss://').replace('http://', 'ws://') + '/ws';
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          console.log('WebSocket connected');
          setWsStatus({ connected: true, reconnecting: false });
          reconnectAttempts = 0;
          socket.send(JSON.stringify({ type: 'join_user_room', user_email: user.email }));
          toast({
            title: "Real-time Updates Connected",
            description: "You'll now receive live updates for platform connections.",
          });
        };

        socket.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          setWsStatus({ connected: false, reconnecting: false });
          if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
            setWsStatus({ connected: false, reconnecting: true });
            setTimeout(() => {
              reconnectAttempts++;
              connectWebSocket();
            }, Math.pow(2, reconnectAttempts) * 1000);
          }
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          setWsStatus({ connected: false, reconnecting: false });
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        setWsStatus({ connected: false, reconnecting: false });
      }
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close(1000, 'Component unmounting');
      }
      socketRef.current = null;
    };
  }, [user?.email]);

  const handleWebSocketMessage = (data: any) => {
    const { type, platform, platform_name, message, error, files_synced } = data;
    const platformId = reversePlatformMapping[platform as keyof typeof reversePlatformMapping];
    if (!platformId) return;

    switch (type) {
      case 'platform_connected':
        setIntegrations(prev => prev.map(i => i.id === platformId ? { ...i, connected: true, isConnecting: false } : i));
        toast({ title: `${platform_name || platform} Connected!`, description: message || "Platform connected successfully." });
        break;
      case 'platform_connection_error':
        setIntegrations(prev => prev.map(i => i.id === platformId ? { ...i, isConnecting: false } : i));
        toast({ title: "Connection Failed", description: error || "Failed to connect platform.", variant: "destructive" });
        break;
      case 'platform_disconnected':
        setIntegrations(prev => prev.map(i => i.id === platformId ? { ...i, connected: false, isConnecting: false } : i));
        toast({ title: "Platform Disconnected", description: message || "Platform has been disconnected.", variant: "destructive" });
        break;
      case 'sync_started':
        setIntegrations(prev => prev.map(i => i.id === platformId ? { ...i, isSyncing: true } : i));
        toast({ title: "Sync Started", description: message || "File synchronization has started." });
        break;
      case 'sync_completed':
        setIntegrations(prev => prev.map(i => i.id === platformId ? { ...i, isSyncing: false } : i));
        toast({ title: "Sync Completed", description: message || `Synchronized ${files_synced || 0} files.` });
        break;
      case 'sync_error':
        setIntegrations(prev => prev.map(i => i.id === platformId ? { ...i, isSyncing: false } : i));
        toast({ title: "Sync Failed", description: error || "File synchronization failed.", variant: "destructive" });
        break;
      case 'platform_status_changed':
        setIntegrations(prev => prev.map(i => i.id === platformId ? { ...i, connected: data.connected } : i));
        break;
    }
  };

  useEffect(() => {
    if (user?.email) {
      checkPlatformStatuses();
    }
  }, [user?.email]);

  const checkPlatformStatuses = async () => {
    if (!user?.email) return;
    try {
      const response = await fetch(`${baseUrl}/platforms/status?user_email=${encodeURIComponent(user.email)}`);
      if (response.ok) {
        const data = await response.json();
        const platformStatuses = data.platforms || {};
        setIntegrations(prev =>
          prev.map(integration => {
            const platformKey = platformMapping[integration.id as keyof typeof platformMapping];
            return platformKey && platformStatuses[platformKey]
              ? { ...integration, connected: platformStatuses[platformKey].connected || false }
              : integration;
          })
        );
      } else {
        console.warn('Failed to fetch platform statuses:', response.status);
      }
    } catch (error) {
      console.error('Error checking platform statuses:', error);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const allowedOrigins = [
        'https://platform-connection-api-g0b5c3fve2dfb2ag.canadacentral-01.azurewebsites.net',
        'https://accounts.google.com',
        'https://login.microsoftonline.com',
        'https://www.dropbox.com',
        'https://api.notion.com',
        'https://slack.com'
      ];
      if (!allowedOrigins.some(origin => event.origin.startsWith(origin))) return;

      const { type, platform, success, message, error } = event.data;
      if (type === 'PLATFORM_AUTH_RESULT' || type === 'oauth_result') {
        const integration = integrations.find(i => platformMapping[i.id as keyof typeof platformMapping] === platform || i.id === platform);
        if (integration) {
          setIntegrations(prev => prev.map(i => i.id === integration.id ? { ...i, connected: success, isConnecting: false } : i));
          if (success) {
            toast({ title: `${integration.name} Connected!`, description: message || "Your account has been connected." });
            if (integration.id === 'google-drive' && user?.email) {
              setIntegrations(prev => prev.map(i => i.id === integration.id ? { ...i, isSyncing: true } : i));
              syncGoogleDrive(user.email).catch(err => {
                console.error('Google Drive sync error:', err);
                setIntegrations(prev => prev.map(i => i.id === integration.id ? { ...i, isSyncing: false } : i));
              });
            } else if (integration.id === 'slack' && user?.email) {
              setIntegrations(prev => prev.map(i => i.id === integration.id ? { ...i, isSyncing: true } : i));
              syncSlack(user.email).catch(err => {
                console.error('Slack sync error:', err);
                setIntegrations(prev => prev.map(i => i.id === integration.id ? { ...i, isSyncing: false } : i));
              });
            }
          } else {
            toast({ title: "Connection Failed", description: error || `Could not connect to ${integration.name}.`, variant: "destructive" });
          }
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [integrations, user?.email, toast]);

  const startStatusPolling = (platformId: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      if (!user?.email) return;
      try {
        const response = await fetch(`${baseUrl}/platforms/status?user_email=${encodeURIComponent(user.email)}`);
        if (response.ok) {
          const data = await response.json();
          const platformStatuses = data.platforms || {};
          const platformKey = platformMapping[platformId as keyof typeof platformMapping];
          if (platformKey && platformStatuses[platformKey]?.connected) {
            setIntegrations(prev => prev.map(i => i.id === platformId ? { ...i, connected: true, isConnecting: false } : i));
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            const integration = integrations.find(i => i.id === platformId);
            if (integration) {
              toast({ title: `${integration.name} Connected!`, description: "Platform connected successfully." });
            }
          }
        }
      } catch (error) {
        console.error('Error polling platform status:', error);
      }
    }, 3000);

    setTimeout(() => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        setIntegrations(prev => prev.map(i => i.id === platformId && i.isConnecting ? { ...i, isConnecting: false } : i));
      }
    }, 120000);
  };

  const handleConnect = async (id: string) => {
    if (!user?.email) {
      toast({ title: "Authentication Required", description: "Please sign in to connect platforms.", variant: "destructive" });
      return;
    }

    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    // Show disclaimer for platform connections
    if (!integration.connected && platformMapping[id as keyof typeof platformMapping]) {
      setPendingConnection(id);
      setShowDisclaimer(true);
      return;
    }

    if (id === "custom-request") {
      const subject = "Custom Integration Request - Weez AI";
      const body = `Hello Weez AI Team,\n\nI would like to request a custom integration for my company.\n\nCompany Name: [Your Company Name]\nIntegration Needed: [Describe the platform/service]\nUse Case: [Explain your use case]\n\nBest regards,\n[Your Name]`;
      const mailtoLink = `mailto:weatweez@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
      toast({ title: "Email Client Opened", description: "Please complete and send the request email." });
      return;
    }

    if (integration.connected) {
      try {
        const platformEndpoint = platformMapping[id as keyof typeof platformMapping];
        if (platformEndpoint) {
          const response = await fetch(`${baseUrl}/disconnect/${platformEndpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_email: user.email })
          });
          if (response.ok) {
            setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: false } : i));
            toast({ title: `${integration.name} Disconnected`, description: "Platform disconnected successfully." });
          } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to disconnect');
          }
        }
      } catch (error) {
        console.error('Disconnect error:', error);
        toast({ title: "Disconnect Failed", description: error instanceof Error ? error.message : "Could not disconnect.", variant: "destructive" });
      }
      return;
    }

    if (!platformMapping[id as keyof typeof platformMapping]) {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, isConnecting: true } : i));
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: true, isConnecting: false } : i));
      toast({ title: `${integration.name} Connected!`, description: "Files are now accessible." });
      return;
    }

    // Proceed with connection after disclaimer agreement
    if (pendingConnection) {
      await proceedWithConnection(pendingConnection);
      setPendingConnection(null);
    }
  };

  const proceedWithConnection = async (id: string) => {
    if (!user?.email) return;

    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    try {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, isConnecting: true } : i));

      // Call the backend API based on platform
      const platformEndpoint = platformMapping[id as keyof typeof platformMapping];
      if (platformEndpoint) {
        const response = await fetch(`https://platform-connection-api-g0b5c3fve2dfb2ag.canadacentral-01.azurewebsites.net/sync/${platformEndpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_email: user.email })
        });

        if (response.ok) {
          setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: true, isConnecting: false } : i));
          toast({ title: `${integration.name} Connected!`, description: "Platform connected successfully." });
        } else {
          throw new Error('Failed to connect platform');
        }
      } else {
        // Fallback to existing auth flow for platforms not in mapping
        const authUrl = `${baseUrl}/auth/${platformEndpoint}?user_email=${encodeURIComponent(user.email)}`;
        const popup = window.open(authUrl, `${integration.name.replace(/\s+/g, '_')}_auth`, 'width=600,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no,left=' + (window.screen.width / 2 - 300) + ',top=' + (window.screen.height / 2 - 350));

        if (!popup) throw new Error('Popup blocked. Please allow popups for this site.');
        startStatusPolling(id);

        const checkClosed = setInterval(() => {
          if (popup && popup.closed) {
            clearInterval(checkClosed);
            setTimeout(async () => {
              await checkPlatformStatuses();
              setIntegrations(prev => prev.map(i => i.id === id && i.isConnecting ? { ...i, isConnecting: false } : i));
            }, 2000);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Connection error:', error);
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, isConnecting: false } : i));
      const errorMessage = error instanceof Error ? error.message : "Could not connect. Please try again.";
      toast({ title: "Connection Failed", description: errorMessage, variant: "destructive" });
    }
  };

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // --- End of Unchanged Logic ---


  // --- Start of Refactored JSX ---

  const getStatusBadge = (integration: Integration) => {
    if (integration.isConnecting) {
      return (
        <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-700 text-xs font-medium">
          Connecting...
        </Badge>
      );
    }
    if (integration.isSyncing) {
      return (
        <Badge variant="outline" className="bg-yellow-900/50 text-yellow-300 border-yellow-700 text-xs font-medium">
          Syncing...
        </Badge>
      );
    }
    if (integration.connected && !integration.isCustomRequest) {
      return (
        <Badge variant="outline" className="bg-green-900/50 text-green-300 border-green-700 text-xs font-medium">
          Connected
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card className="w-full bg-black/50 border-gray-800 shadow-2xl shadow-blue-900/20 backdrop-blur-lg">
      <CardHeader className="pb-4 border-b border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-xl font-bold text-gray-100">Connected Services</CardTitle>
            <CardDescription className="text-gray-400 font-medium mt-1">
              Connect your platforms to enhance Weez's capabilities.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-900/50 rounded-lg border border-gray-700 self-start sm:self-center">
            {wsStatus.connected ? (
              <div className="flex items-center gap-2 text-green-400">
                <Wifi className="w-4 h-4" />
                <span className="text-xs font-medium">Live</span>
              </div>
            ) : wsStatus.reconnecting ? (
              <div className="flex items-center gap-2 text-yellow-400">
                <WifiOff className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-medium">Reconnecting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-400">
                <WifiOff className="w-4 h-4" />
                <span className="text-xs font-medium">Offline</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-3 max-h-[65vh] sm:max-h-[70vh] overflow-y-auto">
        {integrations.map((integration, index) => (
          <div
            key={integration.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl bg-gray-900/70 hover:bg-gray-800/70 transition-all duration-300 border border-gray-800 hover:border-blue-800/50 group animate-fade-in"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className={cn("w-12 h-12 rounded-xl p-2 flex items-center justify-center relative shadow-md group-hover:shadow-lg transition-all duration-300 flex-shrink-0", integration.color)}>
                {integration.isCustomRequest ? (
                  <Plus className="w-6 h-6 text-gray-300" />
                ) : (
                  <>
                    <img
                      src={integration.icon}
                      alt={integration.name}
                      className="w-8 h-8 object-contain"
                    />
                    {integration.connected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </>
                )}
                {(integration.isConnecting || integration.isSyncing) && (
                  <div className="absolute inset-0 bg-blue-500/30 rounded-xl animate-pulse"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-gray-100 text-base truncate">{integration.name}</h3>
                  {getStatusBadge(integration)}
                </div>
                <p className="text-sm text-gray-400 font-medium truncate">{integration.description}</p>
              </div>
            </div>

            <div className="flex-shrink-0 mt-4 sm:mt-0 sm:ml-4">
              <Button
                onClick={() => handleConnect(integration.id)}
                disabled={integration.isConnecting || integration.isSyncing}
                variant={integration.connected && !integration.isCustomRequest ? "outline" : "default"}
                size="sm"
                className={cn(
                  "w-full sm:w-auto transition-all duration-200 font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-lg",
                  integration.isCustomRequest
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600"
                    : integration.connected
                      ? "text-gray-300 border-gray-700 hover:bg-gray-800 bg-transparent hover:text-white"
                      : (integration.isConnecting || integration.isSyncing)
                        ? "bg-blue-600 text-white cursor-not-allowed"
                        : "bg-white text-black hover:bg-gray-200"
                )}
              >
                {integration.isConnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {integration.isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}

                {integration.isCustomRequest ? (
                  <div className="flex items-center gap-1.5">
                    <span>Request</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                ) : integration.isConnecting ? (
                  "Connecting..."
                ) : integration.isSyncing ? (
                  "Syncing..."
                ) : integration.connected ? (
                  "Disconnect"
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-blue-950/40 rounded-lg border border-blue-800/50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-blue-200 mb-2">Connection Tips:</p>
              <ul className="text-blue-300/80 space-y-1.5 text-xs list-disc list-inside">
                <li>Make sure to allow popups from this site.</li>
                <li>Complete the authorization in the new window.</li>
                <li>Keep this tab open during the connection process.</li>
                <li>If a connection fails, try refreshing the page.</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Disclaimer Dialog */}
      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Data Transfer Agreement
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Before connecting to {pendingConnection ? integrations.find(i => i.id === pendingConnection)?.name : 'this platform'}, please review the following:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-blue-950/40 rounded-lg border border-blue-800/50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-200">
                  <p className="font-semibold mb-2">Important Disclaimer:</p>
                  <p className="text-blue-300/90 leading-relaxed">
                    By clicking "Agree & Connect", you authorize Weez AI to securely transfer and process your files and data from {pendingConnection ? integrations.find(i => i.id === pendingConnection)?.name : 'the selected platform'}.
                    This includes:
                  </p>
                  <ul className="mt-2 space-y-1 text-blue-300/80 text-sm list-disc list-inside">
                    <li>Secure file access and transfer to Weez AI servers</li>
                    <li>Data processing for AI-powered search and analysis</li>
                    <li>Temporary storage for enhanced functionality</li>
                    <li>Encrypted transmission using industry-standard protocols</li>
                  </ul>
                  <p className="mt-3 text-blue-300/90 text-sm">
                    Your data security and privacy are our top priorities. All transfers are encrypted and processed in accordance with our privacy policy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDisclaimer(false);
                setPendingConnection(null);
              }}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Disagree
            </Button>
            <Button
              onClick={() => {
                setShowDisclaimer(false);
                if (pendingConnection) {
                  proceedWithConnection(pendingConnection);
                  setPendingConnection(null);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Agree & Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ConnectivityPanel;