import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileIcon, ImageIcon, UploadIcon } from "lucide-react"

export function fileComponent() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      const fileType = selectedFile.type
      if (fileType === "application/pdf" || fileType === "image/png" || fileType === "image/jpeg") {
        setFile(selectedFile)
        setError(null)
      } else {
        setFile(null)
        setError("Please select a PDF, PNG, or JPG file.")
      }
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
        onClick={handleClick}
      >
        <Input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500">PDF, PNG, or JPG (max. 10MB)</p>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {file && (
        <div className="mt-4 flex items-center p-2 bg-gray-100 rounded-md">
          {file.type === "application/pdf" ? (
            <FileIcon className="h-6 w-6 text-blue-500 mr-2" />
          ) : (
            <ImageIcon className="h-6 w-6 text-green-500 mr-2" />
          )}
          <span className="text-sm text-gray-700 truncate">{file.name}</span>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setFile(null)}>
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}

