
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Intro = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Search",
      description: "Find documents instantly with natural language queries"
    },
    {
      icon: Zap,
      title: "Smart Summaries",
      description: "Get instant insights from your files without opening them"
    },
    {
      icon: Target,
      title: "Cross-Platform",
      description: "Works across Google Drive, Slack, Notion, and more"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="mb-8">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-2xl">W</span>
            </div>
            <h1 className="text-5xl font-bold text-black mb-4">
              Weez
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your AI-powered knowledge assistant. Search, summarize, and understand your documents across all platforms.
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/home')}
            className="notion-button-primary group px-8 py-3 text-base"
          >
            Get Started
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`notion-card text-center transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Demo Section */}
        <div className={`notion-card text-center transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '800ms' }}>
          <h2 className="text-2xl font-semibold text-black mb-4">
            Ready to transform your workflow?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Join thousands of teams who've already streamlined their document management with Weez.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => navigate('/chat')}
              className="notion-button-primary"
            >
              Try Chat Interface
            </Button>
            <Button 
              onClick={() => navigate('/workspace')}
              className="notion-button"
            >
              Explore Workspace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
