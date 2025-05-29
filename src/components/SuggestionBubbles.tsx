
import { useState, useEffect } from "react";

const suggestions = [
  "Summarize my documents",
  "Find my documents",
  "Help me write an email",
  "Analyze this data",
  "Create a presentation",
  "Schedule my tasks",
  "Research latest trends",
  "Generate creative ideas",
  "Review my notes",
  "Plan my day",
];

const SuggestionBubbles = () => {
  const [visibleSuggestions, setVisibleSuggestions] = useState(
    suggestions.slice(0, 4)
  );
  const [shuffleIndex, setShuffleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setShuffleIndex((prev) => (prev + 1) % suggestions.length);
      setVisibleSuggestions((prev) => {
        const newSuggestions = [...prev];
        const randomIndex = Math.floor(Math.random() * newSuggestions.length);
        const nextSuggestionIndex =
          (suggestions.indexOf(newSuggestions[randomIndex]) + 1) %
          suggestions.length;
        newSuggestions[randomIndex] = suggestions[nextSuggestionIndex];
        return newSuggestions;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
      <div className="flex flex-wrap justify-center gap-3 px-4">
        {visibleSuggestions.map((suggestion, index) => (
          <div
            key={`${suggestion}-${shuffleIndex}`}
            className="suggestion-bubble animate-shuffle"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionBubbles;
