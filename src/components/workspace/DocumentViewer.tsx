import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Loader2, Download, ExternalLink, FileText, Image, File } from 'lucide-react';
import type { DocumentWithUploader } from '../../types/workspace';

interface DocumentViewerProps {
    document: DocumentWithUploader | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DocumentViewer({ document, open, onOpenChange }: DocumentViewerProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!document) return null;

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
        if (fileType.includes('image')) return <Image className="h-8 w-8 text-blue-500" />;
        if (fileType.includes('word') || fileType.includes('document')) return <FileText className="h-8 w-8 text-blue-600" />;
        return <File className="h-8 w-8 text-gray-500" />;
    };

    const canPreview = (fileType: string) => {
        return fileType.includes('pdf') || fileType.includes('image');
    };

    const handleDownload = () => {
        const link = window.document.createElement('a');
        link.href = document.file_url;
        link.download = document.file_name;
        link.target = '_blank';
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
    };

    const handleOpenInNewTab = () => {
        window.open(document.file_url, '_blank');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        {getFileIcon(document.file_type || '')}
                        <div>
                            <div className="font-medium">{document.file_name}</div>
                            <div className="text-sm text-muted-foreground">
                                Uploaded by {document.uploader.first_name} {document.uploader.last_name}
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-auto">
                    {canPreview(document.file_type || '') ? (
                        <div className="w-full h-[70vh] border rounded-lg overflow-hidden">
                            {document.file_type?.includes('image') ? (
                                <img
                                    src={document.file_url}
                                    alt={document.file_name}
                                    className="w-full h-full object-contain"
                                    onLoad={() => setLoading(false)}
                                    onError={() => {
                                        setLoading(false);
                                        setError('Failed to load image');
                                    }}
                                />
                            ) : (
                                <iframe
                                    src={document.file_url}
                                    className="w-full h-full border-0"
                                    onLoad={() => setLoading(false)}
                                    onError={() => {
                                        setLoading(false);
                                        setError('Failed to load document');
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                {getFileIcon(document.file_type || '')}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{document.file_name}</h3>
                            <p className="text-muted-foreground mb-4">
                                This file type cannot be previewed. Click download to view it.
                            </p>
                            <div className="flex gap-2">
                                <Button onClick={handleDownload}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                                <Button variant="outline" onClick={handleOpenInNewTab}>
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Open in New Tab
                                </Button>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Loading document...</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                            <div className="text-destructive mb-4">{error}</div>
                            <div className="flex gap-2">
                                <Button onClick={handleDownload}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                                <Button variant="outline" onClick={handleOpenInNewTab}>
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Open in New Tab
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                        Size: {document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleDownload}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                        <Button variant="outline" onClick={handleOpenInNewTab}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in New Tab
                        </Button>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
