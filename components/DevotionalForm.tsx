"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Loader2, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { FileUpload } from "@/components/EnhancedFileUpload"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"

// Form schema with validation
const devotionalFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  content: z.string().min(50, { message: "Content must be at least 50 characters" }),
  scripture: z.string().min(3, { message: "Please provide a scripture reference" }),
  tags: z.string().transform(val => val.split(",").map(tag => tag.trim()).filter(Boolean)),
  image: z.string().optional(),
  featured: z.boolean().default(false),
  publishedAt: z.date().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
})

type DevotionalFormValues = z.infer<typeof devotionalFormSchema>

interface DevotionalFormProps {
  initialData?: DevotionalFormValues & { id?: string }
  isEditing?: boolean
}

export function DevotionalForm({ 
  initialData, 
  isEditing = false 
}: DevotionalFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Initialize form with react-hook-form
  const form = useForm<DevotionalFormValues>({
    resolver: zodResolver(devotionalFormSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      scripture: "",
      tags: [],
      image: "",
      featured: false,
      status: "DRAFT",
    }
  })
  
  // Handle image upload
  const handleImageUpload = (url: string) => {
    form.setValue("image", url)
  }
  
  // Handle form submission
  const onSubmit = async (values: DevotionalFormValues) => {
    try {
      setIsSubmitting(true)
      
      // Format tags as array for submission
      let tagsArray = []
      if (typeof values.tags === 'string') {
        tagsArray = values.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      } else {
        tagsArray = values.tags
      }
      
      const endpoint = isEditing 
        ? `/api/devotionals/${initialData?.id}` 
        : "/api/devotionals"
      
      const method = isEditing ? "PATCH" : "POST"
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          tags: tagsArray,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to save devotional")
      }
      
      toast({
        title: isEditing ? "Devotional updated!" : "Devotional created!",
        description: isEditing 
          ? "Your changes have been saved." 
          : "Your devotional has been created successfully.",
      })
      
      router.push("/devotionals")
      router.refresh()
    } catch (error) {
      console.error("Error submitting devotional:", error)
      toast({
        title: "Something went wrong",
        description: "Failed to save devotional. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-8 max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter devotional title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Write the devotional content..." 
                      className="min-h-[200px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="scripture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scripture Reference</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John 3:16-18" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="faith, prayer, forgiveness (comma separated)" 
                    {...field} 
                    value={Array.isArray(field.value) ? field.value.join(", ") : field.value}
                  />
                </FormControl>
                <FormDescription>
                  Separate tags with commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="md:col-span-2">
            <FormLabel className="block mb-2">Featured Image</FormLabel>
            <FileUpload
              onChange={handleImageUpload}
              maxFiles={1}
              maxSize={1024 * 1024 * 2} // 2MB
              accept={{
                'image/*': ['.png', '.jpeg', '.jpg', '.gif']
              }}
              folder="devotional-images"
              value={form.watch("image") ? [form.watch("image")] : []}
            />
          </div>
          
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Featured</FormLabel>
                  <FormDescription>
                    Mark this devotional as featured on the homepage
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="publishedAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Publication Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Schedule when this devotional should be published
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/devotionals")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditing ? "Update Devotional" : "Create Devotional"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
