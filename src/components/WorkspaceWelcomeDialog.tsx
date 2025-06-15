
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
      <DialogContent className="max-w-3xl bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-white">
        <DialogHeader className="text-center pb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
            Enterprise Workspace
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-lg mt-2">
            Advanced workspace management with enhanced analytics and team collaboration
          </DialogDescription>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 mx-auto mt-3">
            <Star className="w-3 h-3 mr-1" />
            Premium Features
          </Badge>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-emerald-400">Navigation Guide</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {tabs.map((tab, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-gray-300">
                    <span className="font-medium">{tab.name}:</span> {tab.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
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
