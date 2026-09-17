import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Phone, CheckCircle } from "lucide-react"
import { PageShell } from "@/components/PageShell"
import { Container } from "@/components/ui/layout"
import heroImg  from "@/assets/wix/hero_home.jpg"
import cardRes  from "@/assets/wix/card_residential.jpg"
import cardCom  from "@/assets/wix/card_commercial.jpg"
import cardHome from "@/assets/wix/card_home.jpg"

const COBALT   = "#1A3A6B"
const BLUE     = "#2E5BA8"
const SKY      = "#4A7DD4"
const CHARCOAL = "#1E2532"
const SLATE    = "#4A5568"
const CLOUD    = "#F8F9FC"
const PEBBLE   = "#DDE2EC"
const WHITE    = "#FFFFFF"

const SERVICES = [
  {
    title: "Custom Homes",
    sub: "Residential",
    href: "/services/residential",
    img: cardRes,
    desc: "Ground-up custom residences on Napa's hillsides and valley floor. From permit to punch list.",
  },
  {
    title: "Commercial & Winery",
    sub: "Commercial",
    href: "/services/commercial",
    img: cardCom,
    desc: "Winery facilities, tasting rooms, tenant improvements, and light commercial construction.",
  },
  {
    title: "Remodels & Additions",
    sub: "Residential",
    href: "/services/residential",
    img: cardHome,
    desc: "Whole-home remodels, structural additions, and high-craft finish work on existing properties.",
  },
]

const STATS = [
  { value: "45+", label: "Years in Business" },
  { value: "1979", label: "Founded in Napa" },
  { value: "100%", label: "Owner-Led Projects" },
  { value: "902560", label: "CSLB License" },
]

const VALUES = [
  "No sub-managed sites — Eric is present every morning",
  "Open-book time-and-materials pricing",
  "Decades of Napa permitting and hillside experience",
  "Custom craft work, not production building",
]

export function HomePage(): React.JSX.Element {
  return (
    <PageShell
      seo={{
        title: "Eric Sherwood Construction | Napa Valley Custom Builder Since 1979",
        description:
          "High-end custom residential and commercial general contractor in Napa Valley. Owner-led since 1979. CSLB Lic. 902560.",
      }}
    >
      {/* ══════ HERO ══════ */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "92vh" }}>
        <img
          src={heroImg}
          alt="Eric Sherwood Construction — custom Napa Valley residence"
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
        />
        {/* deep blue-tinted overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(110deg, rgba(14,20,32,0.90) 0%, rgba(14,20,32,0.72) 55%, rgba(14,20,32,0.30) 100%)",
          }}
        />
        {/* blue accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: BLUE }} />

        <Container size="wide" className="relative z-10">
          <div className="flex flex-col justify-center min-h-[88vh] pt-16 pb-24">
            {/* Badge */}
            <div className="flex items-center gap-3 mb-8">
              <span className="font-display font-semibold tracking-[0.16em] uppercase" style={{ fontSize: "0.625rem", color: SKY }}>
                Napa Valley
              </span>
              <div style={{ width: 24, height: 1, background: SKY }} />
              <span className="font-display font-semibold tracking-[0.16em] uppercase" style={{ fontSize: "0.625rem", color: "rgba(248,249,252,0.38)" }}>
                Est. 1979
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display font-extrabold tracking-[-0.04em] leading-[1.0] mb-8"
              style={{ fontSize: "clamp(2.75rem, 7vw, 5.5rem)", color: CLOUD, maxWidth: "14ch" }}
            >
              Built by the builder<br />
              <span style={{ color: CLOUD, opacity: 0.45 }}>you called.</span>
            </h1>

            {/* Subhead */}
            <p
              className="font-body leading-[1.7] mb-10"
              style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)", color: "rgba(248,249,252,0.58)", maxWidth: "48ch" }}
            >
              Custom residential and commercial construction in Napa Valley.
              Owner-led since 1979. The same hands on your project from initial
              conversation to final walkthrough.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2.5 font-display font-semibold rounded-sm px-7 py-4 transition-colors duration-200"
                style={{ background: BLUE, color: WHITE, fontSize: "0.9375rem" }}
                onMouseEnter={e => (e.currentTarget.style.background = COBALT)}
                onMouseLeave={e => (e.currentTarget.style.background = BLUE)}
              >
                Request an Estimate
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/work"
                className="group inline-flex items-center gap-2.5 font-display font-semibold rounded-sm px-7 py-4 transition-colors duration-200"
                style={{ border: "1px solid rgba(248,249,252,0.22)", color: "rgba(248,249,252,0.72)", fontSize: "0.9375rem" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(248,249,252,0.48)"; e.currentTarget.style.color = CLOUD }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(248,249,252,0.22)"; e.currentTarget.style.color = "rgba(248,249,252,0.72)" }}
              >
                View Projects
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </Container>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px animate-bounce" style={{ height: 36, background: "linear-gradient(to bottom, rgba(248,249,252,0.30), transparent)" }} />
        </div>
      </section>


      {/* ══════ STAT BAR ══════ */}
      <section style={{ background: BLUE }}>
        <Container size="wide">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="py-10 text-center"
                style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.12)" : "none" }}
              >
                <p
                  className="font-display font-extrabold tracking-[-0.04em] leading-none mb-1.5"
                  style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", color: WHITE }}
                >
                  {s.value}
                </p>
                <p
                  className="font-display font-semibold tracking-[0.1em] uppercase"
                  style={{ fontSize: "0.5625rem", color: "rgba(255,255,255,0.50)" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>


      {/* ══════ SERVICES GRID ══════ */}
      <section className="py-24 sm:py-32" style={{ background: CLOUD }}>
        <Container size="wide">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <div className="h-[2px] w-10 mb-5" style={{ background: BLUE }} />
              <h2
                className="font-display font-extrabold tracking-[-0.04em] leading-[1.1]"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: CHARCOAL }}
              >
                What we build
              </h2>
            </div>
            <Link
              to="/work"
              className="group inline-flex items-center gap-2 font-display font-semibold text-sm transition-colors"
              style={{ color: BLUE }}
              onMouseEnter={e => (e.currentTarget.style.color = COBALT)}
              onMouseLeave={e => (e.currentTarget.style.color = BLUE)}
            >
              See all projects
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc) => (
              <Link
                key={svc.title}
                to={svc.href}
                className="group block overflow-hidden rounded-sm"
                style={{ background: WHITE, boxShadow: "0 1px 4px rgba(14,20,32,0.06)", border: `1px solid ${PEBBLE}` }}
              >
                {/* Image */}
                <div className="overflow-hidden" style={{ height: 240 }}>
                  <img
                    src={svc.img}
                    alt={svc.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
                {/* Body */}
                <div className="p-6">
                  <p className="font-display font-semibold tracking-[0.1em] uppercase mb-2" style={{ fontSize: "0.5625rem", color: BLUE }}>
                    {svc.sub}
                  </p>
                  <h3 className="font-display font-extrabold tracking-[-0.025em] mb-3" style={{ fontSize: "1.1875rem", color: CHARCOAL }}>
                    {svc.title}
                  </h3>
                  <p className="font-body leading-[1.65]" style={{ fontSize: "0.9375rem", color: SLATE }}>
                    {svc.desc}
                  </p>
                  <div
                    className="flex items-center gap-2 font-display font-semibold text-sm mt-5 transition-colors"
                    style={{ color: BLUE }}
                  >
                    Learn more <ArrowRight style={{ width: 13, height: 13 }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>


      {/* ══════ ABOUT SPLIT ══════ */}
      <section className="py-24 sm:py-32" style={{ background: WHITE }}>
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Text */}
            <div>
              <div className="h-[2px] w-10 mb-6" style={{ background: BLUE }} />
              <h2
                className="font-display font-extrabold tracking-[-0.04em] leading-[1.1] mb-6"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: CHARCOAL }}
              >
                The builder you speak with<br />
                is the one on your site.
              </h2>
              <p className="font-body leading-[1.75] mb-5" style={{ fontSize: "1.0625rem", color: SLATE, maxWidth: "54ch" }}>
                Eric Sherwood has been building in Napa Valley since 1979. No
                handoffs, no administration layers. The person who discusses
                your project is the person who runs it.
              </p>
              <p className="font-body leading-[1.75] mb-10" style={{ fontSize: "1.0625rem", color: SLATE, maxWidth: "54ch" }}>
                Forty-five years of hillside homes, winery facilities, and fine
                architectural work across Napa and Sonoma counties.
              </p>

              <ul className="flex flex-col gap-3 mb-10">
                {VALUES.map((v) => (
                  <li key={v} className="flex items-start gap-3">
                    <CheckCircle style={{ width: 16, height: 16, color: BLUE, flexShrink: 0, marginTop: 2 }} />
                    <span className="font-body leading-[1.55]" style={{ fontSize: "0.9375rem", color: SLATE }}>
                      {v}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-2 font-display font-semibold rounded-sm px-6 py-3 transition-colors duration-200"
                  style={{ background: BLUE, color: WHITE, fontSize: "0.875rem" }}
                  onMouseEnter={e => (e.currentTarget.style.background = COBALT)}
                  onMouseLeave={e => (e.currentTarget.style.background = BLUE)}
                >
                  About Eric Sherwood
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                  href="tel:707-255-3875"
                  className="inline-flex items-center gap-2 font-display font-semibold rounded-sm px-6 py-3 transition-colors duration-200"
                  style={{ border: `1px solid ${PEBBLE}`, color: CHARCOAL, fontSize: "0.875rem" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = BLUE)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = PEBBLE)}
                >
                  <Phone style={{ width: 14, height: 14 }} />
                  707-255-3875
                </a>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="overflow-hidden rounded-sm" style={{ boxShadow: "0 8px 40px rgba(14,20,32,0.14)" }}>
                <img
                  src={cardCom}
                  alt="Eric Sherwood Construction project — Napa Valley"
                  className="w-full object-cover"
                  style={{ height: 460 }}
                  loading="lazy"
                />
              </div>
              <div
                className="absolute -bottom-5 -left-5 font-display font-extrabold"
                style={{ background: BLUE, color: WHITE, padding: "1.25rem 1.75rem", fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                Since 1979
              </div>
            </div>

          </div>
        </Container>
      </section>


      {/* ══════ CTA BAND ══════ */}
      <section className="py-24" style={{ background: CHARCOAL, borderTop: `3px solid ${BLUE}` }}>
        <Container size="narrow">
          <div className="text-center flex flex-col items-center gap-6">
            <h2
              className="font-display font-extrabold tracking-[-0.04em] leading-[1.1]"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", color: CLOUD }}
            >
              Ready to start a conversation?
            </h2>
            <p className="font-body leading-[1.7]" style={{ fontSize: "1.0625rem", color: "rgba(248,249,252,0.50)", maxWidth: "42ch" }}>
              We schedule site walkthroughs with Eric directly — no
              sales intermediaries, no call centres.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2.5 font-display font-semibold rounded-sm px-8 py-4 transition-colors duration-200"
                style={{ background: BLUE, color: WHITE, fontSize: "0.9375rem" }}
                onMouseEnter={e => (e.currentTarget.style.background = COBALT)}
                onMouseLeave={e => (e.currentTarget.style.background = BLUE)}
              >
                Request an Estimate
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="tel:707-255-3875"
                className="inline-flex items-center gap-2.5 font-display font-semibold rounded-sm px-8 py-4 transition-colors duration-200"
                style={{ border: "1px solid rgba(248,249,252,0.18)", color: "rgba(248,249,252,0.68)", fontSize: "0.9375rem" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(248,249,252,0.38)"; e.currentTarget.style.color = CLOUD }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(248,249,252,0.18)"; e.currentTarget.style.color = "rgba(248,249,252,0.68)" }}
              >
                <Phone style={{ width: 16, height: 16 }} />
                707-255-3875
              </a>
            </div>
          </div>
        </Container>
      </section>

    </PageShell>
  )
}

