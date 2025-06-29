
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, Search, Upload, Brain, Zap, ArrowRight, Sparkles, X } from "lucide-react";

interface ChatWelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChatWelcomeDialog = ({ open, onOpenChange }: ChatWelcomeDialogProps) => {
  const capabilities = [
    {
      icon: FileText,
      title: "Document Analysis",
      description: "Upload and analyze documents from various platforms",
      color: "text-blue-500 bg-blue-50"
    },
    {
      icon: Search,
      title: "Intelligent Search", 
      description: "Find information across all your connected files",
      color: "text-emerald-500 bg-emerald-50"
    },
    {
      icon: Brain,
      title: "AI Summarization",
      description: "Get instant summaries of your documents and content",
      color: "text-violet-500 bg-violet-50"
    },
    {
      icon: Upload,
      title: "Multi-Platform Support",
      description: "Connect with Google Drive, Notion, OneDrive, and more",
      color: "text-orange-500 bg-orange-50"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700 text-white overflow-hidden">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg z-10"
          onClick={() => onOpenChange(false)}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.1),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(139,92,246,0.08),transparent_50%)] pointer-events-none"></div>

        <div className="relative z-10 p-8">
          {/* Header Section */}
          <div className="text-center pb-8 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse-glow">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent mb-4">
              Welcome to Weezy AI
            </h1>
            <p className="text-gray-300 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Your intelligent file assistant powered by advanced AI
            </p>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {capabilities.map((capability, index) => (
              <div 
                key={index} 
                className="group p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl ${capability.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <capability.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-2 group-hover:text-blue-200 transition-colors duration-300">
                      {capability.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed font-medium">
                      {capability.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Getting Started Section */}
          <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-bold text-blue-300 text-xl">Getting Started</h3>
            </div>
            <p className="text-gray-300 text-base mb-4 leading-relaxed font-medium">
              Try asking questions like <span className="text-blue-300 font-semibold">"Summarize my latest document"</span> or <span className="text-blue-300 font-semibold">"Search for project reports"</span> to see Weezy AI in action.
            </p>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2 text-sm font-medium">
              <Zap className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </Badge>
          </div>

          {/* Start Button */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '800ms' }}>
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-12 py-4 rounded-2xl text-lg transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
            >
              Start Chatting
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatWelcomeDialog;
