
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, MoreHorizontal, FileText, Folder, Clock, User, Eye, Menu, X, Home, Settings, Bell, Grid3X3, List, Calendar, Archive } from "lucide-react";

const NotionInterface = () => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedView, setSelectedView] = useState('grid');

  const pages = [
    {
      id: 1,
      title: "Project Roadmap 2024",
      emoji: "📋",
      lastEdited: "2 hours ago",
      author: "John Doe",
      type: "Page",
      tags: ["Planning", "Strategy"],
      status: "In Progress"
    },
    {
      id: 2,
      title: "Design System Guidelines",
      emoji: "📝",
      lastEdited: "1 day ago",
      author: "Sarah Chen",
      type: "Database",
      tags: ["Design", "Documentation"],
      status: "Published"
    },
    {
      id: 3,
      title: "Meeting Notes Template",
      emoji: "📄",
      lastEdited: "3 days ago",
      author: "Mike Johnson",
      type: "Template",
      tags: ["Meetings", "Template"],
      status: "Draft"
    }
  ];

  const sidebarItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Search, label: "Search" },
    { icon: Bell, label: "Updates" },
    { icon: Settings, label: "Settings" },
    { icon: Archive, label: "Trash" }
  ];

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isAccessibilityMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-sm border-b transition-all duration-300 ${
        isAccessibilityMode 
          ? 'bg-black/90 border-white/20' 
          : 'bg-white/90 border-gray-200'
      }`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isAccessibilityMode ? 'bg-white text-black' : 'bg-black text-white'
              }`}>
                <span className="font-bold text-sm">W</span>
              </div>
              <h1 className="text-xl font-semibold">Workspace</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search pages..."
                className={`pl-10 pr-4 py-2 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-black/20 focus:border-black ${
                  isAccessibilityMode 
                    ? 'bg-black border-white/20 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-black'
                }`}
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAccessibilityMode(!isAccessibilityMode)}
              className="hover:bg-gray-100"
              title="Toggle High Contrast Mode"
            >
              <Eye className="w-4 h-4" />
            </Button>
            
            <Button className="notion-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Page
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'
        } ${isAccessibilityMode ? 'bg-black border-white/20' : 'bg-gray-50 border-gray-200'} border-r overflow-hidden`}>
          <div className="p-6 space-y-6 h-full">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 ${
                    item.active 
                      ? (isAccessibilityMode ? 'bg-white text-black' : 'bg-black text-white')
                      : ''
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header Section */}
            <div className="space-y-6 fade-in">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Good morning! 👋
                </h1>
                <p className="text-lg text-gray-600">
                  Here's what you've been working on
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="notion-button">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  
                  <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                    <Button
                      variant={selectedView === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedView('grid')}
                      className="notion-button"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={selectedView === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedView('list')}
                      className="notion-button"
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
              {pages.map((page, index) => (
                <Card
                  key={page.id}
                  className={`notion-card cursor-pointer hover-lift slide-up ${
                    isAccessibilityMode 
                      ? 'bg-black border-white/20 text-white' 
                      : 'bg-white border-gray-200'
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{page.emoji}</span>
                        <div>
                          <h3 className="font-semibold">{page.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <FileText className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{page.type}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {page.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className={`text-xs ${
                              isAccessibilityMode 
                                ? 'bg-white/20 text-white border-white/30' 
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                            }`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <Badge className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                        {page.status}
                      </Badge>
                    </div>
                    
                    <div className={`flex items-center justify-between text-sm pt-3 border-t ${
                      isAccessibilityMode ? 'border-white/20 text-gray-300' : 'border-gray-100 text-gray-500'
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
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotionInterface;
