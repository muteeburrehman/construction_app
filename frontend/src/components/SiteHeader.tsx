import React, { useState, useEffect } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { Menu, X, Phone, ArrowRight } from "lucide-react"
import { Container } from "@/components/ui/layout"

/* ── Brand tokens ── */
const COBALT   = "#1A3A6B"
const BLUE     = "#2E5BA8"
const CHARCOAL = "#1E2532"
const SLATE    = "#4A5568"
const IRON     = "#8A94A6"
const PEBBLE   = "#DDE2EC"

const NAV_LINKS = [
  { label: "Work",        href: "/work" },
  { label: "Residential", href: "/services/residential" },
  { label: "Commercial",  href: "/services/commercial" },
  { label: "About",       href: "/about" },
  { label: "Contact",     href: "/contact" },
]

export function SiteHeader(): React.JSX.Element {
  const [isOpen, setIsOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  const [prevPath, setPrevPath] = useState(location.pathname)
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
    setIsOpen(false)
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: "#FFFFFF",
        borderBottom: `1px solid ${PEBBLE}`,
        boxShadow: scrolled ? "0 2px 20px rgba(14,20,32,0.08)" : "none",
        transition: "box-shadow 0.25s ease",
      }}
    >
      <Container size="wide">
        <div className="flex h-[68px] items-center justify-between">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-3 rounded-sm"
            aria-label="Apex Construction Group — Home"
          >
            <div
              className="h-9 w-9 rounded-sm flex items-center justify-center font-display font-extrabold text-white text-base tracking-tight shadow-sm"
              style={{ background: `linear-gradient(135deg, ${CHARCOAL} 0%, #111622 100%)`, border: `1px solid ${PEBBLE}` }}
            >
              A
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="font-display font-extrabold tracking-[-0.035em] leading-none transition-colors duration-200"
                style={{ fontSize: "0.9375rem", color: CHARCOAL }}
              >
                Apex Construction
              </span>
              <span
                className="font-display font-semibold tracking-[0.08em] uppercase mt-0.5"
                style={{ fontSize: "0.5625rem", color: IRON }}
              >
                Group · Luxury Builders
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className="group relative font-display font-semibold py-1 transition-colors duration-200"
                style={({ isActive }) => ({
                  fontSize: "0.8125rem",
                  color: isActive ? BLUE : SLATE,
                  letterSpacing: "-0.005em",
                })}
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {/* hover/active underline */}
                    <span
                      className="absolute left-0 right-0 -bottom-1 h-[2px] rounded-full transition-all duration-200"
                      style={{
                        background: BLUE,
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "scaleX(1)" : "scaleX(0.5)",
                      }}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop Actions ── */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:707-555-0192"
              className="flex items-center gap-1.5 font-display font-semibold px-2 py-1.5 transition-colors duration-200"
              style={{ fontSize: "0.75rem", color: IRON }}
              onMouseEnter={e => (e.currentTarget.style.color = CHARCOAL)}
              onMouseLeave={e => (e.currentTarget.style.color = IRON)}
              aria-label="Call (707) 555-0192"
            >
              <Phone style={{ width: 13, height: 13 }} />
              <span>(707) 555-0192</span>
            </a>

            <div style={{ width: 1, height: 18, background: PEBBLE }} />

            <Link
              to="/contact"
              className="group flex items-center gap-2 font-display font-semibold text-white rounded-sm px-5 py-2.5 transition-colors duration-200"
              style={{ fontSize: "0.8125rem", background: BLUE }}
              onMouseEnter={e => (e.currentTarget.style.background = COBALT)}
              onMouseLeave={e => (e.currentTarget.style.background = BLUE)}
            >
              Request an Estimate
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* ── Mobile ── */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/contact"
              className="font-display font-semibold text-white rounded-sm px-4 py-2 text-xs"
              style={{ background: BLUE }}
            >
              Estimate
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-sm transition-colors"
              style={{ color: CHARCOAL }}
              aria-label={isOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={isOpen}
            >
              {isOpen
                ? <X style={{ width: 20, height: 20 }} />
                : <Menu style={{ width: 20, height: 20 }} />}
            </button>
          </div>

        </div>
      </Container>

      {/* ── Mobile Drawer ── */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? "420px" : "0",
          borderTop: isOpen ? `1px solid ${PEBBLE}` : "none",
        }}
      >
        <div style={{ background: CHARCOAL }}>
          <nav className="flex flex-col px-5 pt-4 pb-2" aria-label="Mobile navigation">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-4 font-display font-semibold text-base transition-colors"
                style={({ isActive }) => ({
                  color: isActive ? "#FFFFFF" : "rgba(248,249,252,0.55)",
                  borderBottom: "1px solid rgba(248,249,252,0.08)",
                })}
              >
                <span>{item.label}</span>
                <ArrowRight style={{ width: 14, height: 14, opacity: 0.4 }} />
              </NavLink>
            ))}
          </nav>
          <div className="px-5 pt-3 pb-6 flex flex-col gap-3">
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full text-center font-display font-semibold rounded-sm py-3 text-sm"
              style={{ background: BLUE, color: "#FFFFFF" }}
            >
              Request an Estimate
            </Link>
            <a
              href="tel:707-555-0192"
              className="flex items-center justify-center gap-2 font-display font-semibold text-sm py-2"
              style={{ color: "rgba(248,249,252,0.45)" }}
            >
              <Phone style={{ width: 14, height: 14 }} />
              <span>(707) 555-0192</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

