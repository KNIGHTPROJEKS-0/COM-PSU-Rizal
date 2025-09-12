"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", attendance: 88, students: 240 },
  { month: "Feb", attendance: 92, students: 245 },
  { month: "Mar", attendance: 85, students: 238 },
  { month: "Apr", attendance: 94, students: 250 },
  { month: "May", attendance: 91, students: 248 },
  { month: "Jun", attendance: 93, students: 252 },
]

const chartConfig = {
  attendance: {
    label: "Attendance Rate (%)",
    color: "hsl(var(--chart-1))",
  },
  students: {
    label: "Active Students",
    color: "hsl(var(--chart-2))",
  },
}

export function AttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance & Enrollment Overview</CardTitle>
        <CardDescription>Monthly attendance rates and student enrollment trends</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="attendance"
                stackId="1"
                stroke="var(--color-chart-1)"
                fill="var(--color-chart-1)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="students"
                stackId="2"
                stroke="var(--color-chart-2)"
                fill="var(--color-chart-2)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
