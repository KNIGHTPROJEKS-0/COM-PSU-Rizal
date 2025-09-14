import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"

import { Toaster } from "sonner"
import { AuthProvider } from "@com-psu-rizal/shared/contexts/AuthContext"
import { PageTransition } from "@com-psu-rizal/ui/page-transition"

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
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: "url('/images/com-background-3.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed"
          }}
        >
          {/* Optional overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10">
          <AuthProvider>
            <PageTransition>
              {children}
            </PageTransition>
          </AuthProvider>
        </div>
        <Toaster />
      </body>
    </html>
  )
}