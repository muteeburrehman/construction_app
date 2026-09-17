import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Phone, CheckCircle2 } from "lucide-react"
import { PageShell } from "@/components/PageShell"
import { Container } from "@/components/ui/layout"
import heroImg from "@/assets/wix/hero_commercial.jpg"
import cardImg from "@/assets/wix/card_commercial.jpg"

const COBALT   = "#1A3A6B"
const BLUE     = "#2E5BA8"
const CHARCOAL = "#1E2532"
const SLATE    = "#4A5568"
const IRON     = "#8A94A6"
const CLOUD    = "#F8F9FC"
const PEBBLE   = "#DDE2EC"
const WHITE    = "#FFFFFF"

const CAPABILITIES = [
  "Winery production facility expansions",
  "Tasting room & hospitality spaces",
  "CAMi Art and Wine Gallery (Calistoga)",
  "Multi-tenant improvement projects",
  "Commercial code compliance builds",
  "Custom architectural steel & timber",
]

export function CommercialServicePage(): React.JSX.Element {
  return (
    <PageShell
      seo={{
        title: "Commercial & Winery Construction Napa | Eric Sherwood Construction",
        description: "Commercial building, winery hospitality spaces, and light industrial facilities in Napa Valley since 1979. CSLB Lic. 902560.",
      }}
    >
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: 520 }}>
        <img src={heroImg} alt="Commercial winery construction — Napa Valley" className="absolute inset-0 w-full h-full object-cover object-center" fetchPriority="high" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(110deg, rgba(14,20,32,0.90) 45%, rgba(14,20,32,0.50) 100%)" }} />
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: BLUE }} />

        <Container size="wide" className="relative z-10">
          <div className="py-28 sm:py-36 max-w-[640px]">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display font-semibold tracking-[0.16em] uppercase" style={{ fontSize: "0.625rem", color: "#4A7DD4" }}>Services</span>
              <div style={{ width: 24, height: 1, background: "#4A7DD4" }} />
              <span className="font-display font-semibold tracking-[0.16em] uppercase" style={{ fontSize: "0.625rem", color: "rgba(248,249,252,0.38)" }}>Commercial</span>
            </div>
            <h1 className="font-display font-extrabold tracking-[-0.04em] leading-[1.02] mb-6" style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)", color: CLOUD }}>
              Commercial &<br />Winery Construction
            </h1>
            <p className="font-body leading-[1.7] mb-10" style={{ fontSize: "1.0625rem", color: "rgba(248,249,252,0.55)", maxWidth: "50ch" }}>
              Winery hospitality suites, tasting rooms, administrative offices, and commercial facility upgrades
              throughout wine country — delivered on schedule without interrupting operations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="group inline-flex items-center gap-2 font-display font-semibold rounded-sm px-7 py-4 transition-colors duration-200" style={{ background: BLUE, color: WHITE, fontSize: "0.9375rem" }}
                onMouseEnter={e => (e.currentTarget.style.background = COBALT)}
                onMouseLeave={e => (e.currentTarget.style.background = BLUE)}>
                Request commercial consultation <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a href="tel:707-255-3875" className="inline-flex items-center gap-2 font-display font-semibold rounded-sm px-7 py-4 transition-colors duration-200" style={{ border: "1px solid rgba(248,249,252,0.22)", color: "rgba(248,249,252,0.72)", fontSize: "0.9375rem" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(248,249,252,0.48)"; e.currentTarget.style.color = CLOUD }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(248,249,252,0.22)"; e.currentTarget.style.color = "rgba(248,249,252,0.72)" }}>
                <Phone style={{ width: 15, height: 15 }} /> 707-255-3875
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Body ── */}
      <section className="py-24 sm:py-32" style={{ background: WHITE }}>
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 lg:gap-24">
            <div>
              <div className="h-[2px] w-10 mb-6" style={{ background: BLUE }} />
              <h2 className="font-display font-extrabold tracking-[-0.04em] leading-[1.1] mb-6" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: CHARCOAL }}>
                Running while you build.
              </h2>
              <p className="font-body leading-[1.75] mb-5" style={{ fontSize: "1.0625rem", color: SLATE, maxWidth: "58ch" }}>
                Our commercial division coordinates structural steel, commercial code compliance, and custom architectural finishes
                while keeping production and hospitality operations running smoothly. Notable projects include the Ellman Family
                Vineyards tasting room renovation and the CAMi Art and Wine Gallery in Calistoga.
              </p>
              <p className="font-body leading-[1.75] mb-10" style={{ fontSize: "1.0625rem", color: SLATE, maxWidth: "58ch" }}>
                We understand that winery and commercial clients can't afford production downtime. Our phased-build approach
                keeps your facility operational through every stage of construction.
              </p>
              <div className="h-[2px] w-10 mb-6" style={{ background: PEBBLE }} />
              <h3 className="font-display font-semibold tracking-[-0.025em] mb-5" style={{ fontSize: "1.125rem", color: CHARCOAL }}>Specialties</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAPABILITIES.map((cap) => (
                  <li key={cap} className="flex items-start gap-2.5">
                    <CheckCircle2 style={{ width: 15, height: 15, color: BLUE, marginTop: 3, flexShrink: 0 }} />
                    <span className="font-body" style={{ fontSize: "0.9375rem", color: SLATE }}>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <div className="overflow-hidden rounded-sm" style={{ boxShadow: "0 4px 20px rgba(14,20,32,0.10)" }}>
                <img src={cardImg} alt="Commercial winery — Napa Valley" className="w-full object-cover" style={{ height: 280 }} loading="lazy" />
              </div>
              <div className="p-8 rounded-sm" style={{ background: CLOUD, border: `1px solid ${PEBBLE}` }}>
                <p className="font-display font-semibold tracking-[0.1em] uppercase mb-3" style={{ fontSize: "0.6rem", color: IRON }}>CSLB Lic. 902560</p>
                <h3 className="font-display font-extrabold tracking-[-0.025em] mb-3" style={{ fontSize: "1.1875rem", color: CHARCOAL }}>Planning a commercial project?</h3>
                <p className="font-body leading-relaxed mb-6" style={{ fontSize: "0.9375rem", color: IRON }}>
                  We walk you through scope, phasing, and open-book pricing before any work begins.
                </p>
                <Link to="/contact" className="group flex items-center justify-center gap-2 w-full font-display font-semibold rounded-sm py-3.5 transition-colors duration-200" style={{ background: BLUE, color: WHITE, fontSize: "0.875rem" }}
                  onMouseEnter={e => (e.currentTarget.style.background = COBALT)}
                  onMouseLeave={e => (e.currentTarget.style.background = BLUE)}>
                  Request an Estimate <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  )
}
