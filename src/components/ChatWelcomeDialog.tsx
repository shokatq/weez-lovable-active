
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
      <DialogContent className="max-w-2xl bg-white border-gray-200 text-gray-900 overflow-hidden">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg z-10"
          onClick={() => onOpenChange(false)}
        >
          <X className="w-5 h-5" />
        </Button>


        <div className="relative z-10 p-6">
          {/* Header Section */}
          <div className="text-center pb-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome to Weez AI
            </h1>
            <p className="text-gray-600 text-sm max-w-lg mx-auto leading-relaxed">
              Your intelligent file assistant. Upload documents, ask questions, and get instant insights.
            </p>
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-blue-900 text-sm">Quick Start</h3>
            </div>
            <p className="text-blue-800 text-sm leading-relaxed">
              Try: <span className="font-medium">"Summarize my latest document"</span> or <span className="font-medium">"Search for project reports"</span>
            </p>
          </div>


          {/* Start Button */}
          <div className="flex justify-center animate-fade-in">
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-lg transition-all duration-200"
            >
              Start Chatting
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatWelcomeDialog;
