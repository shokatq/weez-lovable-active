import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Building2 } from "lucide-react";
import { useSpaces, CreateSpaceForm } from "@/hooks/useSpaces";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Team {
  id: string;
  name: string;
}

export function CreateSpaceDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateSpaceForm>({
    name: "",
    description: "",
    team_id: "",
  });
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [createTeamName, setCreateTeamName] = useState("");
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  
  const { createSpace, loading } = useSpaces();
  const { user } = useAuth();
  const { toast } = useToast();

  // Load teams where user is a member
  useEffect(() => {
    const loadTeams = async () => {
      if (!user?.id) return;

      try {
        setTeamsLoading(true);
        
        // Get teams where user has role
        const { data: userRoles, error } = await supabase
          .from('user_roles')
          .select(`
            team_id,
            teams (
              id,
              name
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        const teamsData = userRoles?.map(ur => ur.teams).filter(Boolean) || [];
        setTeams(teamsData as Team[]);
        
        // Auto-select first team if only one exists
        if (teamsData.length === 1) {
          setFormData(prev => ({ ...prev, team_id: teamsData[0].id }));
        }
        
        // Show create team option if no teams
        if (teamsData.length === 0) {
          setShowCreateTeam(true);
        }
      } catch (error) {
        console.error('Error loading teams:', error);
      } finally {
        setTeamsLoading(false);
      }
    };

    if (open) {
      loadTeams();
    }
  }, [open, user?.id]);

  const createTeam = async () => {
    if (!createTeamName.trim()) return;

    try {
      setCreatingTeam(true);
      
      // Call the create_team_with_setup function
      const { data, error } = await supabase.rpc('create_team_with_setup', {
        team_name: createTeamName.trim(),
        team_description: `Team created for ${user?.email || 'user'}`
      });

      if (error) throw error;

      const result = data as any;
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to create team');
      }

      toast({
        title: 'Success',
        description: 'Team created successfully',
      });

      // Reload teams
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select(`
          team_id,
          teams (
            id,
            name
          )
        `)
        .eq('user_id', user!.id);

      const teamsData = userRoles?.map(ur => ur.teams).filter(Boolean) || [];
      setTeams(teamsData as Team[]);
      
      // Auto-select the new team
      if (result.team_id) {
        setFormData(prev => ({ ...prev, team_id: result.team_id }));
      }
      
      setShowCreateTeam(false);
      setCreateTeamName("");
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create team',
        variant: 'destructive',
      });
    } finally {
      setCreatingTeam(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.team_id) {
      return;
    }

    try {
      await createSpace(formData);
      setOpen(false);
      setFormData({ name: "", description: "", team_id: "" });
      setShowCreateTeam(false);
      setCreateTeamName("");
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Space
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Space</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!showCreateTeam ? (
            <div>
              <Label htmlFor="team">Team</Label>
              <Select
                value={formData.team_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, team_id: value }))}
                disabled={teamsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={teamsLoading ? "Loading teams..." : "Select a team"} />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {teams.length === 0 && !teamsLoading && (
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateTeam(true)}
                    className="w-full"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Create Team First
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Label htmlFor="teamName">Team Name</Label>
              <div className="flex gap-2">
                <Input
                  id="teamName"
                  value={createTeamName}
                  onChange={(e) => setCreateTeamName(e.target.value)}
                  placeholder="Enter team name"
                />
                <Button
                  type="button"
                  onClick={createTeam}
                  disabled={!createTeamName.trim() || creatingTeam}
                >
                  {creatingTeam ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateTeam(false)}
                className="mt-2 text-xs"
              >
                Back to team selection
              </Button>
            </div>
          )}

          <div>
            <Label htmlFor="name">Space Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter space name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter space description"
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setShowCreateTeam(false);
                setCreateTeamName("");
                setFormData({ name: "", description: "", team_id: "" });
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name.trim() || !formData.team_id}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Space
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}