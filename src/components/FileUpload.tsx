
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, FileText, Image } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FileUploadProps {
  onFileSelect: (files: FileList) => void;
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
    setIsOpen(false);
  };

  const handleImageClick = () => {
    imageInputRef.current?.click();
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-full p-2 h-8 w-8"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="start">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-8"
              onClick={handleFileClick}
            >
              <FileText className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-8"
              onClick={handleImageClick}
            >
              <Image className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

export default FileUpload;
