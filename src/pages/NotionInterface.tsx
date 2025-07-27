
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, MoreHorizontal, FileText, Folder, Star, Clock, User, Palette, Eye, Menu, X, Home, Settings, Bell, Grid3X3, List, Calendar, Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotionInterface = () => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedView, setSelectedView] = useState('grid');
  const navigate = useNavigate();

  const pages = [
    {
      id: 1,
      title: "Project Roadmap 2024",
      emoji: "🚀",
      lastEdited: "2 hours ago",
      author: "John Doe",
      type: "Page",
      tags: ["Planning", "Strategy"],
      status: "In Progress"
    },
    {
      id: 2,
      title: "Design System Guidelines",
      emoji: "🎨",
      lastEdited: "1 day ago",
      author: "Sarah Chen",
      type: "Database",
      tags: ["Design", "Documentation"],
      status: "Published"
    },
    {
      id: 3,
      title: "Meeting Notes Template",
      emoji: "📝",
      lastEdited: "3 days ago",
      author: "Mike Johnson",
      type: "Template",
      tags: ["Meetings", "Template"],
      status: "Draft"
    },
    {
      id: 4,
      title: "Team Goals Q4",
      emoji: "🎯",
      lastEdited: "1 week ago",
      author: "Lisa Wang",
      type: "Page",
      tags: ["Goals", "Team"],
      status: "Published"
    },
    {
      id: 5,
      title: "Product Feedback Database",
      emoji: "💬",
      lastEdited: "2 weeks ago",
      author: "Alex Rivera",
      type: "Database",
      tags: ["Feedback", "Product"],
      status: "Active"
    },
    {
      id: 6,
      title: "Onboarding Checklist",
      emoji: "✅",
      lastEdited: "1 month ago",
      author: "Emma Davis",
      type: "Template",
      tags: ["HR", "Onboarding"],
      status: "Template"
    }
  ];

  const sidebarItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Search, label: "Search" },
    { icon: Bell, label: "Updates" },
    { icon: Settings, label: "Settings" },
    { icon: Archive, label: "Trash" }
  ];

  const toggleAccessibility = () => {
    setIsAccessibilityMode(!isAccessibilityMode);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Draft': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Active': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Template': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Database': return Grid3X3;
      case 'Template': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isAccessibilityMode 
        ? 'bg-white text-black' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        isAccessibilityMode 
          ? 'bg-white/90 border-black/20' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`hover:scale-105 transition-all duration-200 ${
                isAccessibilityMode ? 'hover:bg-gray-200' : 'hover:bg-gray-100'
              }`}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-pulse-glow">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <h1 className="text-xl font-semibold animate-fade-in">Workspace</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative animate-slide-up">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search pages..."
                className={`pl-10 pr-4 py-2 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 ${
                  isAccessibilityMode 
                    ? 'bg-white border-black/20 focus:bg-gray-50' 
                    : 'bg-gray-50/50 border-gray-200 focus:bg-white'
                }`}
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAccessibility}
              className={`transition-all duration-300 hover:scale-105 ${
                isAccessibilityMode ? 'bg-black text-white hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
              title="Toggle High Contrast Mode"
            >
              <Eye className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg animate-float"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Page
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`transition-all duration-500 ease-in-out ${
          sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'
        } ${isAccessibilityMode ? 'bg-white border-black/20' : 'bg-gray-50/50 border-gray-200'} border-r overflow-hidden`}>
          <div className="p-6 space-y-6 h-full">
            <div className="space-y-2 animate-fade-in">
              {sidebarItems.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
                    item.active 
                      ? (isAccessibilityMode ? 'bg-black text-white' : 'bg-purple-100 text-purple-800 border border-purple-200')
                      : (isAccessibilityMode ? 'hover:bg-gray-200' : 'hover:bg-gray-100')
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </div>
            
            <div className={`border-t pt-6 ${isAccessibilityMode ? 'border-black/20' : 'border-gray-200'}`}>
              <div className="space-y-3 animate-slide-up">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Recent</h3>
                {pages.slice(0, 3).map((page, index) => (
                  <div
                    key={page.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
                      isAccessibilityMode ? 'hover:bg-gray-200' : 'hover:bg-gray-100'
                    }`}
                    style={{ animationDelay: `${(index + 5) * 100}ms` }}
                  >
                    <span className="text-lg">{page.emoji}</span>
                    <span className="text-sm font-medium truncate">{page.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header Section */}
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-shift">
                  Good morning! 👋
                </h1>
                <p className={`text-lg ${isAccessibilityMode ? 'text-gray-700' : 'text-gray-600'}`}>
                  Here's what you've been working on
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`transition-all duration-300 hover:scale-105 ${
                      isAccessibilityMode ? 'hover:bg-gray-200' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  
                  <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                    <Button
                      variant={selectedView === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedView('grid')}
                      className="transition-all duration-300 hover:scale-105"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={selectedView === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedView('list')}
                      className="transition-all duration-300 hover:scale-105"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pages Grid */}
            <div className={selectedView === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {pages.map((page, index) => {
                const TypeIcon = getTypeIcon(page.type);
                
                return (
                  <Card
                    key={page.id}
                    className={`group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl animate-slide-up ${
                      isAccessibilityMode 
                        ? 'bg-white border-black/20 hover:border-black/40' 
                        : 'bg-white/80 backdrop-blur-sm border-gray-200/50 hover:border-purple-200 hover:shadow-purple-100/50'
                    }`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl animate-float" style={{ animationDelay: `${index * 200}ms` }}>
                            {page.emoji}
                          </span>
                          <div>
                            <h3 className={`font-semibold group-hover:text-purple-600 transition-colors duration-300 ${
                              isAccessibilityMode ? 'text-black' : 'text-gray-900'
                            }`}>
                              {page.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <TypeIcon className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{page.type}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {page.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className={`text-xs transition-all duration-300 hover:scale-105 ${
                                isAccessibilityMode 
                                  ? 'bg-gray-200 text-black border-black/20' 
                                  : 'bg-purple-50 text-purple-700 border-purple-200'
                              }`}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <Badge
                          className={`text-xs font-medium ${getStatusColor(page.status)} ${
                            isAccessibilityMode ? 'bg-gray-200 text-black border-black/20' : ''
                          }`}
                        >
                          {page.status}
                        </Badge>
                      </div>
                      
                      <div className={`flex items-center justify-between text-sm pt-3 border-t ${
                        isAccessibilityMode ? 'border-black/20 text-gray-700' : 'border-gray-100 text-gray-500'
                      }`}>
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3" />
                          <span>{page.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>{page.lastEdited}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className={`border-t pt-8 ${isAccessibilityMode ? 'border-black/20' : 'border-gray-200'}`}>
              <h2 className="text-xl font-semibold mb-4 animate-fade-in">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slide-up ${
                  isAccessibilityMode 
                    ? 'bg-white border-black/20 hover:border-black/40' 
                    : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200/50 hover:border-purple-300'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Create New Page</h3>
                      <p className="text-sm text-gray-500">Start with a blank page</p>
                    </div>
                  </div>
                </Card>

                <Card className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slide-up ${
                  isAccessibilityMode 
                    ? 'bg-white border-black/20 hover:border-black/40' 
                    : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 hover:border-blue-300'
                }`} style={{ animationDelay: '150ms' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Import Files</h3>
                      <p className="text-sm text-gray-500">Upload documents</p>
                    </div>
                  </div>
                </Card>

                <Card className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slide-up ${
                  isAccessibilityMode 
                    ? 'bg-white border-black/20 hover:border-black/40' 
                    : 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200/50 hover:border-emerald-300'
                }`} style={{ animationDelay: '300ms' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Schedule Meeting</h3>
                      <p className="text-sm text-gray-500">Plan with your team</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotionInterface;
