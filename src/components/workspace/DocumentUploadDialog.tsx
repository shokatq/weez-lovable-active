import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
    Upload,
    FileText,
    X,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../../types/workspace';

interface DocumentUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (file: File) => Promise<void>;
}

interface FileWithProgress {
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    error?: string;
}

export function DocumentUploadDialog({ open, onOpenChange, onSubmit }: DocumentUploadDialogProps) {
    const [files, setFiles] = useState<FileWithProgress[]>([]);
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles: FileWithProgress[] = acceptedFiles.map(file => ({
            file,
            progress: 0,
            status: 'pending' as const,
        }));
        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc'],
            'text/plain': ['.txt'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/gif': ['.gif'],
            'image/webp': ['.webp'],
        },
        maxSize: MAX_FILE_SIZE,
        multiple: true,
    });

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('word') || fileType.includes('document')) return '📝';
        if (fileType.includes('image')) return '🖼️';
        if (fileType.includes('text')) return '📄';
        return '📄';
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);

        try {
            // Upload files one by one
            for (let i = 0; i < files.length; i++) {
                const fileWithProgress = files[i];

                // Update status to uploading
                setFiles(prev => prev.map((f, index) =>
                    index === i ? { ...f, status: 'uploading' as const } : f
                ));

                try {
                    await onSubmit(fileWithProgress.file);

                    // Update status to completed
                    setFiles(prev => prev.map((f, index) =>
                        index === i ? { ...f, status: 'completed' as const, progress: 100 } : f
                    ));
                } catch (error) {
                    // Update status to error
                    setFiles(prev => prev.map((f, index) =>
                        index === i ? {
                            ...f,
                            status: 'error' as const,
                            error: error instanceof Error ? error.message : 'Upload failed'
                        } : f
                    ));
                }
            }
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setFiles([]);
        setUploading(false);
        onOpenChange(false);
    };

    const hasPendingFiles = files.some(f => f.status === 'pending');
    const hasErrorFiles = files.some(f => f.status === 'error');
    const allCompleted = files.length > 0 && files.every(f => f.status === 'completed');

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Upload Documents</DialogTitle>
                    <DialogDescription>
                        Upload documents to your workspace. Supported formats: PDF, DOCX, TXT, and images.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Dropzone */}
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive
                                ? 'border-primary bg-primary/5'
                                : 'border-muted-foreground/25 hover:border-primary/50'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            {isDragActive
                                ? 'Drop files here...'
                                : 'Drag & drop files here, or click to select files'
                            }
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Max file size: {formatFileSize(MAX_FILE_SIZE)}
                        </p>
                    </div>

                    {/* File list */}
                    {files.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Selected Files</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {files.map((fileWithProgress, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                        <div className="text-lg">
                                            {getFileIcon(fileWithProgress.file.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {fileWithProgress.file.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatFileSize(fileWithProgress.file.size)}
                                            </p>
                                            {fileWithProgress.status === 'uploading' && (
                                                <Progress value={fileWithProgress.progress} className="mt-1" />
                                            )}
                                            {fileWithProgress.status === 'error' && fileWithProgress.error && (
                                                <p className="text-xs text-destructive mt-1">
                                                    {fileWithProgress.error}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {fileWithProgress.status === 'pending' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFile(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {fileWithProgress.status === 'uploading' && (
                                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            )}
                                            {fileWithProgress.status === 'completed' && (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            )}
                                            {fileWithProgress.status === 'error' && (
                                                <AlertCircle className="h-4 w-4 text-destructive" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={uploading}
                    >
                        {allCompleted ? 'Close' : 'Cancel'}
                    </Button>
                    {!allCompleted && (
                        <Button
                            onClick={handleUpload}
                            disabled={!hasPendingFiles || uploading}
                        >
                            {uploading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {uploading ? 'Uploading...' : `Upload ${files.filter(f => f.status === 'pending').length} File(s)`}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
