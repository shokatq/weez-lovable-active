import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Settings, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SettingsPanel from "./SettingsPanel";
import ThemeToggle from "./ThemeToggle";

const ChatHeader = () => {
  return (
    <header className="h-14 sm:h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2 sm:gap-3">
        <SidebarTrigger className="h-8 w-8 sm:h-9 sm:w-9" />
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Circular Logo */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
            <img
              src="/lovable-uploads/92fd1f43-ec1e-4562-9a19-fd70618ad920.png"
              alt="Weez AI Logo"
              className="w-full h-full object-contain p-0.5 rounded-full"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground">Weez AI</h1>
          </div>
          <div className="sm:hidden">
            <h1 className="text-sm font-semibold text-foreground">Weez</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-0 bg-background border-border w-80 max-w-[90vw]">
            <SettingsPanel />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ChatHeader;