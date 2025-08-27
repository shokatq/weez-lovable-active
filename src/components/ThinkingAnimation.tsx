
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
                src="/lovable-uploads/92fd1f43-ec1e-4562-9a19-fd70618ad920.png"
                alt="Weez AI Logo"
                className="w-6 h-6 object-contain rounded-full"
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
    <div className="flex items-start gap-4 px-4 py-3 bg-white/90 dark:bg-muted/90 rounded-xl border border-border shadow-sm">
      {/* Avatar / context icon */}
      <div className="shrink-0">{config.icon}</div>

      {/* 3D-style loader */}
      <div className="relative h-8 w-8 [perspective:800px]">
        <div
          className={`absolute inset-0 rounded-full ${config.accentColor} opacity-20 blur-md`}
        />
        <div
          className="absolute inset-0 grid place-items-center [transform-style:preserve-3d] animate-[spin_2.2s_linear_infinite]"
        >
          <div
            className="h-8 w-8 rounded-full border-2 border-t-transparent border-r-transparent border-muted-foreground/30"
            style={{ transform: "rotateX(65deg) rotateY(25deg)" }}
          />
          <div
            className="absolute h-6 w-6 rounded-full border-2 border-b-transparent border-l-transparent border-muted-foreground/50"
            style={{ transform: "rotateX(-35deg) rotateY(-35deg)" }}
          />
        </div>
      </div>

      {/* Animated dots + label */}
      <div className="flex flex-col min-w-0">
        <span className={`text-sm font-medium text-foreground mb-1`}>Here’s a synthesized summary from your sources:</span>
        <div className="flex items-center gap-1">
          <span className={`w-2 h-2 ${config.accentColor} rounded-full`} style={{ animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '0s' }} />
          <span className={`w-2 h-2 ${config.accentColor} rounded-full`} style={{ animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '150ms' }} />
          <span className={`w-2 h-2 ${config.accentColor} rounded-full`} style={{ animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '300ms' }} />
        </div>
        <span className={`text-sm ${config.primaryColor} truncate`}>{config.text}</span>
      </div>
    </div>
  );
};

export default ThinkingAnimation;
