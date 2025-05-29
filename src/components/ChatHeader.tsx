
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const ChatHeader = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-weezy-dark-tertiary bg-weezy-dark/80 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <SidebarTrigger>
          <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-weezy-dark-secondary">
            <Menu className="w-4 h-4" />
          </Button>
        </SidebarTrigger>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-weezy-accent to-weezy-accent-light flex items-center justify-center animate-pulse-glow">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <div>
            <h1 className="font-semibold text-white">Weezy</h1>
            <p className="text-xs text-white/60">Ready to assist</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-white/60">Online</span>
      </div>
    </header>
  );
};

export default ChatHeader;
