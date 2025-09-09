import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SpacesManagement from '@/components/SpacesManagement';
import { SpacesService } from '@/services/spacesService';
import { toast } from '@/hooks/use-toast';

const SpacesManagementPage = () => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Handle invitation acceptance if token is present
    const token = searchParams.get('token');
    if (token) {
      handleInvitationAcceptance(token);
    }
  }, [searchParams]);

  const handleInvitationAcceptance = async (token: string) => {
    try {
      const success = await SpacesService.acceptInvitation(token);
      if (success) {
        toast({
          title: "Success",
          description: "You've successfully joined the space!"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to accept invitation. It may be expired or invalid.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast({
        title: "Error",
        description: "An error occurred while accepting the invitation.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h1 className="text-xl font-semibold">Spaces Management</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SpacesManagement />
      </div>
    </div>
  );
};

export default SpacesManagementPage;