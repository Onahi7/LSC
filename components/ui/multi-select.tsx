"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "@/lib/utils"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"

export type OptionType = {
  label: string
  value: string
}

interface MultiSelectProps {
  options: OptionType[]
  selected: string[]
  onChange: (values: string[]) => void
  className?: string
  placeholder?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder = "Select options",
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [selectedItems, setSelectedItems] = React.useState<string[]>(selected || [])

  React.useEffect(() => {
    setSelectedItems(selected || [])
  }, [selected])

  const handleSelect = (value: string) => {
    let updatedValues: string[]
    
    if (selectedItems.includes(value)) {
      updatedValues = selectedItems.filter((item) => item !== value)
    } else {
      updatedValues = [...selectedItems, value]
    }
    
    setSelectedItems(updatedValues)
    onChange(updatedValues)
  }

  const handleRemove = (value: string) => {
    const updatedValues = selectedItems.filter((item) => item !== value)
    setSelectedItems(updatedValues)
    onChange(updatedValues)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          className={cn(
            "min-h-10 flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            className
          )}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1.5">
            {selectedItems.length > 0 ? (
              selectedItems.map((value) => {
                const option = options.find((o) => o.value === value)
                return (
                  <Badge 
                    key={value} 
                    variant="secondary"
                    className="flex items-center gap-1 px-2"
                  >
                    {option?.label || value}
                    <X
                      className="h-3 w-3 cursor-pointer opacity-70 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(value)
                      }}
                    />
                  </Badge>
                )
              })
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <div className="flex">
            {selectedItems.length > 0 && (
              <X
                className="h-4 w-4 cursor-pointer opacity-70 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedItems([])
                  onChange([])
                }}
              />
            )}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
        <Command className="w-full" shouldFilter={true}>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => handleSelect(option.value)}
                className="flex items-center gap-2"
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    selectedItems.includes(option.value)
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>{option.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { MultiSelect as MultiSelectPrimitive }

export const MultiSelectTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm", className)}
    {...props}
  />
))
MultiSelectTrigger.displayName = "MultiSelectTrigger"

export const MultiSelectValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex gap-1 flex-wrap", className)}
    {...props}
  />
))
MultiSelectValue.displayName = "MultiSelectValue"

export const MultiSelectContent = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn("w-full", className)}
    {...props}
  />
))
MultiSelectContent.displayName = "MultiSelectContent"

export const MultiSelectItem = CommandItem
