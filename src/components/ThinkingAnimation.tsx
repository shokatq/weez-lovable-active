
import { Search, FileText, Brain, Upload, Building2, MessageSquare, Trash2 } from "lucide-react";

interface ThinkingAnimationProps {
  type: 'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general' | 'delete';
}

const ThinkingAnimation = ({ type }: ThinkingAnimationProps) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'search':
        return {
          icon: Search,
          text: "Searching across your files...",
          dots: "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
        };
      case 'summary':
        return {
          icon: FileText,
          text: "Analyzing document content...",
          dots: "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
        };
      case 'rag':
        return {
          icon: Brain,
          text: "Processing knowledge base...",
          dots: "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
        };
      case 'upload':
        return {
          icon: Upload,
          text: "Uploading to cloud platform...",
          dots: "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
        };
      case 'workspace':
        return {
          icon: Building2,
          text: "Preparing workspace data...",
          dots: "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
        };
      case 'delete':
        return {
          icon: Trash2,
          text: "Processing file deletion...",
          dots: "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
        };
      default:
        return {
          icon: MessageSquare,
          text: "Thinking...",
          dots: "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className="w-4 h-4 text-gray-600 animate-pulse" />
      <span className="text-gray-600">{config.text}</span>
      <div className="flex gap-1">
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default ThinkingAnimation;
