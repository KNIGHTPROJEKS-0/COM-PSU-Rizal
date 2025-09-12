import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import Plasma from "@/components/plasma"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "Collaboration Online Meet | Real-time Video Conferencing",
  description:
    "Experience seamless video conferencing with Collaboration Online Meet. High-quality video calls, screen sharing, and real-time chat for all your collaboration needs.",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Dynamic Favicon Script */}
        <Script id="dynamic-favicon" strategy="beforeInteractive">
          {`
            function updateFavicon() {
              const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const faviconHref = darkMode ? '/icons/com-psu-rizal-white.svg' : '/icons/favicon-dark.svg';
              let link = document.querySelector("link[rel~='icon']");
              if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
              }
              link.href = faviconHref;
            }
            updateFavicon();
            // Listen for changes in theme
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);
          `}
        </Script>
      </head>
      <body>
        <div className="fixed inset-0 z-0 bg-black">
          <Plasma
            color="#8b5cf6"
            speed={0.8}
            direction="forward"
            scale={1.5}
            opacity={0.4}
            mouseInteractive={true}
          />
        </div>
        <div className="relative z-10">{children}</div>
        <Toaster />
      </body>
    </html>
  )
}