import React, { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadWithProgressProps {
  spaceId: string;
  onUploadComplete?: () => void;
  onUploadStart?: () => void;
  canUpload: boolean;
}

export const DocumentUploadWithProgress: React.FC<DocumentUploadWithProgressProps> = ({
  spaceId,
  onUploadComplete,
  onUploadStart,
  canUpload
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const sendDocumentNotification = async (fileName: string) => {
    try {
      if (!user) return;

      // Send notification message to the space chat
      const { error } = await supabase
        .from('space_messages')
        .insert({
          space_id: spaceId,
          user_id: user.id,
          content: `📎 New document uploaded: ${fileName}`,
          message_type: 'system'
        });

      if (error) {
        console.warn('Failed to send document notification:', error);
      }
    } catch (error) {
      console.warn('Error sending document notification:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 20MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);
    onUploadStart?.();

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${spaceId}/${fileName}`;

      // Simulate upload progress (since Supabase doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from('workspace-documents')
        .upload(filePath, file);

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      setUploadProgress(95);

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

      setUploadProgress(100);

      // Send notification to space chat
      await sendDocumentNotification(file.name);

      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded successfully`,
      });

      onUploadComplete?.();
      
      // Reset after a short delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setSelectedFile(null);
      }, 1500);

    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
      setUploadProgress(0);
      setSelectedFile(null);
    }
  };

  const cancelUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setSelectedFile(null);
  };

  if (isUploading && selectedFile) {
    return (
      <Card className="p-4 bg-background border">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium truncate">{selectedFile.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={cancelUpload}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <Progress value={uploadProgress} className="h-2" />
          
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Uploading... {Math.round(uploadProgress)}%</span>
            <span>{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileUpload}
        disabled={!canUpload}
      />
      <Button asChild disabled={!canUpload}>
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </label>
      </Button>
    </div>
  );
};