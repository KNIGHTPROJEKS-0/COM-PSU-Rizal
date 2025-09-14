import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    user: "Alice Cooper",
    action: "completed task",
    target: "Brand Guidelines Review",
    time: "2 hours ago",
    avatar: "/woman-designer.png",
    type: "completion",
  },
  {
    id: 2,
    user: "Bob Wilson",
    action: "started project",
    target: "Website Redesign",
    time: "4 hours ago",
    avatar: "/man-developer.png",
    type: "start",
  },
  {
    id: 3,
    user: "Carol Davis",
    action: "uploaded files to",
    target: "Marketing Campaign",
    time: "6 hours ago",
    avatar: "/woman-manager.png",
    type: "upload",
  },
  {
    id: 4,
    user: "David Brown",
    action: "commented on",
    target: "Client Presentation",
    time: "8 hours ago",
    avatar: "/man-designer.png",
    type: "comment",
  },
  {
    id: 5,
    user: "Eve Martinez",
    action: "scheduled meeting for",
    target: "Project Kickoff",
    time: "1 day ago",
    avatar: "/woman-executive.png",
    type: "meeting",
  },
]

export function TeamActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Activity</CardTitle>
        <CardDescription>Recent team member activities and updates</CardDescription>
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
                    activity.type === "completion"
                      ? "border-green-200 text-green-700"
                      : activity.type === "start"
                        ? "border-blue-200 text-blue-700"
                        : activity.type === "upload"
                          ? "border-purple-200 text-purple-700"
                          : activity.type === "comment"
                            ? "border-orange-200 text-orange-700"
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
