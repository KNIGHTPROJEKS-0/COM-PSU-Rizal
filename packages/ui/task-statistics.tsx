"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { Task, QuadrantType } from "./eisenhower-matrix"

interface TaskStatisticsProps {
  tasks: Record<QuadrantType, Task[]>
  isDarkMode: boolean
}

export default function TaskStatistics({ tasks, isDarkMode }: TaskStatisticsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const quadrantColors = {
    "urgent-important": "#ef4444",
    "not-urgent-important": "#3b82f6",
    "urgent-not-important": "#eab308",
    "not-urgent-not-important": "#6b7280",
  }

  const quadrantNames = {
    "urgent-important": "Do First",
    "not-urgent-important": "Schedule",
    "urgent-not-important": "Delegate",
    "not-urgent-not-important": "Eliminate",
  }

  const getQuadrantData = () => {
    return Object.entries(tasks).map(([quadrant, quadrantTasks]) => ({
      name: quadrantNames[quadrant as QuadrantType],
      value: quadrantTasks.length,
      color: quadrantColors[quadrant as QuadrantType],
    }))
  }

  const getTagData = () => {
    const tagCounts: Record<string, number> = {}

    Object.values(tasks).forEach((quadrantTasks) => {
      quadrantTasks.forEach((task) => {
        if (task.tags) {
          task.tags.forEach((tag) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1
          })
        }
      })
    })

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ name: tag, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Top 10 tags
  }

  const getDeadlineData = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    let overdue = 0
    let dueToday = 0
    let dueTomorrow = 0
    let dueThisWeek = 0
    let dueLater = 0
    let noDeadline = 0

    Object.values(tasks).forEach((quadrantTasks) => {
      quadrantTasks.forEach((task) => {
        if (!task.deadline) {
          noDeadline++
        } else {
          const deadlineDate = new Date(task.deadline)
          deadlineDate.setHours(0, 0, 0, 0)

          if (deadlineDate < today) {
            overdue++
          } else if (deadlineDate.getTime() === today.getTime()) {
            dueToday++
          } else if (deadlineDate.getTime() === tomorrow.getTime()) {
            dueTomorrow++
          } else if (deadlineDate <= nextWeek) {
            dueThisWeek++
          } else {
            dueLater++
          }
        }
      })
    })

    return [
      { name: "Overdue", value: overdue, color: "#ef4444" },
      { name: "Due Today", value: dueToday, color: "#f97316" },
      { name: "Due Tomorrow", value: dueTomorrow, color: "#eab308" },
      { name: "Due This Week", value: dueThisWeek, color: "#3b82f6" },
      { name: "Due Later", value: dueLater, color: "#10b981" },
      { name: "No Deadline", value: noDeadline, color: "#6b7280" },
    ]
  }

  const quadrantData = getQuadrantData()
  const tagData = getTagData()
  const deadlineData = getDeadlineData()

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-2 rounded-md shadow-md border text-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-muted-foreground">{`Tasks: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Task Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="distribution">
          <TabsList className="mb-4">
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          </TabsList>

          <TabsContent value="distribution">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={quadrantData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {quadrantData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="tags">
            <div className="h-[300px]">
              {tagData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tagData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <XAxis type="number" tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }}
                      width={100}
                      tickFormatter={(value) => (value.length > 12 ? `${value.substring(0, 12)}...` : value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No tags found in your tasks
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="deadlines">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deadlineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {deadlineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
