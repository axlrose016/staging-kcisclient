"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

type OptionItems = {
  id: number
  name: string
}

type FormMultiDropDownProps = {
  options: OptionItems[] // Pass your disabilities library as options
  selectedValues: string[] // Pass the current selected values
  onChange: (updatedValues: string[]) => void // Handle value changes
  id?: any
}

export function FormMultiDropDown({ options, selectedValues, onChange, id }: FormMultiDropDownProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (currentValue: string) => {
    const updatedValues = selectedValues.includes(currentValue)
      ? selectedValues.filter((value) => value !== currentValue)
      : [...selectedValues, currentValue]

    onChange(updatedValues)
  }

  const handleRemove = (valueToRemove: string) => {
    const updatedValues = selectedValues.filter((value) => value !== valueToRemove)
    onChange(updatedValues)
  }

  const handleClear = () => {
    onChange([])
  }

  return (
    <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger asChild>
        <Button id={id} variant="outline" role="combobox" aria-expanded={open} className="w-full h-300 justify-between overflow-y-auto">
          <div className="flex items-center gap-1 truncate">
            {selectedValues.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-1 w-full overflow-auto">
                  {/* <div className="flex flex-wrap items-center gap-1 max-w-[500px] min-w-0 max-h-[50px] overflow-auto"> */}

                  {selectedValues.slice(0, 2).map((value) => (
                    <Badge key={value} variant="secondary"
                      className="truncate max-w-[500px] inline-flex items-center px-2 py-1 whitespace-nowrap w-auto">
                      {options.find((option) => option.id === Number(value))?.name}
                    </Badge>
                  ))}
                </div>
                {selectedValues.length > 2 && <Badge variant="secondary" className="text-center">+{selectedValues.length - 2}</Badge>}
              </>
            ) : (
              "Select Disabilities..."
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search disability..." />
          <CommandList>
            <CommandEmpty>No disability found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.id.toString()}
                  onSelect={() => handleSelect(option.id.toString())}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(option.id.toString()) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {selectedValues.length > 0 && (
            <div className="border-t p-2">
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedValues.map((value) => (
                  <Badge key={value} variant="secondary" className="truncate max-w-[120px]">
                    {options.find((option) => option.id === Number(value))?.name}
                    <button
                      className="ml-1 inline-flex items-center rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-auto"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRemove(value);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleRemove(value)}
                    >
                      <X className="h-3 w-3 ml-1" />
                    </button>

                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={handleClear}>
                Clear all
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
