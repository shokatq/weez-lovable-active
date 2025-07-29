import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Building2, Users, Sparkles } from 'lucide-react';

const WorkspaceSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const predefinedDepartments = [
    { name: 'Marketing', description: 'Digital marketing, content, and brand management' },
    { name: 'Creative', description: 'Design, video production, and creative content' },
    { name: 'Operations', description: 'Business operations and project management' },
    { name: 'Sales', description: 'Sales and business development' },
    { name: 'HR', description: 'Human resources and talent management' },
    { name: 'Finance', description: 'Finance, accounting, and budgeting' },
    { name: 'IT', description: 'Information technology and systems' },
    { name: 'Design', description: 'UI/UX design and visual design' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Create the team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: formData.name,
          description: formData.description,
          created_by: user.id,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add the creator as admin
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          team_id: team.id,
          role: 'admin',
        });

      if (roleError) throw roleError;

      // Add predefined departments
      const departmentsToInsert = predefinedDepartments.map(dept => ({
        name: dept.name,
        description: dept.description,
        team_id: team.id,
      }));

      const { error: deptError } = await supabase
        .from('departments')
        .insert(departmentsToInsert);

      if (deptError) throw deptError;

      // Add creator to team_employees
      const { error: employeeError } = await supabase
        .from('team_employees')
        .insert({
          user_id: user.id,
          team_id: team.id,
          status: 'active',
        });

      if (employeeError) throw employeeError;

      toast.success('Workspace created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating workspace:', error);
      toast.error(error.message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Welcome to Weez.AI</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Let's set up your workspace to get started with AI-powered team management
          </p>
        </div>

        {/* Setup Form */}
        <Card className="border-2 border-primary/10 shadow-xl">
          <CardHeader className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building2 className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Create Your Workspace</CardTitle>
            </div>
            <CardDescription className="text-base">
              Your workspace is where your team will collaborate, manage projects, and leverage AI tools.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Workspace Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Acme Creative Agency"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of your workspace and what your team does..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Predefined Departments Preview */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <Label className="text-sm font-medium">
                    Default Departments (You can customize these later)
                  </Label>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {predefinedDepartments.slice(0, 6).map((dept) => (
                    <div key={dept.name} className="flex items-center space-x-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      <span>{dept.name}</span>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                    <span>+ 2 more...</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !formData.name.trim()}
                className="w-full h-12 text-base font-semibold"
              >
                {loading ? 'Creating Workspace...' : 'Create Workspace & Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">Team Management</h3>
            <p className="text-sm text-muted-foreground">Invite and manage team members with role-based access</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">AI-Powered</h3>
            <p className="text-sm text-muted-foreground">Leverage AI tools for enhanced productivity</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">Organized</h3>
            <p className="text-sm text-muted-foreground">Keep projects and departments well organized</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSetup;