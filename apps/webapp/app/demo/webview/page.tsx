"use client"

import { WebViewDemo } from "@com-psu-rizal/ui/demo/webview-demo"
import { WebViewHtmlDemo } from "@com-psu-rizal/ui/demo/webview-html-demo"
import { SiteHeader } from "@com-psu-rizal/ui/site-header"
import { AppverseFooter } from "@com-psu-rizal/ui/appverse-footer"

export default function WebViewDemoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">WebView Demo</h1>
          <p className="text-muted-foreground">
            Demonstrating the WebView component integration
          </p>
        </div>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">URL Loading Demo</h2>
          <WebViewDemo />
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">HTML Content Demo</h2>
          <WebViewHtmlDemo />
        </section>
      </main>
      <AppverseFooter />
    </div>
  )
}