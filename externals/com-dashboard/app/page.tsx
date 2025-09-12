import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { ClassesOverview } from "@/components/classes-overview"
import { StudentsSection } from "@/components/students-section"
import { AttendanceChart } from "@/components/attendance-chart"
import { RecentActivity } from "@/components/recent-activity"

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        <DashboardHeader />
        <StatsCards />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <AttendanceChart />
          </div>
          <div className="col-span-3">
            <RecentActivity />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <ClassesOverview />
          <StudentsSection />
        </div>
      </div>
    </DashboardLayout>
  )
}
