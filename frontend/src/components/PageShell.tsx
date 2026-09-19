import React from "react"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { SEO, type SEOProps } from "@/components/SEO"
import { ChatWidget } from "@/features/chatbot/ChatWidget"

export interface PageShellProps {
  children: React.ReactNode
  seo?: SEOProps
}

export function PageShell({ children, seo }: PageShellProps): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-white text-charcoal">
      {/* Accessible Skip-to-content link for keyboard users */}
      <a href="#content" className="skip-link">
        Skip to main content
      </a>

      {seo && <SEO {...seo} />}

      <SiteHeader />

      <main id="content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>

      <SiteFooter />

      {/* Zero-cost Local Database Chatbot */}
      <ChatWidget />
    </div>
  )
}
