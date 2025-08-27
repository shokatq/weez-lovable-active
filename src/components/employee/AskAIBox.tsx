import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Bot, User, Copy } from "lucide-react";
import ThinkingAnimation from "@/components/ThinkingAnimation";
import { fastApiService } from "@/services/fastApiService";

interface Msg { role: "user" | "ai"; content: string }

export default function AskAIBox() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", content: "Hi! Ask me to find files, summarize chats, or draft ideas." },
  ]);

  const onAsk = async () => {
    if (!input.trim()) return;
    const question = input;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: question }]);
    setLoading(true);
    try {
      const res = await fastApiService.askAgent({ query: question, user_id: 'anonymous' });
      const text = (res as any)?.data?.answer || "Here’s a quick summary and relevant links based on your request.";
      setMessages((m) => [...m, { role: "ai", content: text }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "ai", content: "I couldn't reach the AI service. Here's a suggested outline instead." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 bg-card border-border">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Ask AI</h3>
      <div className="space-y-3">
        <div className="space-y-2 max-h-[360px] overflow-auto pr-1">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${m.role === "ai" ? "bg-muted/50" : ""} p-2 rounded-md`}>
              {m.role === "ai" ? (
                <Bot className="w-4 h-4 mt-1 text-primary" />
              ) : (
                <User className="w-4 h-4 mt-1 text-muted-foreground" />
              )}
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-sm text-foreground whitespace-pre-wrap">{m.content}</p>
              </div>
              {m.role === "ai" && (
                <button className="ml-auto text-muted-foreground hover:text-foreground" aria-label="Copy">
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <ThinkingAnimation type="general" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Summarize a file, find assets, or brainstorm…"
            className={`min-h-[48px] ${loading ? 'animate-pulse-glow border-primary/40' : ''}`}
          />
          <Button onClick={onAsk} disabled={loading}>Ask</Button>
        </div>
      </div>
    </Card>
  );
}
