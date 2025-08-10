import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

const EmployeeLogin = () => {
  const { user, signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Employee Sign In • Weez AI';
    const desc = 'Sign in to your employee workspace to access documents and tasks.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', window.location.href);
  }, []);

  // If already authenticated, route by role
  useEffect(() => {
    const redirectByRole = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();
      if (error) {
        console.error(error);
        navigate('/employee-dashboard', { replace: true });
        return;
      }
      const role = data?.role as string | undefined;
      if (role === 'admin' || role === 'team_lead') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/employee-dashboard', { replace: true });
      }
    };
    redirectByRole();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;

      // If user entered an invite code, attempt to accept it after login
      if (inviteCode.trim()) {
        const { data, error: rpcError } = await supabase.rpc('accept_team_invitation', {
          invitation_id: inviteCode.trim(),
        });
        if (rpcError) throw rpcError;
        const result = data as any;
        if (result?.success) {
          toast.success('Invitation accepted. Welcome to the workspace!');
        } else {
          toast.error(result?.error || 'Failed to accept invitation');
        }
      }

      navigate('/employee-dashboard', { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        <Card className="border border-border/50 backdrop-blur-sm bg-card/80">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Employee Sign In</CardTitle>
            <CardDescription>Access your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Button type="button" variant="outline" className="w-full" onClick={() => signInWithGoogle()}>
                Continue with Google
              </Button>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite">Workspace Invite Code (optional)</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="invite"
                    type="text"
                    placeholder="Paste invitation code (UUID)"
                    className="pl-10"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="text-center">
                <Button variant="ghost" onClick={() => navigate('/employee-signup')} disabled={isLoading}>
                  Need an account? Employee Sign Up
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeLogin;
