"use client"

import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { CalendarIcon } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

export function CustomDatePicker() {
  const [date, setDate] = React.useState<Date>()
  const [inputValue, setInputValue] = React.useState("")

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setInputValue(selectedDate ? format(selectedDate, "yyyy-MM-dd") : "")
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setInputValue(value)

    const parsedDate = parse(value, "yyyy-MM-dd", new Date())
    if (isValid(parsedDate)) {
      setDate(parsedDate)
    } else {
      setDate(undefined)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
        <div className="p-3 border-t">
          <Input
            type="date"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="YYYY-MM-DD"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

