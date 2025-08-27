import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Settings, Link2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import SettingsPanel from "./SettingsPanel";
import ThemeToggle from "./ThemeToggle";
import ConnectivityPanel from "./ConnectivityPanel";
import { useState } from "react";

const ChatHeader = () => {
  const [showConnectServices, setShowConnectServices] = useState(false);

  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-8 w-8" />
        <div className="flex items-center gap-3">
          {/* Circular Logo */}
          <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center">
            <img 
              src="/lovable-uploads/weezy-logo.png" 
              alt="Weez AI Logo" 
              className="w-full h-full object-contain p-0.5 rounded-full"
            />
          </div>
          <h1 className="text-lg font-semibold text-foreground">Weez AI</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Dialog open={showConnectServices} onOpenChange={setShowConnectServices}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Link2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <ConnectivityPanel />
          </DialogContent>
        </Dialog>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-0 bg-background border-border">
            <SettingsPanel />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ChatHeader;