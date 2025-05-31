
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Intro = () => {
  const navigate = useNavigate();

  const handleTryWeezy = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold text-white">
          Introducing Weezy AI
        </h1>
        
        <p className="text-xl text-gray-400">
          Your smart document assistant.
        </p>
        
        <Button
          onClick={handleTryWeezy}
          variant="outline"
          className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-200 px-8 py-3 text-lg rounded-lg"
        >
          Try Weezy
        </Button>
      </div>
    </div>
  );
};

export default Intro;
