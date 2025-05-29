
const ThinkingAnimation = () => {
  return (
    <div className="flex items-center gap-2 py-2">
      <span className="text-sm text-white/80">Weezy is thinking</span>
      <div className="flex gap-1">
        <div
          className="w-2 h-2 bg-weezy-accent rounded-full animate-thinking-dot"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-weezy-accent-light rounded-full animate-thinking-dot"
          style={{ animationDelay: "200ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-weezy-glow rounded-full animate-thinking-dot"
          style={{ animationDelay: "400ms" }}
        ></div>
      </div>
    </div>
  );
};

export default ThinkingAnimation;
