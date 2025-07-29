
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
      title: "Campaign Intelligence",
      description: "AI that understands your marketing goals and optimizes campaigns automatically",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: Search,
      title: "Content Discovery",
      description: "Find and analyze marketing assets across all platforms instantly",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: Shield,
      title: "Brand Consistency",
      description: "Ensure brand guidelines across all marketing materials",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      icon: Globe,
      title: "Omnichannel Insights",
      description: "Unified view of your marketing performance across channels",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Artistic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-white/5 to-gray-300/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-64 h-64 bg-gradient-to-br from-white/10 to-gray-200/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-white/5 to-gray-100/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 fade-in">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg p-1">
              <img 
                src="/lovable-uploads/0e372f3a-9596-4ed9-9dc2-068ab8534e62.png" 
                alt="Weez AI Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Weez AI</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 slide-in-right">
            <Button 
              variant="outline" 
              onClick={() => navigate("/auth-landing")}
              className="border-white/20 text-white hover:bg-white/10 transition-all duration-300"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate("/auth-landing")}
              className="bg-white text-black hover:bg-gray-200 font-semibold px-6 py-2 rounded-lg transition-all duration-300"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight slide-up">
                Futuristic ideas
                <br />
                <span className="text-white">
                  & concepts
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-lg leading-relaxed slide-up" style={{ animationDelay: '0.2s' }}>
                All the tools and resources you need for a successful start in one place
              </p>
              
              <div className="flex items-center gap-6 slide-up" style={{ animationDelay: '0.4s' }}>
                <Button 
                  onClick={() => navigate("/auth-landing")}
                  size="lg"
                  className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg transition-all duration-300"
                >
                  Start Your Journey
                </Button>
                <Button 
                  onClick={() => navigate("/workspace-new")}
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg transition-all duration-300"
                >
                  Enterprise Dash
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center lg:justify-end slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="relative">
                <img 
                  src="/lovable-uploads/2b0def8d-5248-407f-9292-436e182a1ed1.png" 
                  alt="Marketing Operations Illustration" 
                  className="w-full max-w-lg h-auto object-contain filter invert rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 slide-up">
              Supercharge Your <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Marketing Team</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto slide-up" style={{ animationDelay: '0.2s' }}>
              Transform your marketing operations with AI that understands campaigns, customer data, and brand consistency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 shadow-sm hover:shadow-xl hover:bg-white/10 transition-all duration-500 group slide-up" style={{ animationDelay: `${0.1 * index}s` }}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 text-lg leading-relaxed mb-4">
                        {feature.description}
                      </p>
                      <Button variant="ghost" className="text-yellow-400 hover:text-yellow-300 hover:bg-white/10 p-0 h-auto font-semibold group">
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


      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Weez AI. All rights reserved. Empowering marketing teams with intelligent automation.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
