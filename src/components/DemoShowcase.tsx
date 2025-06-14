
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, MessageSquare, Upload, Clock, CheckCircle } from "lucide-react";
import { demoFiles, demoResponses } from "@/data/demoData";

const DemoShowcase = () => {
  const [activeDemo, setActiveDemo] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const demoTypes = [
    {
      icon: Search,
      title: "Smart File Search",
      description: "Search files across all platforms using natural language",
      color: "bg-blue-500",
      demoIndex: 0
    },
    {
      icon: FileText,
      title: "Auto Summarization", 
      description: "Get instant summaries of any document",
      color: "bg-green-500",
      demoIndex: 1
    },
    {
      icon: MessageSquare,
      title: "RAG Q&A",
      description: "Ask specific questions about your files",
      color: "bg-purple-500", 
      demoIndex: 2
    },
    {
      icon: Upload,
      title: "Platform Upload",
      description: "Upload files to any connected platform",
      color: "bg-orange-500",
      demoIndex: 3
    }
  ];

  const runDemo = (demoIndex: number) => {
    setIsProcessing(true);
    setActiveDemo(null);
    
    setTimeout(() => {
      setActiveDemo(demoIndex);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Weezy AI Demo</h1>
          <p className="text-gray-400 text-lg">
            See how Weezy transforms file management with AI-powered capabilities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {demoTypes.map((demo, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 ${demo.color} rounded-lg flex items-center justify-center mb-3`}>
                  <demo.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-lg">{demo.title}</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  {demo.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => runDemo(demo.demoIndex)}
                  className="w-full bg-white text-black hover:bg-gray-200"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Try Demo"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {isProcessing && (
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardContent className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span className="text-white">Weezy AI is processing your request...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {activeDemo !== null && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Demo Result</CardTitle>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">
                    {demoResponses[activeDemo].processingTime}
                  </span>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 mt-3">
                <p className="text-gray-300 italic">"{demoResponses[activeDemo].query}"</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-black rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-white font-medium">Weezy Response:</span>
                  </div>
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                    {demoResponses[activeDemo].response}
                  </p>
                </div>

                {demoResponses[activeDemo].files && (
                  <div>
                    <h4 className="text-white font-medium mb-3">Files Found:</h4>
                    <div className="space-y-2">
                      {demoResponses[activeDemo].files!.map((file) => (
                        <div key={file.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-white font-medium">{file.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                                  {file.platform}
                                </Badge>
                                <span className="text-gray-400 text-sm">{file.size}</span>
                                <span className="text-gray-400 text-sm">Modified {file.lastModified}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">
            This is a demonstration of Weezy's AI capabilities with sample data
          </p>
          <Button 
            onClick={() => setActiveDemo(null)}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Reset Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DemoShowcase;
