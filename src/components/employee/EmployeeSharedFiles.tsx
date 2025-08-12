
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LinkIcon, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SharedFile {
  id: string;
  title: string;
  url: string;
  platform: string | null;
  created_at: string;
  team_id: string;
  shared_with_user_id: string | null;
}

export default function EmployeeSharedFiles() {
  const { user } = useAuth();
  const { userRole } = useUserRole();
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    if (!user || !userRole?.teamId) return;
    setLoading(true);
    console.log("[SharedFiles] fetching for team", userRole.teamId, "user", user.id);
    const { data, error } = await supabase
      .from("shared_files")
      .select("*")
      .eq("team_id", userRole.teamId)
      .or(`shared_with_user_id.is.null,shared_with_user_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[SharedFiles] fetch error", error);
      toast.error("Failed to load shared files");
    } else {
      setFiles(data as SharedFile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
    // Realtime subscription for shared files in this team
    if (!userRole?.teamId) return;

    const channel = supabase
      .channel("shared_files-employee")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shared_files",
          filter: `team_id=eq.${userRole.teamId}`,
        },
        (payload) => {
          console.log("[SharedFiles] realtime payload", payload);
          fetchFiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole?.teamId, user?.id]);

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Shared Files</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={fetchFiles} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      <Separator className="my-3" />

      {loading ? (
        <div className="space-y-3">
          <div className="h-10 rounded-md bg-muted animate-pulse" />
          <div className="h-10 rounded-md bg-muted animate-pulse" />
          <div className="h-10 rounded-md bg-muted animate-pulse" />
        </div>
      ) : files.length === 0 ? (
        <div className="text-sm text-muted-foreground">No files have been shared with you yet.</div>
      ) : (
        <ul className="space-y-3">
          {files.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{f.title}</div>
                <div className="text-xs text-muted-foreground">
                  {f.platform ? <Badge variant="secondary">{f.platform}</Badge> : <span>Link</span>}
                </div>
              </div>
              <Button asChild variant="secondary" size="sm">
                <a href={f.url} target="_blank" rel="noreferrer">
                  <LinkIcon className="h-4 w-4 mr-1" />
                  Open
                </a>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
