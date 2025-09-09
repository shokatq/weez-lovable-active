import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Upload, File, Edit2, Trash2, Download, FolderOpen } from 'lucide-react';
import { useFilePermissions, useFileOperations } from '@/hooks/useFilePermissions';

interface FileData {
  id: string;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

interface SpaceFileManagerProps {
  spaceId: string;
  spaceName: string;
}

export const SpaceFileManager = ({ spaceId, spaceName }: SpaceFileManagerProps) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [editingFile, setEditingFile] = useState<FileData | null>(null);
  const [newFileName, setNewFileName] = useState('');

  const { permissions, userRole, loading: permissionsLoading } = useFilePermissions(spaceId);
  const { uploadFile, deleteFile, updateFile } = useFileOperations(spaceId);

  useEffect(() => {
    fetchFiles();
  }, [spaceId]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('space_id', spaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error",
        description: "Failed to fetch files",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    const result = await uploadFile(file);
    if (result) {
      await fetchFiles();
    }
    setUploadLoading(false);
    
    // Reset input
    event.target.value = '';
  };

  const handleDeleteFile = async (fileId: string) => {
    const success = await deleteFile(fileId);
    if (success) {
      await fetchFiles();
    }
  };

  const handleEditFile = async () => {
    if (!editingFile || !newFileName.trim()) return;

    const result = await updateFile(editingFile.id, { filename: newFileName.trim() });
    if (result) {
      setEditingFile(null);
      setNewFileName('');
      await fetchFiles();
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = () => {
    if (!userRole) return null;
    
    const variants = {
      admin: 'destructive',
      team_lead: 'default',
      employee: 'secondary', 
      viewer: 'outline'
    } as const;
    
    const labels = {
      admin: 'Admin',
      team_lead: 'Team Leader',
      employee: 'Employee',
      viewer: 'Viewer'
    };

    return (
      <Badge variant={variants[userRole]}>
        {labels[userRole]}
      </Badge>
    );
  };

  if (permissionsLoading || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            {spaceName} - Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!permissions.canView) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            {spaceName} - Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            You don't have permission to view files in this space.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              {spaceName} - Files
            </CardTitle>
            <CardDescription>
              Manage files with role-based permissions
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {getRoleBadge()}
            {permissions.canUpload && (
              <div>
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploadLoading}
                  className="hidden"
                  id={`file-upload-${spaceId}`}
                />
                <Button
                  onClick={() => document.getElementById(`file-upload-${spaceId}`)?.click()}
                  disabled={uploadLoading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadLoading ? 'Uploading...' : 'Upload File'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{file.filename}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatFileSize(file.file_size)} • {formatDate(file.created_at)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {permissions.canEdit && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingFile(file);
                          setNewFileName(file.filename);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit File</DialogTitle>
                        <DialogDescription>
                          Change the filename for this file.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          value={newFileName}
                          onChange={(e) => setNewFileName(e.target.value)}
                          placeholder="Enter new filename"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingFile(null);
                              setNewFileName('');
                            }}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleEditFile}>
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {permissions.canDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete File</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{file.filename}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteFile(file.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}

          {files.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <div className="text-lg font-medium mb-2">No files yet</div>
              <div className="text-sm">
                {permissions.canUpload 
                  ? "Upload your first file to get started" 
                  : "No files have been uploaded to this space"}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Your Permissions:</h4>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant={permissions.canView ? "default" : "outline"}>
              View: {permissions.canView ? "✓" : "✗"}
            </Badge>
            <Badge variant={permissions.canUpload ? "default" : "outline"}>
              Upload: {permissions.canUpload ? "✓" : "✗"}
            </Badge>
            <Badge variant={permissions.canEdit ? "default" : "outline"}>
              Edit: {permissions.canEdit ? "✓" : "✗"}
            </Badge>
            <Badge variant={permissions.canDelete ? "default" : "outline"}>
              Delete: {permissions.canDelete ? "✓" : "✗"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};