
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Settings, MessageSquare } from "lucide-react";
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
    <header className="flex items-center justify-between p-6 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 h-10 w-10 p-0 rounded-xl transition-all duration-200 flex items-center justify-center">
          <Menu className="w-5 h-5" />
        </SidebarTrigger>

        <div className="flex items-center gap-3 fade-in">
          <div>
            <h1 className="font-bold text-lg text-slate-900">
              Weez AI
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm"></span>
              <p className="text-xs text-slate-500">
                Online & Ready
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 slide-in-right">
        <Popover open={showConnectivity} onOpenChange={setShowConnectivity}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 bg-white/80 backdrop-blur-sm hover:border-slate-300 transition-all duration-300 hover:shadow-sm px-4 py-2 rounded-xl"
            >
              <Settings className="w-4 h-4 mr-2" />
              Connect Services
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0 bg-white/95 backdrop-blur-sm border-slate-200/80 shadow-xl" align="end">
            <ConnectivityPanel />
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default ChatHeader;
