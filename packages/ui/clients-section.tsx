import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MoreHorizontal } from "lucide-react"

const clients = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechCorp Inc.",
    email: "sarah@techcorp.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
    avatar: "/professional-woman-diverse.png",
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "StartupXYZ",
    email: "michael@startupxyz.com",
    phone: "+1 (555) 987-6543",
    status: "Active",
    avatar: "/professional-man.png",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    company: "RetailCo",
    email: "emily@retailco.com",
    phone: "+1 (555) 456-7890",
    status: "Pending",
    avatar: "/professional-woman-manager.png",
  },
  {
    id: 4,
    name: "David Kim",
    company: "FinanceFlow",
    email: "david@financeflow.com",
    phone: "+1 (555) 321-0987",
    status: "Active",
    avatar: "/professional-executive-man.png",
  },
]

export function ClientsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Clients</CardTitle>
        <CardDescription>Your most recent client interactions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {clients.map((client) => (
          <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={client.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-sm">{client.name}</h4>
                  <Badge
                    variant={client.status === "Active" ? "default" : "secondary"}
                    className={
                      client.status === "Active"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    }
                  >
                    {client.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{client.company}</p>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{client.phone}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
