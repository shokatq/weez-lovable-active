import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Activity, MessageSquare, FileText, Bot, Bell } from "lucide-react";

const items = [
  { id: 1, icon: FileText, text: "ACME Brief updated by Dana", time: "2h" },
  { id: 2, icon: MessageSquare, text: "New comment in #product-launch", time: "3h" },
  { id: 3, icon: Bot, text: "AI summarized meeting notes", time: "5h" },
  { id: 4, icon: Bell, text: "Task assigned to you: Write copy", time: "1d" },
];

export default function ActivityFeed() {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Recent Activity</h3>
        <Activity className="w-4 h-4 text-muted-foreground" />
      </div>
      <Separator className="mb-3" />
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-3">
            <i.icon className="w-4 h-4 text-primary" />
            <div className="text-sm text-foreground flex-1">{i.text}</div>
            <span className="text-xs text-muted-foreground">{i.time}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
