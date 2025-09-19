import React, { useState, useEffect } from 'react';
import { Upload, FileText, Image, Video, Download, Trash2, MoreVertical, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SpaceFile {
  id: string;
  filename: string;
  file_path: string;
  mime_type: string | null;
  file_size: number | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
  owner?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

interface SpaceDocumentManagerProps {
  spaceId: string;
  userRole: string;
}

export const SpaceDocumentManager: React.FC<SpaceDocumentManagerProps> = ({
  spaceId,
  userRole
}) => {
  const [files, setFiles] = useState<SpaceFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { user } = useAuth();
  const { toast } = useToast();

  const loadFiles = async () => {
    try {
      // Load files with owner info using explicit queries
      const { data: filesData, error: filesError } = await supabase
        .from('files')
        .select('*')
        .eq('space_id', spaceId)
        .order('created_at', { ascending: false });

      if (filesError) throw filesError;

      // Get unique owner IDs
      const ownerIds = [...new Set(filesData?.map(file => file.owner_id) || [])];
      
      // Load profiles for owners
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', ownerIds);

      if (profilesError) {
        console.warn('Error loading profiles:', profilesError);
      }

      // Create profiles map for quick lookup
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Format files with owner data
      const formattedFiles = filesData?.map(file => ({
        ...file,
        owner: profilesMap.get(file.owner_id) || {
          first_name: 'Unknown',
          last_name: 'User',
          avatar_url: null
        }
      })) || [];
      
      setFiles(formattedFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${spaceId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('workspace-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('files')
        .insert({
          space_id: spaceId,
          filename: file.name,
          file_path: filePath,
          mime_type: file.type,
          file_size: file.size,
          owner_id: user.id
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      loadFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return <FileText className="h-5 w-5 text-muted-foreground" />;
    
    if (mimeType.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (mimeType.startsWith('video/')) {
      return <Video className="h-5 w-5 text-purple-500" />;
    } else {
      return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'images' && file.mime_type?.startsWith('image/')) ||
                         (selectedFilter === 'documents' && file.mime_type && !file.mime_type.startsWith('image/') && !file.mime_type.startsWith('video/')) ||
                         (selectedFilter === 'videos' && file.mime_type?.startsWith('video/'));
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    if (spaceId) {
      loadFiles();
    }
  }, [spaceId]);

  // Set up real-time subscription for file changes
  useEffect(() => {
    if (!spaceId) return;

    const filesChannel = supabase
      .channel(`space-files-${spaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'files',
          filter: `space_id=eq.${spaceId}`
        },
        () => {
          // Reload files when changes occur
          loadFiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(filesChannel);
    };
  }, [spaceId]);

  const canUpload = ['admin', 'team_lead', 'employee'].includes(userRole);
  const canDelete = userRole === 'admin';

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-background">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Documents & Files</h3>
            <p className="text-sm text-muted-foreground">{files.length} files</p>
          </div>
          
          {canUpload && (
            <div>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </label>
              </Button>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {selectedFilter === 'all' ? 'All Files' : 
                 selectedFilter === 'images' ? 'Images' :
                 selectedFilter === 'documents' ? 'Documents' : 'Videos'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedFilter('all')}>
                All Files
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('images')}>
                Images
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('documents')}>
                Documents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('videos')}>
                Videos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Files Grid */}
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="text-center text-muted-foreground py-8">Loading files...</div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No files found</p>
            {canUpload && (
              <p className="text-sm mt-2">Upload your first file to get started</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getFileIcon(file.mime_type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{file.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.file_size)}
                      </p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      {canDelete && (
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={file.owner?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {file.owner?.first_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">
                      By {file.owner?.first_name} {file.owner?.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};