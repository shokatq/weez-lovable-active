import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Cloud, HardDrive, Boxes, Slack, FileText, NotebookPen } from "lucide-react";

export default function ConnectedPlatforms() {
  const platforms = [
    { name: "Google Drive", icon: Cloud, status: "Synced" },
    { name: "OneDrive", icon: HardDrive, status: "Connect" },
    { name: "Dropbox", icon: Boxes, status: "Connect" },
    { name: "Slack", icon: Slack, status: "Synced" },
    { name: "Notion", icon: NotebookPen, status: "Connect" },
  ];

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Connected Platforms</h3>
        <Button variant="outline" size="sm">Manage</Button>
      </div>
      <Separator className="mb-3" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {platforms.map((p) => (
          <div key={p.name} className="flex items-center gap-3 p-3 rounded-md border border-border">
            <p.icon className="w-5 h-5 text-primary" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.status === "Synced" ? "Live sync enabled" : "Not connected"}</div>
            </div>
            <Badge variant={p.status === "Synced" ? "secondary" : "outline"}>{p.status}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
