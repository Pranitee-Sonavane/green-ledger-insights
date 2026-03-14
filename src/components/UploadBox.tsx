import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadBoxProps {
  onUpload: (file: File) => void;
}

const UploadBox = ({ onUpload }: UploadBoxProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        setFileName(file.name);
        onUpload(file);
      }
    },
    [onUpload]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onUpload(file);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className={`border-2 border-dashed transition-all duration-300 ${isDragging ? "border-primary bg-accent" : "border-border hover:border-primary/50"}`}>
        <CardContent className="p-10">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="rounded-full bg-accent p-4">
              {fileName ? (
                <FileText className="h-8 w-8 text-primary" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
            </div>

            {fileName ? (
              <div>
                <p className="text-sm font-medium text-foreground">{fileName}</p>
                <p className="text-xs text-muted-foreground mt-1">File ready for analysis</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-foreground">
                  Drag & drop your CSV file here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports CSV uploads up to 10MB
                </p>
              </div>
            )}

            <label>
              <input type="file" className="hidden" accept=".csv" onChange={handleFileInput} />
              <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                <span>Browse Files</span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UploadBox;