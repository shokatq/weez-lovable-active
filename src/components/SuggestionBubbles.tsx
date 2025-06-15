
import { FileText, Search, Filter, Folder, Clock, Users } from "lucide-react";

interface SuggestionBubblesProps {
  suggestions: string[];
  onSendMessage: (message: string) => void;
}

const SuggestionBubbles = ({ suggestions, onSendMessage }: SuggestionBubblesProps) => {
  const getIconForSuggestion = (suggestion: string) => {
    const s = suggestion.toLowerCase();
    if (s.includes('find') || s.includes('search')) return Search;
    if (s.includes('summarize')) return FileText;
    if (s.includes('pdf') || s.includes('excel') || s.includes('presentation')) return FileText;
    if (s.includes('shared') || s.includes('docs')) return Users;
    if (s.includes('recent') || s.includes('last')) return Clock;
    if (s.includes('files') || s.includes('project')) return Folder;
    return Filter;
  };

  return (
    <div className="px-4 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {suggestions.slice(0, 4).map((suggestion, index) => {
            const Icon = getIconForSuggestion(suggestion);
            return (
              <button
                key={index}
                onClick={() => onSendMessage(suggestion)}
                className="group flex items-center gap-2 px-3 py-2 bg-gray-950/80 hover:bg-gray-800/90 border border-gray-700/60 hover:border-gray-600/70 rounded-lg text-xs text-gray-300 hover:text-white transition-all duration-200 backdrop-blur-sm"
              >
                <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
                <span className="font-medium leading-tight whitespace-nowrap">
                  {suggestion}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SuggestionBubbles;
