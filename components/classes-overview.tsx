import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, Users, Clock, Calendar } from "lucide-react"

const classes = [
  {
    id: 1,
    name: "Computer Science 101",
    instructor: "Dr. Rodriguez",
    students: 32,
    nextMeeting: "Today, 2:00 PM",
    status: "scheduled",
    avatar: "/instructor-1.png",
  },
  {
    id: 2,
    name: "Data Structures",
    instructor: "Prof. Chen",
    students: 28,
    nextMeeting: "Tomorrow, 10:00 AM",
    status: "upcoming",
    avatar: "/instructor-2.png",
  },
  {
    id: 3,
    name: "Web Development",
    instructor: "Dr. Smith",
    students: 35,
    nextMeeting: "Live Now",
    status: "live",
    avatar: "/instructor-3.png",
  },
  {
    id: 4,
    name: "Database Systems",
    instructor: "Prof. Johnson",
    students: 24,
    nextMeeting: "Friday, 3:00 PM",
    status: "scheduled",
    avatar: "/instructor-4.png",
  },
]

export function ClassesOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Active Classes</span>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            View Schedule
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {classes.map((classItem) => (
            <div key={classItem.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={classItem.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {classItem.instructor
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{classItem.name}</p>
                  <p className="text-sm text-muted-foreground">{classItem.instructor}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{classItem.students}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge
                    variant={classItem.status === "live" ? "default" : "secondary"}
                    className={classItem.status === "live" ? "bg-green-100 text-green-800" : ""}
                  >
                    {classItem.status === "live" && (
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                    )}
                    {classItem.nextMeeting}
                  </Badge>

                  {classItem.status === "live" ? (
                    <Button size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Join
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
