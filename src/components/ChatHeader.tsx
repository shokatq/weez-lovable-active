
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between p-4 bg-transparent border-b border-gray-800/50">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-gray-400 hover:text-white hover:bg-gray-800 h-10 w-10 p-0 rounded-lg transition-colors flex items-center justify-center">
          <Menu className="w-5 h-5" />
        </SidebarTrigger>
        
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            {/* Logo container with tight-cropped image and center alignment */}
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-transparent overflow-hidden">
              <img
                src="/lovable-uploads/e337fa8d-e4f4-41b6-a0bd-c43716da2acd.png"
                alt="Weezy AI Logo"
                className="w-9 h-9 object-contain"
                style={{
                  background: "transparent",
                  display: "block",
                  objectFit: "contain",
                  objectPosition: "center"
                }}
              />
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-base bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Weezy
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <p className="text-xs text-gray-400">
                Online
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Popover open={showConnectivity} onOpenChange={setShowConnectivity}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white bg-gray-900 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
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
