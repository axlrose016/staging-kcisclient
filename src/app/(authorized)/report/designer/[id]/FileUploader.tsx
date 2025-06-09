"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

export function FileUploader({ onFileUpload, isProcessing }: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1,
  });

  return (

    <>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-10 transition-all duration-200 ease-in-out cursor-pointer",
          "flex flex-col items-center justify-center text-center",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          isDragAccept ? "border-green-500 bg-green-50" : "",
          isDragReject ? "border-destructive bg-destructive/10" : "",
          isProcessing ? "pointer-events-none opacity-70" : "hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} disabled={isProcessing} />

        {isProcessing ? (
          <div className="space-y-4 w-full max-w-md">
            <div className="flex flex-col items-center">
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-2 animate-pulse" />
              <p className="font-medium">Processing your file...</p>
            </div>
            <Progress value={45} className="h-2" />
          </div>
        ) : (
          <>
            <div className="p-4 mb-4 rounded-full bg-primary/10">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Upload Excel File</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Drag and drop your Excel file here, or click to browse
            </p>
            <Button variant="outline" className="mt-2">
              Browse Files
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Supports .xlsx, .xls, and .csv files
            </p>
          </>
        )}
      </div>
    </>
  );
}