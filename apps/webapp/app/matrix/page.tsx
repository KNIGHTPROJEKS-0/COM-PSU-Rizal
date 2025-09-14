"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const matrixLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()_+".split("")

const MatrixRain = () => {
  const columns = Array(25).fill(1)
  return (
    <div className="absolute inset-0 flex justify-around overflow-hidden">
      {columns.map((_, i) => (
        <motion.div
          key={i}
          className="text-green-500 text-xs"
          initial={{ y: -50 }}
          animate={{ y: "100vh" }}
          transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear" }}
        >
          {Array(50)
            .fill(1)
            .map((_, j) => (
              <div key={j}>{matrixLetters[Math.floor(Math.random() * matrixLetters.length)]}</div>
            ))}
        </motion.div>
      ))}
    </div>
  )
}

export default function MatrixPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth")
    }, 5000) // Navigate to auth page after 5 seconds

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="bg-black min-h-screen flex items-center justify-center text-white relative">
      <MatrixRain />
      <div className="relative z-10 text-center">
        <motion.h1
          className="text-4xl font-bold text-green-400 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
        >
          v0-COM-NextJS-Electron-Matrix
        </motion.h1>
        <motion.p
          className="text-lg text-green-300 mt-4 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
        >
          Initializing COM Interface...
        </motion.p>
      </div>
    </div>
  )
}
