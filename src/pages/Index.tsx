
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 relative overflow-hidden">
      {/* Notion-style animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 fade-in">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Weez AI</h1>
              <p className="text-xs text-muted-foreground">Marketing Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 slide-in-right">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate("/auth-landing")}
                className="hover:bg-accent transition-all duration-300"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign In
              </Button>
              <Button 
                onClick={() => navigate("/auth-landing")}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold px-6 py-2 rounded-lg transition-all duration-300"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-muted border border-border rounded-full px-4 py-2 mb-12 hover:bg-accent transition-colors duration-300">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Powered by Advanced Marketing AI</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight slide-up">
            Your Knowledge Agent
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              for Marketing Operations
            </span>
          </h1>
          
          <p className="text-lg text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed slide-up" style={{ animationDelay: '0.2s' }}>
            Revolutionize your marketing workflows with AI that understands your brand, campaigns, and customer data. Get instant insights, automate processes, and scale your marketing operations intelligently.
          </p>
          
          <div className="flex items-center justify-center gap-6 mb-20 slide-up" style={{ animationDelay: '0.4s' }}>
              <Button 
                onClick={() => navigate("/chat")}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold px-12 py-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageSquare className="w-6 h-6 mr-3" />
                Start Your Marketing Journey
              </Button>
              <Button 
                onClick={() => navigate("/workspace-new")}
                variant="outline"
                size="lg"
                className="font-semibold px-12 py-6 rounded-2xl text-lg transition-all duration-300 hover:bg-accent hover:shadow-lg"
              >
                <Building2 className="w-6 h-6 mr-3" />
                Enterprise Dashboard
              </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6 slide-up">
              Supercharge Your <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Marketing Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto slide-up" style={{ animationDelay: '0.2s' }}>
              Transform your marketing operations with AI that understands campaigns, customer data, and brand consistency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border shadow-sm hover:shadow-xl hover:bg-card transition-all duration-500 group slide-up" style={{ animationDelay: `${0.1 * index}s` }}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                        {feature.description}
                      </p>
                      <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-accent p-0 h-auto font-semibold group">
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
          <Card className="bg-card/50 backdrop-blur-sm shadow-2xl border-border slide-up">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Ready to Scale Your Marketing?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Join forward-thinking marketing teams already using AI to 10x their productivity.
              </p>
              <div className="flex items-center justify-center gap-6">
                <Button 
                  onClick={() => navigate("/auth-landing")}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-primary-foreground font-semibold px-10 py-4 rounded-xl text-lg shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Start Free with Google
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-border backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Weez AI. All rights reserved. Empowering marketing teams with intelligent automation.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
