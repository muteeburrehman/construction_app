import React, { useState } from "react"
import { Phone, Mail, MapPin, ArrowRight, Send } from "lucide-react"
import { PageShell } from "@/components/PageShell"
import { Container } from "@/components/ui/layout"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const COBALT   = "#1A3A6B"
const BLUE     = "#2E5BA8"
const CHARCOAL = "#1E2532"
const SLATE    = "#4A5568"
const IRON     = "#8A94A6"
const CLOUD    = "#F8F9FC"
const PEBBLE   = "#DDE2EC"
const WHITE    = "#FFFFFF"

const CONTACT_ITEMS = [
  { icon: Phone, primary: "(707) 555-0192", secondary: "Monday – Friday, 7:00 AM – 5:00 PM PST", href: "tel:707-555-0192" },
  { icon: Mail, primary: "info@muteeblabs.com", secondary: "Plan sets & project documentation", href: "mailto:info@muteeblabs.com" },
]

export function ContactPage(): React.JSX.Element {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <PageShell
      seo={{
        title: "Contact & Request an Estimate | Apex Construction Group",
        description: "Start your custom residential or commercial building project. Call (707) 555-0192 or submit an estimate request.",
      }}
    >
      {/* ── Page Header ── */}
      <div style={{ background: CHARCOAL, borderBottom: `3px solid ${BLUE}` }}>
        <Container size="wide">
          <div className="py-20 sm:py-28">
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: 24, height: 1, background: BLUE }} />
              <span className="font-display font-semibold tracking-[0.15em] uppercase" style={{ fontSize: "0.625rem", color: BLUE }}>Inquiries</span>
            </div>
            <h1 className="font-display font-extrabold tracking-[-0.04em] leading-[1.04] mb-5" style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)", color: CLOUD }}>
              Request an Estimate
            </h1>
            <p className="font-body leading-[1.7]" style={{ fontSize: "1.0625rem", color: "rgba(248,249,252,0.52)", maxWidth: "52ch" }}>
              Direct builder consultation for projects in Napa Valley and Northern California.
              We review site conditions, architectural plans, and preliminary budgets.
            </p>
          </div>
        </Container>
      </div>

      {/* ── Body ── */}
      <section className="py-20 sm:py-28" style={{ background: CLOUD }}>
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left: Contact Info */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div>
                <h2 className="font-display font-extrabold tracking-[-0.035em] mb-3" style={{ fontSize: "1.5rem", color: CHARCOAL }}>
                  Direct Contact
                </h2>
                <p className="font-body leading-[1.7]" style={{ fontSize: "0.9375rem", color: SLATE }}>
                  For immediate discussion regarding land parcels, architectural
                  sets, or urgent site inquiries, call our project office directly.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {CONTACT_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-start gap-4 p-5 rounded-sm transition-all duration-200"
                    style={{ background: WHITE, border: `1px solid ${PEBBLE}` }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = BLUE)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = PEBBLE)}
                  >
                    <item.icon style={{ width: 18, height: 18, color: BLUE, flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div className="font-display font-semibold break-all" style={{ fontSize: "0.9375rem", color: CHARCOAL }}>
                        {item.primary}
                      </div>
                      <div className="font-body mt-0.5" style={{ fontSize: "0.8125rem", color: IRON }}>
                        {item.secondary}
                      </div>
                    </div>
                  </a>
                ))}

                <div className="flex items-start gap-4 p-5 rounded-sm" style={{ background: WHITE, border: `1px solid ${PEBBLE}` }}>
                  <MapPin style={{ width: 18, height: 18, color: IRON, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div className="font-display font-semibold" style={{ fontSize: "0.9375rem", color: CHARCOAL }}>Napa, California</div>
                    <div className="font-body mt-0.5" style={{ fontSize: "0.8125rem", color: IRON }}>
                      Serving Napa Valley, St. Helena, Yountville, Calistoga & Sonoma
                    </div>
                  </div>
                </div>
              </div>

              {/* License note */}
              <div className="p-5 rounded-sm" style={{ background: "rgba(46,91,168,0.07)", border: "1px solid rgba(46,91,168,0.18)" }}>
                <p className="font-display font-semibold tracking-[0.08em] uppercase mb-1" style={{ fontSize: "0.5625rem", color: BLUE }}>California State License Board</p>
                <p className="font-display font-extrabold tracking-[-0.025em]" style={{ fontSize: "1.125rem", color: CHARCOAL }}>CSLB Lic. #849201</p>
                <p className="font-body mt-1.5" style={{ fontSize: "0.8125rem", color: IRON }}>Class B General Building Contractor, continuously licensed and bonded.</p>
              </div>
            </div>

            {/* Right: Form */}
            <div
              className="lg:col-span-7 p-8 sm:p-10 rounded-sm"
              style={{ background: WHITE, border: `1px solid ${PEBBLE}`, boxShadow: "0 2px 16px rgba(14,20,32,0.06)" }}
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(46,91,168,0.10)" }}>
                    <Send style={{ width: 28, height: 28, color: BLUE }} />
                  </div>
                  <h3 className="font-display font-extrabold tracking-[-0.03em]" style={{ fontSize: "1.5rem", color: CHARCOAL }}>Request Received</h3>
                  <p className="font-body leading-[1.7]" style={{ fontSize: "1rem", color: IRON, maxWidth: "38ch" }}>
                    Thank you. Our principal builder will follow up within one business day to schedule a site walkthrough.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-7">
                    <h3 className="font-display font-extrabold tracking-[-0.03em] mb-1" style={{ fontSize: "1.25rem", color: CHARCOAL }}>Project Inquiry Form</h3>
                    <p className="font-body" style={{ fontSize: "0.875rem", color: IRON }}>
                      Our team reviews each submission personally and responds within one business day.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-display font-semibold" style={{ fontSize: "0.75rem", color: CHARCOAL }}>Full Name *</label>
                        <Input required placeholder="Your full name" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-display font-semibold" style={{ fontSize: "0.75rem", color: CHARCOAL }}>Phone Number *</label>
                        <Input required type="tel" placeholder="707-..." />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-display font-semibold" style={{ fontSize: "0.75rem", color: CHARCOAL }}>Email Address *</label>
                      <Input required type="email" placeholder="name@domain.com" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-display font-semibold" style={{ fontSize: "0.75rem", color: CHARCOAL }}>Project Type</label>
                      <Select defaultValue="residential">
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">Custom Residential Construction</SelectItem>
                          <SelectItem value="remodel">Architectural Remodel / Addition</SelectItem>
                          <SelectItem value="commercial">Commercial / Winery Facility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-display font-semibold" style={{ fontSize: "0.75rem", color: CHARCOAL }}>Project Location / Town</label>
                      <Input placeholder="e.g. Napa, Yountville, St. Helena" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-display font-semibold" style={{ fontSize: "0.75rem", color: CHARCOAL }}>What are you planning?</label>
                      <Textarea required placeholder="Please describe the scope, existing structures, and target start timeframe..." rows={5} />
                    </div>
                    <button
                      type="submit"
                      className="group flex items-center justify-center gap-2 w-full font-display font-semibold rounded-sm py-4 transition-colors duration-200 mt-1"
                      style={{ background: BLUE, color: WHITE, fontSize: "0.9375rem" }}
                      onMouseEnter={e => (e.currentTarget.style.background = COBALT)}
                      onMouseLeave={e => (e.currentTarget.style.background = BLUE)}
                    >
                      Submit Estimate Request
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  )
}

