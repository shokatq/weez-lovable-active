
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Settings, Bot, Zap } from "lucide-react";
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
    <header className="flex items-center justify-between p-6 bg-black border-b border-gray-800">
      <div className="flex items-center gap-6">
        <SidebarTrigger className="text-gray-400 hover:text-white hover:bg-gray-800 h-10 w-10 p-0 rounded-xl transition-all duration-300 hover:scale-105">
          <Menu className="w-5 h-5" />
        </SidebarTrigger>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl opacity-30 animate-pulse"></div>
          </div>
          <div>
            <h1 className="font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Weezy
            </h1>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              AI-Powered Assistant
            </p>
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
