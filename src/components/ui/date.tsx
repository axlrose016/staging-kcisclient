"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function DateInput() {
  const [month, setMonth] = useState("")
  const [day, setDay] = useState("")
  const [year, setYear] = useState("")
  const [isValid, setIsValid] = useState(true)

  const handleMonthChange = (value: string) => {
    setMonth(value)
  }

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || (Number.parseInt(value) >= 1 && Number.parseInt(value) <= 31)) {
      setDay(value)
    }
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || (value.length <= 4 && /^\d*$/.test(value))) {
      setYear(value)
    }
  }

  const isValidDate = (m: string, d: string, y: string) => {
    if (!m || !d || !y) return true // Allow partial dates
    const monthIndex = months.indexOf(m)
    const yearNum = Number.parseInt(y)
    const dayNum = Number.parseInt(d)

    if (monthIndex === -1 || isNaN(yearNum) || isNaN(dayNum)) return false

    const date = new Date(yearNum, monthIndex, dayNum)
    return (
      date.getMonth() === monthIndex &&
      date.getDate() === dayNum &&
      date.getFullYear() === yearNum &&
      yearNum >= 1900 &&
      yearNum <= 2100
    )
  }

  useEffect(() => {
    setIsValid(isValidDate(month, day, year))
  }, [month, day, year, isValidDate]) // Added isValidDate to dependencies

  return (
    <div className="grid w-full max-w-sm items-center gap-4">
      <Label htmlFor="date">Date (MMM/DD/YYYY)</Label>
      <div className="flex space-x-2">
        <Select value={month} onValueChange={handleMonthChange}>
          <SelectTrigger id="month" className="w-[120px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent position="popper">
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          id="day"
          placeholder="DD"
          value={day}
          onChange={handleDayChange}
          className="w-[80px]"
        />
        <Input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          id="year"
          placeholder="YYYY"
          value={year}
          onChange={handleYearChange}
          className="w-[100px]"
        />
      </div>
      {month && day && year && (
        <div className={`text-sm ${isValid ? "text-muted-foreground" : "text-red-500"}`}>
          {isValid
            ? `Selected Date: ${month}/${day.padStart(2, "0")}/${year}`
            : "Invalid date. Please check your input."}
        </div>
      )}
    </div>
  )
}

