"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
    initialDate?: Date
    onDateChange?: (date: Date) => void
    selectedDate?: Date
    onSelectedDateChange?: (date: Date) => void
    id: string
    value?: Date
}


export function DatePicker({ initialDate, onDateChange, selectedDate, onSelectedDateChange, id, value }: DatePickerProps) {
    const [date, setDate] = React.useState<Date>()
    React.useEffect(() => {
        setDate(value)
    }, [value])
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
