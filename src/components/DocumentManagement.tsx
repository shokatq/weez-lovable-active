import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Eye,
  Edit,
  Trash2,
  FolderOpen,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  platform: string;
  lastModified: Date;
  owner: string;
  tags: string[];
  isShared: boolean;
  permissions: 'view' | 'edit' | 'admin';
}

const DocumentManagement = () => {
  const { userRole, canManageTeam } = useUserRole();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Mock documents data
  useEffect(() => {
    const mockDocs: Document[] = [
      {
        id: '1',
        name: 'Q1 Performance Report.pdf',
        type: 'PDF',
        size: '2.4 MB',
        platform: 'Google Drive',
        lastModified: new Date('2024-01-15'),
        owner: 'John Smith',
        tags: ['report', 'finance', 'quarterly'],
        isShared: true,
        permissions: 'view'
      },
      {
        id: '2',
        name: 'Project Roadmap 2024.xlsx',
        type: 'Excel',
        size: '1.8 MB',
        platform: 'OneDrive',
        lastModified: new Date('2024-01-20'),
        owner: 'Sarah Johnson',
        tags: ['roadmap', 'planning', 'project'],
        isShared: false,
        permissions: 'edit'
      },
      {
        id: '3',
        name: 'Team Guidelines.docx',
        type: 'Word',
        size: '456 KB',
        platform: 'Notion',
        lastModified: new Date('2024-01-18'),
        owner: 'Mike Wilson',
        tags: ['guidelines', 'team', 'handbook'],
        isShared: true,
        permissions: 'admin'
      }
    ];
    setDocuments(mockDocs);
  }, []);

  const platforms = ['all', 'Google Drive', 'OneDrive', 'Notion', 'Slack'];
  const fileTypes = ['all', 'PDF', 'Word', 'Excel', 'PowerPoint', 'Image'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPlatform = selectedPlatform === 'all' || doc.platform === selectedPlatform;
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    
    return matchesSearch && matchesPlatform && matchesType;
  });

  const handleUpload = () => {
    toast.success('File upload functionality would be implemented here');
    setUploadDialogOpen(false);
  };

  const handleShare = (docId: string) => {
    toast.success('Document shared successfully');
  };

  const handleDownload = (docId: string) => {
    toast.success('Download started');
  };

  const getFileIcon = (type: string) => {
    return <FileText className="w-8 h-8 text-primary" />;
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Google Drive': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'OneDrive': return 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20';
      case 'Notion': return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      case 'Slack': return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Document Management</h2>
          <p className="text-muted-foreground">Organize and access your team's documents across platforms</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Documents</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Drag and drop files here</p>
                <Button onClick={handleUpload}>Choose Files</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-md text-foreground"
            >
              {platforms.map(platform => (
                <option key={platform} value={platform}>
                  {platform === 'all' ? 'All Platforms' : platform}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-md text-foreground"
            >
              {fileTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{documents.length}</p>
                <p className="text-sm text-muted-foreground">Total Files</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Share2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{documents.filter(d => d.isShared).length}</p>
                <p className="text-sm text-muted-foreground">Shared</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <FolderOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4</p>
                <p className="text-sm text-muted-foreground">Platforms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Upload className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="bg-card border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {getFileIcon(doc.type)}
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{doc.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {doc.owner}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {doc.lastModified.toLocaleDateString()}
                      </span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={getPlatformColor(doc.platform)}>
                    {doc.platform}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {doc.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Tag className="w-2 h-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleDownload(doc.id)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleShare(doc.id)}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {canManageTeam && (
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search or filters' : 'Upload your first document to get started'}
          </p>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Documents
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentManagement;