
import { Bot, Search, FileText, Upload, Building2, Brain, Trash2, BookOpen } from 'lucide-react';

export interface ThinkingAnimationProps {
  type?: 'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general' | 'delete' | 'pdf-search';
}

const ThinkingAnimation = ({ type = 'general' }: ThinkingAnimationProps) => {
  const getThinkingConfig = () => {
    switch (type) {
      case 'pdf-search':
        return {
          icon: <FileText className="w-5 h-5 text-red-500" />,
          text: "Searching for PDFs across all platforms...",
          primaryColor: "text-red-500",
          accentColor: "bg-red-500"
        };
      case 'search':
        return {
          icon: <Search className="w-5 h-5 text-blue-500" />,
          text: "Searching across your files...",
          primaryColor: "text-blue-500",
          accentColor: "bg-blue-500"
        };
      case 'summary':
        return {
          icon: <FileText className="w-5 h-5 text-emerald-500" />,
          text: "Analyzing document content...",
          primaryColor: "text-emerald-500",
          accentColor: "bg-emerald-500"
        };
      case 'rag':
        return {
          icon: <BookOpen className="w-5 h-5 text-purple-500" />,
          text: "Analyzing knowledge base and generating insights...",
          primaryColor: "text-purple-500",
          accentColor: "bg-purple-500"
        };
      case 'upload':
        return {
          icon: <Upload className="w-5 h-5 text-orange-500" />,
          text: "Uploading to cloud storage...",
          primaryColor: "text-orange-500",
          accentColor: "bg-orange-500"
        };
      case 'delete':
        return {
          icon: <Trash2 className="w-5 h-5 text-red-500" />,
          text: "Processing file deletion...",
          primaryColor: "text-red-500",
          accentColor: "bg-red-500"
        };
      case 'workspace':
        return {
          icon: <Building2 className="w-5 h-5 text-emerald-500" />,
          text: "Accessing workspace data...",
          primaryColor: "text-emerald-500",
          accentColor: "bg-emerald-500"
        };
      default:
        return {
          icon: (
            <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center">
              <img 
                src="/lovable-uploads/6f7d4cd5-bb83-4d52-9b89-34f558e6e6cd.png" 
                alt="Weez AI" 
                className="w-6 h-6 object-cover rounded-full"
              />
            </div>
          ),
          text: "Weez is thinking...",
          primaryColor: "text-primary",
          accentColor: "bg-primary"
        };
    }
  };

  const config = getThinkingConfig();

  return (
    <div className="flex items-center gap-4 px-6 py-6 bg-gradient-to-r from-background/50 to-background/80 rounded-lg backdrop-blur-sm border border-border/50">
      <div className="relative">
        {config.icon}
      </div>
      
      {/* Advanced wave animation */}
      <div className="flex items-center gap-1">
        <div 
          className={`w-2 h-2 ${config.accentColor} rounded-full animate-pulse`}
          style={{ 
            animation: 'thinking-wave 1.4s ease-in-out infinite',
            animationDelay: '0ms'
          }}
        />
        <div 
          className={`w-2 h-2 ${config.accentColor} rounded-full animate-pulse`}
          style={{ 
            animation: 'thinking-wave 1.4s ease-in-out infinite',
            animationDelay: '150ms'
          }}
        />
        <div 
          className={`w-2 h-2 ${config.accentColor} rounded-full animate-pulse`}
          style={{ 
            animation: 'thinking-wave 1.4s ease-in-out infinite',
            animationDelay: '300ms'
          }}
        />
      </div>
      
      <span className={`text-sm font-medium ${config.primaryColor} animate-pulse`}>
        {config.text}
      </span>
      
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 ${config.accentColor} opacity-5 rounded-lg blur-xl animate-pulse`} />
    </div>
  );
};

export default ThinkingAnimation;
