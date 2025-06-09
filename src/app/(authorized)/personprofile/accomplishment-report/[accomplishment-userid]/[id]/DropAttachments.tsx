import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FileItem {
  name: string;
  size: string;
}

interface DropAttachmentsProps {
  onDropFiles?: (files: FileItem[]) => void;
}

export default function DropAttachments({ onDropFiles }: DropAttachmentsProps) {
  const [files, setFiles] = useState<FileItem[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [], "application/pdf": [], "text/plain": [] },
    onDrop: (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
      }));
      setFiles((prev) => [...prev, ...newFiles]);
      if (onDropFiles) onDropFiles([...files, ...newFiles]);
    },
  });

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (onDropFiles) onDropFiles(updatedFiles);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className="border-dashed border-2 border-gray-300 p-6 text-center cursor-pointer rounded-lg hover:border-gray-500"
      >
        <input {...getInputProps()} />
        <p>Drag & drop files here, or click to select files</p>
      </div>

      <div className="mt-4 space-y-2">
        {files.map((file, index) => (
          <Card key={index} className="flex justify-between items-center p-2">
            <CardContent className="flex justify-between items-center w-full">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">{file.size}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                <X className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}