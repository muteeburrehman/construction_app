import React from "react"
import { Link } from "react-router-dom"
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react"
import { Container } from "@/components/ui/layout"
import logoSq from "@/assets/wix/logo_square.jpg"

const COBALT   = "#1A3A6B"
const BLUE     = "#2E5BA8"
const CHARCOAL = "#1E2532"
const IRON     = "#8A94A6"

const NAV_COLS = [
  {
    heading: "Projects",
    links: [
      { label: "All Work",    href: "/work" },
      { label: "Residential", href: "/services/residential" },
      { label: "Commercial",  href: "/services/commercial" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",   href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
]

export function SiteFooter(): React.JSX.Element {
  return (
    <footer style={{ background: CHARCOAL }}>

      {/* ── CTA Band ── */}
      <div style={{ borderBottom: "1px solid rgba(248,249,252,0.07)" }}>
        <Container size="wide">
          <div className="py-16 sm:py-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <p
                className="font-display font-semibold tracking-[0.12em] uppercase mb-3"
                style={{ fontSize: "0.6875rem", color: BLUE }}
              >
                Ready to build?
              </p>
              <h2
                className="font-display font-extrabold tracking-[-0.035em] leading-[1.06]"
                style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", color: "#F8F9FC" }}
              >
                Let's talk about<br />
                your project.
              </h2>
            </div>
            <Link
              to="/contact"
              className="group flex items-center gap-3 font-display font-semibold text-sm shrink-0 rounded-sm px-8 py-4 transition-colors duration-200"
              style={{ background: BLUE, color: "#FFFFFF" }}
              onMouseEnter={e => (e.currentTarget.style.background = COBALT)}
              onMouseLeave={e => (e.currentTarget.style.background = BLUE)}
            >
              Request an Estimate
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Container>
      </div>

      {/* ── Main Body ── */}
      <Container size="wide">
        <div className="py-16 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-12 lg:gap-16">

          {/* Brand Column */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-6" aria-label="Eric Sherwood Construction — Home">
              <img
                src={logoSq}
                alt=""
                className="h-10 w-10 rounded-sm object-cover"
                style={{ border: "1px solid rgba(248,249,252,0.12)" }}
              />
              <div className="flex flex-col leading-none">
                <span
                  className="font-display font-extrabold tracking-[-0.03em] uppercase"
                  style={{ fontSize: "0.9375rem", color: "#F8F9FC" }}
                >
                  Eric Sherwood
                </span>
                <span
                  className="font-display font-semibold tracking-[0.06em] uppercase mt-0.5"
                  style={{ fontSize: "0.5625rem", color: "rgba(248,249,252,0.30)" }}
                >
                  Construction
                </span>
              </div>
            </Link>

            <p
              className="font-body leading-relaxed mb-6"
              style={{ fontSize: "0.9375rem", color: "rgba(248,249,252,0.42)", maxWidth: "30ch" }}
            >
              Napa Valley's premier custom general contractor since 1979.
              Owner-led, on site every morning.
            </p>

            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="tel:707-255-3875"
                  className="flex items-center gap-2.5 text-sm font-display transition-colors"
                  style={{ color: "rgba(248,249,252,0.45)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#F8F9FC")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,249,252,0.45)")}
                >
                  <Phone style={{ width: 13, height: 13, color: BLUE, flexShrink: 0 }} />
                  707-255-3875
                </a>
              </li>
              <li>
                <a
                  href="mailto:eric@ericsherwoodconstruction.com"
                  className="flex items-center gap-2.5 text-sm font-display transition-colors"
                  style={{ color: "rgba(248,249,252,0.45)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#F8F9FC")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,249,252,0.45)")}
                >
                  <Mail style={{ width: 13, height: 13, color: BLUE, flexShrink: 0 }} />
                  eric@ericsherwoodconstruction.com
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm font-display" style={{ color: "rgba(248,249,252,0.28)" }}>
                <MapPin style={{ width: 13, height: 13, color: IRON, flexShrink: 0 }} />
                Napa Valley, CA
              </li>
            </ul>
          </div>

          {/* Nav Columns */}
          {NAV_COLS.map((col) => (
            <div key={col.heading}>
              <p
                className="font-display font-semibold tracking-[0.1em] uppercase mb-5"
                style={{ fontSize: "0.625rem", color: "rgba(248,249,252,0.22)" }}
              >
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm font-display font-semibold transition-colors"
                      style={{ color: "rgba(248,249,252,0.50)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#F8F9FC")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,249,252,0.50)")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(248,249,252,0.07)" }}
        >
          <p className="text-xs font-display" style={{ color: "rgba(248,249,252,0.22)" }}>
            © {new Date().getFullYear()} Eric Sherwood Construction. All rights reserved.
          </p>
          <p className="text-xs font-display" style={{ color: "rgba(248,249,252,0.16)" }}>
            CSLB Lic. 902560 · Napa Valley, CA
          </p>
        </div>
      </Container>
    </footer>
  )
}

