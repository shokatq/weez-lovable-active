import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SimplifiedInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInviteSuccess?: () => void;
}

const SimplifiedInviteDialog = ({ open, onOpenChange, onInviteSuccess }: SimplifiedInviteDialogProps) => {
  const { user } = useAuth();
  const { userRole } = useUserRole();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !user || !userRole?.teamId) return;

    setLoading(true);
    try {
      // Use the secure function for team invitations
      const { data: result, error: functionError } = await supabase
        .rpc('handle_team_invitation', {
          invitation_email: email,
          team_id: userRole.teamId,
          role: 'employee',
          invited_by: user.id,
          custom_department: null
        });

      if (functionError) {
        throw functionError;
      }

      const invitationResult = result as any;
      if (!invitationResult?.success) {
        throw new Error(invitationResult?.error || 'Failed to create invitation');
      }

      // Send invitation email
      const { error: emailError } = await supabase.functions.invoke('send-team-invitation', {
        body: {
          inviteeEmail: email,
          inviteeName: email.split('@')[0],
          workspaceName: userRole.teamName,
          userRole: 'Employee',
          userDepartment: 'General',
          inviterName: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email,
          invitationId: invitationResult.invitation_id,
        },
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        toast.error('Invitation created but email failed to send');
      } else {
        toast.success('Invitation sent successfully!');
      }

      // Reset form and close dialog
      setEmail('');
      onOpenChange(false);
      onInviteSuccess?.();
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Enter the email address of the person you'd like to invite to your workspace.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !email.trim()}>
              {loading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SimplifiedInviteDialog;