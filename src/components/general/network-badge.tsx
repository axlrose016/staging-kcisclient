"use client"

import { Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useOnlineStatus } from "@/hooks/use-network"

interface NetworkStatusBadgeProps {
  className?: string
  showText?: boolean
}

export function NetworkStatusBadge({ className, showText = true }: NetworkStatusBadgeProps) {
  const isOnline = useOnlineStatus()

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 transition-colors",
        isOnline
          ? "bg-green-500/10 text-green-600 border-green-500/20"
          : "bg-red-500/10 text-red-600 border-red-500/20",
        className,
      )}
    >
      {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
      {showText && (isOnline ? "Online" : "Offline")}
    </Badge>
  )
}

