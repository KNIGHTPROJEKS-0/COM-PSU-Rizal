import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { MessageCircle, UserPlus, TrendingUp } from "lucide-react"

const students = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@university.edu",
    attendance: 95,
    grade: "A",
    status: "active",
    avatar: "/student-1.png",
    lastSeen: "2 hours ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@university.edu",
    attendance: 88,
    grade: "B+",
    status: "active",
    avatar: "/student-2.png",
    lastSeen: "1 day ago",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "e.rodriguez@university.edu",
    attendance: 92,
    grade: "A-",
    status: "online",
    avatar: "/student-3.png",
    lastSeen: "Online now",
  },
  {
    id: 4,
    name: "David Kim",
    email: "d.kim@university.edu",
    attendance: 76,
    grade: "C+",
    status: "needs_attention",
    avatar: "/student-4.png",
    lastSeen: "3 days ago",
  },
]

export function StudentsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Students</span>
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {student.status === "online" && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">Attendance:</span>
                    <Progress value={student.attendance} className="w-16 h-2" />
                    <span className="text-xs font-medium">{student.attendance}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Badge
                  variant={
                    student.grade.startsWith("A") ? "default" : student.grade.startsWith("B") ? "secondary" : "outline"
                  }
                  className={
                    student.grade.startsWith("A")
                      ? "bg-green-100 text-green-800"
                      : student.grade.startsWith("B")
                        ? "bg-blue-100 text-blue-800"
                        : ""
                  }
                >
                  {student.grade}
                </Badge>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{student.lastSeen}</p>
                  {student.status === "needs_attention" && (
                    <Badge variant="destructive" className="mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Follow up
                    </Badge>
                  )}
                </div>

                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
