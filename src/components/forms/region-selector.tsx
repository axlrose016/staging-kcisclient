"use client"

import { useEffect, useState } from "react"
import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dxFetchData } from "../_dal/external-apis/dxcloud"
import { LibrariesService } from "../services/LibrariesService"
import { getOfflineLibRegion } from "../_dal/offline-options"
import { useOnlineStatus } from "@/hooks/use-network"

interface RegionOption {
  id: string | number
  name: string
  label: string
}

interface RegionSelectorProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  placeholder?: string
}

export function RegionSelector<T extends FieldValues>({
  control,
  name,
  label = "Region",
  placeholder = "Select a region",
}: RegionSelectorProps<T>) {
  const [region, setRegion] = useState<RegionOption[]>([])
  const [presentRegion, setPresentRegion] = useState<RegionOption[]>([])
  const [loading, setLoading] = useState(true)
  const libService = new LibrariesService();
  const isOnline = useOnlineStatus();
  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        let data: any[] = []

        if (isOnline) {
          await dxFetchData("regions", "/api-libs/psgc/regions", async (fetchedData) => {
            data = fetchedData
            await libService.saveOfflineLibRegionBulk(data)
          })
        } else {
          data = await getOfflineLibRegion()
        }

        const regionOptions = data.map((item: any) => ({
          id: isOnline ? item.code : item.id,
          name: item.name,
          label: item.name,
        }))

        setRegion(regionOptions)
        setPresentRegion(regionOptions)
      } catch (error) {
        console.error("Failed to fetch library regions:", error)
      } finally {
        setLoading(false)
      }
    })()
  }, [isOnline])

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              value={field.value?.toString() || ""}
              onValueChange={(value) => field.onChange(value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Loading..." : placeholder} />
              </SelectTrigger>
              <SelectContent>
                {region.map((option) => (
                  <SelectItem key={option.id} value={option.id.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
