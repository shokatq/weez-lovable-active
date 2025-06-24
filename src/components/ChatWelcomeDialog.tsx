
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquare, Search, Upload, BarChart3, Shield, Zap } from "lucide-react";

interface ChatWelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChatWelcomeDialog = ({ open, onOpenChange }: ChatWelcomeDialogProps) => {
  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Find files across all your platforms with natural language"
    },
    {
      icon: BarChart3,
      title: "AI Summaries",
      description: "Get instant summaries and insights from your documents"
    },
    {
      icon: Upload,
      title: "File Management",
      description: "Upload, organize, and manage files across cloud platforms"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security for all your sensitive documents"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border border-gray-200 rounded-2xl">
        <DialogHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Welcome to Weezy AI
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-lg">
            Your intelligent file assistant powered by advanced AI
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-6">
          {features.map((feature, index) => (
            <div key={index} className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-200">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                <feature.icon className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col gap-3 pt-6 border-t border-gray-200">
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-3 transition-colors duration-200"
          >
            <Zap className="w-4 h-4 mr-2" />
            Start Chatting
          </Button>
          <p className="text-xs text-center text-gray-500">
            Connect your cloud services in settings to get started
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatWelcomeDialog;
