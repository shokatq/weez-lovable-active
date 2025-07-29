import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Check } from 'lucide-react';
import { toast } from 'sonner';

const TeamCreationCard = () => {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.name.trim()) return;

    setIsCreating(true);

    try {
      // Create team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          created_by: user.id
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add user as admin
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          team_id: teamData.id,
          role: 'admin'
        });

      if (roleError) throw roleError;

      toast.success('Team created successfully!');
      setFormData({ name: '', description: '' });
      setShowForm(false);
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast.error(error.message || 'Failed to create team');
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!showForm) {
    return (
      <Card className="border border-dashed border-primary/30 hover:border-primary/50 transition-colors cursor-pointer bg-primary/5 hover:bg-primary/10">
        <CardContent 
          className="flex flex-col items-center justify-center p-8 text-center"
          onClick={() => setShowForm(true)}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Create New Team</h3>
          <p className="text-muted-foreground text-sm">
            Start collaborating with your team members
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-primary/50 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Create New Team
        </CardTitle>
        <CardDescription>
          Set up a new team workspace for collaboration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g., Marketing Team"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isCreating}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description of the team's purpose..."
              value={formData.description}
              onChange={handleInputChange}
              disabled={isCreating}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isCreating || !formData.name.trim()}
              className="flex-1"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Create Team
                </div>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowForm(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TeamCreationCard;