"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { useExportImport } from "@/hooks/use-export-import"
import { financeDb } from "@/db/offline/Dexie/databases/financeDb"
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb"
import { auditDb } from "@/db/offline/Dexie/databases/auditDb"
import { hrDb } from "@/db/offline/Dexie/databases/hrDb"
import { attachmentDb } from "@/components/forms/form-attachments"

export default function ExportImportUI() {
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
  const [exportStatus, setExportStatus] = useState<"idle" | "success">("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const [pendingImportData, setPendingImportData] = useState<any>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [fileName, setFileName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const { exportToJSON, importFromJSON } = useExportImport([financeDb,dexieDb,auditDb,hrDb,attachmentDb]);

  const handleExportToJSON = () => {
    try {
      exportToJSON;
      setExportStatus("success")
      setStatusMessage("Data exported successfully!")
      setTimeout(() => setExportStatus("idle"), 3000)
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "application/json") {
      setImportStatus("error")
      setStatusMessage("Please select a valid JSON file.")
      setTimeout(() => setImportStatus("idle"), 3000)
      return
    }

    const reader = new FileReader()
    debugger;
    reader.onload = (e) => {
      try {
        // Store the data for confirmation
        setFileName(file.name)
        setFile(file)
        setShowConfirmation(true)
        setImportStatus("idle")
        setStatusMessage("")
      } catch (error) {
        setImportStatus("error")
        setStatusMessage("Invalid JSON file format.")
        setTimeout(() => setImportStatus("idle"), 3000)
      }
    }

    reader.readAsText(file)
    event.target.value = ""
  }

  const confirmImport = () => {
    try {
      // Here you would typically process the imported data
      console.log("Confirmed import data:", pendingImportData)
        if (file) {
            importFromJSON(file);
        }
      setImportStatus("success")
      setStatusMessage(`Successfully imported data from ${fileName}`)
      setShowConfirmation(false)
      setPendingImportData(null)
      setFileName("")
      setTimeout(() => setImportStatus("idle"), 3000)
    } catch (error) {
      setImportStatus("error")
      setStatusMessage("Failed to import data.")
      setTimeout(() => setImportStatus("idle"), 3000)
    }
  }

  const cancelImport = () => {
    setShowConfirmation(false)
    setPendingImportData(null)
    setFileName("")
    setImportStatus("idle")
    setStatusMessage("")
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>Export your data to JSON format or import data from a JSON file</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <Label className="text-base font-medium">Export Data</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Download your current data as a JSON file for backup or transfer purposes.
            </p>
            <Button onClick={exportToJSON} className="w-full sm:w-auto" disabled={exportStatus === "success"}>
              {exportStatus === "success" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Exported Successfully
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export to JSON
                </>
              )}
            </Button>
          </div>

          <Separator />

          {/* Import Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <Label className="text-base font-medium">Import Data</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Select a JSON file to import data. You'll be able to review the data before confirming the import.
            </p>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="import-file">JSON File</Label>
              <Input
                id="import-file"
                type="file"
                accept="application/json,.json"
                onChange={handleImport}
                className="cursor-pointer"
                disabled={showConfirmation}
              />
            </div>

            {/* Confirmation Section */}
            {showConfirmation && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Confirm Import</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Ready to import data from <span className="font-medium">{fileName}</span>
                </p>

                <div className="flex gap-2">
                  <Button onClick={confirmImport} size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Import
                  </Button>
                  <Button onClick={cancelImport} variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {(importStatus !== "idle" || exportStatus === "success") && (
            <Alert className={importStatus === "error" ? "border-destructive" : "border-green-500"}>
              {importStatus === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
