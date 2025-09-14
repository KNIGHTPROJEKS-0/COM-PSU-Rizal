import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users } from "lucide-react"

const projects = [
  {
    id: 1,
    name: "Brand Redesign - TechCorp",
    client: "TechCorp Inc.",
    progress: 75,
    status: "On Track",
    dueDate: "Dec 15, 2024",
    team: [
      { name: "Alice", avatar: "/woman-designer.png" },
      { name: "Bob", avatar: "/man-developer.png" },
    ],
  },
  {
    id: 2,
    name: "Website Development",
    client: "StartupXYZ",
    progress: 45,
    status: "In Progress",
    dueDate: "Jan 20, 2025",
    team: [
      { name: "Carol", avatar: "/woman-developer.png" },
      { name: "David", avatar: "/man-designer.png" },
      { name: "Eve", avatar: "/woman-manager.png" },
    ],
  },
  {
    id: 3,
    name: "Marketing Campaign",
    client: "RetailCo",
    progress: 90,
    status: "Nearly Done",
    dueDate: "Dec 5, 2024",
    team: [{ name: "Frank", avatar: "/man-marketer.jpg" }],
  },
]

export function ProjectsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Projects</CardTitle>
        <CardDescription>Current project status and progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-medium text-sm">{project.name}</h4>
                <p className="text-xs text-muted-foreground">{project.client}</p>
              </div>
              <Badge
                variant={project.status === "On Track" ? "default" : "secondary"}
                className={
                  project.status === "On Track"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : project.status === "Nearly Done"
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      : ""
                }
              >
                {project.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{project.dueDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <div className="flex -space-x-1">
                  {project.team.map((member, index) => (
                    <Avatar key={index} className="h-5 w-5 border-2 border-background">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
