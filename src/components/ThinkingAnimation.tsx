
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
          { icon: '🔍', text: 'Scanning your files...' },
          { icon: '📊', text: 'Analyzing content...' },
          { icon: '🎯', text: 'Finding matches...' },
          { icon: '✨', text: 'Preparing results...' }
        ];
      case 'summary':
        return [
          { icon: '📄', text: 'Reading document...' },
          { icon: '🧠', text: 'Understanding context...' },
          { icon: '📝', text: 'Extracting key points...' },
          { icon: '✨', text: 'Generating summary...' }
        ];
      case 'rag':
        return [
          { icon: '🧠', text: 'Processing your question...' },
          { icon: '📚', text: 'Searching knowledge base...' },
          { icon: '🔗', text: 'Connecting information...' },
          { icon: '💡', text: 'Formulating answer...' }
        ];
      case 'upload':
        return [
          { icon: '☁️', text: 'Preparing upload...' },
          { icon: '🔐', text: 'Securing connection...' },
          { icon: '📤', text: 'Transferring files...' },
          { icon: '✅', text: 'Finalizing upload...' }
        ];
      case 'workspace':
        return [
          { icon: '🏢', text: 'Loading workspace...' },
          { icon: '👥', text: 'Fetching team data...' },
          { icon: '📊', text: 'Calculating metrics...' },
          { icon: '🎯', text: 'Preparing dashboard...' }
        ];
      default:
        return [
          { icon: '💭', text: 'Processing request...' },
          { icon: '🤔', text: 'Analyzing context...' },
          { icon: '⚡', text: 'Generating response...' },
          { icon: '✨', text: 'Almost ready...' }
        ];
    }
  };

  const steps = getAnimationSteps();

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    const dotInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(dotInterval);
    };
  }, [steps.length]);

  return (
    <div className="flex items-center gap-4 py-3">
      <div className="relative">
        <div className="text-2xl animate-bounce" style={{ animationDuration: '1s' }}>
          {steps[currentStep].icon}
        </div>
        <div className="absolute -inset-1 bg-gradient-to-r from-weezy-accent to-weezy-glow rounded-full opacity-30 animate-pulse"></div>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white animate-fade-in">
            {steps[currentStep].text}
          </span>
          <span className="text-weezy-accent font-bold min-w-[20px]">{dots}</span>
        </div>
        
        <div className="flex gap-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentStep 
                  ? 'bg-weezy-accent shadow-lg shadow-weezy-accent/50 scale-125' 
                  : i < currentStep 
                    ? 'bg-weezy-accent/60' 
                    : 'bg-gray-600'
              }`}
              style={{
                animationDelay: `${i * 200}ms`
              }}
            />
          ))}
        </div>
        
        <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-weezy-accent to-weezy-glow transition-all duration-2000 ease-out"
            style={{ 
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ThinkingAnimation;
