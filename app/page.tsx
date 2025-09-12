import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { LogoMarquee } from "@/components/logo-marquee"
import { Pricing } from "@/components/pricing"
import { AppverseFooter } from "@/components/appverse-footer"
import { ToastDemo } from "@/components/toast-demo"
import Script from "next/script"

// ✅ Force static generation for low TTFB
export const dynamic = "force-static"

export default function Page() {
  // Structured data for pricing
  const pricingStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPageElement",
    "@id": "https://com-psu-rizal.com/#pricing",
    name: "Pricing Plans",
    description: "Video conferencing pricing plans - Basic, Pro, and Enterprise packages for all business needs",
    url: "https://com-psu-rizal.com/#pricing",
    mainEntity: {
      "@type": "PriceSpecification",
      name: "Video Conferencing Services",
      description: "Professional video conferencing services with three pricing tiers",
      offers: [
        {
          "@type": "Offer",
          name: "Basic Plan",
          price: "0",
          priceCurrency: "USD",
          description: "Free plan for individuals and small teams",
        },
        {
          "@type": "Offer",
          name: "Pro Plan",
          price: "9.99",
          priceCurrency: "USD",
          description: "Advanced features for growing teams",
        },
        {
          "@type": "Offer",
          name: "Enterprise Plan",
          price: "29.99",
          priceCurrency: "USD",
          description: "Unlimited meetings for large organizations",
        },
      ],
    },
  }

  // Structured data for main page
  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://com-psu-rizal.com/",
    name: "Collaboration Online Meet | Real-time Video Conferencing",
    description:
      "Experience seamless video conferencing with Collaboration Online Meet. High-quality video calls, screen sharing, and real-time chat for all your collaboration needs.",
    url: "https://com-psu-rizal.com/",
    mainEntity: {
      "@type": "Organization",
      name: "Collaboration Online Meet",
      url: "https://com-psu-rizal.com",
      sameAs: [
        "https://twitter.com/compsurizal",
        "https://www.youtube.com/@compsurizal",
        "https://instagram.com/compsurizal",
        "https://threads.com/compsurizal",
      ],
    },
    hasPart: [
      {
        "@type": "WebPageElement",
        "@id": "https://com-psu-rizal.com/#pricing",
        name: "Pricing Section",
        url: "https://com-psu-rizal.com/#pricing",
      },
    ],
  }

  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <Hero />
        <Features />
        <LogoMarquee />
        <div className="container py-12">
          <ToastDemo />
        </div>
        <Pricing />
        <AppverseFooter />
      </main>

      {/* JSON-LD structured data */}
      <Script
        id="pricing-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pricingStructuredData),
        }}
      />

      <Script
        id="page-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageStructuredData),
        }}
      />
    </>
  )
}