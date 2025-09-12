"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Video,
  BarChart3,
  Calendar,
  Settings,
  Menu,
  Plus,
  GraduationCap,
  FileText,
  Clock,
} from "lucide-react"

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, current: true },
  { name: "Students", icon: Users, current: false, count: 45 },
  { name: "Classes", icon: GraduationCap, current: false, count: 12 },
  { name: "Meetings", icon: Video, current: false, count: 3 },
  { name: "Attendance", icon: Clock, current: false },
  { name: "Grades", icon: BarChart3, current: false },
  { name: "Files", icon: FileText, current: false },
  { name: "Schedule", icon: Calendar, current: false },
  { name: "Settings", icon: Settings, current: false },
]

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        open ? "w-64" : "w-16",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {open && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
              <Video className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">COM Platform</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => onOpenChange(!open)} className="h-8 w-8 p-0">
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {open && (
          <div className="mb-4">
            <Button className="w-full justify-start" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Start Meeting
            </Button>
          </div>
        )}

        {navigation.map((item) => (
          <Button
            key={item.name}
            variant={item.current ? "secondary" : "ghost"}
            className={cn("w-full justify-start", !open && "justify-center px-2")}
            size="sm"
          >
            <item.icon className={cn("h-4 w-4", open && "mr-2")} />
            {open && (
              <>
                <span className="flex-1 text-left">{item.name}</span>
                {item.count && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.count}
                  </Badge>
                )}
              </>
            )}
          </Button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-4">
        <div className={cn("flex items-center", open ? "space-x-3" : "justify-center")}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/instructor-avatar.png" />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          {open && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Dr. Rodriguez</p>
              <p className="text-xs text-muted-foreground truncate">Computer Science</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
