
import { MessageSquare } from "lucide-react";

interface SuggestionBubblesProps {
  suggestions: string[];
  onSendMessage: (message: string) => void;
}

const SuggestionBubbles = ({ suggestions, onSendMessage }: SuggestionBubblesProps) => {
  return (
    <div className="px-6 pb-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap gap-3 justify-center">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSendMessage(suggestion)}
              className="group flex items-center gap-2 px-4 py-2 bg-gray-900/80 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:scale-105"
            >
              <MessageSquare className="w-4 h-4 opacity-70 group-hover:opacity-100" />
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestionBubbles;
