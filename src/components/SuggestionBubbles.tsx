
import { FileText, Search, Filter, Folder, Clock, Users } from "lucide-react";

interface SuggestionBubblesProps {
  suggestions: string[];
  onSendMessage: (message: string) => void;
}

const SuggestionBubbles = ({ suggestions, onSendMessage }: SuggestionBubblesProps) => {
  return (
    <div className="pb-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {suggestions.slice(0, 6).map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSendMessage(suggestion)}
            className="px-4 py-3 bg-white/80 backdrop-blur-sm hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 rounded-xl text-sm text-slate-700 hover:text-blue-700 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 font-medium slide-up"
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
