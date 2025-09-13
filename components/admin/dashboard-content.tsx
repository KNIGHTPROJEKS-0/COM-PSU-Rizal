"use client"

import OverviewStats from "./overview-stats"
import ClassesOverview from "./classes-overview"
import RecentActivity from "./recent-activity"
import QuickActions from "./quick-actions"
import AnalyticsChart from "./analytics-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, MessageSquare, Video, Plus, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDashboardContent() {
  const router = useRouter()

  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Welcome to the COM-PSU-Rizal administrative dashboard. Manage classes, students, and academic content.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => router.push('/dashboard/admin/classes/new')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Class
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push('/dashboard/admin/analytics')}
            className="border-gray-300 dark:border-gray-600"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <OverviewStats />

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card 
          className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23] hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => router.push('/dashboard/social')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-white text-lg">
              <MessageSquare className="h-5 w-5 mr-2 text-purple-400" />
              Social Media
            </CardTitle>
            <CardDescription className="text-gray-300">Connect with students and share updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">Access the integrated social media platform to engage with the academic community.</p>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23] hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => router.push('/dashboard/documents')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-white text-lg">
              <FileText className="h-5 w-5 mr-2 text-blue-400" />
              Documents
            </CardTitle>
            <CardDescription className="text-gray-300">Manage and share academic documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">Upload, organize, and collaborate on documents with students and faculty.</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23] hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => router.push('/meeting')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-white text-lg">
              <Video className="h-5 w-5 mr-2 text-green-400" />
              Meetings
            </CardTitle>
            <CardDescription className="text-gray-300">Schedule and manage virtual meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">Create and join virtual meetings with students and faculty members.</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23] hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => router.push('/dashboard/admin/students')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-white text-lg">
              <Users className="h-5 w-5 mr-2 text-yellow-400" />
              Students
            </CardTitle>
            <CardDescription className="text-gray-300">Manage student enrollment and records</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">View and manage student information, enrollment status, and academic records.</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column - 2/3 width on desktop */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 w-full min-w-0">
          <ClassesOverview />
          <AnalyticsChart />
        </div>

        {/* Right Column - 1/3 width on desktop */}
        <div className="space-y-4 sm:space-y-6 w-full min-w-0">
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
