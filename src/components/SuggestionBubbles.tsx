
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
    if (suggestion.toLowerCase().includes('summarize')) {
      return FileText;
    }
    if (suggestion.toLowerCase().includes('shared') || suggestion.toLowerCase().includes('team')) {
      return Users;
    }
    if (suggestion.toLowerCase().includes('modified') || suggestion.toLowerCase().includes('last')) {
      return Clock;
    }
    if (suggestion.toLowerCase().includes('folder') || suggestion.toLowerCase().includes('drive')) {
      return Folder;
    }
    return Filter;
  };

  return (
    <div className="px-6 pb-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-400 text-center mb-2">
            Quick File Actions
          </h3>
          <p className="text-xs text-gray-500 text-center">
            Try these common file management tasks
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {suggestions.map((suggestion, index) => {
            const Icon = getIconForSuggestion(suggestion);
            return (
              <button
                key={index}
                onClick={() => onSendMessage(suggestion)}
                className="group flex items-center gap-3 p-4 bg-gray-900/80 hover:bg-gray-800/90 border border-gray-700/50 hover:border-gray-600/80 rounded-xl text-sm text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 hover:scale-105 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:from-blue-500/30 group-hover:to-indigo-500/30 transition-all duration-300">
                  <Icon className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium leading-relaxed group-hover:text-blue-100 transition-colors duration-300">
                    {suggestion}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Or type your own file management request below
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuggestionBubbles;
