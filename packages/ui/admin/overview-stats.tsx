"use client"

import type React from "react"
import { FileText, Eye, MessageSquare, Users, TrendingUp, TrendingDown, Calendar, ImageIcon, BookOpen, GraduationCap, Award, BarChart3 } from "lucide-react"

interface StatCard {
  title: string
  value: string
  change: string
  changeType: "increase" | "decrease"
  icon: React.ReactNode
  description: string
}

const stats: StatCard[] = [
  {
    title: "Total Classes",
    value: "24",
    change: "+12.5%",
    changeType: "increase",
    icon: <BookOpen className="h-4 w-4" />,
    description: "Active classes",
  },
  {
    title: "Total Students",
    value: "1,247",
    change: "+23.1%",
    changeType: "increase",
    icon: <GraduationCap className="h-4 w-4" />,
    description: "Enrolled students",
  },
  {
    title: "Faculty Members",
    value: "45",
    change: "+8.2%",
    changeType: "increase",
    icon: <Users className="h-4 w-4" />,
    description: "Active faculty",
  },
  {
    title: "Documents",
    value: "2,847",
    change: "+15.7%",
    changeType: "increase",
    icon: <FileText className="h-4 w-4" />,
    description: "Shared documents",
  },
  {
    title: "Assignments",
    value: "156",
    change: "+5.3%",
    changeType: "increase",
    icon: <Award className="h-4 w-4" />,
    description: "Pending grading",
  },
  {
    title: "Attendance Rate",
    value: "87%",
    change: "+2.1%",
    changeType: "increase",
    icon: <BarChart3 className="h-4 w-4" />,
    description: "This semester",
  },
]

export default function OverviewStats() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white dark:bg-[#0F0F12] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-[#1F1F23] hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between space-y-0 pb-2">
            <div className="text-gray-600 dark:text-gray-400 flex-shrink-0">{stat.icon}</div>
            <div className="flex items-center text-xs">
              {stat.changeType === "increase" ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1 flex-shrink-0" />
              )}
              <span className={`font-medium ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
                {stat.change}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="space-y-0.5">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-500">{stat.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
