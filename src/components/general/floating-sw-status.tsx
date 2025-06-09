"use client"

import React, { useEffect, useState } from "react"
import { Wifi, WifiOff, Check, AlertCircle, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils" 
import { SyncSummaryDrawer } from "../app-syncdrawer" 

export default function FloatingPWAStatusAvatar() {
  const [swStatus, setSwStatus] = useState<"loading" | "registered" | "active" | "unsupported">("loading")
  const [isOnline, setIsOnline] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

   
  useEffect(() => {
    // Check if service worker is supported
    if (!("serviceWorker" in navigator)) {
      setSwStatus("unsupported")
      return
    }

    // Check online status initially
    setIsOnline(navigator.onLine)

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check service worker registration status
    const checkServiceWorker = async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations()

        if (registrations.length === 0) {
          // No service worker registered yet
          setSwStatus("loading")
          return
        }

        // Check if any service worker is active
        const activeServiceWorker = registrations.some(
          (registration) => registration.active && registration.active.state === "activated",
        )

        setSwStatus(activeServiceWorker ? "active" : "registered")
      } catch (error) {
        console.error("Error checking service worker status:", error)
        setSwStatus("unsupported")
      }
    }

    // Check initially
    checkServiceWorker()

    // Set up interval to check periodically
    const interval = setInterval(checkServiceWorker, 2000)

    // Listen for service worker state changes
    navigator.serviceWorker.addEventListener("controllerchange", checkServiceWorker)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(interval)
      navigator.serviceWorker.removeEventListener("controllerchange", checkServiceWorker)
    }
  }, [])

  // Get status icon based on service worker status
  const getStatusIcon = () => {
    switch (swStatus) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
      case "registered":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "active":
        return <Check className="h-4 w-4 text-green-500" />
      case "unsupported":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  // Get status text for tooltip
  const getStatusText = () => {
    switch (swStatus) {
      case "loading":
        return "Installing service worker..."
      case "registered":
        return "Service worker registered, waiting for activation"
      case "active":
        return "Ready for offline use"
      case "unsupported":
        return "Offline mode not supported in this browser"
    }
  }

  return ( 
    <SyncSummaryDrawer>
      <div className="fixed bottom-4 right-4 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="relative group" onClick={() => setIsOpen(!isOpen)} aria-label="PWA offline status">
                <Avatar className="h-12 w-12 border-2 shadow-lg hover:shadow-xl transition-shadow">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" alt="App logo" />
                  <AvatarFallback>PWA</AvatarFallback>
                </Avatar>

                {/* Status indicator dot */}
                <span
                  className={cn(
                    "absolute top-0 right-0 h-4 w-4 rounded-full border-2 border-white",
                    isOnline ? (swStatus === "active" ? "bg-green-500" : "bg-yellow-500") : "bg-red-500",
                  )}
                />

                {/* Connection status icon */}
                <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                  {isOnline ? <Wifi className="h-3 w-3 text-primary" /> : <WifiOff className="h-3 w-3 text-red-500" />}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="flex flex-col gap-1">
              <div className="font-medium">PWA Status</div>
              <div className="flex items-center gap-1.5 text-sm">
                {getStatusIcon()} {getStatusText()}
              </div>
              <div className="text-xs text-muted-foreground">{isOnline ? "Online" : "Offline"}</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Expanded status panel (optional) */}
        {/* {isOpen && (
          <div className="absolute bottom-14 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 w-64 border">
            <div className="text-sm font-medium mb-2">PWA Offline Status</div>

            <div className="flex items-center gap-2 mb-2">
              <div
                className={cn(
                  "p-1.5 rounded-full",
                  swStatus === "active"
                    ? "bg-green-100 dark:bg-green-900/20"
                    : swStatus === "unsupported"
                      ? "bg-red-100 dark:bg-red-900/20"
                      : "bg-yellow-100 dark:bg-yellow-900/20",
                )}
              >
                {getStatusIcon()}
              </div>
              <div className="text-sm">{getStatusText()}</div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isOnline ? (
                <>
                  <Wifi className="h-3 w-3" /> Connected
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" /> Offline
                </>
              )}
            </div>
          </div>
        )} */}
      </div>
    </SyncSummaryDrawer>
  )
}

