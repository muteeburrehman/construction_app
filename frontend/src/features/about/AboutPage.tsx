import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Phone, Award, MapPin, Clock, CheckCircle2 } from "lucide-react"
import { PageShell } from "@/components/PageShell"
import { Container } from "@/components/ui/layout"
import heroImg from "@/assets/wix/hero_commercial.jpg"
import photoImg from "@/assets/wix/card_residential.jpg"
import aboutHero from "@/assets/wix/about-hero.jpg"

const COBALT   = "#1A3A6B"
const BLUE     = "#2E5BA8"
const CHARCOAL = "#1E2532"
const SLATE    = "#4A5568"
const IRON     = "#8A94A6"
const CLOUD    = "#F8F9FC"
const PEBBLE   = "#DDE2EC"
const WHITE    = "#FFFFFF"

const TIMELINE = [
  { year: "1998", text: "Founded as a specialized structural framing and architectural carpentry group." },
  { year: "2006", text: "Expanded into ground-up custom luxury residences and hillside architectural estates." },
  { year: "2014", text: "Established commercial & hospitality division — tasting rooms, winery facilities, and retail." },
  { year: "2020", text: "Pioneered integrated wildfire-resilient (WUI) building science and smart estate infrastructure." },
  { year: "Today", text: "Delivering world-class residential and commercial builds with direct principal site supervision." },
]

const PILLARS = [
  { icon: Award, title: "Licensed & Bonded", desc: "California Class B General Contractor License #849201, continuously held in impeccable standing." },
  { icon: MapPin, title: "Wine Country Expertise", desc: "Decades navigating demanding hillside terrain, fire-hazard zones, and complex municipal permitting." },
  { icon: Clock, title: "Principal on Site", desc: "No handoffs to junior supervisors. Our lead builders direct your project from initial planning to final walkthrough." },
]

export function AboutPage(): React.JSX.Element {
  return (
    <PageShell
      seo={{
        title: "About Apex Construction Group | Premier Custom Builders",
        description: "Founded on uncompromising craftsmanship and engineering precision. Delivering custom residences and commercial landmarks.",
      }}
    >
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: 500 }}>
        <img src={heroImg} alt="Apex Construction Group craftsmanship" className="absolute inset-0 w-full h-full object-cover object-center" fetchPriority="high" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(110deg, rgba(14,20,32,0.90) 40%, rgba(14,20,32,0.50) 100%)" }} />
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: BLUE }} />

        <Container size="wide" className="relative z-10">
          <div className="py-28 sm:py-36 max-w-[640px]">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display font-semibold tracking-[0.16em] uppercase" style={{ fontSize: "0.625rem", color: "#4A7DD4" }}>Heritage</span>
              <div style={{ width: 24, height: 1, background: "#4A7DD4" }} />
              <span className="font-display font-semibold tracking-[0.16em] uppercase" style={{ fontSize: "0.625rem", color: "rgba(248,249,252,0.38)" }}>Est. 1998</span>
            </div>
            <h1 className="font-display font-extrabold tracking-[-0.04em] leading-[1.02] mb-6" style={{ fontSize: "clamp(2.25rem, 5.5vw, 4.25rem)", color: CLOUD }}>
              Over Two Decades<br />of Master Craft
            </h1>
            <p className="font-body leading-[1.7]" style={{ fontSize: "1.0625rem", color: "rgba(248,249,252,0.55)", maxWidth: "50ch" }}>
              Founded on the principles of structural integrity, aesthetic excellence, and total fiscal transparency,
              Apex Construction Group delivers distinguished residential and commercial environments throughout California.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Pillars Band ── */}
      <section style={{ background: CHARCOAL }}>
        <Container size="wide">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <div key={p.title} className="py-10 px-8" style={{ borderRight: i < 2 ? "1px solid rgba(248,249,252,0.08)" : "none" }}>
                <p.icon style={{ width: 22, height: 22, color: BLUE, marginBottom: "1rem" }} />
                <h3 className="font-display font-extrabold tracking-[-0.025em] mb-3" style={{ fontSize: "1.0625rem", color: CLOUD }}>
                  {p.title}
                </h3>
                <p className="font-body leading-[1.65]" style={{ fontSize: "0.9375rem", color: "rgba(248,249,252,0.48)" }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Master Builder Heritage Section ── */}
      <section className="py-24 sm:py-32" style={{ background: CLOUD, borderBottom: `1px solid ${PEBBLE}` }}>
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Leadership Architectural Photo & Caption */}
            <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
              <div
                style={{
                  background: WHITE,
                  padding: "16px",
                  borderRadius: 12,
                  boxShadow: "0 10px 30px -5px rgba(26, 58, 107, 0.12)",
                  border: `1px solid ${PEBBLE}`,
                  maxWidth: 420,
                  width: "100%",
                }}
              >
                <div style={{ overflow: "hidden", borderRadius: 8, background: "#E2E8F0" }}>
                  <img
                    src={aboutHero}
                    alt="Apex Construction Group Master Craftsmanship"
                    className="w-full object-cover"
                    style={{ aspectRatio: "4 / 3" }}
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center justify-between mt-3 px-1">
                  <p
                    className="font-display font-semibold tracking-wide"
                    style={{ fontSize: "0.875rem", color: CHARCOAL }}
                  >
                    Architectural Field Direction
                  </p>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-medium">
                    Lic. #849201
                  </span>
                </div>
              </div>
            </div>

            {/* Leadership Content */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="h-[2px] w-12 mb-5" style={{ background: BLUE }} />
              <h2
                className="font-display font-extrabold tracking-[-0.035em] leading-tight mb-2"
                style={{ fontSize: "clamp(2rem, 3.8vw, 2.75rem)", color: CHARCOAL }}
              >
                The Master Builder Heritage
              </h2>
              <p
                className="font-display font-bold tracking-[0.02em] mb-6"
                style={{ fontSize: "1.125rem", color: BLUE }}
              >
                Apex Construction Group · Executive Field Direction
              </p>

              <p
                className="font-body leading-[1.8] mb-8"
                style={{ fontSize: "1.0625rem", color: SLATE }}
              >
                Our firm was founded on a singular conviction: luxury building demands direct field leadership,
                rigorous technical acumen, and complete fiscal transparency. Every project on our roster receives
                direct supervision from our principal builders — guaranteeing that the architectural vision on paper
                is translated flawlessly into physical reality.
              </p>

              <div
                style={{
                  background: WHITE,
                  borderRadius: 10,
                  padding: "24px 28px",
                  border: `1px solid ${PEBBLE}`,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  marginBottom: "2rem",
                }}
              >
                <h3
                  className="font-display font-extrabold tracking-[-0.02em] mb-4"
                  style={{ fontSize: "1.125rem", color: CHARCOAL }}
                >
                  Why Choose Apex Construction Group?
                </h3>
                <ul className="flex flex-col gap-3.5">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 style={{ width: 18, height: 18, color: BLUE, flexShrink: 0, marginTop: 3 }} />
                    <span className="font-body leading-relaxed" style={{ fontSize: "0.9375rem", color: SLATE }}>
                      <strong style={{ color: CHARCOAL }}>Experienced, thorough, and detail-oriented:</strong> Over two decades directing high-end architectural estates and commercial facilities.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 style={{ width: 18, height: 18, color: BLUE, flexShrink: 0, marginTop: 3 }} />
                    <span className="font-body leading-relaxed" style={{ fontSize: "0.9375rem", color: SLATE }}>
                      <strong style={{ color: CHARCOAL }}>Focused on collaborative team efforts:</strong> Partnering seamlessly with premier architects, structural engineers, and artisans with timely execution.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 style={{ width: 18, height: 18, color: BLUE, flexShrink: 0, marginTop: 3 }} />
                    <span className="font-body leading-relaxed" style={{ fontSize: "0.9375rem", color: SLATE }}>
                      <strong style={{ color: CHARCOAL }}>Principal on site every morning:</strong> Direct personal oversight and open-book billing with zero surprise markups.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 font-display font-semibold rounded-sm px-7 py-3.5 transition-colors duration-200"
                  style={{ background: BLUE, color: WHITE, fontSize: "0.875rem" }}
                  onMouseEnter={e => (e.currentTarget.style.background = COBALT)}
                  onMouseLeave={e => (e.currentTarget.style.background = BLUE)}
                >
                  Schedule Project Consultation <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                  href="tel:707-555-0192"
                  className="inline-flex items-center gap-2 font-display font-semibold rounded-sm px-6 py-3.5 transition-colors duration-200"
                  style={{ border: `1px solid ${PEBBLE}`, color: CHARCOAL, fontSize: "0.875rem", background: WHITE }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = BLUE)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = PEBBLE)}
                >
                  <Phone style={{ width: 14, height: 14, color: BLUE }} />
                  (707) 555-0192
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Philosophy + Timeline ── */}
      <section className="py-24 sm:py-32" style={{ background: WHITE }}>
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Text */}
            <div>
              <div className="h-[2px] w-10 mb-6" style={{ background: BLUE }} />
              <h2 className="font-display font-extrabold tracking-[-0.04em] leading-[1.1] mb-6" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: CHARCOAL }}>
                The builder you meet<br />is the one on site.
              </h2>
              <p className="font-body leading-[1.75] mb-5" style={{ fontSize: "1.0625rem", color: SLATE, maxWidth: "56ch" }}>
                We operate on a straightforward premise: the contractor you speak with during initial planning
                is the person who runs your job site every morning. No layers of overhead, no handoffs.
              </p>
              <p className="font-body leading-[1.75] mb-5" style={{ fontSize: "1.0625rem", color: SLATE, maxWidth: "56ch" }}>
                Wine Country is demanding terrain. Steep hillsides, fire-hazard zones, complex soil profiles,
                and strict municipal permitting require a contractor who has navigated these conditions for decades.
              </p>
              <p className="font-body leading-[1.75] mb-10" style={{ fontSize: "1.0625rem", color: SLATE, maxWidth: "56ch" }}>
                Our open-book construction management model means you see exactly where every dollar goes —
                no hidden markups buried in line items.
              </p>

              {/* License card */}
              <div className="p-6 mb-8 rounded-sm" style={{ borderLeft: `4px solid ${BLUE}`, background: "rgba(46,91,168,0.06)" }}>
                <p className="font-display font-semibold tracking-[0.1em] uppercase mb-1" style={{ fontSize: "0.6rem", color: BLUE }}>General Contractor</p>
                <p className="font-display font-extrabold tracking-[-0.025em]" style={{ fontSize: "1.25rem", color: CHARCOAL }}>CSLB Lic. #849201</p>
                <p className="font-body mt-2" style={{ fontSize: "0.875rem", color: IRON }}>Class B General Building Contractor continuously licensed and bonded in good standing with the California State License Board.</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/contact" className="group inline-flex items-center gap-2 font-display font-semibold rounded-sm px-6 py-3 transition-colors duration-200" style={{ background: BLUE, color: WHITE, fontSize: "0.875rem" }}
                  onMouseEnter={e => (e.currentTarget.style.background = COBALT)}
                  onMouseLeave={e => (e.currentTarget.style.background = BLUE)}>
                  Work with Apex Construction Group <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link to="/work" className="inline-flex items-center gap-2 font-display font-semibold rounded-sm px-6 py-3 transition-colors duration-200" style={{ border: `1px solid ${PEBBLE}`, color: CHARCOAL, fontSize: "0.875rem" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = BLUE)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = PEBBLE)}>
                  View Projects
                </Link>
              </div>
            </div>

            {/* Image + Timeline */}
            <div className="flex flex-col gap-10">
              <div className="overflow-hidden rounded-sm" style={{ boxShadow: "0 4px 24px rgba(14,20,32,0.10)" }}>
                <img src={photoImg} alt="Residential project — Napa Valley" className="w-full object-cover" style={{ height: 280 }} loading="lazy" />
              </div>
              <div>
                <h3 className="font-display font-semibold tracking-[-0.025em] mb-6" style={{ fontSize: "1.0625rem", color: CHARCOAL }}>A brief history</h3>
                <ol className="relative pl-6 space-y-6" style={{ borderLeft: `2px solid ${PEBBLE}` }}>
                  {TIMELINE.map((item) => (
                    <li key={item.year} className="relative">
                      <span className="absolute -left-[1.65rem] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: BLUE, background: WHITE }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: BLUE }} />
                      </span>
                      <p className="font-display font-extrabold tracking-wide mb-1" style={{ fontSize: "0.75rem", color: BLUE }}>{item.year}</p>
                      <p className="font-body leading-[1.6]" style={{ fontSize: "0.9375rem", color: SLATE }}>{item.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA Band ── */}
      <section className="py-24" style={{ background: CHARCOAL, borderTop: `3px solid ${BLUE}` }}>
        <Container size="narrow">
          <div className="text-center flex flex-col items-center gap-6">
            <h2 className="font-display font-extrabold tracking-[-0.04em] leading-[1.1]" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: CLOUD }}>
              Ready to start a conversation?
            </h2>
            <p className="font-body leading-[1.7]" style={{ fontSize: "1.0625rem", color: "rgba(248,249,252,0.50)", maxWidth: "42ch" }}>
              We schedule site walkthroughs with our principal builders directly — no sales intermediaries.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link to="/contact" className="group inline-flex items-center gap-2.5 font-display font-semibold rounded-sm px-8 py-4 transition-colors duration-200" style={{ background: BLUE, color: WHITE, fontSize: "0.9375rem" }}
                onMouseEnter={e => (e.currentTarget.style.background = COBALT)}
                onMouseLeave={e => (e.currentTarget.style.background = BLUE)}>
                Request an Estimate <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a href="tel:707-555-0192" className="inline-flex items-center gap-2.5 font-display font-semibold rounded-sm px-8 py-4 transition-colors duration-200" style={{ border: "1px solid rgba(248,249,252,0.18)", color: "rgba(248,249,252,0.65)", fontSize: "0.9375rem" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(248,249,252,0.38)"; e.currentTarget.style.color = CLOUD }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(248,249,252,0.18)"; e.currentTarget.style.color = "rgba(248,249,252,0.65)" }}>
                <Phone style={{ width: 16, height: 16 }} /> (707) 555-0192
              </a>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  )
}
