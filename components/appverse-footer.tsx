"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Instagram, Twitter, Youtube, MessageCircle, Video } from "lucide-react"
import LazyVideo from "./lazy-video"
import Image from "next/image"

interface FooterContent {
  tagline: string
  copyright: string
}

const defaultContent: FooterContent = {
  tagline: "Experience collaborative video conferencing solution built for academic communities. Connect with crystal clear audio and video quality.",
  copyright: "© 2025 — Collaboration Online Meet (COM|PSU|Rizal)",
}

export function AppverseFooter() {
  const [content, setContent] = useState<FooterContent>(defaultContent)

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("com-psu-rizal-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.footer) {
          setContent(parsed.footer)
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }
  }, [])

  return (
    <section className="text-white">
      {/* Contact CTA */}
      <div className="container mx-auto px-4 pt-12 sm:pt-16">
        <div className="flex justify-center">
          <Button
            asChild
            className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(255,100,0,0.35)] hover:from-orange-600 hover:to-orange-700"
          >
            <a href="/meeting/new">
              Start a Meeting
            </a>
          </Button>
        </div>
      </div>

      {/* Download the app */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <Card className="relative overflow-hidden rounded-3xl liquid-glass p-6 sm:p-10">
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            {/* Left copy */}
            <div>
              <p className="mb-2 text-[11px] tracking-widest text-orange-400">GET STARTED TODAY</p>
              <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                Download our app for the best experience
              </h3>
              <p className="mt-2 max-w-prose text-sm text-neutral-400">
                Join meetings on the go with our mobile app. Available for iOS and Android.
              </p>
              <div className="mt-4 flex gap-3">
                <Button
                  asChild
                  className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  <a href="#">
                    <span className="flex items-center gap-2">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 12.04C17.05 10.49 18.16 9.83 18.21 9.8C16.89 7.88 14.61 7.65 13.65 7.68C12.39 7.65 11.28 8.46 10.59 8.46C9.87 8.46 8.91 7.71 7.77 7.74C6.12 7.77 4.53 8.76 3.72 10.35C1.98 13.44 3.24 17.82 4.95 20.25C5.82 21.48 6.87 22.77 8.22 22.71C9.48 22.65 9.93 21.84 11.43 21.84C12.93 21.84 13.32 22.71 14.67 22.68C16.05 22.65 16.95 21.51 17.82 20.28C18.21 19.71 18.57 19.11 18.9 18.51C17.52 17.91 16.26 17.55 16.23 15.99C16.2 14.61 17.31 14.01 17.37 13.95C17.34 13.86 17.05 12.81 17.05 12.04ZM14.64 4.59C15.27 3.78 15.72 2.61 15.57 1.5C14.52 1.56 13.35 2.19 12.72 3.03C12.15 3.78 11.64 4.98 11.82 6.06C12.9 6.15 14.01 5.43 14.64 4.59Z" />
                      </svg>
                      App Store
                    </span>
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                >
                  <a href="#">
                    <span className="flex items-center gap-2">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 21H21V3H3V21ZM18.19 9.13C17.84 7.84 16.77 6.77 15.48 6.42C14.58 6.18 13.62 6.3 12.78 6.72C11.94 7.14 11.24 7.86 10.78 8.76C10.32 9.66 10.14 10.71 10.26 11.76C10.38 12.81 10.78 13.77 11.4 14.52C12.02 15.27 12.84 15.78 13.74 16.02C14.64 16.26 15.6 16.17 16.44 15.81C17.28 15.45 17.94 14.84 18.36 14.04C17.43 13.59 16.5 13.15 15.57 12.7C15.39 12.61 15.21 12.52 15.03 12.43C14.52 12.18 14.28 11.94 14.04 11.7C13.56 11.22 13.08 10.74 12.6 10.26C12.42 10.08 12.24 9.9 12.06 9.72C11.7 9.36 11.46 9.12 11.22 8.88C10.98 8.64 10.74 8.4 10.5 8.16C10.26 7.92 10.02 7.68 9.78 7.44C9.54 7.2 9.3 6.96 9.06 6.72C8.82 6.48 8.58 6.24 8.34 6C8.1 5.76 7.86 5.52 7.62 5.28C7.38 5.04 7.14 4.8 6.9 4.56C6.66 4.32 6.42 4.08 6.18 3.84C5.94 3.6 5.7 3.36 5.46 3.12C5.22 2.88 4.98 2.64 4.74 2.4C4.5 2.16 4.26 1.92 4.02 1.68C3.78 1.44 3.54 1.2 3.3 0.96C3.06 0.72 2.82 0.48 2.58 0.24C2.34 0 2.1 0 1.86 0C1.62 0 1.38 0 1.14 0C0.9 0 0.66 0 0.42 0C0.18 0 0 0 0 0V24H24V0H3.3L3.78 0.48L4.26 0.96L4.74 1.44L5.22 1.92L5.7 2.4L6.18 2.88L6.66 3.36L7.14 3.84L7.62 4.32L8.1 4.8L8.58 5.28L9.06 5.76L9.54 6.24L10.02 6.72L10.5 7.2L10.98 7.68L11.46 8.16L11.94 8.64L12.42 9.12L12.9 9.6L13.38 10.08L13.86 10.56L14.34 11.04L14.82 11.52L15.3 12L15.78 12.48L16.26 12.96L16.74 13.44L17.22 13.92L17.7 14.4L18.18 14.88L18.66 15.36L19.14 15.84L19.62 16.32L20.1 16.8L20.58 17.28L21.06 17.76L21.54 18.24L22.02 18.72L22.5 19.2L22.98 19.68L23.46 20.16L23.94 20.64L24 21V0H0V24H24V21H18.19Z" />
                      </svg>
                      Google Play
                    </span>
                  </a>
                </Button>
              </div>
            </div>

            {/* Right mockup */}
            <div className="mx-auto w-full max-w-[320px]">
              <div className="relative rounded-[28px] liquid-glass p-2 shadow-2xl">
                <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-black">
                  {/* Lazy-loaded video fills the screen */}
                  <LazyVideo
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%202-YFaCK7cEiHWSMRv8XEHaLCoYj2SUAi.mp4"
                    className="absolute inset-0 h-full w-full object-cover"
                    autoplay={true}
                    loop={true}
                    muted={true}
                    playsInline={true}
                    aria-label="COM-PSU-Rizal app preview - seamless video calls"
                  />
                  {/* On-screen content */}
                  <div className="relative p-3">
                    <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/20" />
                    <div className="space-y-1 px-1">
                      <div className="text-5xl font-extrabold text-orange-400">Join Meeting</div>
                      <p className="text-xs text-white/80">Start collaborating with your team</p>
                      <div className="mt-3 inline-flex items-center rounded-full bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-orange-400">
                        <Video className="mr-1 h-3 w-3" />
                        Video Call
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 pb-20 md:pb-10">
        <div className="container mx-auto px-4 py-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Image src="/icons/com-psu-rizal-white.svg" alt="COM-PSU-Rizal logo" width={32} height={32} className="h-8 w-8" />
                <div className="flex flex-col">
                  <span className="text-xl font-semibold text-orange-400">Collaboration Online Meet</span>
                  <span className="text-xs text-orange-400 tracking-widest">COM|PSU|Rizal</span>
                </div>
              </div>
              <p className="max-w-sm text-sm text-neutral-400">{content.tagline}</p>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-2">
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Navigation</h5>
                <ul className="space-y-2 text-sm text-neutral-300">
                  {["Home", "Features", "Pricing", "Download", "Support"].map((item) => (
                    <li key={item}>
                      <Link href={`#${item.toLowerCase()}`} className="hover:text-orange-400">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Social media</h5>
                <ul className="space-y-2 text-sm text-neutral-300">
                  <li className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-neutral-400" />
                    <a
                      href="https://twitter.com/compsurizal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-400"
                      aria-label="Follow Collaboration Online Meet on Twitter"
                    >
                      X/Twitter
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-neutral-400" />
                    <a
                      href="https://www.youtube.com/@compsurizal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-400"
                      aria-label="Subscribe to Collaboration Online Meet on YouTube"
                    >
                      YouTube
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-neutral-400" />
                    <a
                      href="https://instagram.com/compsurizal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-400"
                      aria-label="Follow Collaboration Online Meet on Instagram"
                    >
                      Instagram
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-neutral-400" />
                    <a
                      href="https://threads.com/compsurizal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-400"
                      aria-label="Follow Collaboration Online Meet on Threads"
                    >
                      Threads
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-neutral-500 sm:flex-row">
            <p>{content.copyright}</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-orange-400">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-orange-400">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}