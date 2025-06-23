"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form } from "@/components/ui/form"

interface Option {
  id: string | number
  name: string
  value?: string
}

interface FormDropDownProps {
  id: string
  options: Option[]
  selectedOption: string | number | null
  onChange: (value: string | number | null) => void
  onCancel?: () => void;
  placeholder?: string
  allowCustomInput?: boolean
  className?: string
}

export function FormDropDownWithInput({
  id,
  options,
  selectedOption,
  onChange,
  onCancel,
  placeholder = "Select an option...",
  allowCustomInput = true,
  className,
}: FormDropDownProps) {
  const [open, setOpen] = React.useState(false)
  const [customValue, setCustomValue] = React.useState("")
  const [isCustomInput, setIsCustomInput] = React.useState(false)

  // Check if current value is a custom input (not in options)
  React.useEffect(() => {
    if (selectedOption && !options.find((option) => option.id === selectedOption)) {
      setIsCustomInput(true)
      setCustomValue(String(selectedOption))
    } else {
      setIsCustomInput(false)
      setCustomValue("")
    }
  }, [selectedOption, options])

  const selectedOptionData = options.find((option) => option.id === selectedOption)
  const displayValue = isCustomInput ? customValue : selectedOptionData?.name || ""

  const handleSelect = (optionId: string | number) => {
    onChange(optionId === selectedOption ? null : optionId)
    setOpen(false)
    setIsCustomInput(false)
    setCustomValue("")
  }

  const handleCustomInputChange = (value: string) => {
    setCustomValue(value)
    onChange(value)
    setIsCustomInput(true)
  }

  const handleCustomInputSubmit = () => {
    if (customValue.trim()) {
      onChange(customValue.trim())
      setOpen(false)
    }
  }

  const handleOnCancel = async () => {
    if (onCancel) {
        await onCancel();
    }
  };

  if (isCustomInput) {
    return (
      <div className="flex gap-2">
        <Input
          value={customValue}
          onChange={(e) => handleCustomInputChange(e.target.value)}
          placeholder="Enter custom value..."
          className={cn("flex-1", className)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleCustomInputSubmit()
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCustomInput(false)
            setCustomValue("")
            onChange(null)
            handleOnCancel()
          }}
        >
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {displayValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search options..." />
          <CommandList>
            <CommandEmpty>
              <div className="p-2">
                <p className="text-sm text-muted-foreground mb-2">No options found.</p>
                {allowCustomInput && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setIsCustomInput(true)
                      setOpen(false)
                    }}
                  >
                    Add custom input
                  </Button>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem key={option.id} value={option.name} onSelect={() => handleSelect(option.id)}>
                  <Check className={cn("mr-2 h-4 w-4", selectedOption === option.id ? "opacity-100" : "opacity-0")} />
                  {option.name}
                </CommandItem>
              ))}
              {allowCustomInput && options.length > 0 && (
                <CommandItem
                  onSelect={() => {
                    setIsCustomInput(true)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center w-full text-muted-foreground">
                    <span className="mr-2">+</span>
                    Add custom input
                  </div>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

