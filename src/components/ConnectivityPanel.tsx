import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, Check, AlertCircle, Wifi, WifiOff, ExternalLink, Loader2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

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
  transferProgress?: number;
  filesTransferred?: number;
  totalFiles?: number;
}

interface WebSocketStatus {
  connected: boolean;
  reconnecting: boolean;
}

const ConnectivityPanel = () => {
  const { toast } = useToast();
  const { user } = useAuth();
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

  const platformMapping = {
    "google-drive": "google",
    "onedrive": "microsoft",
    "dropbox": "dropbox",
    "notion": "notion",
    "slack": "slack",
    "confluence": "confluence"
  };

  const baseUrl = 'https://platform-connection-api-g0b5c3fve2dfb2ag.canadacentral-01.azurewebsites.net';

  useEffect(() => {
    if (user?.email) {
      checkPlatformStatuses();
    }
  }, [user?.email]);

  const checkPlatformStatuses = async () => {
    if (!user?.email) return;
    try {
      const response = await fetch(`${baseUrl}/user/platforms?user_email=${encodeURIComponent(user.email)}`);
      if (response.ok) {
        const data = await response.json();
        const connectedPlatforms = data.connected_platforms || [];
        
        setIntegrations(prev =>
          prev.map(integration => {
            const platformKey = platformMapping[integration.id as keyof typeof platformMapping];
            const isConnected = connectedPlatforms.some((p: any) => p.platform === platformKey || p.platform === `${platformKey}_drive`);
            return { ...integration, connected: isConnected };
          })
        );
      } else {
        console.warn('Failed to fetch platform statuses:', response.status);
      }
    } catch (error) {
      console.error('Error checking platform statuses:', error);
    }
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
          const response = await fetch(`${baseUrl}/user/disconnect/${platformEndpoint}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_email: user.email })
          });
          if (response.ok) {
            setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: false } : i));
            toast({ title: `${integration.name} Disconnected`, description: "Platform disconnected successfully." });
          } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to disconnect');
          }
        }
      } catch (error) {
        console.error('Disconnect error:', error);
        toast({ title: "Disconnect Failed", description: error instanceof Error ? error.message : "Could not disconnect.", variant: "destructive" });
      }
      return;
    }
  };

  const proceedWithConnection = async (id: string) => {
    if (!user?.email) return;

    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    const platformEndpoint = platformMapping[id as keyof typeof platformMapping];
    if (!platformEndpoint) {
      console.error(`No platform mapping found for ${id}`);
      toast({
        title: "Configuration Error",
        description: "Platform configuration not found.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIntegrations(prev => prev.map(i => i.id === id ? {
        ...i,
        isConnecting: true,
        transferProgress: 10
      } : i));

      console.log(`Starting OAuth flow for platform: ${platformEndpoint}`);

      // Start OAuth flow - this opens popup window
      const authUrl = `${baseUrl}/auth/${platformEndpoint}?user_email=${encodeURIComponent(user.email)}`;
      const popup = window.open(authUrl, `${integration.name.replace(/\s+/g, '_')}_auth`, 'width=600,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no,left=' + (window.screen.width / 2 - 300) + ',top=' + (window.screen.height / 2 - 350));

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      let authCompleted = false;

      // Start polling to check popup status and platform connection
      const checkAuth = setInterval(async () => {
        if (popup && popup.closed && !authCompleted) {
          clearInterval(checkAuth);
          authCompleted = true;

          // Wait a moment then check connection status
          setTimeout(async () => {
            await checkPlatformStatuses();
            
            // Check if the platform is now connected
            const updatedIntegration = integrations.find(i => i.id === id);
            if (updatedIntegration?.connected) {
              toast({ title: `${integration.name} Connected!`, description: "Platform connected successfully." });
              await startFileSyncWorkflow(id, user.email!);
            } else {
              setIntegrations(prev => prev.map(i => i.id === id ? { ...i, isConnecting: false, transferProgress: 0 } : i));
            }
          }, 2000);
        }
      }, 1000);

      // Set timeout to stop checking after 2 minutes
      setTimeout(() => {
        if (!authCompleted) {
          clearInterval(checkAuth);
          authCompleted = true;
          if (popup && !popup.closed) {
            popup.close();
          }
          setIntegrations(prev => prev.map(i => i.id === id && i.isConnecting ? { ...i, isConnecting: false, transferProgress: 0 } : i));
        }
      }, 120000);

    } catch (error) {
      console.error('Connection error:', error);
      setIntegrations(prev => prev.map(i => i.id === id ? {
        ...i,
        isConnecting: false,
        transferProgress: 0
      } : i));
      const errorMessage = error instanceof Error ? error.message : "Could not connect. Please try again.";
      toast({ title: "Connection Failed", description: errorMessage, variant: "destructive" });
    }
  };

  const startFileSyncWorkflow = async (platformId: string, userEmail: string) => {
    if (!userEmail) return;

    const integration = integrations.find(i => i.id === platformId);
    if (!integration) return;

    const platformEndpoint = platformMapping[platformId as keyof typeof platformMapping];
    if (!platformEndpoint) return;

    try {
      console.log(`Starting file sync workflow for ${platformEndpoint} - user: ${userEmail}`);

      setIntegrations(prev => prev.map(i => i.id === platformId ? {
        ...i,
        isSyncing: true,
        transferProgress: 20
      } : i));

      toast({
        title: "Starting File Sync",
        description: "Starting sync process..."
      });

      // Start file sync using the correct endpoint
      const syncResponse = await fetch(`${baseUrl}/sync/${platformEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: userEmail })
      });

      if (!syncResponse.ok) {
        const errorData = await syncResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Sync failed: ${syncResponse.status}`);
      }

      const syncResult = await syncResponse.json();
      console.log(`Sync completed for ${platformEndpoint}:`, syncResult);

      setIntegrations(prev => prev.map(i => i.id === platformId ? {
        ...i,
        isSyncing: false,
        transferProgress: 100,
        filesTransferred: syncResult.count || 0,
        totalFiles: syncResult.count || 0
      } : i));

      toast({
        title: "Sync Complete!",
        description: `Successfully synced ${syncResult.count || 0} files from ${integration.name}.`
      });

      // Start metadata processing after successful sync
      if (syncResult.count > 0) {
        await startMetadataProcessing(platformId, userEmail);
      }

    } catch (error) {
      console.error('File sync workflow error:', error);
      setIntegrations(prev => prev.map(i => i.id === platformId ? {
        ...i,
        isSyncing: false,
        transferProgress: 0
      } : i));
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "File synchronization failed",
        variant: "destructive"
      });
    }
  };

  const startMetadataProcessing = async (platformId: string, userEmail: string) => {
    try {
      console.log('Starting metadata processing');
      
      setIntegrations(prev => prev.map(i => i.id === platformId ? {
        ...i,
        transferProgress: 85
      } : i));

      toast({
        title: "Starting AI Processing",
        description: "Files synced successfully! Starting AI-powered metadata generation..."
      });

      // Start bulk metadata update
      const metadataResponse = await fetch('https://generate-metadata-cffyg9hva0hugyb4.canadacentral-01.azurewebsites.net/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userEmail,
          batch_size: 5
        }),
        signal: AbortSignal.timeout(15000)
      });

      if (!metadataResponse.ok) {
        const errorText = await metadataResponse.text();
        throw new Error(`Metadata processing failed: ${metadataResponse.status} - ${errorText}`);
      }

      console.log('Metadata processing started successfully');

      // Poll for processing completion
      await pollProcessingProgress(platformId, userEmail);

    } catch (error) {
      console.error('Metadata processing error:', error);
      setIntegrations(prev => prev.map(i => i.id === platformId ? {
        ...i,
        isSyncing: false,
        transferProgress: 0
      } : i));
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "Metadata processing failed",
        variant: "destructive"
      });
    }
  };

  const pollProcessingProgress = async (platformId: string, userEmail: string) => {
    let processingAttempts = 0;
    const maxProcessingAttempts = 120;

    const pollInterval = setInterval(async () => {
      processingAttempts++;

      try {
        const statsResponse = await fetch(`https://generate-metadata-cffyg9hva0hugyb4.canadacentral-01.azurewebsites.net/processing-stats?user_id=${encodeURIComponent(userEmail)}`, {
          method: 'GET',
          signal: AbortSignal.timeout(8000)
        });

        if (statsResponse.ok) {
          const data = await statsResponse.json();
          const stats = data.stats || data;

          const progressPercent = Math.min(99, 85 + (stats.processing_percentage || 0) * 0.14);
          
          setIntegrations(prev => prev.map(i => i.id === platformId ? {
            ...i,
            transferProgress: progressPercent,
            filesTransferred: stats.processed_files || 0,
            totalFiles: stats.total_files || 0
          } : i));

          console.log(`Processing progress: ${stats.processing_percentage}% (${stats.processed_files}/${stats.total_files} files)`);

          if (stats.processing_percentage >= 100) {
            clearInterval(pollInterval);
            
            setIntegrations(prev => prev.map(i => i.id === platformId ? {
              ...i,
              isSyncing: false,
              transferProgress: 100,
              filesTransferred: stats.processed_files || 0,
              totalFiles: stats.total_files || 0
            } : i));

            toast({
              title: "Processing Complete!",
              description: `Successfully processed ${stats.processed_files} files with AI-powered search capabilities.`
            });
          }
        }

        if (processingAttempts >= maxProcessingAttempts) {
          clearInterval(pollInterval);
          console.warn('Processing polling timeout reached');
          
          setIntegrations(prev => prev.map(i => i.id === platformId ? {
            ...i,
            isSyncing: false,
            transferProgress: 0
          } : i));

          toast({
            title: "Processing Timeout",
            description: "Processing is taking longer than expected. Please check back later.",
            variant: "destructive"
          });
        }

      } catch (error) {
        console.warn('Error polling processing progress:', error);
        if (processingAttempts >= maxProcessingAttempts) {
          clearInterval(pollInterval);
        }
      }
    }, 15000);

    setTimeout(() => {
      clearInterval(pollInterval);
    }, 1800000);
  };

  const triggerMetadataProcessing = async (userEmail: string) => {
    if (!userEmail) {
      toast({
        title: "Error",
        description: "User email is required",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log(`Manual metadata processing requested for user: ${userEmail}`);

      toast({
        title: "Checking Service",
        description: "Checking metadata service availability..."
      });

      const healthCheck = await fetch('https://generate-metadata-cffyg9hva0hugyb4.canadacentral-01.azurewebsites.net/health', {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });

      if (!healthCheck.ok) {
        toast({
          title: "Service Unavailable",
          description: "Metadata processing service is currently unavailable. Please try again later.",
          variant: "destructive"
        });
        return;
      }

      const statsResponse = await fetch(`https://generate-metadata-cffyg9hva0hugyb4.canadacentral-01.azurewebsites.net/processing-stats?user_id=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        signal: AbortSignal.timeout(8000)
      });

      if (statsResponse.ok) {
        const responseData = await statsResponse.json();
        const stats = responseData.stats || responseData;

        if (stats.total_files === 0) {
          toast({
            title: "No Files Found",
            description: "No files are available for processing. Please connect a platform first and wait for files to sync.",
            variant: "destructive"
          });
          return;
        }

        if (stats.processing_percentage > 0 && stats.processing_percentage < 100) {
          toast({
            title: "Processing Already in Progress",
            description: `Files are currently being processed (${Math.round(stats.processing_percentage)}% complete). Please wait for completion.`,
          });
          return;
        }

        toast({
          title: "Starting Processing",
          description: `Found ${stats.total_files} files. Starting AI-powered metadata generation...`
        });
      }

      const response = await fetch('https://generate-metadata-cffyg9hva0hugyb4.canadacentral-01.azurewebsites.net/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userEmail,
          batch_size: 5
        }),
        signal: AbortSignal.timeout(15000)
      });

      if (response.ok) {
        toast({
          title: "Processing Started",
          description: "Metadata generation has been initiated. This may take several minutes."
        });

        let attempts = 0;
        const maxAttempts = 120;
        const pollInterval = setInterval(async () => {
          attempts++;

          try {
            const pollResponse = await fetch(`https://generate-metadata-cffyg9hva0hugyb4.canadacentral-01.azurewebsites.net/processing-stats?user_id=${encodeURIComponent(userEmail)}`, {
              method: 'GET',
              signal: AbortSignal.timeout(8000)
            });

            if (pollResponse.ok) {
              const responseData = await pollResponse.json();
              const stats = responseData.stats || responseData;

              if (stats.processing_percentage >= 100 || attempts >= maxAttempts) {
                clearInterval(pollInterval);

                if (stats.processed_files > 0) {
                  toast({
                    title: "Processing Complete!",
                    description: `Successfully processed ${stats.processed_files} files with AI-powered search capabilities.`
                  });
                } else {
                  toast({
                    title: "Processing Complete",
                    description: "All files have been processed successfully."
                  });
                }
              }
            }
          } catch (error) {
            console.warn('Error polling metadata progress:', error);
            if (attempts >= maxAttempts) {
              clearInterval(pollInterval);
            }
          }
        }, 15000);

        setTimeout(() => {
          clearInterval(pollInterval);
        }, 1800000);
      } else {
        const errorText = await response.text();
        console.error('Manual metadata processing failed:', response.status, errorText);
        toast({
          title: "Processing Failed",
          description: `Failed to start processing: ${response.status}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Manual metadata processing error:', error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

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

  const renderTransferProgress = (integration: Integration) => {
    if (!integration.isConnecting || integration.transferProgress === undefined) return null;

    const getProgressMessage = () => {
      if (integration.transferProgress < 20) {
        return "Connecting to platform...";
      } else if (integration.transferProgress < 80) {
        return "Syncing files from platform...";
      } else if (integration.transferProgress < 95) {
        return "Files found! Starting metadata generation...";
      } else {
        return "Processing files with AI...";
      }
    };

    const getProgressDetails = () => {
      if (integration.transferProgress < 80) {
        return "Waiting for files to sync. This may take several minutes...";
      } else if (integration.totalFiles && integration.totalFiles > 0) {
        return `Processing ${integration.filesTransferred || 0} of ${integration.totalFiles} files with AI embeddings`;
      } else {
        return "Preparing to process files...";
      }
    };

    return (
      <div className="mt-3 space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>{getProgressMessage()}</span>
          <span>{Math.round(integration.transferProgress)}%</span>
        </div>
        <Progress
          value={integration.transferProgress}
          className="h-2 bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>
            {integration.totalFiles && integration.totalFiles > 0 ? `${integration.filesTransferred || 0} of ${integration.totalFiles} files` : "Checking for files..."}
          </span>
          <span>
            {integration.totalFiles && integration.totalFiles > 0 && integration.filesTransferred && integration.filesTransferred > 0
              ? Math.round((integration.filesTransferred / integration.totalFiles) * 100)
              : 0}% processed
          </span>
        </div>
        <div className="text-xs text-blue-400">
          {getProgressDetails()}
        </div>
      </div>
    );
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

                {renderTransferProgress(integration)}
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

        {/* Manual Metadata Processing Button */}
        {user?.email && (
          <div className="mt-4 p-4 bg-indigo-950/40 rounded-lg border border-indigo-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-indigo-200 mb-1">Metadata Processing</p>
                  <p className="text-indigo-300/80 text-xs">
                    Manually trigger metadata generation for your files
                  </p>
                </div>
              </div>
              <Button
                onClick={() => triggerMetadataProcessing(user.email!)}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
              >
                Process Files
              </Button>
            </div>
          </div>
        )}
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