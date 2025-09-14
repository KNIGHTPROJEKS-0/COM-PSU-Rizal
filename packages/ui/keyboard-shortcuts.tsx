"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Keyboard } from "lucide-react"

interface KeyboardShortcutsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: () => void
  onToggleView: () => void
  onToggleDarkMode: () => void
  onShowHelp: () => void
  onSearch: () => void
}

export default function KeyboardShortcuts({
  open,
  onOpenChange,
  onAddTask,
  onToggleView,
  onToggleDarkMode,
  onShowHelp,
  onSearch,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      // Keyboard shortcuts
      switch (e.key.toLowerCase()) {
        case "n":
          if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault()
            onAddTask()
          }
          break
        case "v":
          if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault()
            onToggleView()
          }
          break
        case "d":
          if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault()
            onToggleDarkMode()
          }
          break
        case "?":
          e.preventDefault()
          onOpenChange(!open)
          break
        case "/":
          e.preventDefault()
          onSearch()
          break
        case "h":
          if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault()
            onShowHelp()
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange, onAddTask, onToggleView, onToggleDarkMode, onShowHelp, onSearch])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Key</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono">N</TableCell>
                <TableCell>Add new task</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">V</TableCell>
                <TableCell>Toggle between grid and list view</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">D</TableCell>
                <TableCell>Toggle dark mode</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">/</TableCell>
                <TableCell>Focus search</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">H</TableCell>
                <TableCell>Show help/onboarding</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">?</TableCell>
                <TableCell>Show keyboard shortcuts</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
