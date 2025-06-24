
import { Button } from "@/components/ui/button";

interface SuggestionBubblesProps {
  onSuggestionClick: (suggestion: string) => void;
}

const SuggestionBubbles = ({ onSuggestionClick }: SuggestionBubblesProps) => {
  const suggestions = [
    "Find my deep learning papers from last year",
    "Give me a detailed summary of the project proposal document",
    "What is ResNet architecture and how does it work?",
    "Upload this quarterly report to Google Drive",
    "Remove the old marketing presentation from Dropbox",
    "Show me the API integration documentation"
  ];

  return (
    <div className="grid grid-cols-1 gap-3 max-w-2xl">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          onClick={() => onSuggestionClick(suggestion)}
          className="text-left justify-start p-4 h-auto border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all duration-200 whitespace-normal"
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
};

export default SuggestionBubbles;
