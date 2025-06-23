"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, File, ImageIcon, FileText, Video, Check, Database, Info, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Dexie, { type Table } from "dexie"
import { v4 as uuidv4 } from "uuid"
import { getOfflineLibFilesToUpload } from "../_dal/offline-options"
import { LibraryOption } from "../interfaces/library-interface"
import { getSession } from "@/lib/sessions-client"
import { SessionPayload } from "@/types/globals"

interface FormAttachmentsProps {
  record_id: string;    
  module_path: string;
}

interface FileWithPreview extends File {
  preview?: string
  progress?: number
  id: string
  saved?: boolean
  file_id?: number
  fileName?: string
  fileType?: string
  fileSize?: number
}

interface SavedAttachment {
  id?: string
  record_id?: string
  file_id: number
  fileName: string
  fileType: string
  fileSize: number
  blob: Blob
  preview?: string
  module_path: string
  user_id: string
  created_date: string
  created_by: string
  last_modified_date: string | null
  last_modified_by: string | null
  push_status_id: number
  push_date: string | null
  deleted_date: string | null
  deleted_by: string | null
  is_deleted: boolean
  remarks: string | null
}

// Dexie Database Setup
class AttachmentDatabase extends Dexie {
  attachments!: Table<SavedAttachment>

  constructor() {
    super("AttachmentDatabase")
    this.version(1).stores({
      attachments: "id, record_id, file_id, fileName, fileType, module_path, user_id, created_date",
    })
  }
}

export const attachmentDb = new AttachmentDatabase()

const _session = await getSession() as SessionPayload;

export default function FormAttachments({ record_id, module_path }: FormAttachmentsProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [savedAttachments, setSavedAttachments] = useState<SavedAttachment[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAttachment, setSelectedAttachment] = useState<SavedAttachment | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedAttachmentType, setSelectedAttachmentType] = useState<number>(0)
  const [attachmentType,setAttachmentTypes] = useState<LibraryOption[]>([])
  const [filterType, setFilterType] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load saved attachments on component mount
  useEffect(() => {
    loadSavedAttachments()
    async function fetchLibrary(){
        const lib_attachment_types = await getOfflineLibFilesToUpload();
        setAttachmentTypes(lib_attachment_types);
    }
    fetchLibrary();
  }, [])

  const loadSavedAttachments = async () => {
    try {
      const attachments = await attachmentDb.attachments
        .toArray()
        .then((results) =>
          results
            .filter((attachment) => !attachment.is_deleted && attachment.record_id == record_id && attachment.module_path == module_path)
            .sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()),
        )
      setSavedAttachments(attachments)
    } catch (error) {
      console.error("Failed to load saved attachments:", error)
    }
  }

  const getFileIcon = (file: File | SavedAttachment) => {
    const fileType = "type" in file ? file.type : file.fileType
    if (fileType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (fileType.startsWith("video/")) return <Video className="h-4 w-4" />
    if (fileType.includes("pdf") || fileType.includes("document")) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const getAttachmentTypeInfo = (type: number) => {
    debugger;
    return attachmentType.find((t) => t.id === type)!
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  const isValidFileType = (file: File) => {
    return file.type.startsWith("image/") || file.type === "application/pdf"
  }

  const processFiles = useCallback(
    (fileList: FileList) => {
      const validFiles = Array.from(fileList).filter(isValidFileType)
      const invalidFiles = Array.from(fileList).filter((file) => !isValidFileType(file))

      if (invalidFiles.length > 0) {
        alert(`${invalidFiles.length} file(s) rejected. Only images and PDF files are allowed.`)
      }

      const newFiles: FileWithPreview[] = validFiles.map((file) => ({
        ...file,
        id: Math.random().toString(36).substring(7),
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        progress: 0,
        saved: false,
        file_id: selectedAttachmentType,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      }))
      
      debugger;

      setFiles((prev) => [...prev, ...newFiles])

      // Don't close modal immediately - let user set attachment type if not selected
      if (newFiles.length > 0 && selectedAttachmentType) {
        setIsModalOpen(false)
      }
    },
    [selectedAttachmentType],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const droppedFiles = e.dataTransfer.files
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles)
      }
    },
    [processFiles],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files
      if (selectedFiles && selectedFiles.length > 0) {
        processFiles(selectedFiles)
      }
    },
    [processFiles],
  )

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter((f) => f.id !== fileId)
    })
  }, [])

  const clearAllFiles = useCallback(() => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
  }, [files])

  const updateFileAttachmentType = (fileId: string, attachmentType: string) => {
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, attachmentType } : f)))
  }

  const saveFilesToDexie = useCallback(async () => {
    // Check if all files have attachment types
    const filesWithoutType = files.filter((file) => !file.file_id)
    if (filesWithoutType.length > 0) {
      alert("Please select an attachment type for all files before saving.")
      return
    }

    setIsUploading(true)

    try {
      for (const file of files) {
        // Update progress
        for (let progress = 0; progress <= 90; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 50))
          setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, progress } : f)))
        }

        const now = new Date().toISOString()
        const fileId = Date.now() + Math.random() // Ensure unique file_id

        // Save to Dexie with the detailed schema
        const attachmentData: SavedAttachment = {
          id: uuidv4(), // Generate UUID for the record
          record_id: record_id, // Generate UUID for associated record
          fileName: file.fileName ?? "",
          fileType: file.fileType ?? "",
          fileSize: file.fileSize ?? 0,
          blob: file,
          preview: file.preview,
          file_id: file.file_id ?? 0,
          module_path: module_path,
          user_id: _session.id,
          created_date: now,
          created_by: _session.userData.email ?? "",
          last_modified_date: null,
          last_modified_by: null,
          push_status_id: 0, // 0 = not pushed
          push_date: null,
          deleted_date: null,
          deleted_by: null,
          is_deleted: false,
          remarks: null,
        }

        await attachmentDb.attachments.add(attachmentData)

        // Complete progress
        setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, progress: 100, saved: true } : f)))
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Reload saved attachments
      await loadSavedAttachments()
    } catch (error) {
      console.error("Failed to save files to Dexie:", error)
      alert("Failed to save files. Please try again.")
    }

    setIsUploading(false)

    // Clear files after successful save
    setTimeout(() => {
      setFiles([])
    }, 1000)
  }, [files])

  const deleteSavedAttachment = async (id: string) => {
    try {
      const now = new Date().toISOString()

      // Soft delete - update the record instead of removing it
      await attachmentDb.attachments.update(id, {
        is_deleted: true,
        deleted_date: now,
        deleted_by: _session.userData.email,
      })

      await loadSavedAttachments()
    } catch (error) {
      console.error("Failed to delete attachment:", error)
    }
  }

  const downloadAttachment = (attachment: SavedAttachment) => {
    const url = URL.createObjectURL(attachment.blob)
    const a = document.createElement("a")
    a.href = url
    a.download = attachment.fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const showAttachmentDetails = (attachment: SavedAttachment) => {
    setSelectedAttachment(attachment)
    setIsDetailsOpen(true)
  }

  const filteredAttachments = savedAttachments.filter((attachment) => {
    if (filterType === 0) return true
    return attachment.file_id === filterType
  })

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      {/* Add Attachment Button and Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" size="lg">
            <Upload className="h-4 w-4 mr-2" />
            Add New Attachment
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Select Files</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">Upload images and PDF documents</p>

            {/* Attachment Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="attachment-type">Attachment Type</Label>
              <Select value={selectedAttachmentType.toString()} onValueChange={(val) => setSelectedAttachmentType(Number(val))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select attachment type" />
                </SelectTrigger>
                <SelectContent>
                  {attachmentType.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Tag className="h-3 w-3" />
                        {type.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Upload Area */}
            <Card
              className={cn(
                "border-2 border-dashed transition-colors cursor-pointer",
                isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <CardContent className="flex flex-col items-center justify-center py-8 px-6">
                <Upload
                  className={cn(
                    "h-10 w-10 mb-4 transition-colors",
                    isDragOver ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <div className="text-center space-y-2">
                  <p className="font-medium">{isDragOver ? "Drop files here" : "Choose files or drag them here"}</p>
                  <p className="text-sm text-muted-foreground">
                    Support for images (JPG, PNG, GIF, etc.) and PDF documents
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*,application/pdf"
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              {files.length > 0 && (
                <Button onClick={() => setIsModalOpen(false)} disabled={!selectedAttachmentType}>
                  Continue
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attachment Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Attachment Details</DialogTitle>
          </DialogHeader>

          {selectedAttachment && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {selectedAttachment.preview ? (
                    <img
                      src={selectedAttachment.preview || "/placeholder.svg"}
                      alt={selectedAttachment.fileName}
                      className="h-16 w-16 object-cover rounded"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-muted rounded flex items-center justify-center">
                      {getFileIcon(selectedAttachment)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{selectedAttachment.fileName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedAttachment.fileSize)} • {selectedAttachment.fileType}
                  </p>
                  <Badge className={cn("mt-1")}>
                    {getAttachmentTypeInfo(selectedAttachment.file_id)?.name}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-1">
                  <p className="font-medium">ID</p>
                  <p className="text-muted-foreground truncate">{selectedAttachment.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Record ID</p>
                  <p className="text-muted-foreground truncate">{selectedAttachment.record_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">File ID</p>
                  <p className="text-muted-foreground">{selectedAttachment.file_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Attachment Type</p>
                  <p className="text-muted-foreground">
                    {getAttachmentTypeInfo(selectedAttachment.file_id).name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Module Path</p>
                  <p className="text-muted-foreground">{selectedAttachment.module_path}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Created By</p>
                  <p className="text-muted-foreground">{selectedAttachment.created_by}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Created Date</p>
                  <p className="text-muted-foreground">{formatDate(selectedAttachment.created_date)}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Last Modified</p>
                  <p className="text-muted-foreground">
                    {selectedAttachment.last_modified_date
                      ? `${formatDate(selectedAttachment.last_modified_date)} by ${selectedAttachment.last_modified_by}`
                      : "Never"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Push Status</p>
                  <p className="text-muted-foreground">
                    {selectedAttachment.push_status_id === 0
                      ? "Not Pushed"
                      : `Pushed on ${formatDate(selectedAttachment.push_date)}`}
                  </p>
                </div>
                {selectedAttachment.remarks && (
                  <div className="space-y-1 col-span-2">
                    <p className="font-medium">Remarks</p>
                    <p className="text-muted-foreground">{selectedAttachment.remarks}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => downloadAttachment(selectedAttachment)}>Download</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* File List - Outside Modal */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Attachments ({files.length})</h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearAllFiles} disabled={isUploading} size="sm">
                  Clear All
                </Button>
                <Button onClick={saveFilesToDexie} disabled={isUploading} size="sm">
                  <Database className="h-4 w-4 mr-1" />
                  {isUploading ? "Saving..." : "Save to Database"}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <img
                        src={file.preview || "/placeholder.svg"}
                        alt={file.fileName}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                        {getFileIcon(file)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.fileName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.fileSize ?? 0)}</p>
                      {file.file_id && (
                        <Badge className={cn("text-xs","red")}>
                          {getAttachmentTypeInfo(file.file_id)?.name}
                        </Badge>
                      )}
                    </div>

                    {!file.file_id && (
                      <div className="mt-2">
                        <Select
                          value={file.file_id?.toString()}
                          onValueChange={(value) => updateFileAttachmentType(file.id, value)}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {attachmentType.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {typeof file.progress === "number" && file.progress > 0 && (
                      <div className="mt-2">
                        <Progress value={file.progress} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {file.saved ? "Saved!" : `${file.progress}% saving...`}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {file.saved && <Check className="h-4 w-4 text-green-600" />}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      disabled={isUploading}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Attachments */}
      {savedAttachments.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Saved Attachments ({filteredAttachments.length})</h3>
              <div className="flex gap-2">
                <Select value={filterType.toString()} onValueChange={(val) => setFilterType(Number(val))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Types</SelectItem>
                    {attachmentType.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={loadSavedAttachments} size="sm">
                  Refresh
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredAttachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
                  <div className="flex-shrink-0">
                    {attachment.preview ? (
                      <img
                        src={attachment.preview || "/placeholder.svg"}
                        alt={attachment.fileName}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                        {getFileIcon(attachment)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{attachment.fileName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.fileSize)} • Created {formatDate(attachment.created_date)}
                      </p>
                      <Badge className={cn("text-xs")}>
                        {getAttachmentTypeInfo(attachment.file_id)?.name}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => showAttachmentDetails(attachment)}>
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadAttachment(attachment)}>
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => attachment.id && deleteSavedAttachment(attachment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
