import { useState } from "react"
import { useForm, FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import FileUpload from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const sermonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  video_url: z.array(z.string()).default([]),
  audio_url: z.array(z.string()).default([]),
  preacherId: z.string(),
})

type SermonFormData = z.infer<typeof sermonSchema>

interface SermonFormProps {
  initialData?: SermonFormData
  onSuccess?: () => void
  mode: "create" | "edit"
  id?: string
}

export function SermonForm({ initialData, onSuccess, mode, id }: SermonFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<SermonFormData>({
    resolver: zodResolver(sermonSchema),
    defaultValues: initialData || {
      title: "",
      content: "",      video_url: [],
      audio_url: [],
    },
  })

  const onSubmit = async (data: SermonFormData) => {
    try {
      setLoading(true)
      const url = mode === "create" ? "/api/sermons" : `/api/sermons/${id}`
      const method = mode === "create" ? "POST" : "PATCH"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.error)

      toast({
        title: "Success",
        description: mode === "create" ? "Sermon created successfully" : "Sermon updated successfully",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">      <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder="Enter sermon title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  disabled={loading} 
                  placeholder="Enter sermon content"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="video_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video</FormLabel>
              <FormControl>
                <FileUpload
                  disabled={loading}
                  onChange={(url) => field.onChange([...field.value, url])}
                  onRemove={(url) => field.onChange(field.value.filter((current) => current !== url))}
                  value={field.value}
                  variant="video"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="audio_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Audio</FormLabel>
              <FormControl>
                <FileUpload
                  disabled={loading}
                  onChange={(url) => field.onChange([...field.value, url])}
                  onRemove={(url) => field.onChange(field.value.filter((current) => current !== url))}
                  value={field.value}
                  variant="audio"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter sermon content"
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />        <FormField
          control={form.control}
          name="video_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Files (optional)</FormLabel>
              <FormControl>
                <FileUpload
                  value={field.value}
                  onChange={async (files) => {
                    setIsUploading(true)
                    try {
                      const urls = await Promise.all(
                        files.map(file => 
                          uploadToCloudinary(file, "sermons/videos", "video")
                          .then(res => res.url)
                        )
                      )
                      field.onChange([...field.value, ...urls])
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to upload video file",
                        variant: "destructive",
                      })
                    } finally {
                      setIsUploading(false)
                    }
                  }}
                  onRemove={(url) => {
                    field.onChange(field.value.filter((current) => current !== url))
                  }}
                  accept={{
                    'video/*': ['.mp4', '.webm', '.ogg']
                  }}
                  maxSize={100 * 1024 * 1024} // 100MB
                  isUploading={isUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="audio_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Audio Files (optional)</FormLabel>
              <FormControl>
                <FileUpload
                  value={field.value}
                  onChange={async (files) => {
                    setIsUploading(true)
                    try {
                      const urls = await Promise.all(
                        files.map(file => 
                          uploadToCloudinary(file, "sermons/audio", "audio")
                          .then(res => res.url)
                        )
                      )
                      field.onChange([...field.value, ...urls])
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to upload audio file",
                        variant: "destructive",
                      })
                    } finally {
                      setIsUploading(false)
                    }
                  }}
                  onRemove={(url) => {
                    field.onChange(field.value.filter((current) => current !== url))
                  }}
                  accept={{
                    'audio/*': ['.mp3', '.wav', '.ogg']
                  }}
                  maxSize={50 * 1024 * 1024} // 50MB
                  isUploading={isUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Sermon" : "Update Sermon"}
        </Button>
      </form>
    </Form>
  )
}
