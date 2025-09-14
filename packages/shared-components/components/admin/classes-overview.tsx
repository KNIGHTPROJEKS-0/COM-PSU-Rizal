"use client"

import { BookOpen, Users, FileText, Calendar, Plus, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface Class {
  id: string
  name: string
  code: string
  students: number
  assignments: number
  nextMeeting: string
  status: "active" | "upcoming" | "completed"
  instructor: string
}

const classes: Class[] = [
  {
    id: "1",
    name: "Mathematics 101",
    code: "MATH-101",
    students: 24,
    assignments: 5,
    nextMeeting: "Tomorrow 10:00 AM",
    status: "active",
    instructor: "Dr. Smith"
  },
  {
    id: "2",
    name: "Physics 201",
    code: "PHYS-201",
    students: 18,
    assignments: 3,
    nextMeeting: "Friday 2:00 PM",
    status: "active",
    instructor: "Prof. Johnson"
  },
  {
    id: "3",
    name: "Computer Science 301",
    code: "CS-301",
    students: 32,
    assignments: 7,
    nextMeeting: "Monday 9:00 AM",
    status: "active",
    instructor: "Dr. Williams"
  },
  {
    id: "4",
    name: "English Literature",
    code: "ENG-201",
    students: 20,
    assignments: 4,
    nextMeeting: "Next Week",
    status: "upcoming",
    instructor: "Prof. Brown"
  }
]

const getStatusColor = (status: Class["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-500/20 text-green-400"
    case "upcoming":
      return "bg-blue-500/20 text-blue-400"
    case "completed":
      return "bg-gray-500/20 text-gray-400"
    default:
      return "bg-gray-500/20 text-gray-400"
  }
}

export default function ClassesOverview() {
  const router = useRouter()

  const handleCreateClass = () => {
    router.push('/dashboard/admin/classes/new')
  }

  const handleViewClass = (classId: string) => {
    router.push(`/dashboard/admin/classes/${classId}`)
  }

  return (
    <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Classes Overview</CardTitle>
            <CardDescription className="text-gray-300">Manage your active classes</CardDescription>
          </div>
          <Button 
            onClick={handleCreateClass}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Class
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {classes.length > 0 ? (
          <div className="space-y-4">
            {classes.map((cls) => (
              <div 
                key={cls.id} 
                className="p-4 rounded-lg border border-gray-200 dark:border-[#1F1F23] hover:bg-gray-50 dark:hover:bg-[#1F1F23]/50 transition-colors cursor-pointer"
                onClick={() => handleViewClass(cls.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-lg text-white">{cls.name}</h3>
                      <Badge variant="secondary" className={getStatusColor(cls.status)}>
                        {cls.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{cls.code} • {cls.instructor}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {cls.students} students
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {cls.assignments} assignments
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {cls.nextMeeting}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle more options
                    }}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-300">No classes yet</h3>
            <p className="mt-1 text-sm text-gray-400">
              Get started by creating a new class.
            </p>
            <div className="mt-6">
              <Button 
                onClick={handleCreateClass}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Class
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
