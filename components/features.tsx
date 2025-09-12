"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Star, Video, Monitor, MessageCircle, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeaturesContent {
  title: string
  subtitle: string
}

const defaultContent: FeaturesContent = {
  title: "Why Choose Collaboration Online Meet for Your Academic Video Conferencing Needs",
  subtitle: "Discover our unique approach to seamless educational communication",
}

export function Features() {
  const [content, setContent] = useState<FeaturesContent>(defaultContent)

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("com-psu-rizal-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.features) {
          setContent(parsed.features)
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }
  }, [])

  return (
    <section id="features" className="container mx-auto px-4 py-16 sm:py-20">
      <h2 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        {content.title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Video Quality Card - Hidden on mobile */}
        <Card className="hidden md:block liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <p className="text-[11px] tracking-widest text-neutral-400">VIDEO QUALITY</p>
            <CardTitle className="mt-1 text-xl text-white">Crystal Clear HD Video Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10">
                <Image
                  src="/images/video-quality-1.png"
                  alt="High definition video call"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 240px, 45vw"
                  priority={false}
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10">
                <Image
                  src="/images/video-quality-2.png"
                  alt="Multiple participants in HD"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 240px, 45vw"
                  priority={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Features Card - Always visible */}
        <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <p className="text-[11px] tracking-widest text-neutral-400">KEY FEATURES</p>
            <CardTitle className="mt-1 text-xl text-white">
              Everything you need for seamless communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Video className="mt-0.5 h-5 w-5 text-orange-400" />
                  <div>
                    <h3 className="font-medium text-white">High-Quality Video</h3>
                    <p className="text-sm text-neutral-400">Experience crystal clear video calls with up to 1080p resolution</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Monitor className="mt-0.5 h-5 w-5 text-orange-400" />
                  <div>
                    <h3 className="font-medium text-white">Screen Sharing</h3>
                    <p className="text-sm text-neutral-400">Share your screen with participants for presentations and collaboration</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-5 w-5 text-orange-400" />
                  <div>
                    <h3 className="font-medium text-white">Real-Time Chat</h3>
                    <p className="text-sm text-neutral-400">Send messages, files, and emojis during your meetings</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="mt-0.5 h-5 w-5 text-orange-400" />
                  <div>
                    <h3 className="font-medium text-white">Large Meetings</h3>
                    <p className="text-sm text-neutral-400">Host meetings with up to 100 participants</p>
                  </div>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}