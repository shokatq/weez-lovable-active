
interface ThinkingAnimationProps {
  type?: 'search' | 'summary' | 'rag' | 'upload' | 'general';
}

const ThinkingAnimation = ({ type = 'general' }: ThinkingAnimationProps) => {
  const getAnimationText = () => {
    switch (type) {
      case 'search':
        return 'Searching across your files...';
      case 'summary':
        return 'Analyzing and summarizing...';
      case 'rag':
        return 'Reading and understanding...';
      case 'upload':
        return 'Preparing for upload...';
      default:
        return 'Weezy is thinking...';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'search':
        return '🔍';
      case 'summary':
        return '📄';
      case 'rag':
        return '🧠';
      case 'upload':
        return '☁️';
      default:
        return '💭';
    }
  };

  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-lg">{getIcon()}</span>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-white/80">{getAnimationText()}</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-weezy-accent rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-weezy-accent rounded-full animate-pulse" style={{ animationDelay: "200ms" }}></div>
          <div className="w-2 h-2 bg-weezy-accent rounded-full animate-pulse" style={{ animationDelay: "400ms" }}></div>
        </div>
      </div>
    </div>
  );
};

export default ThinkingAnimation;
