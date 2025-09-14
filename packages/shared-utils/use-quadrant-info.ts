import type { QuadrantType } from "@/lib/types"

interface QuadrantInfo {
  title: string
  description: string
  color: string
  iconColor: string
  tips: string[]
}

export function useQuadrantInfo() {
  const quadrantInfo: Record<QuadrantType, QuadrantInfo> = {
    "urgent-important": {
      title: "Do First",
      description: "Urgent & Important",
      color: "bg-red-500/20 border-red-500",
      iconColor: "text-red-500",
      tips: [
        "Do these tasks as soon as possible",
        "These are critical activities",
        "They require immediate attention",
        "Often these are crises or deadlines",
      ],
    },
    "not-urgent-important": {
      title: "Schedule",
      description: "Not Urgent & Important",
      color: "bg-blue-500/20 border-blue-500",
      iconColor: "text-blue-500",
      tips: [
        "Schedule time to do these tasks",
        "These contribute to long-term goals",
        "Plan ahead to prevent these becoming urgent",
        "Focus on these for personal growth",
      ],
    },
    "urgent-not-important": {
      title: "Delegate",
      description: "Urgent & Not Important",
      color: "bg-yellow-500/20 border-yellow-500",
      iconColor: "text-yellow-500",
      tips: [
        "Delegate these tasks if possible",
        "These are interruptions and distractions",
        "Minimize time spent on these",
        "Can you automate or simplify these?",
      ],
    },
    "not-urgent-not-important": {
      title: "Eliminate",
      description: "Not Urgent & Not Important",
      color: "bg-gray-500/20 border-gray-500",
      iconColor: "text-gray-500",
      tips: [
        "Eliminate these tasks when possible",
        "These are time-wasters",
        "Say no to these activities",
        "Be mindful of how much time you spend here",
      ],
    },
  }

  const getQuadrantTitle = (quadrant: QuadrantType): string => {
    return quadrantInfo[quadrant].title
  }

  const getQuadrantDescription = (quadrant: QuadrantType): string => {
    return quadrantInfo[quadrant].description
  }

  const getQuadrantColor = (quadrant: QuadrantType): string => {
    return quadrantInfo[quadrant].color
  }

  const getQuadrantIconColor = (quadrant: QuadrantType): string => {
    return quadrantInfo[quadrant].iconColor
  }

  return {
    quadrantInfo,
    getQuadrantTitle,
    getQuadrantDescription,
    getQuadrantColor,
    getQuadrantIconColor,
  }
}
