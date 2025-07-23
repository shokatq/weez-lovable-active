
import { FileText, Search, Filter, Folder, Clock, Users } from "lucide-react";

interface SuggestionBubblesProps {
  suggestions: string[];
  onSendMessage: (message: string) => void;
}

const SuggestionBubbles = ({ suggestions, onSendMessage }: SuggestionBubblesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
      {suggestions.slice(0, 6).map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSendMessage(suggestion)}
          className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 font-medium text-left"
          style={{ 
            animationDelay: `${index * 50}ms`,
            opacity: 0,
            animation: 'fade-in 0.5s ease-out forwards'
          }}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SuggestionBubbles;
