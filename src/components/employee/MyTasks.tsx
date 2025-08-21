import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const initial = [
  { id: "t1", title: "Draft campaign copy", due: "Today", tag: "ACME" },
  { id: "t2", title: "Collect assets from Design", due: "Tomorrow", tag: "Launch" },
  { id: "t3", title: "Summarize Slack thread", due: "Fri", tag: "Research" },
];

export default function MyTasks() {
  const [tasks, setTasks] = useState(initial.map((t) => ({ ...t, done: false })));

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">My Tasks</h3>
      </div>
      <Separator className="mb-3" />
      <ul className="space-y-3">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center gap-3">
            <Checkbox
              checked={(t as any).done}
              onCheckedChange={(v) => setTasks((arr) => arr.map((x) => x.id === t.id ? { ...x, done: !!v } : x))}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-foreground truncate">{t.title}</div>
              <div className="text-xs text-muted-foreground">Due {t.due}</div>
            </div>
            <Badge variant="secondary">{t.tag}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
