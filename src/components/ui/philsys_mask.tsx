"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PhilSysInput() {
  const [value, setValue] = useState("")

  const maskPhilSysId = (input: string) => {
    const digitsOnly = input.replace(/\D/g, "")
    const parts = [digitsOnly.slice(0, 4), digitsOnly.slice(4, 11), digitsOnly.slice(11, 12)]
    return parts.filter(Boolean).join("-")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = maskPhilSysId(e.target.value)
    setValue(newValue)
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      {/* <Label htmlFor="philsys-id">PhilSys ID</Label> */}
      <Input
        type="text"
        id="philsys_id_no"
        placeholder="0000-0000000-0"
        value={value}
        onChange={handleChange}
        maxLength={14} // 4 + 7 + 1 digits + 2 hyphens
      />
    </div>
  )
}

