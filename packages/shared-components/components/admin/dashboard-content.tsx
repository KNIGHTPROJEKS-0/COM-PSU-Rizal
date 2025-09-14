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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white drop-shadow-md">COM: Admin Dashboard</h1>
          <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 font-medium drop-shadow">
            Welcome to the COM administrative dashboard. Manage classes, students, and academic content.
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
          className="bg-white dark:bg-[#0F0F12] bg-opacity-95 dark:bg-opacity-95 border-gray-200 dark:border-[#1F1F23] hover:shadow-md transition-shadow cursor-pointer shadow-lg"
          onClick={() => router.push('/dashboard/social')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-gray-900 dark:text-white text-lg font-bold drop-shadow-sm">
              <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
              Social Media
            </CardTitle>
            <CardDescription className="text-gray-800 dark:text-gray-200">Connect with students and share updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-800 dark:text-gray-200 drop-shadow-sm">Access the integrated social media platform to engage with the academic community.</p>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-white dark:bg-[#0F0F12] bg-opacity-90 dark:bg-opacity-90 border-gray-200 dark:border-[#1F1F23] hover:shadow-md transition-shadow cursor-pointer shadow-lg"
          onClick={() => router.push('/dashboard/documents')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-gray-900 dark:text-white text-lg font-bold drop-shadow-sm">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Documents
            </CardTitle>
            <CardDescription className="text-gray-800 dark:text-gray-200">Manage and share academic documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-800 dark:text-gray-200 drop-shadow-sm">Upload, organize, and collaborate on documents with students and faculty.</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-white dark:bg-[#0F0F12] bg-opacity-90 dark:bg-opacity-90 border-gray-200 dark:border-[#1F1F23] hover:shadow-md transition-shadow cursor-pointer shadow-lg"
          onClick={() => router.push('/meeting')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-gray-900 dark:text-white text-lg font-bold drop-shadow-sm">
              <Video className="h-5 w-5 mr-2 text-green-600" />
              Meetings
            </CardTitle>
            <CardDescription className="text-gray-800 dark:text-gray-200">Schedule and manage virtual meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-800 dark:text-gray-200 drop-shadow-sm">Create and join virtual meetings with students and faculty members.</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-white dark:bg-[#0F0F12] bg-opacity-90 dark:bg-opacity-90 border-gray-200 dark:border-[#1F1F23] hover:shadow-md transition-shadow cursor-pointer shadow-lg"
          onClick={() => router.push('/dashboard/admin/students')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-gray-900 dark:text-white text-lg font-bold drop-shadow-sm">
              <Users className="h-5 w-5 mr-2 text-yellow-600" />
              Students
            </CardTitle>
            <CardDescription className="text-gray-800 dark:text-gray-200">Manage student enrollment and records</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-800 dark:text-gray-200 drop-shadow-sm">View and manage student information, enrollment status, and academic records.</p>
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
