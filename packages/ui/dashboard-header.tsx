import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Video } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-balance">COM Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your academic collaboration overview.</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students, classes..." className="pl-10 w-64" />
        </div>

        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
            5
          </Badge>
        </Button>

        <Button size="sm">
          <Video className="h-4 w-4 mr-2" />
          Start Meeting
        </Button>
      </div>
    </div>
  )
}
