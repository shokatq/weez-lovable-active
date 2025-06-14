
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Settings, Play } from "lucide-react";
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
    <header className="flex items-center justify-between p-4 bg-black">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 p-0 rounded-lg">
          <Menu className="w-4 h-4" />
        </SidebarTrigger>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <span className="text-black font-bold text-sm">W</span>
          </div>
          <div>
            <h1 className="font-semibold text-white">Weezy</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => navigate('/demo')}
          variant="outline"
          size="sm"
          className="text-gray-400 border-gray-800 hover:bg-gray-800 hover:text-white bg-black"
        >
          <Play className="w-4 h-4 mr-2" />
          View Demo
        </Button>
        
        <Popover open={showConnectivity} onOpenChange={setShowConnectivity}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-400 border-gray-800 hover:bg-gray-800 hover:text-white bg-black"
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
