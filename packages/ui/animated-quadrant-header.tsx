"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface AnimatedQuadrantHeaderProps {
  title: string
  description: string
  iconColor: string
}

export default function AnimatedQuadrantHeader({ title, description, iconColor }: AnimatedQuadrantHeaderProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const descriptionVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2, ease: "easeOut" } },
  }

  const dotVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { duration: 0.3, type: "spring", stiffness: 500 } },
  }

  return (
    <div className="flex items-start gap-2">
      <motion.div
        className={`h-3 w-3 rounded-full ${iconColor.replace("text-", "bg-")}`}
        variants={dotVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      />
      <div>
        <motion.h2
          className="text-lg sm:text-xl font-bold truncate"
          variants={titleVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-xs sm:text-sm text-muted-foreground mt-1"
          variants={descriptionVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {description}
        </motion.p>
      </div>
    </div>
  )
}
