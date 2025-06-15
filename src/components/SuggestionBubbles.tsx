
import { FileText, Search, Filter, Folder, Clock, Users } from "lucide-react";

interface SuggestionBubblesProps {
  suggestions: string[];
  onSendMessage: (message: string) => void;
}

const SuggestionBubbles = ({ suggestions, onSendMessage }: SuggestionBubblesProps) => {
  return (
    <div className="pb-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {suggestions.slice(0, 4).map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSendMessage(suggestion)}
            className="px-4 py-2 bg-gray-800/70 hover:bg-gray-700/70 border border-gray-700/60 rounded-xl text-sm text-gray-300 hover:text-white transition-colors duration-200"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionBubbles;
