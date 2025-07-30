import { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Users } from 'lucide-react';
import { toast } from 'sonner';

interface InvitationData {
  id: string;
  email: string;
  role: string;
  team_id: string;
  expires_at: string;
  accepted_at: string | null;
  teams: {
    name: string;
    description: string;
  };
}

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const invitationId = searchParams.get('id');

  useEffect(() => {
    if (!invitationId) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    fetchInvitation();
  }, [invitationId]);

  const fetchInvitation = async () => {
    try {
      const { data, error } = await supabase
        .from('team_invitations')
        .select(`
          *,
          teams (
            name,
            description
          )
        `)
        .eq('id', invitationId)
        .single();

      if (error) throw error;

      if (!data) {
        setError('Invitation not found');
        return;
      }

      if (data.accepted_at) {
        setError('This invitation has already been accepted');
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        setError('This invitation has expired');
        return;
      }

      setInvitation(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!invitation || !user) return;

    if (user.email !== invitation.email) {
      setError('This invitation is for a different email address. Please sign in with the correct account.');
      return;
    }

    setAccepting(true);
    try {
      const { data, error } = await supabase.rpc('accept_team_invitation', {
        invitation_id: invitation.id
      });

      if (error) throw error;

      const result = data as any;
      if (result?.success) {
        setSuccess(true);
        toast.success('Successfully joined the team!');
        setTimeout(() => {
          window.location.href = '/workspace';
        }, 2000);
      } else {
        throw new Error(result?.error || 'Failed to accept invitation');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to accept invitation');
      toast.error('Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-6">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading invitation...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Welcome to the team!</CardTitle>
            <CardDescription>
              You have successfully joined {invitation?.teams.name}. Redirecting to your workspace...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <CardTitle className="text-2xl">Invalid Invitation</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.href = '/auth'} 
              className="w-full"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Users className="w-16 h-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Join {invitation?.teams.name}</CardTitle>
            <CardDescription>
              You've been invited to join <strong>{invitation?.teams.name}</strong> as a <strong>{invitation?.role}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Please sign in or create an account with <strong>{invitation?.email}</strong> to accept this invitation.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.href = '/auth'} 
                className="w-full"
              >
                Sign In / Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Users className="w-16 h-16 text-primary mx-auto mb-4" />
          <CardTitle className="text-2xl">Join {invitation?.teams.name}</CardTitle>
          <CardDescription>
            You've been invited to join <strong>{invitation?.teams.name}</strong> as a <strong>{invitation?.role}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {invitation?.teams.description && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">{invitation.teams.description}</p>
            </div>
          )}
          
          <Alert>
            <AlertDescription>
              By accepting this invitation, you'll gain access to the team workspace and be able to collaborate with other members.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button 
              onClick={handleAcceptInvitation}
              disabled={accepting}
              className="w-full"
            >
              {accepting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Joining Team...
                </>
              ) : (
                'Accept Invitation'
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitation;