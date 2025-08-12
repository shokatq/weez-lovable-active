
import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { RefreshCw } from "lucide-react";

type TaskStatus = "todo" | "in_progress" | "done" | "blocked";
type TaskPriority = "low" | "medium" | "high" | "urgent";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority | null;
  due_date: string | null;
  assigned_to: string | null;
  team_id: string;
  created_at: string;
  updated_at: string;
}

export default function EmployeeTasks() {
  const { user } = useAuth();
  const { userRole } = useUserRole();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const teamId = userRole?.teamId;
  const userId = user?.id;

  const fetchTasks = async () => {
    if (!teamId || !userId) return;
    setLoading(true);
    console.log("[EmployeeTasks] fetching tasks for assignee", userId, "team", teamId);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("team_id", teamId)
      .eq("assigned_to", userId)
      .order("due_date", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[EmployeeTasks] fetch error", error);
      toast.error("Failed to load tasks");
    } else {
      setTasks(data as Task[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();

    if (!teamId) return;
    const channel = supabase
      .channel("tasks-employee")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `team_id=eq.${teamId}`,
        },
        (payload) => {
          console.log("[EmployeeTasks] realtime payload", payload);
          // Re-fetch for simplicity; policies ensure only own tasks are returned
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, userId]);

  const markDone = async (id: string) => {
    // Optimistic update
    setTasks((arr) => arr.map((t) => (t.id === id ? { ...t, status: "done" } : t)));
    const { error } = await supabase.from("tasks").update({ status: "done" }).eq("id", id);
    if (error) {
      console.error("[EmployeeTasks] update error", error);
      toast.error("Could not update task");
      // rollback
      setTasks((arr) => arr.map((t) => (t.id === id ? { ...t, status: "todo" } : t)));
    } else {
      toast.success("Task marked as done");
    }
  };

  const prioritized = useMemo(() => {
    const order = { urgent: 0, high: 1, medium: 2, low: 3 } as Record<string, number>;
    return [...tasks].sort((a, b) => {
      const pa = a.priority ? order[a.priority] : 2;
      const pb = b.priority ? order[b.priority] : 2;
      return pa - pb;
    });
  }, [tasks]);

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">My Tasks</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={fetchTasks} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      <Separator className="my-3" />

      {loading ? (
        <div className="space-y-3">
          <div className="h-10 rounded-md bg-muted animate-pulse" />
          <div className="h-10 rounded-md bg-muted animate-pulse" />
        </div>
      ) : prioritized.length === 0 ? (
        <div className="text-sm text-muted-foreground">No tasks assigned yet.</div>
      ) : (
        <ul className="space-y-3">
          {prioritized.map((t) => (
            <li key={t.id} className="flex items-center gap-3">
              <Checkbox
                checked={t.status === "done"}
                onCheckedChange={() => markDone(t.id)}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-foreground truncate">{t.title}</div>
                <div className="text-xs text-muted-foreground">
                  {t.due_date ? `Due ${new Date(t.due_date).toLocaleDateString()}` : "No due date"}
                </div>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {t.priority || "medium"}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
