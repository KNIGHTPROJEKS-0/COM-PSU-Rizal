import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    user: "Sarah Johnson",
    action: "submitted assignment for",
    target: "Data Structures Project",
    time: "15 minutes ago",
    avatar: "/student-1.png",
    type: "submission",
  },
  {
    id: 2,
    user: "Dr. Rodriguez",
    action: "started meeting for",
    target: "CS 101 - Algorithms",
    time: "1 hour ago",
    avatar: "/instructor-1.png",
    type: "meeting",
  },
  {
    id: 3,
    user: "Michael Chen",
    action: "joined class",
    target: "Web Development",
    time: "2 hours ago",
    avatar: "/student-2.png",
    type: "attendance",
  },
  {
    id: 4,
    user: "Prof. Smith",
    action: "uploaded materials to",
    target: "Database Systems",
    time: "3 hours ago",
    avatar: "/instructor-2.png",
    type: "upload",
  },
  {
    id: 5,
    user: "Emily Rodriguez",
    action: "asked question in",
    target: "Programming Fundamentals",
    time: "4 hours ago",
    avatar: "/student-3.png",
    type: "question",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest student and instructor activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {activity.user
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    activity.type === "submission"
                      ? "border-green-200 text-green-700"
                      : activity.type === "meeting"
                        ? "border-blue-200 text-blue-700"
                        : activity.type === "upload"
                          ? "border-purple-200 text-purple-700"
                          : activity.type === "question"
                            ? "border-orange-200 text-orange-700"
                            : activity.type === "attendance"
                              ? "border-teal-200 text-teal-700"
                              : "border-gray-200 text-gray-700"
                  }`}
                >
                  {activity.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
