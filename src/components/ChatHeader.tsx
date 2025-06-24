
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900">Weezy</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 rounded-lg transition-all duration-200"
        >
          <Settings className="w-4 h-4 mr-2" />
          Connect Services
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;
