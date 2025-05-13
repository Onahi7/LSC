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
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectValue
} from "@/components/ui/multi-select"
import { Loader2, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { FileUpload } from "@/components/EnhancedFileUpload"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, addDays } from "date-fns"

// Form schema with validation
const announcementFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  content: z.string().min(20, { message: "Content must be at least 20 characters" }),
  image: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  targetGroups: z.array(z.string()).default([]),
  publishedAt: z.date().optional(),
})
.refine(data => {
  if (data.startDate && data.endDate) {
    return data.endDate >= data.startDate
  }
  return true
}, {
  message: "End date must be after start date",
  path: ["endDate"]
})

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>

interface AnnouncementFormProps {
  initialData?: AnnouncementFormValues & { id?: string }
  isEditing?: boolean
  targetGroupOptions?: { value: string; label: string }[]
}

export function AnnouncementForm({ 
  initialData, 
  isEditing = false,
  targetGroupOptions = [
    { value: "ALL", label: "All Members" },
    { value: "LEADERSHIP", label: "Leadership Team" },
    { value: "WORKERS", label: "Church Workers" },
    { value: "CHOIR", label: "Choir Members" },
    { value: "YOUTH", label: "Youth Ministry" },
    { value: "CHILDREN", label: "Children's Ministry" },
    { value: "MEN", label: "Men's Fellowship" },
    { value: "WOMEN", label: "Women's Fellowship" },
  ]
}: AnnouncementFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // If startDate is set but endDate is not, default endDate to 7 days after startDate
  const getDefaultEndDate = () => {
    if (initialData?.startDate && !initialData?.endDate) {
      return addDays(new Date(initialData.startDate), 7)
    }
    return initialData?.endDate
  }
  
  // Initialize form with react-hook-form
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      endDate: getDefaultEndDate(),
    } : {
      title: "",
      content: "",
      image: "",
      startDate: undefined,
      endDate: undefined,
      status: "DRAFT",
      priority: "NORMAL",
      targetGroups: ["ALL"],
      publishedAt: undefined,
    }
  })
  
  // Handle image upload
  const handleImageUpload = (url: string) => {
    form.setValue("image", url)
  }
  
  // Update end date when start date changes
  useEffect(() => {
    const startDate = form.watch("startDate")
    const endDate = form.watch("endDate")
    
    if (startDate && !endDate) {
      form.setValue("endDate", addDays(new Date(startDate), 7))
    }
  }, [form.watch("startDate")])
  
  // Handle form submission
  const onSubmit = async (values: AnnouncementFormValues) => {
    try {
      setIsSubmitting(true)
      
      // If status is PUBLISHED but no publishedAt date, set it to now
      if (values.status === "PUBLISHED" && !values.publishedAt) {
        values.publishedAt = new Date()
      }
      
      const endpoint = isEditing 
        ? `/api/announcements/${initialData?.id}` 
        : "/api/announcements"
      
      const method = isEditing ? "PATCH" : "POST"
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      
      if (!response.ok) {
        throw new Error("Failed to save announcement")
      }
      
      toast({
        title: isEditing ? "Announcement updated!" : "Announcement created!",
        description: isEditing 
          ? "Your changes have been saved." 
          : "Your announcement has been created successfully.",
      })
      
      router.push("/announcements")
      router.refresh()
    } catch (error) {
      console.error("Error submitting announcement:", error)
      toast({
        title: "Something went wrong",
        description: "Failed to save announcement. Please try again.",
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
                    <Input placeholder="Enter announcement title" {...field} />
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
                      placeholder="Write the announcement content..." 
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
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Determines how prominently the announcement will be displayed
                </FormDescription>
                <FormMessage />
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
                <FormDescription>
                  Draft announcements are only visible to admins
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="targetGroups"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Groups</FormLabel>
                <MultiSelect
                  selected={field.value}
                  options={targetGroupOptions}
                  onChange={field.onChange}
                  placeholder="Select target groups"
                />
                <FormDescription>
                  Select the groups this announcement is relevant for
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
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
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When the announcement should start being displayed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
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
                      disabled={(date) => {
                        const startDate = form.watch("startDate")
                        return startDate ? date < startDate : date < new Date()
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When the announcement should stop being displayed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="publishedAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Publish Date</FormLabel>
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
                  When the announcement should be published (only needed for scheduled announcements)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="md:col-span-2">
            <FormLabel className="block mb-2">Image (Optional)</FormLabel>
            <FileUpload
              onChange={handleImageUpload}
              maxFiles={1}
              maxSize={1024 * 1024 * 2} // 2MB
              accept={{
                'image/*': ['.png', '.jpeg', '.jpg', '.gif']
              }}
              folder="announcement-images"
              value={form.watch("image") ? [form.watch("image")] : []}
            />
            <FormDescription className="mt-2">
              Add an image to make your announcement more eye-catching
            </FormDescription>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/announcements")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditing ? "Update Announcement" : "Create Announcement"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
