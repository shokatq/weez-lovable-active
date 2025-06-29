
import { Bot, Search, FileText, Upload, Building2, Brain, Trash2, BookOpen } from 'lucide-react';

export interface ThinkingAnimationProps {
  type?: 'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general' | 'delete' | 'pdf-search';
}

const ThinkingAnimation = ({ type = 'general' }: ThinkingAnimationProps) => {
  const getThinkingConfig = () => {
    switch (type) {
      case 'pdf-search':
        return {
          icon: <FileText className="w-4 h-4 text-red-500" />,
          text: "Searching for PDFs across all platforms...",
          dots: "bg-red-500"
        };
      case 'search':
        return {
          icon: <Search className="w-4 h-4 text-blue-500" />,
          text: "Searching across your files...",
          dots: "bg-blue-500"
        };
      case 'summary':
        return {
          icon: <FileText className="w-4 h-4 text-emerald-500" />,
          text: "Analyzing document content...",
          dots: "bg-emerald-500"
        };
      case 'rag':
        return {
          icon: <BookOpen className="w-4 h-4 text-purple-500" />,
          text: "Analyzing knowledge base and generating insights...",
          dots: "bg-purple-500"
        };
      case 'upload':
        return {
          icon: <Upload className="w-4 h-4 text-orange-500" />,
          text: "Uploading to cloud storage...",
          dots: "bg-orange-500"
        };
      case 'delete':
        return {
          icon: <Trash2 className="w-4 h-4 text-red-500" />,
          text: "Processing file deletion...",
          dots: "bg-red-500"
        };
      case 'workspace':
        return {
          icon: <Building2 className="w-4 h-4 text-emerald-500" />,
          text: "Accessing workspace data...",
          dots: "bg-emerald-500"
        };
      default:
        return {
          icon: <Bot className="w-4 h-4 text-slate-500" />,
          text: "Weezy is thinking...",
          dots: "bg-slate-500"
        };
    }
  };

  const config = getThinkingConfig();

  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="animate-pulse">
        {config.icon}
      </div>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${config.dots} typing-indicator`}></span>
        <span className={`h-2 w-2 rounded-full ${config.dots} typing-indicator`} style={{ animationDelay: '0.2s' }}></span>
        <span className={`h-2 w-2 rounded-full ${config.dots} typing-indicator`} style={{ animationDelay: '0.4s' }}></span>
      </div>
      <span className="text-sm font-medium text-slate-600 animate-pulse">
        {config.text}
      </span>
    </div>
  );
};

export default ThinkingAnimation;
