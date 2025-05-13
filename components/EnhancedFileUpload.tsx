"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadToNeonStorage } from "@/lib/upload"

interface FileUploadProps {
  onChange: (urls: string[]) => void
  maxFiles?: number 
  maxSize?: number
  accept?: Record<string, string[]>
  folder?: string
}

export function FileUpload({
  onChange,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = { 'image/*': ['.png', '.jpeg', '.jpg'] },
  folder = "general",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Reset error state
      setError(null)
      
      // Check file limits
      if (acceptedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`)
        return
      }

      // Validate each file
      const validFiles = acceptedFiles.filter(file => {
        // Check file size
        if (file.size > maxSize) {
          setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`)
          return false
        }
        
        // Validation passed
        return true
      })

      setFiles(prev => [...prev, ...validFiles].slice(0, maxFiles))
    },
    [maxFiles, maxSize]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    multiple: maxFiles > 1,
    accept
  })

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (!files.length) return

    try {
      setUploading(true)
      const uploadedUrls = []
      
      for (const file of files) {
        const url = await uploadToNeonStorage(file, folder)
        uploadedUrls.push(url)
      }
      
      onChange(uploadedUrls)
      setFiles([])
    } catch (error) {
      setError("Failed to upload files")
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      {error && (
        <div className="text-destructive text-sm mb-2">{error}</div>
      )}
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"}
          ${files.length ? "bg-muted/50" : ""}`}
      >
        <input {...getInputProps()} />
        
        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm truncate">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFile(index)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? "Drop the file here"
                : `Drag and drop file${maxFiles > 1 ? 's' : ''}, or click to select`}
            </p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <Button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 w-full"
        >
          {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upload {files.length > 1 ? `${files.length} Files` : 'File'}
        </Button>
      )}
    </div>
  )
}
