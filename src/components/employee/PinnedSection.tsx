import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pin, ExternalLink } from "lucide-react";

const pinned = [
  { id: "p1", title: "Q4 Campaign Brief", href: "#" },
  { id: "p2", title: "Launch Messaging Doc", href: "#" },
  { id: "p3", title: "Creative Assets", href: "#" },
];

export default function PinnedSection() {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Pinned</h3>
        <Pin className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {pinned.map((p) => (
          <a key={p.id} href={p.href} className="block">
            <div className="p-3 rounded-md border border-border hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="font-medium text-foreground truncate">{p.title}</div>
                <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className="mt-3">
        <Button variant="outline" size="sm">Manage pins</Button>
      </div>
    </Card>
  );
}
