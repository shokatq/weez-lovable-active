import { useParams } from "react-router-dom";

const Blank = () => {
  const params = useParams();
  const title = decodeURIComponent((params.name || params.spaceName || "Page").toString());
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground">This page is intentionally blank.</p>
      </div>
    </div>
  );
};

export default Blank;


