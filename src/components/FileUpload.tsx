
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (files: FileList) => void;
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.txt"
      />
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:text-white hover:bg-gray-800 rounded-full p-2 h-8 w-8"
        onClick={handleButtonClick}
      >
        <Paperclip className="w-4 h-4 text-white" />
      </Button>
    </>
  );
};

export default FileUpload;
