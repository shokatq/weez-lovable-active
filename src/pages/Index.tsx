
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Building2, FileText, Users, Zap, ArrowRight, Sparkles, Globe, Shield, TrendingUp, Brain, Search, Upload, Eye, Star } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI models that understand and analyze your documents with exceptional accuracy",
      color: "from-blue-500 to-indigo-600",
      stats: "99.2% accuracy"
    },
    {
      icon: Search,
      title: "Intelligent Search",
      description: "Find any document across all platforms with natural language queries",
      color: "from-emerald-500 to-teal-600",
      stats: "<0.3s response"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and security protocols to protect your sensitive data",
      color: "from-violet-500 to-purple-600",
      stats: "ISO 27001 certified"
    },
    {
      icon: Globe,
      title: "Multi-Platform Support",
      description: "Seamlessly integrate with Google Drive, OneDrive, Notion, Dropbox, and more",
      color: "from-orange-500 to-red-600",
      stats: "20+ integrations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(167,139,250,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent_70%)] pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <header className="px-8 py-6 border-b border-gray-800/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Weezy AI</h1>
                <p className="text-xs text-gray-400">Enterprise File Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1">
                <Star className="w-3 h-3 mr-1" />
                Premium
              </Badge>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600">
                Sign In
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-8 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Powered by Advanced AI</span>
            </div>
            
            <h1 className="text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-gray-300 bg-clip-text text-transparent leading-tight">
              Your AI-Powered
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                File Assistant
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform how you interact with your documents. Weezy AI understands, analyzes, and organizes your files across all platforms with unprecedented intelligence and speed.
            </p>
            
            <div className="flex items-center justify-center gap-6 mb-16">
              <Button 
                onClick={() => navigate("/chat")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-12 py-6 rounded-2xl text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                <MessageSquare className="w-6 h-6 mr-3" />
                Start Chatting
              </Button>
              <Button 
                onClick={() => navigate("/workspace-new")}
                variant="outline"
                size="lg"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 font-semibold px-12 py-6 rounded-2xl text-lg transition-all duration-300 hover:scale-105"
              >
                <Building2 className="w-6 h-6 mr-3" />
                Enterprise Workspace
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-6">
                Why Choose <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Weezy AI</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Experience the future of document management with cutting-edge AI technology and enterprise-grade security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-gray-900/40 border-gray-800/50 backdrop-blur-md hover:bg-gray-800/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl shadow-lg group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl font-bold group-hover:text-blue-400 transition-colors">
                          {feature.title}
                        </CardTitle>
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mt-2">
                          {feature.stats}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    <Button variant="ghost" className="text-blue-400 hover:text-white hover:bg-blue-500/10 p-0 h-auto font-semibold">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-blue-900/20 to-violet-900/20 border-blue-500/20 backdrop-blur-md shadow-2xl">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to Transform Your Workflow?
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Join thousands of professionals who have revolutionized their document management with Weezy AI.
                </p>
                <div className="flex items-center justify-center gap-6">
                  <Button 
                    onClick={() => navigate("/chat")}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Get Started Free
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 font-semibold px-10 py-4 rounded-xl text-lg"
                  >
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-8 py-8 border-t border-gray-800/50">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-500">
              © 2024 Weezy AI. All rights reserved. Built with cutting-edge AI technology.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
