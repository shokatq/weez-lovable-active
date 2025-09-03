import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Upload, 
  Search, 
  Download, 
  Share2, 
  Eye,
  Edit,
  Trash2,
  FolderOpen,
  Calendar,
  User,
  Tag,
  Play,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from 'sonner';

interface Asset {
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
  processed: boolean;
}

const Assets = () => {
  const { userRole, canManageTeam } = useUserRole();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  // Mock assets data with processed/unprocessed status
  useEffect(() => {
    const mockAssets: Asset[] = [
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
        permissions: 'view',
        processed: true
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
        permissions: 'edit',
        processed: false
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
        permissions: 'admin',
        processed: true
      },
      {
        id: '4',
        name: 'Marketing Assets.zip',
        type: 'Archive',
        size: '15.2 MB',
        platform: 'Slack',
        lastModified: new Date('2024-01-22'),
        owner: 'Lisa Chen',
        tags: ['marketing', 'assets', 'brand'],
        isShared: false,
        permissions: 'edit',
        processed: false
      }
    ];
    setAssets(mockAssets);
  }, []);

  const platforms = ['all', 'Google Drive', 'OneDrive', 'Notion', 'Slack'];
  const fileTypes = ['all', 'PDF', 'Word', 'Excel', 'PowerPoint', 'Image', 'Archive'];

  const processedAssets = assets.filter(asset => asset.processed);
  const unprocessedAssets = assets.filter(asset => !asset.processed);

  const getFilteredAssets = (assetList: Asset[]) => {
    return assetList.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPlatform = selectedPlatform === 'all' || asset.platform === selectedPlatform;
      const matchesType = selectedType === 'all' || asset.type === selectedType;
      
      return matchesSearch && matchesPlatform && matchesType;
    });
  };

  const handleUpload = () => {
    toast.success('Files uploaded successfully');
    setUploadDialogOpen(false);
  };

  const handleProcessAssets = () => {
    if (selectedAssets.length === 0) {
      toast.error('Please select assets to process');
      return;
    }
    
    setAssets(prev => prev.map(asset => 
      selectedAssets.includes(asset.id) 
        ? { ...asset, processed: true, tags: [...asset.tags, 'AI-processed'] }
        : asset
    ));
    
    toast.success(`${selectedAssets.length} assets processed successfully`);
    setSelectedAssets([]);
    setProcessDialogOpen(false);
  };

  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleShare = (assetId: string) => {
    toast.success('Asset shared successfully');
  };

  const handleDownload = (assetId: string) => {
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

  const renderAssetCard = (asset: Asset) => (
    <Card key={asset.id} className="bg-card border-border hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <input
              type="checkbox"
              checked={selectedAssets.includes(asset.id)}
              onChange={() => toggleAssetSelection(asset.id)}
              className="w-4 h-4 text-primary"
            />
            {getFileIcon(asset.type)}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground">{asset.name}</h3>
                {asset.processed ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-500" />
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {asset.owner}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {asset.lastModified.toLocaleDateString()}
                </span>
                <span>{asset.size}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={getPlatformColor(asset.platform)}>
              {asset.platform}
            </Badge>
            <div className="flex items-center gap-1">
              {asset.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Tag className="w-2 h-2 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => handleDownload(asset.id)}>
                <Download className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleShare(asset.id)}>
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
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Assets</h2>
          <p className="text-muted-foreground">Manage and process your team's documents and files</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={processDialogOpen} onOpenChange={setProcessDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Process Assets ({selectedAssets.length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Process Selected Assets</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  AI will analyze and tag {selectedAssets.length} selected assets for better organization.
                </p>
                <Button onClick={handleProcessAssets} className="w-full">
                  Start Processing
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Files
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Assets</DialogTitle>
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
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
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
                <p className="text-2xl font-bold text-foreground">{assets.length}</p>
                <p className="text-sm text-muted-foreground">Total Assets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{processedAssets.length}</p>
                <p className="text-sm text-muted-foreground">Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{unprocessedAssets.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
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
                <p className="text-2xl font-bold text-foreground">{assets.filter(a => a.isShared).length}</p>
                <p className="text-sm text-muted-foreground">Shared</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assets Tabs */}
      <Tabs defaultValue="processed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="processed">Processed Assets ({processedAssets.length})</TabsTrigger>
          <TabsTrigger value="unprocessed">Unprocessed Assets ({unprocessedAssets.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="processed" className="space-y-4">
          <div className="space-y-4">
            {getFilteredAssets(processedAssets).map(renderAssetCard)}
            {getFilteredAssets(processedAssets).length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No processed assets found</h3>
                <p className="text-muted-foreground">Process some assets to see them here</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="unprocessed" className="space-y-4">
          <div className="space-y-4">
            {getFilteredAssets(unprocessedAssets).map(renderAssetCard)}
            {getFilteredAssets(unprocessedAssets).length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No unprocessed assets found</h3>
                <p className="text-muted-foreground">Upload new files to see them here</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assets;