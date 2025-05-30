
import { useState, useEffect } from "react";

const suggestions = [
  "Summarize my documents",
  "Find my documents",
  "Help me write an email",
  "Analyze this data",
  "Create a presentation",
  "Schedule my tasks",
];

const SuggestionBubbles = () => {
  const [visibleSuggestions, setVisibleSuggestions] = useState(
    suggestions.slice(0, 3)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleSuggestions((prev) => {
        const newSuggestions = [...suggestions];
        return newSuggestions.slice(0, 3);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 w-full max-w-3xl">
      <div className="flex flex-wrap justify-center gap-3 px-4">
        {visibleSuggestions.map((suggestion, index) => (
          <div
            key={suggestion}
            className="bg-secondary border border-border rounded-full px-4 py-2 text-sm text-foreground cursor-pointer hover:bg-accent hover:border-accent transition-colors shadow-sm"
          >
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionBubbles;
