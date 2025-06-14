
import { useEffect, useState } from 'react';

interface ThinkingAnimationProps {
  type?: 'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general';
}

const ThinkingAnimation = ({ type = 'general' }: ThinkingAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState('');

  const getAnimationSteps = () => {
    switch (type) {
      case 'search':
        return [
          { icon: '🔍', text: 'Analyzing search query...', color: 'text-blue-400' },
          { icon: '📊', text: 'Scanning document databases...', color: 'text-green-400' },
          { icon: '🎯', text: 'Finding relevant matches...', color: 'text-purple-400' },
          { icon: '✨', text: 'Preparing comprehensive results...', color: 'text-cyan-400' }
        ];
      case 'summary':
        return [
          { icon: '📄', text: 'Reading document content...', color: 'text-blue-400' },
          { icon: '🧠', text: 'Understanding key concepts...', color: 'text-green-400' },
          { icon: '📝', text: 'Extracting important insights...', color: 'text-purple-400' },
          { icon: '✨', text: 'Generating intelligent summary...', color: 'text-cyan-400' }
        ];
      case 'rag':
        return [
          { icon: '🤔', text: 'Processing your question...', color: 'text-blue-400' },
          { icon: '📚', text: 'Searching knowledge base...', color: 'text-green-400' },
          { icon: '🔗', text: 'Connecting relevant information...', color: 'text-purple-400' },
          { icon: '💡', text: 'Formulating detailed answer...', color: 'text-cyan-400' }
        ];
      case 'upload':
        return [
          { icon: '☁️', text: 'Preparing secure upload...', color: 'text-blue-400' },
          { icon: '🔐', text: 'Establishing encrypted connection...', color: 'text-green-400' },
          { icon: '📤', text: 'Transferring files safely...', color: 'text-purple-400' },
          { icon: '✅', text: 'Completing upload process...', color: 'text-cyan-400' }
        ];
      case 'workspace':
        return [
          { icon: '🏢', text: 'Loading workspace data...', color: 'text-blue-400' },
          { icon: '👥', text: 'Fetching team information...', color: 'text-green-400' },
          { icon: '📊', text: 'Calculating analytics...', color: 'text-purple-400' },
          { icon: '🎯', text: 'Preparing dashboard...', color: 'text-cyan-400' }
        ];
      default:
        return [
          { icon: '🤖', text: 'Processing your request...', color: 'text-blue-400' },
          { icon: '🧠', text: 'Analyzing context...', color: 'text-green-400' },
          { icon: '⚡', text: 'Generating response...', color: 'text-purple-400' },
          { icon: '✨', text: 'Almost ready...', color: 'text-cyan-400' }
        ];
    }
  };

  const steps = getAnimationSteps();

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2500);

    const dotInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 600);

    return () => {
      clearInterval(stepInterval);
      clearInterval(dotInterval);
    };
  }, [steps.length]);

  return (
    <div className="flex items-center gap-4 py-3">
      <div className="relative">
        <div 
          className={`text-2xl animate-bounce ${steps[currentStep].color}`}
          style={{ animationDuration: '1.2s' }}
        >
          {steps[currentStep].icon}
        </div>
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 animate-pulse" 
             style={{ animationDuration: '2s' }}></div>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium animate-fade-in ${steps[currentStep].color}`}>
            {steps[currentStep].text}
          </span>
          <span className="text-blue-400 font-bold min-w-[20px] animate-pulse">{dots}</span>
        </div>
        
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                i === currentStep 
                  ? 'bg-blue-400 shadow-lg shadow-blue-400/50 scale-125 animate-pulse' 
                  : i < currentStep 
                    ? 'bg-blue-400/60 scale-110' 
                    : 'bg-gray-600 scale-100'
              }`}
              style={{
                animationDelay: `${i * 250}ms`
              }}
            />
          ))}
        </div>
        
        <div className="w-40 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 transition-all duration-2500 ease-in-out relative"
            style={{ 
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThinkingAnimation;
