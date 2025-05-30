
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ConnectivityPanel from "./ConnectivityPanel";

const ChatHeader = () => {
  const [showConnectivity, setShowConnectivity] = useState(false);

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-8 w-8 p-0 rounded-lg">
          <Menu className="w-4 h-4" />
        </SidebarTrigger>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Weezy</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Popover open={showConnectivity} onOpenChange={setShowConnectivity}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            >
              <Settings className="w-4 h-4 mr-2" />
              Connect Services
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end">
            <ConnectivityPanel />
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default ChatHeader;
