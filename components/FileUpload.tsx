"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { validateFileSize, validateFileType, uploadToNeonStorage } from "@/lib/upload"

interface FileUploadProps {
  onUploadComplete: (url: string) => void
  onUploadError: (error: string) => void
  allowedTypes: string[]
  maxSizeMB: number
  folder?: string
}

export function FileUpload({
  onUploadComplete,
  onUploadError,
  allowedTypes,
  maxSizeMB,
  folder = "general",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]

      if (!validateFileType(file, allowedTypes)) {
        onUploadError("Invalid file type")
        return
      }

      if (!validateFileSize(file, maxSizeMB)) {
        onUploadError(`File size must be less than ${maxSizeMB}MB`)
        return
      }

      setFile(file)
    },
    [allowedTypes, maxSizeMB, onUploadError]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  })

  const handleUpload = async () => {
    if (!file) return

    try {
      setUploading(true)
      const url = await uploadToNeonStorage(file, folder)
      onUploadComplete(url)
      setFile(null)
    } catch (error) {
      onUploadError("Failed to upload file")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"}
          ${file ? "bg-muted/50" : ""}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center justify-between">
            <span className="text-sm truncate">{file.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                setFile(null)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? "Drop the file here"
                : "Drag and drop a file, or click to select"}
            </p>
          </div>
        )}
      </div>

      {file && (
        <Button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 w-full"
        >
          {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upload File
        </Button>
      )}
    </div>
  )
}
