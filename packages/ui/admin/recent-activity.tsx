"use client"

import { FileText, Users, Award, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ActivityItem {
  id: string
  type: "assignment" | "enrollment" | "grading" | "meeting" | "document" | "alert"
  title: string
  description: string
  time: string
  status?: "completed" | "pending" | "urgent"
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "assignment",
    title: "New assignment submitted",
    description: "Mathematics 101 - Problem Set 3",
    time: "2 minutes ago",
    status: "pending"
  },
  {
    id: "2",
    type: "enrollment",
    title: "New student enrolled",
    description: "John Smith in Physics 201",
    time: "1 hour ago",
    status: "completed"
  },
  {
    id: "3",
    type: "grading",
    title: "Assignment graded",
    description: "CS 301 - Final Project",
    time: "3 hours ago",
    status: "completed"
  },
  {
    id: "4",
    type: "meeting",
    title: "Class meeting reminder",
    description: "Mathematics 101 - Tomorrow 10:00 AM",
    time: "1 day ago",
    status: "pending"
  },
  {
    id: "5",
    type: "document",
    title: "Document shared",
    description: "Course syllabus updated",
    time: "2 days ago",
    status: "completed"
  },
  {
    id: "6",
    type: "alert",
    title: "System maintenance",
    description: "Scheduled for this weekend",
    time: "3 days ago",
    status: "urgent"
  }
]

const getActivityIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "assignment":
      return <FileText className="h-4 w-4" />
    case "enrollment":
      return <Users className="h-4 w-4" />
    case "grading":
      return <Award className="h-4 w-4" />
    case "meeting":
      return <Clock className="h-4 w-4" />
    case "document":
      return <FileText className="h-4 w-4" />
    case "alert":
      return <AlertCircle className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

const getStatusColor = (status?: ActivityItem["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-500/20 text-green-400"
    case "pending":
      return "bg-yellow-500/20 text-yellow-400"
    case "urgent":
      return "bg-red-500/20 text-red-400"
    default:
      return "bg-gray-500/20 text-gray-400"
  }
}

const getStatusIcon = (status?: ActivityItem["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-3 w-3" />
    case "pending":
      return <Clock className="h-3 w-3" />
    case "urgent":
      return <AlertCircle className="h-3 w-3" />
    default:
      return <Clock className="h-3 w-3" />
  }
}

export default function RecentActivity() {
  return (
    <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
        <CardDescription className="text-gray-300">Latest updates from your classes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="flex-shrink-0">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full ${getStatusColor(activity.status)}`}>
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-300">
                    {activity.title}
                  </p>
                  {activity.status && (
                    <Badge variant="secondary" className={`text-xs ${getStatusColor(activity.status)}`}>
                      {getStatusIcon(activity.status)}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
