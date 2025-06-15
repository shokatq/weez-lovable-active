
import { Bot } from 'lucide-react';

export interface ThinkingAnimationProps {
  type?: 'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general';
}

const ThinkingAnimation = ({ type = 'general' }: ThinkingAnimationProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-pulse [animation-delay:-0.3s]"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-pulse [animation-delay:-0.15s]"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-pulse"></span>
      </div>
       <span className="text-sm font-medium text-gray-300">
        Weezy is thinking...
      </span>
    </div>
  );
};

export default ThinkingAnimation;
