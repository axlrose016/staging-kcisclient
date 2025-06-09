"use client"

import * as React from "react"
import { addDays, format } from "date-fns" 
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils" 
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerWithRange({
    endIcon,
    onClickEndIcon,
    className,
    value,
    onChange,
}: {
    endIcon?: React.ReactNode
    onClickEndIcon?: ()=> void
    className?: string
    value: DateRange | undefined
    onChange: (range: DateRange | undefined) => void
}) {

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <div className="flex items-center g">
                        <span

                            id="date"
                            className={cn(
                                "scursor-pointer py-1 rounded-md",
                                !value && "text-muted-foreground"
                            )}
                        >
                            {value?.from ? (
                                value.to ? (
                                    <>
                                        {format(value.from, "LLL dd")}-
                                        {format(value.to, "dd,y")}
                                    </>
                                ) : (
                                    format(value.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}

                            
                        </span> 
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={value?.from}
                        selected={value}
                        onSelect={onChange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover> 
            {endIcon}
        </div>
    )
}
