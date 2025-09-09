import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'team_lead' | 'employee' | 'viewer';

export interface FilePermissions {
  canView: boolean;
  canUpload: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export const useFilePermissions = (spaceId: string) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<FilePermissions>({
    canView: false,
    canUpload: false,
    canEdit: false,
    canDelete: false
  });
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user || !spaceId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('get_user_role_for_space', {
          space_id_param: spaceId
        });

        if (error) {
          console.error('Error fetching user role:', error);
          toast({
            title: "Error",
            description: "Failed to fetch user permissions",
            variant: "destructive"
          });
          return;
        }

        const role = data as UserRole;
        setUserRole(role);
        
        // Set permissions based on role
        const newPermissions: FilePermissions = {
          canView: true, // All roles can view
          canUpload: role !== 'viewer',
          canEdit: role === 'admin' || role === 'team_lead',
          canDelete: role === 'admin'
        };
        
        setPermissions(newPermissions);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user, spaceId]);

  return { permissions, userRole, loading };
};

export const useFileOperations = (spaceId: string) => {
  const { user } = useAuth();
  const { permissions } = useFilePermissions(spaceId);

  const uploadFile = async (file: File) => {
    if (!permissions.canUpload) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to upload files",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('files')
        .insert({
          space_id: spaceId,
          owner_id: user?.id,
          filename: file.name,
          file_path: `${spaceId}/${file.name}`,
          file_size: file.size,
          mime_type: file.type
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "File uploaded successfully"
      });

      return data;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload file",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!permissions.canDelete) {
      toast({
        title: "Access Denied", 
        description: "You don't have permission to delete files",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "File deleted successfully"
      });

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete file",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateFile = async (fileId: string, updates: { filename?: string }) => {
    if (!permissions.canEdit) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit files", 
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('files')
        .update(updates)
        .eq('id', fileId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "File updated successfully"
      });

      return data;
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update file",
        variant: "destructive"
      });
      return null;
    }
  };

  return { uploadFile, deleteFile, updateFile, permissions };
};