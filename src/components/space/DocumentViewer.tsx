import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

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

interface DocumentViewerProps {
  file: SpaceFile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  file,
  isOpen,
  onClose
}) => {
  if (!file) return null;

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getPublicUrl = () => {
    const { data } = supabase.storage
      .from('workspace-documents')
      .getPublicUrl(file.file_path);
    return data.publicUrl;
  };

  const downloadFile = async () => {
    const { data, error } = await supabase.storage
      .from('workspace-documents')
      .download(file.file_path);

    if (error) {
      console.error('Error downloading file:', error);
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openInNewTab = () => {
    const url = getPublicUrl();
    window.open(url, '_blank');
  };

  const isViewable = file.mime_type && (
    file.mime_type.startsWith('image/') ||
    file.mime_type === 'application/pdf' ||
    file.mime_type.startsWith('text/') ||
    file.mime_type.includes('document') ||
    file.mime_type.includes('spreadsheet') ||
    file.mime_type.includes('presentation')
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold truncate pr-4">
              {file.filename}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={downloadFile}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={openInNewTab}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarImage src={file.owner?.avatar_url || undefined} />
              <AvatarFallback>
                {file.owner?.first_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {file.owner?.first_name} {file.owner?.last_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(file.created_at).toLocaleDateString()} • {formatFileSize(file.file_size)}
              </p>
            </div>
            <Badge variant="secondary">
              {file.mime_type?.split('/')[1]?.toUpperCase() || 'FILE'}
            </Badge>
          </div>

          {/* File Preview */}
          <div className="flex-1 min-h-[400px] bg-muted/30 rounded-lg flex items-center justify-center">
            {isViewable ? (
              file.mime_type?.startsWith('image/') ? (
                <img
                  src={getPublicUrl()}
                  alt={file.filename}
                  className="max-w-full max-h-[400px] object-contain rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : file.mime_type === 'application/pdf' ? (
                <iframe
                  src={getPublicUrl()}
                  className="w-full h-[400px] rounded border"
                  title={file.filename}
                />
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground mb-4">
                    Preview not available for this file type
                  </p>
                  <Button onClick={openInNewTab}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              )
            ) : (
              <div className="text-center p-8">
                <p className="text-muted-foreground mb-4">
                  Preview not available for this file type
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={downloadFile}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={openInNewTab}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};