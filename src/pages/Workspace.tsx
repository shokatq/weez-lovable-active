
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import WorkspaceDashboard from "@/components/WorkspaceDashboard";

const Workspace = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="p-4 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white hover:bg-gray-800/50 mr-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
      <WorkspaceDashboard />
    </div>
  );
};

export default Workspace;
