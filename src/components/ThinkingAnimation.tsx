import { Bot, Search, FileText, Upload, Building2, Brain, Trash2, BookOpen } from 'lucide-react';

export interface ThinkingAnimationProps {
  type?: 'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general' | 'delete' | 'pdf-search';
}

const ThinkingAnimation = ({ type = 'general' }: ThinkingAnimationProps) => {
  const getThinkingConfig = () => {
    switch (type) {
      case 'pdf-search':
        return {
          icon: <FileText className="w-4 h-4 text-red-400" />,
          text: "Searching for PDFs across all platforms...",
          dots: "bg-red-400"
        };
      case 'search':
        return {
          icon: <Search className="w-4 h-4 text-blue-400" />,
          text: "Searching across your files...",
          dots: "bg-blue-400"
        };
      case 'summary':
        return {
          icon: <FileText className="w-4 h-4 text-green-400" />,
          text: "Analyzing document content...",
          dots: "bg-green-400"
        };
      case 'rag':
        return {
          icon: <BookOpen className="w-4 h-4 text-purple-400" />,
          text: "Analyzing knowledge base and generating insights...",
          dots: "bg-purple-400"
        };
      case 'upload':
        return {
          icon: <Upload className="w-4 h-4 text-orange-400" />,
          text: "Uploading to cloud storage...",
          dots: "bg-orange-400"
        };
      case 'delete':
        return {
          icon: <Trash2 className="w-4 h-4 text-red-400" />,
          text: "Processing file deletion...",
          dots: "bg-red-400"
        };
      case 'workspace':
        return {
          icon: <Building2 className="w-4 h-4 text-emerald-400" />,
          text: "Accessing workspace data...",
          dots: "bg-emerald-400"
        };
      default:
        return {
          icon: <Bot className="w-4 h-4 text-gray-400" />,
          text: "Weezy is thinking...",
          dots: "bg-gray-400"
        };
    }
  };

  const config = getThinkingConfig();

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="animate-pulse">
        {config.icon}
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${config.dots} animate-pulse [animation-delay:-0.3s]`}></span>
        <span className={`h-1.5 w-1.5 rounded-full ${config.dots} animate-pulse [animation-delay:-0.15s]`}></span>
        <span className={`h-1.5 w-1.5 rounded-full ${config.dots} animate-pulse`}></span>
      </div>
      <span className="text-sm font-medium text-gray-300 animate-pulse">
        {config.text}
      </span>
    </div>
  );
};

export default ThinkingAnimation;
