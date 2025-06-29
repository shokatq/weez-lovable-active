
import { FileText, Search, Filter, Folder, Clock, Users } from "lucide-react";

interface SuggestionBubblesProps {
  suggestions: string[];
  onSendMessage: (message: string) => void;
}

const SuggestionBubbles = ({ suggestions, onSendMessage }: SuggestionBubblesProps) => {
  return (
    <div className="pb-6">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {suggestions.slice(0, 6).map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSendMessage(suggestion)}
            className="px-6 py-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-900 rounded-2xl text-sm text-gray-700 hover:text-gray-900 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 font-medium animate-fade-in shadow-sm"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionBubbles;
