"use import { Card, CardContent, CardHeader, CardTitle } from '@com-psu-rizal/shared-components/ui/card';lient"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Star, Video, Monitor, MessageCircle, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeaturesContent {
  title: string
  subtitle: string
}

const defaultContent: FeaturesContent = {
  title: "Why Choose Collaboration Online Meet (COM) for Smarter Learning",
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
        {/* Unique Value Card - Hidden on mobile */}
        <Card className="hidden md:block liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <p className="text-[11px] tracking-widest text-neutral-400">UNIQUE VALUE</p>
            <CardTitle className="mt-1 text-xl text-white">Academic + Collaboration Focus:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10">
                <Image
                  src="/images/academic-1.png"
                  alt="Academic focused collaboration"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 240px, 45vw"
                  priority={false}
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10">
                <Image
                  src="/images/collaboration-2.png"
                  alt="Collaborative learning environment"
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
              Your complete solution for online learning and communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Users className="mt-0.5 h-5 w-5 text-orange-400" />
                  <div>
                    <h3 className="font-medium text-white">👩‍🏫 Academic-Centered Design</h3>
                    <p className="text-sm text-neutral-400">Built with students and faculty in mind—flexible schedules, easy file sharing, and attendance tracking.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Video className="mt-0.5 h-5 w-5 text-orange-400" />
                  <div>
                    <h3 className="font-medium text-white">🌐 Seamless Connectivity</h3>
                    <p className="text-sm text-neutral-400">Join or host meetings anytime, anywhere with stable, low-latency video and audio powered by WebRTC.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Monitor className="mt-0.5 h-5 w-5 text-orange-400" />
                  <div>
                    <h3 className="font-medium text-white">📂 Smart File Management</h3>
                    <p className="text-sm text-neutral-400">Never lose your work—uploaded assignments and shared files are automatically backed up for easy recovery.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-5 w-5 text-orange-400" />
                  <div>
                    <h3 className="font-medium text-white">📝 Learning Tools Integration</h3>
                    <p className="text-sm text-neutral-400">Stay on top of grades, tasks, and compliance through built-in monitoring features that keep both students and instructors updated.</p>
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