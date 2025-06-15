
export interface ThinkingAnimationProps {
  type?: 'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general';
}

const ThinkingAnimation = ({ type = 'general' }: ThinkingAnimationProps) => {
  return (
    <div className="flex items-center justify-center px-4 py-3">
      <div className="flex items-center gap-1.5">
        <span
          className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"
          style={{ animationDuration: '1.2s', animationDelay: '0s' }}
        ></span>
        <span
          className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"
          style={{ animationDuration: '1.2s', animationDelay: '0.2s' }}
        ></span>
        <span
          className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"
          style={{ animationDuration: '1.2s', animationDelay: '0.4s' }}
        ></span>
      </div>
    </div>
  );
};

export default ThinkingAnimation;
