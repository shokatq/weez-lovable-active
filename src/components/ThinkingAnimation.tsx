
import { useEffect, useState } from 'react';

export interface ThinkingAnimationProps {
  type?: 'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general';
}

const ThinkingAnimation = ({ type = 'general' }: ThinkingAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const getAnimationSteps = () => {
    switch (type) {
      case 'search':
        return [
          { icon: '🔍', text: 'Analyzing search query', color: 'text-blue-400' },
          { icon: '📊', text: 'Scanning document databases', color: 'text-emerald-400' },
          { icon: '🎯', text: 'Finding relevant matches', color: 'text-violet-400' },
          { icon: '✨', text: 'Preparing comprehensive results', color: 'text-cyan-400' }
        ];
      case 'summary':
        return [
          { icon: '📄', text: 'Reading document content', color: 'text-blue-400' },
          { icon: '🧠', text: 'Understanding key concepts', color: 'text-emerald-400' },
          { icon: '📝', text: 'Extracting important insights', color: 'text-violet-400' },
          { icon: '✨', text: 'Generating intelligent summary', color: 'text-cyan-400' }
        ];
      case 'rag':
        return [
          { icon: '🤔', text: 'Processing your question', color: 'text-blue-400' },
          { icon: '📚', text: 'Searching knowledge base', color: 'text-emerald-400' },
          { icon: '🔗', text: 'Connecting relevant information', color: 'text-violet-400' },
          { icon: '💡', text: 'Formulating detailed answer', color: 'text-cyan-400' }
        ];
      case 'upload':
        return [
          { icon: '☁️', text: 'Preparing secure upload', color: 'text-blue-400' },
          { icon: '🔐', text: 'Establishing encrypted connection', color: 'text-emerald-400' },
          { icon: '📤', text: 'Transferring files safely', color: 'text-violet-400' },
          { icon: '✅', text: 'Completing upload process', color: 'text-cyan-400' }
        ];
      case 'workspace':
        return [
          { icon: '🏢', text: 'Loading workspace data', color: 'text-blue-400' },
          { icon: '👥', text: 'Fetching team information', color: 'text-emerald-400' },
          { icon: '📊', text: 'Calculating analytics', color: 'text-violet-400' },
          { icon: '🎯', text: 'Preparing dashboard', color: 'text-cyan-400' }
        ];
      default:
        return [
          { icon: '🤖', text: 'Processing your request', color: 'text-blue-400' },
          { icon: '🧠', text: 'Analyzing context', color: 'text-emerald-400' },
          { icon: '⚡', text: 'Generating response', color: 'text-violet-400' },
          { icon: '✨', text: 'Almost ready', color: 'text-cyan-400' }
        ];
    }
  };

  const steps = getAnimationSteps();

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(stepInterval);
  }, [steps.length]);

  return (
    <div className="flex items-center gap-5 py-4">
      <div className="relative">
        <div 
          className={`text-3xl animate-bounce ${steps[currentStep].color}`}
          style={{ animationDuration: '1s' }}
        >
          {steps[currentStep].icon}
        </div>
        <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full opacity-30 animate-pulse-glow"></div>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className={`text-base font-bold animate-fade-in ${steps[currentStep].color}`}>
            {steps[currentStep].text}
          </span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-thinking-dot"
                style={{
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-700 ${
                i === currentStep 
                  ? 'bg-blue-400 shadow-lg shadow-blue-400/60 scale-125 animate-pulse-glow' 
                  : i < currentStep 
                    ? 'bg-blue-400/70 scale-110' 
                    : 'bg-gray-600 scale-100'
              }`}
            />
          ))}
        </div>
        
        <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 transition-all duration-2000 ease-out relative rounded-full"
            style={{ 
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.7)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThinkingAnimation;
