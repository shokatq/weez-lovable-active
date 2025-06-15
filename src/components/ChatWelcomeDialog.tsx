
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, Search, Upload, Brain, Zap, ArrowRight, Sparkles } from "lucide-react";

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
      color: "text-blue-400 bg-blue-500/10"
    },
    {
      icon: Search,
      title: "Intelligent Search",
      description: "Find information across all your connected files",
      color: "text-emerald-400 bg-emerald-500/10"
    },
    {
      icon: Brain,
      title: "AI Summarization",
      description: "Get instant summaries of your documents and content",
      color: "text-violet-400 bg-violet-500/10"
    },
    {
      icon: Upload,
      title: "Multi-Platform Support",
      description: "Connect with Google Drive, Notion, OneDrive, and more",
      color: "text-orange-400 bg-orange-500/10"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-white">
        <DialogHeader className="text-center pb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Welcome to Weezy AI
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-lg mt-2">
            Your intelligent file assistant powered by advanced AI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capabilities.map((capability, index) => (
              <div key={index} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${capability.color} flex items-center justify-center`}>
                    <capability.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{capability.title}</h3>
                    <p className="text-gray-400 text-sm">{capability.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-blue-400">Getting Started</h3>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              Try asking questions like "Summarize my latest document" or "Search for project reports" to see Weezy AI in action.
            </p>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Zap className="w-3 h-3 mr-1" />
              Powered by Advanced AI
            </Badge>
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
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
