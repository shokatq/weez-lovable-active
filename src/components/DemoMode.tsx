import { useState, useEffect } from "react";
import { X, Search, FileText, MessageSquare, Upload, Users, Settings, Home } from "lucide-react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { demoFiles, demoRFPOutput } from "@/data/demoMockData";

interface DemoModeProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoMode = ({ isOpen, onClose }: DemoModeProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(demoFiles);
  const [showRFP, setShowRFP] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  const tourSteps: Step[] = [
    {
      target: '.demo-connections',
      content: 'This is where you connect your platforms (Google Drive, Slack, etc.). In demo mode, connections are mocked.',
      disableBeacon: true,
    },
    {
      target: '.demo-search',
      content: 'Try searching for a file here (e.g., type "Java PDF").',
    },
    {
      target: '.demo-results',
      content: "Here's how results look — files, PDFs, and metadata are pulled together.",
    },
    {
      target: '.demo-rfp',
      content: 'You can generate RFPs here. In demo mode, we\'ll show a mock output.',
    },
    {
      target: '.demo-exit',
      content: "That's it! Exit demo to try the real product with your own data.",
    },
  ];

  useEffect(() => {
    if (isOpen) {
      // Start tour after a brief delay
      setTimeout(() => setRunTour(true), 1000);
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.toLowerCase().includes("java")) {
      setSearchResults(demoFiles.filter(file => 
        file.name.toLowerCase().includes("java") || 
        file.description.toLowerCase().includes("java")
      ));
    } else {
      setSearchResults(demoFiles);
    }
  };

  const handleTourCallback = (data: CallBackProps) => {
    const { status, index, type } = data;
    
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
    }
    
    if (type === 'step:after') {
      setTourIndex(index + 1);
    }
  };

  const generateRFP = () => {
    setShowRFP(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        callback={handleTourCallback}
        styles={{
          options: {
            primaryColor: 'hsl(var(--primary))',
            backgroundColor: 'hsl(var(--background))',
            textColor: 'hsl(var(--foreground))',
            arrowColor: 'hsl(var(--background))',
          }
        }}
      />
      
      <div className="h-full w-full bg-background overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <img 
                  src="/lovable-uploads/92fd1f43-ec1e-4562-9a19-fd70618ad920.png" 
                  alt="Weez AI" 
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <h1 className="text-xl font-bold">Weez AI - Demo Mode</h1>
              <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                DEMO
              </Badge>
            </div>
            
            <Button 
              onClick={onClose}
              variant="ghost" 
              size="sm"
              className="demo-exit"
            >
              <X className="w-4 h-4 mr-2" />
              Exit Demo
            </Button>
          </div>
        </header>

        <div className="flex h-[calc(100vh-73px)]">
          {/* Sidebar */}
          <div className="w-64 bg-muted/30 border-r border-border p-4">
            <div className="space-y-6">
              {/* Connections */}
              <div className="demo-connections">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Connected Platforms
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Google Drive</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Slack</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">OneDrive</span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Navigation
                </h3>
                <div className="space-y-1">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    <span className="text-sm">Search & Discovery</span>
                  </div>
                  <div className="p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <span className="text-sm text-muted-foreground">Team Chat</span>
                  </div>
                  <div className="p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <span className="text-sm text-muted-foreground">Analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Search Section */}
              <Card className="demo-search">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Smart File Search
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for files... (try 'Java PDF')"
                      className="flex-1"
                    />
                    <Button type="submit">
                      <Search className="w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card className="demo-results">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Search Results ({searchResults.length} files found)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {searchResults.map((file) => (
                      <div key={file.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{file.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{file.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {file.platform}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {file.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Modified {file.lastModified}
                              </span>
                            </div>
                          </div>
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* RFP Generator */}
              <Card className="demo-rfp">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    RFP Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!showRFP ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Generate a comprehensive RFP based on your selected files
                      </p>
                      <Button onClick={generateRFP} className="px-8">
                        Generate Sample RFP
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{demoRFPOutput.title}</h3>
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                          Generated
                        </Badge>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        {demoRFPOutput.sections.map((section, index) => (
                          <div key={index} className="p-4 bg-muted/30 rounded-lg">
                            <h4 className="font-medium mb-2">{section.heading}</h4>
                            <p className="text-sm text-muted-foreground">{section.content}</p>
                          </div>
                        ))}
                      </div>
                      <Button 
                        onClick={() => setShowRFP(false)} 
                        variant="outline"
                        size="sm"
                      >
                        Generate New RFP
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoMode;