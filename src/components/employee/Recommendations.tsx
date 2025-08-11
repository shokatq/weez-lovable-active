import { Card } from "@/components/ui/card";
import { Sparkles, ExternalLink } from "lucide-react";

const recs = [
  { id: "r1", title: "Use the Launch Checklist template", source: "Notion", href: "#" },
  { id: "r2", title: "Past Campaign: Summer 2024 – Assets", source: "Drive", href: "#" },
  { id: "r3", title: "Creative brief structure that worked well", source: "Weez", href: "#" },
];

export default function Recommendations() {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium text-muted-foreground">Recommended for you</h3>
      </div>
      <div className="grid gap-2">
        {recs.map((r) => (
          <a key={r.id} href={r.href} className="block">
            <div className="p-3 rounded-md border border-border hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-foreground truncate">{r.title}</div>
                <span className="text-xs text-muted-foreground ml-auto">{r.source}</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
}
