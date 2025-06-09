"use client"

import { useState, useEffect } from "react"
import { Loader2, RotateCcw, CircleOff } from "lucide-react"
import { cn } from "@/lib/utils"

type LoadingStyle = "spinner" | "dots" | "progress" | "pulse"

interface LoadingScreenProps {
  isLoading?: boolean
  text?: string
  style?: LoadingStyle
  fullScreen?: boolean
  progress?: number
  timeout?: number
  onTimeout?: () => void
  className?: string
}

export default function LoadingScreen({
  isLoading = true,
  text = "Loading...",
  style = "spinner",
  fullScreen = true,
  progress = 0,
  timeout = 0,
  onTimeout,
  className,
}: LoadingScreenProps) {
  const [visible, setVisible] = useState(isLoading)
  const [timeoutReached, setTimeoutReached] = useState(false)

  useEffect(() => {
    setVisible(isLoading)
  }, [isLoading])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (timeout > 0 && isLoading) {
      timer = setTimeout(() => {
        setTimeoutReached(true)
        onTimeout?.()
      }, timeout)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [timeout, isLoading, onTimeout])

  if (!visible) return null

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300",
        fullScreen ? "fixed inset-0 z-50" : "w-full h-full min-h-[200px] relative z-10 rounded-lg",
        className,
      )}
    >
      {timeoutReached ? (
        <div className="flex flex-col items-center space-y-4 p-4 text-center">
          <CircleOff className="h-10 w-10 text-gray-400 animate-pulse" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Loading timed out</p>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
          <button
            onClick={() => {
              setTimeoutReached(false)
              window.location.reload()
            }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
          >
            <RotateCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 p-4 text-center">
          {style === "spinner" && <Loader2 className="h-10 w-10 animate-spin text-primary" />}

          {style === "dots" && (
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-3 w-3 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}

          {style === "progress" && (
            <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-in-out"
                style={{
                  width: progress ? `${progress}%` : "100%",
                  animation: !progress ? "indeterminate 1.5s infinite ease-in-out" : "none",
                }}
              />
            </div>
          )}

          {style === "pulse" && (
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-primary/20 animate-ping absolute inset-0" />
              <div className="h-16 w-16 rounded-full bg-primary/40 relative" />
            </div>
          )}

          {text && <p className="text-base font-medium">{text}</p>}

          {style === "progress" && progress > 0 && (
            <p className="text-sm text-muted-foreground">{progress}% complete</p>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes indeterminate {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

