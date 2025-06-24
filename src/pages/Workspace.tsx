
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import WorkspaceDashboard from "@/components/WorkspaceDashboard";

const Workspace = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 flex items-center border-b border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 mr-4 rounded-lg transition-colors duration-200"
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
