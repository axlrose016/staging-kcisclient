"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AlertOptions {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
}

interface AlertContextType {
  show: (options: AlertOptions) => Promise<boolean>
  confirm: (options: Omit<AlertOptions, "confirmText" | "cancelText">) => Promise<boolean>
  info: (title: string, description: string) => Promise<boolean>
  warning: (title: string, description: string) => Promise<boolean>
  danger: (title: string, description: string) => Promise<boolean>
}

const AlertContext = createContext<AlertContextType | null>(null)

interface AlertState extends AlertOptions {
  open: boolean
  resolve?: (value: boolean) => void
}

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    title: "",
    description: "",
    confirmText: "OK",
    cancelText: "Cancel",
    variant: "default",
  })

  const showAlert = (options: AlertOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setAlertState({
        ...options,
        open: true,
        confirmText: options.confirmText || "OK",
        cancelText: options.cancelText || "Cancel",
        resolve,
      })
    })
  }

  const handleConfirm = () => {
    alertState.resolve?.(true)
    setAlertState((prev) => ({ ...prev, open: false }))
  }

  const handleCancel = () => {
    alertState.resolve?.(false)
    setAlertState((prev) => ({ ...prev, open: false }))
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      alertState.resolve?.(false)
    }
    setAlertState((prev) => ({ ...prev, open }))
  }

  const alertMethods: AlertContextType = {
    show: showAlert,
    confirm: (options) =>
      showAlert({
        ...options,
        confirmText: "Confirm",
        cancelText: "Cancel",
      }),
    info: (title, description) =>
      showAlert({
        title,
        description,
        confirmText: "OK",
        variant: "default",
      }),
    warning: (title, description) =>
      showAlert({
        title,
        description,
        confirmText: "Proceed",
        cancelText: "Cancel",
        variant: "default",
      }),
    danger: (title, description) =>
      showAlert({
        title,
        description,
        confirmText: "Delete",
        cancelText: "Cancel",
        variant: "destructive",
      }),
  }

  return (
    <AlertContext.Provider value={alertMethods}>
      {children}
      <AlertDialog open={alertState.open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertState.title}</AlertDialogTitle>
            <AlertDialogDescription>{alertState.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>{alertState.cancelText}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={alertState.variant === "destructive" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {alertState.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  )
}

export function useAlert(): AlertContextType {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider")
  }
  return context
}
