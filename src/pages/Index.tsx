
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Search, 
  Shield, 
  Globe, 
  Star,
  Zap,
  CheckCircle
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced AI that understands context and delivers precise results",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find anything across all platforms with natural language",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption protecting your sensitive data",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      icon: Globe,
      title: "Universal Integration",
      description: "Connect with 20+ platforms seamlessly",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl float-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 glass-effect border-b border-white/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 fade-in">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Weezy AI</h1>
              <p className="text-xs text-slate-500">Enterprise Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 slide-in-right">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
              <Star className="w-3 h-3 mr-1" />
              Premium
            </Badge>
            <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8 bounce-gentle">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-medium">Powered by Advanced AI</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-700 bg-clip-text text-transparent leading-tight slide-up">
            Your Intelligent
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              File Assistant
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed slide-up" style={{ animationDelay: '0.2s' }}>
            Transform how you work with documents. Weezy AI understands, analyzes, and organizes your files with unprecedented intelligence.
          </p>
          
          <div className="flex items-center justify-center gap-6 mb-16 slide-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              onClick={() => navigate("/chat")}
              size="lg"
              className="btn-primary bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-12 py-6 rounded-2xl text-lg shadow-lg shadow-blue-500/25"
            >
              <MessageSquare className="w-6 h-6 mr-3" />
              Start Chatting
            </Button>
            <Button 
              onClick={() => navigate("/workspace-new")}
              variant="outline"
              size="lg"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold px-12 py-6 rounded-2xl text-lg transition-all duration-300 hover:shadow-lg"
            >
              <Building2 className="w-6 h-6 mr-3" />
              Enterprise Workspace
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-6 slide-up">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Weezy AI</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto slide-up" style={{ animationDelay: '0.2s' }}>
              Experience the future of document management with cutting-edge AI technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-xl transition-all duration-500 group slide-up" style={{ animationDelay: `${0.1 * index}s` }}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 text-lg leading-relaxed mb-4">
                        {feature.description}
                      </p>
                      <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-semibold group">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-effect shadow-2xl border-slate-200/50 slide-up">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-lg pulse-glow">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Ready to Transform Your Workflow?
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Join thousands of professionals revolutionizing their document management.
              </p>
              <div className="flex items-center justify-center gap-6">
                <Button 
                  onClick={() => navigate("/chat")}
                  size="lg"
                  className="btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-10 py-4 rounded-xl text-lg shadow-lg"
                >
                  Get Started Free
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold px-10 py-4 rounded-xl text-lg transition-all duration-300"
                >
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-slate-200/50 glass-effect">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500">
            © 2024 Weezy AI. All rights reserved. Built with cutting-edge AI technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
