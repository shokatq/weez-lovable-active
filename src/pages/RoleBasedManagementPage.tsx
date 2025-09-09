import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { UserRoleManagement } from '@/components/UserRoleManagement';
import { SpaceFileManager } from '@/components/SpaceFileManager';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from '@/hooks/use-toast';

interface Space {
  id: string;
  name: string;
  description: string;
  team_id: string;
}

const RoleBasedManagementPage = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { user } = useAuth();
  const { userRole, loading: roleLoading } = useUserRole();
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (spaceId) {
      fetchSpace();
    }
  }, [spaceId]);

  const fetchSpace = async () => {
    if (!spaceId) return;
    
    try {
      const { data, error } = await supabase
        .from('spaces')
        .select('id, name, description, team_id')
        .eq('id', spaceId)
        .single();

      if (error) {
        console.error('Error fetching space:', error);
        toast({
          title: "Error",
          description: "Failed to load space details",
          variant: "destructive"
        });
        return;
      }

      setSpace(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Link to="/chat">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Chat</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Link to="/chat">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Chat</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-8">Space not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/chat">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Chat</span>
              </Button>
            </Link>
            
            <div className="text-center">
              <h1 className="text-lg font-semibold">{space.name}</h1>
              <p className="text-sm text-muted-foreground">Role-Based Management</p>
            </div>
            
            <div className="w-24" /> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* User Role Management - Only show if user has admin access */}
          {userRole?.role === 'admin' && (
            <UserRoleManagement teamId={space.team_id} />
          )}
          
          {/* File Management */}
          <SpaceFileManager 
            spaceId={space.id} 
            spaceName={space.name}
          />
        </div>
      </div>
    </div>
  );
};

export default RoleBasedManagementPage;