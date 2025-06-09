"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import {
  Dialog as DialogPrimitive,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface CustomDialogProps {
  trigger: any
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  modal?: boolean
}

export function CustomDialog({
  trigger,
  title,
  description,
  children,
  className,
  open,
  onOpenChange,
  modal,
}: CustomDialogProps) {
  return (
    <>
      {/* Backdrop overlay that dims the background */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40" aria-hidden="true" />
      )}

      <DialogPrimitive open={open} onOpenChange={onOpenChange} >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className={cn("z-50 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", className)}>
          {title && (
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
          )}
          {children}
        </DialogContent>
      </DialogPrimitive>
    </>
  )
}
