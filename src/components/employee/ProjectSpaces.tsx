import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderKanban, MessageSquare, FileText, Link2 } from "lucide-react";

const projects = [
  { id: "brand-campaign", name: "Brand Campaign", unread: 3, type: "channel" as const },
  { id: "product-launch", name: "Product Launch", unread: 0, type: "channel" as const },
  { id: "design-system", name: "Design System", unread: 1, type: "doc" as const },
  { id: "client-acme", name: "Client • ACME", unread: 0, type: "channel" as const },
];

interface ProjectSpacesProps {
  onSelect?: (id: string) => void;
}

export default function ProjectSpaces({ onSelect }: ProjectSpacesProps) {
  return (
    <aside className="space-y-3">
      <div className="px-1">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Project Spaces</h3>
      </div>
      <Card className="bg-card border-border">
        <ul className="divide-y divide-border">
          {projects.map((p) => (
            <li key={p.id}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 rounded-none"
                onClick={() => onSelect?.(p.id)}
              >
                {p.type === "channel" ? (
                  <MessageSquare className="w-4 h-4 text-primary" />
                ) : (
                  <FolderKanban className="w-4 h-4 text-primary" />
                )}
                <span className="truncate text-foreground">{p.name}</span>
                {p.unread > 0 && (
                  <Badge variant="secondary" className="ml-auto">{p.unread}</Badge>
                )}
              </Button>
            </li>
          ))}
          <li>
            <Button variant="ghost" className="w-full justify-start gap-3 rounded-none">
              <Link2 className="w-4 h-4 text-primary" />
              <span>Connect more spaces</span>
            </Button>
          </li>
        </ul>
      </Card>
      <Card className="p-3 bg-card border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="w-4 h-4" />
          <span>Docs & Files centralized</span>
        </div>
      </Card>
    </aside>
  );
}
