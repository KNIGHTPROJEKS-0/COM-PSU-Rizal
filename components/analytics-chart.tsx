"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", revenue: 12000, projects: 8 },
  { month: "Feb", revenue: 15000, projects: 12 },
  { month: "Mar", revenue: 18000, projects: 15 },
  { month: "Apr", revenue: 22000, projects: 18 },
  { month: "May", revenue: 25000, projects: 22 },
  { month: "Jun", revenue: 28000, projects: 25 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  projects: {
    label: "Projects",
    color: "hsl(var(--chart-2))",
  },
}

export function AnalyticsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue & Projects Overview</CardTitle>
        <CardDescription>Monthly revenue and project completion trends</CardDescription>
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
                dataKey="revenue"
                stackId="1"
                stroke="var(--color-chart-1)"
                fill="var(--color-chart-1)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="projects"
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
