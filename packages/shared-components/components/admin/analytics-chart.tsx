"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, BookOpen, FileText, Award } from "lucide-react"

interface ChartData {
  month: string
  students: number
  classes: number
  assignments: number
}

const chartData: ChartData[] = [
  { month: "Jan", students: 1200, classes: 20, assignments: 45 },
  { month: "Feb", students: 1250, classes: 22, assignments: 52 },
  { month: "Mar", students: 1300, classes: 24, assignments: 48 },
  { month: "Apr", students: 1280, classes: 23, assignments: 55 },
  { month: "May", students: 1350, classes: 25, assignments: 60 },
  { month: "Jun", students: 1400, classes: 26, assignments: 65 },
]

const stats = [
  {
    title: "Total Students",
    value: "1,400",
    change: "+12.5%",
    changeType: "increase" as const,
    icon: Users,
    description: "vs last month"
  },
  {
    title: "Active Classes",
    value: "26",
    change: "+8.3%",
    changeType: "increase" as const,
    icon: BookOpen,
    description: "vs last month"
  },
  {
    title: "Assignments",
    value: "65",
    change: "+15.2%",
    changeType: "increase" as const,
    icon: FileText,
    description: "vs last month"
  },
  {
    title: "Completion Rate",
    value: "87%",
    change: "+2.1%",
    changeType: "increase" as const,
    icon: Award,
    description: "vs last month"
  }
]

export default function AnalyticsChart() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                {stat.changeType === "increase" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stat.changeType === "increase" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Placeholder */}
      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle className="text-white">Academic Performance Trends</CardTitle>
          <CardDescription className="text-gray-300">
            Monthly overview of students, classes, and assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-500 dark:text-gray-400">Chart visualization would go here</p>
              <p className="text-sm text-gray-400 mt-1">
                Integration with Chart.js or Recharts recommended
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
