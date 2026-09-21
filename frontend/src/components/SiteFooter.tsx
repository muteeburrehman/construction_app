import React from "react"
import { Link } from "react-router-dom"
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react"
import { Container } from "@/components/ui/layout"

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
      { label: "Admin Portal", href: "/admin" },
    ],
  },
]

// Official Social Media Icons matching original website
function YouTubeIcon(): React.JSX.Element {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#FF0000" />
      <path d="M10 8.5L15.5 12L10 15.5V8.5Z" fill="white" />
    </svg>
  )
}

function LinkedInIcon(): React.JSX.Element {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        d="M6.5 6.5C6.5 7.32843 5.82843 8 5 8C4.17157 8 3.5 7.32843 3.5 6.5C3.5 5.67157 4.17157 5 5 5C5.82843 5 6.5 5.67157 6.5 6.5ZM6.5 9.5H3.5V19H6.5V9.5ZM11.5 9.5H8.5V19H11.5V14.17C11.5 11.55 14.86 11.37 14.86 14.17V19H17.86V13.25C17.86 8.78 12.72 8.94 11.5 11.23V9.5Z"
        fill="white"
      />
    </svg>
  )
}

function FacebookIcon(): React.JSX.Element {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#1877F2" />
      <path
        d="M15 11.5H12.5V19H9.5V11.5H8V9H9.5V7.25C9.5 5.87 10.38 5 11.77 5C12.44 5 13.1 5.08 13.1 5.08V6.58H12.33C11.64 6.58 11.43 7.01 11.43 7.45V9H14.85L15 11.5Z"
        fill="white"
      />
    </svg>
  )
}

interface SiteSettingsData {
  company_name: string
  phone: string
  email: string
  license_number: string
  youtube_url: string
  linkedin_url: string
  facebook_url: string
}

const DEFAULT_SETTINGS: SiteSettingsData = {
  company_name: "Apex Construction Group",
  phone: "(707) 555-0192",
  email: "info@muteeblabs.com",
  license_number: "Licensed, Bonded & Insured (Lic. #849201)",
  youtube_url: "",
  linkedin_url: "",
  facebook_url: "",
}

export function SiteFooter(): React.JSX.Element {
  const [settings, setSettings] = React.useState<SiteSettingsData>(DEFAULT_SETTINGS)

  React.useEffect(() => {
    fetch("/api/v1/site-settings/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load settings")
        return res.json()
      })
      .then((data: Partial<SiteSettingsData>) => {
        setSettings((prev) => ({
          ...prev,
          ...data,
        }))
      })
      .catch(() => {
        // Fallback silently to DEFAULT_SETTINGS
      })
  }, [])

  return (
    <footer style={{ background: CHARCOAL }}>

      {/* ── CTA Band ── */}
      <div style={{ borderBottom: "1px solid rgba(248,249,252,0.07)" }}>
        <Container size="wide">
          <div className="py-16 sm:py-20 flex flex-col sm:row items-start sm:items-center justify-between gap-8">
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
            <Link to="/" className="inline-flex items-center gap-3 mb-6" aria-label="Apex Construction Group — Home">
              <div
                className="h-10 w-10 rounded-sm flex items-center justify-center font-display font-extrabold text-white text-base tracking-tight shadow-sm"
                style={{ background: `linear-gradient(135deg, ${CHARCOAL} 0%, #111622 100%)`, border: "1px solid rgba(248,249,252,0.18)" }}
              >
                A
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="font-display font-extrabold tracking-[-0.03em] uppercase"
                  style={{ fontSize: "0.9375rem", color: "#F8F9FC" }}
                >
                  {settings.company_name}
                </span>
                <span
                  className="font-display font-semibold tracking-[0.06em] uppercase mt-0.5"
                  style={{ fontSize: "0.5625rem", color: "rgba(248,249,252,0.30)" }}
                >
                  Custom Estate & Commercial Builders
                </span>
              </div>
            </Link>

            <p
              className="font-body leading-relaxed mb-6"
              style={{ fontSize: "0.9375rem", color: "rgba(248,249,252,0.42)", maxWidth: "30ch" }}
            >
              Premier custom residential and commercial general contractors. Master craftsmanship and transparent accountability on every project.
            </p>

            {/* Direct Contact Details */}
            <ul className="flex flex-col gap-3 mb-6">
              <li>
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-2.5 text-sm font-display transition-colors"
                  style={{ color: "rgba(248,249,252,0.65)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#F8F9FC")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,249,252,0.65)")}
                >
                  <Phone style={{ width: 13, height: 13, color: BLUE, flexShrink: 0 }} />
                  {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2.5 text-sm font-display transition-colors"
                  style={{ color: "rgba(248,249,252,0.65)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#F8F9FC")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,249,252,0.65)")}
                >
                  <Mail style={{ width: 13, height: 13, color: BLUE, flexShrink: 0 }} />
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm font-display" style={{ color: "rgba(248,249,252,0.38)" }}>
                <MapPin style={{ width: 13, height: 13, color: IRON, flexShrink: 0 }} />
                Napa Valley, CA
              </li>
            </ul>

            {/* Social Media Links from original website */}
            <div>
              <p
                className="font-display font-semibold tracking-[0.1em] uppercase mb-2.5"
                style={{ fontSize: "0.625rem", color: "rgba(248,249,252,0.35)" }}
              >
                Connect With Us
              </p>
              <div className="flex items-center gap-3">
                {settings.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${settings.company_name} on YouTube`}
                    className="transition-transform hover:scale-105"
                    title="YouTube"
                  >
                    <YouTubeIcon />
                  </a>
                )}
                {settings.linkedin_url && (
                  <a
                    href={settings.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${settings.company_name} on LinkedIn`}
                    className="transition-transform hover:scale-105"
                    title="LinkedIn"
                  >
                    <LinkedInIcon />
                  </a>
                )}
                {settings.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${settings.company_name} on Facebook`}
                    className="transition-transform hover:scale-105"
                    title="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Nav Columns */}
          {NAV_COLS.map((col) => (
            <div key={col.heading}>
              <p
                className="font-display font-semibold tracking-[0.1em] uppercase mb-5"
                style={{ fontSize: "0.625rem", color: "rgba(248,249,252,0.35)" }}
              >
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm font-display font-semibold transition-colors"
                      style={{ color: "rgba(248,249,252,0.55)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#F8F9FC")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,249,252,0.55)")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar matching original site */}
        <div
          className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(248,249,252,0.07)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-sm flex items-center justify-center font-display font-black text-xs text-white opacity-70"
              style={{ background: "#111622", border: "1px solid rgba(248,249,252,0.2)" }}
            >
              A
            </div>
            <p className="text-xs font-display" style={{ color: "rgba(248,249,252,0.40)" }}>
              © {new Date().getFullYear()}, {settings.company_name || "Apex Construction Group"}. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              {settings.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-75 hover:opacity-100 transition-opacity"
                  title="YouTube"
                >
                  <YouTubeIcon />
                </a>
              )}
              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-75 hover:opacity-100 transition-opacity"
                  title="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
              )}
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-75 hover:opacity-100 transition-opacity"
                  title="Facebook"
                >
                  <FacebookIcon />
                </a>
              )}
            </div>
            <p className="text-xs font-display font-semibold" style={{ color: "#4A7DD4" }}>
              {settings.license_number}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
