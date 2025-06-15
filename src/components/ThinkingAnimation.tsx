
import { Bot } from 'lucide-react';

export interface ThinkingAnimationProps {
  type?: 'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general';
}

const ThinkingAnimation = ({ type = 'general' }: ThinkingAnimationProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Bot className="w-5 h-5 text-blue-400 animate-spin" />
      <span className="text-sm font-medium text-gray-300">
        Weezy is thinking...
      </span>
    </div>
  );
};

export default ThinkingAnimation;
