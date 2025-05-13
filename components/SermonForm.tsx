import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FileUpload } from "@/components/EnhancedFileUpload"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const sermonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  video_url: z.array(z.string()).default([]),
  audio_url: z.array(z.string()).default([]),
  thumbnail: z.string().optional(),
  scripture: z.string().optional(),
  duration: z.string().optional(),
  series: z.string().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
})

type SermonFormValues = z.infer<typeof sermonSchema>

interface SermonFormProps {
  initialData?: any;
  onSubmit: (data: SermonFormValues) => void;
  onCancel: () => void;
}

export function SermonForm({ initialData, onSubmit, onCancel }: SermonFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableSeries, setAvailableSeries] = useState<{id: string; name: string}[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();
  
  const form = useForm<SermonFormValues>({
    resolver: zodResolver(sermonSchema),
    defaultValues: initialData ? {
      title: initialData.title || "",
      content: initialData.content || "",
      video_url: initialData.video_url || [],
      audio_url: initialData.audio_url || [],
      thumbnail: initialData.thumbnail || "",
      scripture: initialData.scripture || "",
      duration: initialData.duration || "",
      series: initialData.series || "",
      tags: initialData.tags || [],
      featured: initialData.featured || false,
    } : {
      title: "",
      content: "",
      video_url: [],
      audio_url: [],
      thumbnail: "",
      scripture: "",
      duration: "",
      series: "",
      tags: [],
      featured: false,
    },
  });

  // Fetch available series
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await fetch("/api/sermons/series");
        if (response.ok) {
          const data = await response.json();
          setAvailableSeries(data.map((s: any) => ({ id: s.id, name: s.name })));
        }
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };
    
    // Fetch available tags
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/sermons/tags");
        if (response.ok) {
          const data = await response.json();
          setAvailableTags(data);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    
    fetchSeries();
    fetchTags();
  }, []);
  
  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !form.getValues().tags.includes(tagInput.trim())) {
      const currentTags = form.getValues().tags;
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues().tags;
    form.setValue("tags", currentTags.filter(t => t !== tag));
  };
  
  const handleFormSubmit = async (values: SermonFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save sermon",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle file uploads
  const handleVideoUpload = (urls: string[]) => {
    form.setValue("video_url", [...form.getValues().video_url, ...urls]);
  };
  
  const handleAudioUpload = (urls: string[]) => {
    form.setValue("audio_url", [...form.getValues().audio_url, ...urls]);
  };
  
  const handleThumbnailUpload = (urls: string[]) => {
    if (urls.length > 0) {
      form.setValue("thumbnail", urls[0]);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Sermon title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="scripture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scripture Reference</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John 3:16-21" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 45:30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="series"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Series</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a series" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {availableSeries.map((series) => (
                    <SelectItem key={series.id} value={series.name}>
                      {series.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  placeholder="Sermon content, notes, or transcript"
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>Tags</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.getValues().tags.map((tag) => (
              <div
                key={tag}
                className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-secondary-foreground/70 hover:text-secondary-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          <FormDescription>
            Press Enter or click Add to add a tag
          </FormDescription>
        </div>
        
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Featured Sermon</FormLabel>
                <FormDescription>
                  Feature this sermon on the homepage and sermon listing
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>Thumbnail Image</FormLabel>
          <div className="flex items-center gap-4">
            {form.getValues().thumbnail && (
              <div className="relative w-24 h-24 rounded overflow-hidden">
                <img
                  src={form.getValues().thumbnail}
                  alt="Thumbnail"
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => form.setValue("thumbnail", "")}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}            <FileUpload
              onChange={handleThumbnailUpload}
              maxFiles={1}
              maxSize={1024 * 1024 * 5} // 5MB
              accept={{
                'image/*': ['.png', '.jpeg', '.jpg', '.gif']
              }}
              folder="sermon-thumbnails"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <FormLabel>Audio Files</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.getValues().audio_url.map((url, index) => (
              <div
                key={index}
                className="bg-secondary text-secondary-foreground p-2 rounded-md text-sm flex items-center gap-2"
              >
                <span className="truncate max-w-[200px]">{url.split('/').pop()}</span>
                <button
                  type="button"
                  onClick={() => {
                    const currentUrls = [...form.getValues().audio_url];
                    currentUrls.splice(index, 1);
                    form.setValue("audio_url", currentUrls);
                  }}
                  className="text-secondary-foreground/70 hover:text-secondary-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>          <FileUpload
            onChange={handleAudioUpload}
            maxSize={1024 * 1024 * 20} // 20MB
            accept={{
              'audio/*': ['.mp3', '.wav', '.m4a']
            }}
            folder="sermon-audio"
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>Video Files</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.getValues().video_url.map((url, index) => (
              <div
                key={index}
                className="bg-secondary text-secondary-foreground p-2 rounded-md text-sm flex items-center gap-2"
              >
                <span className="truncate max-w-[200px]">{url.split('/').pop()}</span>
                <button
                  type="button"
                  onClick={() => {
                    const currentUrls = [...form.getValues().video_url];
                    currentUrls.splice(index, 1);
                    form.setValue("video_url", currentUrls);
                  }}
                  className="text-secondary-foreground/70 hover:text-secondary-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>          <FileUpload
            onChange={handleVideoUpload}
            maxSize={1024 * 1024 * 50} // 50MB
            accept={{
              'video/*': ['.mp4', '.mov', '.avi']
            }}
            folder="sermon-videos"
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update" : "Create"} Sermon
          </Button>
        </div>
      </form>
    </Form>
  );
}
