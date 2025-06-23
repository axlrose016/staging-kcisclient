"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Clock } from "lucide-react"

interface SessionTimeoutModalProps {
  onContinueSession: () => void
  onSignOut: () => void
  sessionDuration?: number // in milliseconds
  idleTimeout?: number // in milliseconds
  warningTime?: number // in milliseconds before timeout to show warning
}

export function SessionTimeoutModal({
  onContinueSession,
  onSignOut,
  sessionDuration = 24 * 60 * 60 * 1000, // 30 minutes default
  idleTimeout = 15 * 60 * 1000, // 15 minutes default
  warningTime = 2 * 60 * 1000, // 2 minutes warning default
}: SessionTimeoutModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [reason, setReason] = useState<"idle" | "session">("idle")

  const idleTimerRef = useRef<NodeJS.Timeout>()
  const sessionTimerRef = useRef<NodeJS.Timeout>()
  const warningTimerRef = useRef<NodeJS.Timeout>()
  const countdownRef = useRef<NodeJS.Timeout>()
  const lastActivityRef = useRef(Date.now())
  const sessionStartRef = useRef(Date.now())
  const countdownStartTimeRef = useRef<number>(0)

  // Handle timeout (either idle or session expiry)
  const handleTimeout = useCallback(
    (timeoutReason: "idle" | "session") => {
      console.log("Timeout triggered:", timeoutReason)

      // Clear all timers first
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current)
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)

      setIsOpen(false)
      setTimeLeft(0)
      onSignOut()
    },
    [onSignOut],
  )

  // Start session timer
  const startSessionTimer = useCallback(() => {
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current)
    }

    sessionTimerRef.current = setTimeout(() => {
      setReason("session")
      setTimeLeft(warningTime)
      setIsOpen(true)
    }, sessionDuration - warningTime)
  }, [sessionDuration, warningTime])

  // Reset idle timer on user activity
  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = Date.now()

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }

    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current)
    }

    // Set warning timer (show modal before actual timeout)
    warningTimerRef.current = setTimeout(() => {
      setReason("idle")
      setTimeLeft(warningTime)
      setIsOpen(true)
    }, idleTimeout - warningTime)
  }, [idleTimeout, warningTime])

  // Handle continue session
  const handleContinueSession = useCallback(() => {
    console.log("Continue session clicked")

    setIsOpen(false)
    setTimeLeft(0)

    if (countdownRef.current) {
      clearInterval(countdownRef.current)
    }

    // Reset session start time
    sessionStartRef.current = Date.now()

    // Restart timers
    resetIdleTimer()
    startSessionTimer()

    onContinueSession()
  }, [onContinueSession, resetIdleTimer, startSessionTimer])

  // Set up activity listeners
  useEffect(() => {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]

    const handleActivity = () => {
      // Only reset timer if modal is NOT open
      if (!isOpen) {
        resetIdleTimer()
      }
    }

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true)
    })

    // Initialize timers only if modal is not open
    if (!isOpen) {
      resetIdleTimer()
      startSessionTimer()
    }

    return () => {
      // Cleanup event listeners
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [resetIdleTimer, startSessionTimer, isOpen])

  // Handle countdown when modal opens
  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      console.log("Starting countdown with time:", timeLeft)

      // Clear any existing countdown
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }

      // Record when countdown started
      countdownStartTimeRef.current = Date.now()
      const initialTime = timeLeft

      countdownRef.current = setInterval(() => {
        const elapsed = Date.now() - countdownStartTimeRef.current
        const remaining = Math.max(0, initialTime - elapsed)

        if (remaining <= 0) {
          console.log("Countdown finished, signing out")
          clearInterval(countdownRef.current!)
          handleTimeout(reason)
        } else {
          setTimeLeft(remaining)
        }
      }, 100) // Update more frequently for smoother countdown

      return () => {
        if (countdownRef.current) {
          clearInterval(countdownRef.current)
        }
      }
    }
  }, [isOpen, reason, handleTimeout]) // Removed timeLeft from dependencies to prevent restart

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current)
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const progressValue = Math.max(0, (timeLeft / warningTime) * 100)

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {reason === "idle" ? (
              <>
                <Clock className="h-5 w-5 text-orange-500" />
                Session Timeout Warning
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Session Expired
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {reason === "idle"
              ? "You've been inactive for a while. Your session will expire soon for security reasons."
              : "Your session has expired for security reasons. Please sign in again to continue."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-red-600">{formatTime(timeLeft)}</div>
            <div className="text-sm text-muted-foreground">Time remaining</div>
          </div>

          <Progress value={progressValue} className="w-full" />
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => {
              console.log("Sign out clicked")
              handleTimeout(reason)
            }}
            className="w-full sm:w-auto"
          >
            Sign Out
          </Button>
          <Button onClick={handleContinueSession} className="w-full sm:w-auto">
            Continue Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
