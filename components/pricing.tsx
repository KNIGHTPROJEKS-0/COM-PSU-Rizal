"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle2, Users, Monitor, Video, MessageCircle, Lock } from "lucide-react"

type Feature = { text: string; icon: React.ReactNode; muted?: boolean }

function FeatureItem({ text, icon, muted = false }: Feature) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5">{icon}</span>
      <span className={`text-sm ${muted ? "text-neutral-500" : "text-neutral-200"}`}>{text}</span>
    </li>
  )
}

type Currency = "USD"

const PRICES: Record<Currency, { basic: string; pro: string; enterprise: string; save: string }> = {
  USD: {
    basic: "Free",
    pro: "$9.99",
    enterprise: "$29.99",
    save: "Save $5",
  },
}

function guessLocalCurrency(): Currency {
  return "USD"
}

export function Pricing() {
  const [currency, setCurrency] = useState<Currency>("USD")

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        if (!cancelled) setCurrency(guessLocalCurrency())
      } catch {
        if (!cancelled) setCurrency(guessLocalCurrency())
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="pricing" className="text-white" itemScope itemType="https://schema.org/PriceSpecification">
      <div className="container mx-auto px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="mx-auto mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: "rgba(255,100,0,0.12)", color: "#FF6400" }}
          >
            Our Pricing and Packages
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl" itemProp="name">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-400" itemProp="description">
            No hidden fees. Just high-quality video conferencing that fits your budget.
          </p>
          <div className="mt-6">
            <Button
              asChild
              className="rounded-full px-5 text-white hover:brightness-95 bg-gradient-to-r from-orange-500 to-orange-600"
            >
              <Link href="/meeting/new">
                Start Free
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* Basic */}
          <Card
            className="relative overflow-hidden rounded-2xl liquid-glass shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <CardHeader className="space-y-3 pb-4">
              <div className="text-sm font-semibold text-neutral-200" itemProp="name">
                Basic
              </div>
              <div className="flex items-end gap-2 text-neutral-100">
                <div className="text-xl font-bold tracking-tight" itemProp="price">
                  {PRICES[currency].basic}
                </div>
                <span className="pb-0.5 text-[11px] text-neutral-400">forever</span>
                <meta itemProp="priceCurrency" content={currency} />
              </div>
              <div className="flex gap-2">
                <Button
                  asChild
                  className="w-full rounded-full px-4 py-2 text-sm font-medium text-white shadow transition-[box-shadow,transform,filter] active:translate-y-[1px] bg-gradient-to-r from-orange-500 to-orange-600"
                >
                  <Link href="/meeting/new">Get Started</Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <ul className="grid gap-2" itemProp="description">
                {[
                  { text: "Up to 10 participants", icon: <Users className="h-4 w-4 text-orange-400" /> },
                  { text: "40-minute meeting limit", icon: <Video className="h-4 w-4 text-orange-400" /> },
                  { text: "Basic video quality", icon: <Monitor className="h-4 w-4 text-orange-400" /> },
                  { text: "Chat messaging", icon: <MessageCircle className="h-4 w-4 text-orange-400" /> },
                  { text: "Unlimited meetings", icon: <Video className="h-4 w-4 text-orange-400" /> },
                ].map((f, i) => (
                  <FeatureItem key={i} text={f.text} icon={f.icon} />
                ))}
              </ul>
            </CardContent>
            <CardFooter />
          </Card>

          {/* Pro */}
          <Card
            className="relative overflow-hidden rounded-2xl liquid-glass shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <div
              className="absolute right-4 top-11 rounded-full px-2 py-0.5 text-[10px]"
              style={{ backgroundColor: "#1f1f1f", color: "#d4d4d4" }}
            >
              {PRICES[currency].save}
            </div>

            <CardHeader className="space-y-3 pb-4">
              <div className="text-sm font-semibold text-neutral-200" itemProp="name">
                Pro
              </div>
              <div className="flex items-end gap-2 text-neutral-100">
                <div className="text-xl font-bold tracking-tight" itemProp="price">
                  {PRICES[currency].pro}
                </div>
                <span className="pb-0.5 text-[11px] text-neutral-400">per month</span>
                <meta itemProp="priceCurrency" content={currency} />
              </div>

              <div className="flex gap-2">
                <Button
                  asChild
                  className="w-full rounded-full px-4 py-2 text-sm font-medium text-white shadow transition-[box-shadow,transform,filter] active:translate-y-[1px] bg-gradient-to-r from-orange-500 to-orange-600"
                >
                  <Link href="/checkout?plan=pro">Select Plan</Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <ul className="grid gap-2" itemProp="description">
                {[
                  { text: "Up to 100 participants", icon: <Users className="h-4 w-4 text-orange-400" /> },
                  { text: "24-hour meeting limit", icon: <Video className="h-4 w-4 text-orange-400" /> },
                  { text: "HD video quality", icon: <Monitor className="h-4 w-4 text-orange-400" /> },
                  { text: "Screen sharing", icon: <Monitor className="h-4 w-4 text-orange-400" /> },
                  { text: "Real-time chat", icon: <MessageCircle className="h-4 w-4 text-orange-400" /> },
                  { text: "Recording (cloud)", icon: <Video className="h-4 w-4 text-orange-400" /> },
                  { text: "Unlimited meetings", icon: <Video className="h-4 w-4 text-orange-400" /> },
                ].map((f, i) => (
                  <FeatureItem key={i} text={f.text} icon={f.icon} />
                ))}
              </ul>
            </CardContent>
            <CardFooter />
          </Card>

          {/* Enterprise */}
          <Card
            className="relative overflow-hidden rounded-2xl liquid-glass-enhanced shadow-[0_16px_50px_rgba(0,0,0,0.4)] transition-all duration-300"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <CardHeader className="relative space-y-3 pb-4">
              <div className="text-sm font-semibold text-neutral-200" itemProp="name">
                Enterprise
              </div>
              <div className="flex items-end gap-2 text-white">
                <div className="text-xl font-bold tracking-tight" itemProp="price">
                  {PRICES[currency].enterprise}
                </div>
                <span className="pb-0.5 text-[11px] text-neutral-400">per month</span>
                <meta itemProp="priceCurrency" content={currency} />
              </div>
              <div className="flex gap-2">
                <Button
                  asChild
                  className="w-full rounded-full px-4 py-2 text-sm font-medium text-white shadow transition-[box-shadow,transform,filter] active:translate-y-[1px] bg-gradient-to-r from-orange-500 to-orange-600"
                >
                  <Link href="/checkout?plan=enterprise">Contact Sales</Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="relative pt-0">
              <ul className="grid gap-2" itemProp="description">
                {[
                  { text: "Up to 1000 participants", icon: <Users className="h-4 w-4 text-orange-400" /> },
                  { text: "Unlimited meeting duration", icon: <Video className="h-4 w-4 text-orange-400" /> },
                  { text: "4K video quality", icon: <Monitor className="h-4 w-4 text-orange-400" /> },
                  { text: "Advanced screen sharing", icon: <Monitor className="h-4 w-4 text-orange-400" /> },
                  { text: "Real-time chat & file sharing", icon: <MessageCircle className="h-4 w-4 text-orange-400" /> },
                  { text: "Cloud & local recording", icon: <Video className="h-4 w-4 text-orange-400" /> },
                  { text: "End-to-end encryption", icon: <Lock className="h-4 w-4 text-orange-400" /> },
                  { text: "Custom branding", icon: <Monitor className="h-4 w-4 text-orange-400" /> },
                  { text: "API access", icon: <Monitor className="h-4 w-4 text-orange-400" /> },
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5">{f.icon}</span>
                    <span className="text-sm text-neutral-200">{f.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter />
          </Card>
        </div>
      </div>
    </section>
  )
}