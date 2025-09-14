"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { X } from "lucide-react"

interface DocumentSharingProps {
  sharedUsers: { email: string; permission: string }[]
  onAddUser: (email: string) => void
  onRemoveUser: (email: string) => void
  onChangePermission: (email: string, permission: string) => void
}

const DocumentSharing: React.FC<DocumentSharingProps> = ({
  sharedUsers,
  onAddUser,
  onRemoveUser,
  onChangePermission,
}) => {
  const [newEmail, setNewEmail] = React.useState("")

  const handleAddUser = () => {
    if (newEmail) {
      onAddUser(newEmail)
      setNewEmail("")
    }
  }

  const handleRemoveUser = (email: string) => {
    onRemoveUser(email)
  }

  const handleChangePermission = (email: string, permission: string) => {
    onChangePermission(email, permission)
  }

  return (
    <div>
      <div className="grid gap-4">
        <div>
          <Label htmlFor="email">Share with</Label>
          <div className="flex space-x-2">
            <Input
              id="email"
              placeholder="Email address"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <Button onClick={handleAddUser}>Add</Button>
          </div>
        </div>
        {sharedUsers.length > 0 && (
          <div>
            <Label>Shared with:</Label>
            <div className="mt-2 space-y-2">
              {sharedUsers.map((user) => (
                <div key={user.email} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {user.permission === "view" && "Can view"}
                          {user.permission === "edit" && "Can edit"}
                          {user.permission === "comment" && "Can comment"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleChangePermission(user.email, "view")}>
                          Can view
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangePermission(user.email, "comment")}>
                          Can comment
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangePermission(user.email, "edit")}>
                          Can edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRemoveUser(user.email)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentSharing
