"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  Users, 
  FileText, 
  Video, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Calendar,
  BookOpen,
  GraduationCap,
  Upload,
  Download
} from "lucide-react"
import { useRouter } from "next/navigation"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  href: string
  color: string
}

const quickActions: QuickAction[] = [
  {
    id: "create-class",
    title: "Create Class",
    description: "Set up a new class with students and schedule",
    icon: BookOpen,
    href: "/dashboard/admin/classes/new",
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "add-student",
    title: "Add Student",
    description: "Enroll a new student in the system",
    icon: GraduationCap,
    href: "/dashboard/admin/students/new",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "upload-document",
    title: "Upload Document",
    description: "Share files with students and faculty",
    icon: Upload,
    href: "/dashboard/documents/upload",
    color: "from-green-500 to-green-600"
  },
  {
    id: "schedule-meeting",
    title: "Schedule Meeting",
    description: "Create a virtual meeting session",
    icon: Video,
    href: "/meeting/new",
    color: "from-red-500 to-red-600"
  },
  {
    id: "create-announcement",
    title: "Create Announcement",
    description: "Share important updates with everyone",
    icon: MessageSquare,
    href: "/dashboard/admin/announcements/new",
    color: "from-yellow-500 to-yellow-600"
  },
  {
    id: "view-analytics",
    title: "View Analytics",
    description: "Check performance metrics and reports",
    icon: BarChart3,
    href: "/dashboard/admin/analytics",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    id: "manage-schedule",
    title: "Manage Schedule",
    description: "Update class schedules and timetables",
    icon: Calendar,
    href: "/dashboard/admin/schedule",
    color: "from-pink-500 to-pink-600"
  },
  {
    id: "system-settings",
    title: "System Settings",
    description: "Configure system preferences and options",
    icon: Settings,
    href: "/dashboard/admin/settings",
    color: "from-gray-500 to-gray-600"
  }
]

export default function QuickActions() {
  const router = useRouter()

  const handleActionClick = (href: string) => {
    router.push(href)
  }

  return (
    <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
        <CardDescription className="text-gray-300">
          Common administrative tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
              onClick={() => handleActionClick(action.href)}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {action.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
