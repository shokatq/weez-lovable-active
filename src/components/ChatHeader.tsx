
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

const ChatHeader = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-weezy-dark-tertiary bg-weezy-dark">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-white/70 hover:text-white hover:bg-weezy-dark-secondary h-8 w-8 p-0">
          <Menu className="w-4 h-4" />
        </SidebarTrigger>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-weezy-accent flex items-center justify-center">
            <span className="text-white font-semibold text-sm">W</span>
          </div>
          <div>
            <h1 className="font-semibold text-white">Weezy</h1>
            <p className="text-xs text-white/60">Ready to assist</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
