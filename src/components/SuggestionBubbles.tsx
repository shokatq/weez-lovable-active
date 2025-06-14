
import { FileText, Search, Filter, Folder, Clock, Users } from "lucide-react";

interface SuggestionBubblesProps {
  suggestions: string[];
  onSendMessage: (message: string) => void;
}

const SuggestionBubbles = ({ suggestions, onSendMessage }: SuggestionBubblesProps) => {
  const getIconForSuggestion = (suggestion: string) => {
    if (suggestion.toLowerCase().includes('find') || suggestion.toLowerCase().includes('search')) {
      return Search;
    }
    if (suggestion.toLowerCase().includes('pdf') || suggestion.toLowerCase().includes('excel')) {
      return FileText;
    }
    if (suggestion.toLowerCase().includes('shared') || suggestion.toLowerCase().includes('docs')) {
      return Users;
    }
    if (suggestion.toLowerCase().includes('recent') || suggestion.toLowerCase().includes('last')) {
      return Clock;
    }
    if (suggestion.toLowerCase().includes('files') || suggestion.toLowerCase().includes('project')) {
      return Folder;
    }
    return Filter;
  };

  return (
    <div className="px-4 pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {suggestions.map((suggestion, index) => {
            const Icon = getIconForSuggestion(suggestion);
            return (
              <button
                key={index}
                onClick={() => onSendMessage(suggestion)}
                className="group flex items-center gap-2 p-3 bg-gray-900/60 hover:bg-gray-800/70 border border-gray-700/40 hover:border-gray-600/50 rounded-xl text-xs text-gray-300 hover:text-white transition-all duration-200 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 text-left"
              >
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:from-blue-500/30 group-hover:to-indigo-500/30 transition-all duration-200">
                  <Icon className="w-3 h-3 text-blue-400 group-hover:text-blue-300" />
                </div>
                <span className="font-medium leading-tight group-hover:text-blue-100 transition-colors duration-200 truncate text-xs">
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
