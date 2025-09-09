import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, Lock, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { SpacesService } from '@/services/spacesService';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  user_id: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface CreateSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSpaceCreated?: () => void;
  teamMembers: TeamMember[];
}

const CreateSpaceDialog = ({ open, onOpenChange, onSpaceCreated, teamMembers }: CreateSpaceDialogProps) => {
  const { user } = useAuth();
  const { userRole } = useUserRole();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !userRole?.teamId) return;

    setLoading(true);
    try {
      // Create the space
      const spaceId = await SpacesService.createSpace(
        name,
        description
      );
      
      if (!spaceId) throw new Error('Failed to create space');

      // If it's a private space, add selected members
      if (isPrivate && selectedMembers.length > 0) {
        const memberPromises = selectedMembers.map(userId => 
          SpacesService.addMemberToSpace(spaceId, userId)
        );
        await Promise.all(memberPromises);
      }

      toast.success('Space created successfully!');
      
      // Reset form
      setName('');
      setDescription('');
      setIsPrivate(false);
      setSelectedMembers([]);
      onOpenChange(false);
      onSpaceCreated?.();
    } catch (error) {
      console.error('Error creating space:', error);
      toast.error('Failed to create space');
    } finally {
      setLoading(false);
    }
  };

  const toggleMemberSelection = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getSelectedMemberName = (userId: string) => {
    const member = teamMembers.find(m => m.user_id === userId);
    return member ? `${member.profiles.first_name} ${member.profiles.last_name}` : 'Unknown';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Create New Space
          </DialogTitle>
          <DialogDescription>
            Create a dedicated space for your team to collaborate and share files.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleCreateSpace} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="space-name">Space Name *</Label>
            <Input
              id="space-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Marketing Team, Product Development"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="space-description">Description</Label>
            <Textarea
              id="space-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this space..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="private-space"
                checked={isPrivate}
                onCheckedChange={(checked) => setIsPrivate(checked === true)}
              />
              <Label htmlFor="private-space" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Private Space
              </Label>
            </div>
            
            {isPrivate && (
              <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/30">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Members</Label>
                  <p className="text-xs text-muted-foreground">
                    Choose team members who will have access to this private space
                  </p>
                </div>
                
                {/* Selected Members */}
                {selectedMembers.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs">Selected ({selectedMembers.length})</Label>
                    <div className="flex flex-wrap gap-1">
                      {selectedMembers.map(userId => (
                        <Badge key={userId} variant="secondary" className="text-xs">
                          {getSelectedMemberName(userId)}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-1 hover:bg-transparent"
                            onClick={() => toggleMemberSelection(userId)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Members */}
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  <Label className="text-xs">Available Members</Label>
                  <div className="space-y-1">
                    {teamMembers
                      .filter(member => member.user_id !== user?.id && !selectedMembers.includes(member.user_id))
                      .map(member => (
                      <div 
                        key={member.user_id}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleMemberSelection(member.user_id)}
                      >
                        <Checkbox 
                          checked={selectedMembers.includes(member.user_id)}
                          onChange={() => {}}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {member.profiles.first_name} {member.profiles.last_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {member.profiles.email}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Creating...' : 'Create Space'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSpaceDialog;