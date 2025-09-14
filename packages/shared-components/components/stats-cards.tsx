import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, GraduationCap, Video, Clock } from "lucide-react"

const stats = [
  {
    title: "Total Students",
    value: "245",
    change: "+12",
    trend: "up",
    icon: Users,
    description: "enrolled this semester",
  },
  {
    title: "Active Classes",
    value: "18",
    change: "+2",
    trend: "up",
    icon: GraduationCap,
    description: "new this week",
  },
  {
    title: "Live Meetings",
    value: "3",
    change: "0",
    trend: "neutral",
    icon: Video,
    description: "currently active",
  },
  {
    title: "Attendance Rate",
    value: "92.5%",
    change: "+3.2%",
    trend: "up",
    icon: Clock,
    description: "this month",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {stat.trend !== "neutral" && (
                <Badge
                  variant={stat.trend === "up" ? "default" : "secondary"}
                  className={`flex items-center space-x-1 ${
                    stat.trend === "up"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  }`}
                >
                  {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{stat.change}</span>
                </Badge>
              )}
              <span>{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
