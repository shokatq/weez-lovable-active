
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, BarChart2, Shield, Settings, Database, ArrowRight, Star, Target } from "lucide-react";

interface WorkspaceWelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WorkspaceWelcomeDialog = ({ open, onOpenChange }: WorkspaceWelcomeDialogProps) => {
  const features = [
    {
      icon: BarChart2,
      title: "Advanced Analytics",
      description: "Comprehensive insights into your team's file usage and productivity",
      color: "text-blue-400 bg-blue-500/10"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Add, manage, and monitor team members across all platforms",
      color: "text-emerald-400 bg-emerald-500/10"
    },
    {
      icon: Database,
      title: "File Organization",
      description: "Centralized view of all files across multiple platforms",
      color: "text-violet-400 bg-violet-500/10"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and advanced security protocols",
      color: "text-orange-400 bg-orange-500/10"
    }
  ];

  const tabs = [
    { name: "Dashboard", description: "Overview and key metrics" },
    { name: "Team Management", description: "Add and manage team members" },
    { name: "File Management", description: "Organize and search files" },
    { name: "Analytics", description: "Detailed performance insights" },
    { name: "Settings", description: "Configure workspace preferences" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border-gray-200 text-gray-900">
        <DialogHeader className="text-center pb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Weez AI Workspace
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm mt-2">
            Manage your team, files, and analytics in one place
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-blue-900 text-sm">Quick Navigation</h3>
            </div>
            <div className="space-y-1">
              <p className="text-blue-800 text-xs">• <span className="font-medium">Dashboard:</span> View overview and metrics</p>
              <p className="text-blue-800 text-xs">• <span className="font-medium">Team:</span> Manage members and roles</p>
              <p className="text-blue-800 text-xs">• <span className="font-medium">Files:</span> Organize and search documents</p>
              <p className="text-blue-800 text-xs">• <span className="font-medium">Analytics:</span> Track performance insights</p>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200"
            >
              Explore Workspace
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkspaceWelcomeDialog;
