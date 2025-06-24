
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Building2, ArrowRight, Sparkles, Globe, Shield, TrendingUp, Brain, Search, Upload, Star, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI models that understand and analyze your documents with exceptional accuracy",
      stats: "99.2% accuracy"
    },
    {
      icon: Search,
      title: "Intelligent Search",
      description: "Find any document across all platforms with natural language queries",
      stats: "<0.3s response"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and security protocols to protect your sensitive data",
      stats: "ISO 27001 certified"
    },
    {
      icon: Globe,
      title: "Multi-Platform Support",
      description: "Seamlessly integrate with Google Drive, OneDrive, Notion, Dropbox, and more",
      stats: "20+ integrations"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-700">
      {/* Header */}
      <header className="px-8 py-6 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-medium">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Weezy AI</h1>
              <p className="text-xs text-gray-500">Enterprise File Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
              <Star className="w-3 h-3 mr-1" />
              Premium
            </Badge>
            <Button variant="outline" className="btn-secondary">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-20 gradient-hero">
        <div className="max-w-7xl mx-auto text-center">
          <div className="fade-in">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-medium">Powered by Advanced AI</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 text-gray-900 leading-tight fade-in-stagger-1">
            Your AI-Powered
            <br />
            <span className="text-blue-600">File Assistant</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed fade-in-stagger-2">
            Transform how you interact with your documents. Weezy AI understands, analyzes, and organizes your files across all platforms with unprecedented intelligence and speed.
          </p>
          
          <div className="flex items-center justify-center gap-6 mb-16 fade-in-stagger-3">
            <Button 
              onClick={() => navigate("/chat")}
              className="btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-6 rounded-xl text-lg shadow-large"
            >
              <MessageSquare className="w-6 h-6 mr-3" />
              Start Chatting
            </Button>
            <Button 
              onClick={() => navigate("/workspace-new")}
              variant="outline"
              className="btn-secondary font-semibold px-12 py-6 rounded-xl text-lg"
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
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-blue-600">Weezy AI</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of document management with cutting-edge AI technology and enterprise-grade security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border-gray-200 shadow-soft hover:shadow-large card-hover">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center shadow-soft">
                      <feature.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-gray-900 text-xl font-bold">
                        {feature.title}
                      </CardTitle>
                      <Badge className="bg-blue-50 text-blue-600 border-blue-200 mt-2">
                        {feature.stats}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-semibold group">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border-gray-200 shadow-large">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-8 shadow-large">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Ready to Transform Your Workflow?
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of professionals who have revolutionized their document management with Weezy AI.
              </p>
              <div className="flex items-center justify-center gap-6">
                <Button 
                  onClick={() => navigate("/chat")}
                  className="btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-4 rounded-xl text-lg shadow-medium"
                >
                  Get Started Free
                </Button>
                <Button 
                  variant="outline"
                  className="btn-secondary font-semibold px-10 py-4 rounded-xl text-lg"
                >
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">
            © 2024 Weezy AI. All rights reserved. Built with cutting-edge AI technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
