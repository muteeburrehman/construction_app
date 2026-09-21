import React, { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  Phone,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building2,
  Home,
  Layers,
  MapPin,
  ArrowUpRight,
  Eye,
  Star,
  Quote,
  Clock,
  Compass,
  Award,
} from "lucide-react"
import { PageShell } from "@/components/PageShell"
import { Container } from "@/components/ui/layout"
import heroImg from "@/assets/wix/hero_home.jpg"
import cardRes from "@/assets/wix/card_residential.jpg"
import cardCom from "@/assets/wix/card_commercial.jpg"
import cardHome from "@/assets/wix/card_home.jpg"
import builderCraftImg from "@/assets/wix/project_interior_living.jpg"

const COBALT = "#1A3A6B"
const BLUE = "#2E5BA8"
const SLATE = "#475569"
const IRON = "#94A3B8"
const PEBBLE = "#E2E8F0"
const WHITE = "#FFFFFF"

interface HomeProject {
  id: string | number
  slug: string
  title: string
  category: "Residential" | "Commercial"
  category_display: string
  location: string
  year?: number | string
  scope: string
  summary: string
  is_featured?: boolean
  img: string
  tags: string[]
}

interface HomeTestimonial {
  id: string
  author: string
  role_or_location: string
  quote: string
  project_title?: string
}

const FALLBACK_FEATURED_PROJECTS: HomeProject[] = [
  {
    id: 1,
    slug: "silverado-trail-estate",
    title: "Silverado Trail Estate",
    category: "Residential",
    category_display: "Custom Residential",
    location: "Yountville, CA",
    year: 2023,
    scope: "Ground-up 6,800 sq ft limestone residence",
    summary:
      "Expansive valley-floor estate marrying precision Douglas fir timber framing with hand-cut Napa limestone masonry.",
    img: cardRes,
    is_featured: true,
    tags: ["Ground-Up Build", "Napa Limestone", "Vineyard Topography"],
  },
  {
    id: 2,
    slug: "st-helena-vineyard-residence",
    title: "St. Helena Vineyard Residence",
    category: "Residential",
    category_display: "Custom Residential",
    location: "St. Helena, CA",
    year: 2022,
    scope: "5,400 sq ft hillside residence + cantilever terrace",
    summary:
      "Steep-slope architectural build overlooking private cabernet sauvignon vineyard parcels in St. Helena.",
    img: cardHome,
    is_featured: true,
    tags: ["Hillside Terrain", "Cantilever Deck", "WUI Fire-Zone"],
  },
  {
    id: 3,
    slug: "rutherford-winery-hospitality-pavilion",
    title: "Rutherford Winery Hospitality Pavilion",
    category: "Commercial",
    category_display: "Commercial & Winery",
    location: "Rutherford, CA",
    year: 2021,
    scope: "4,200 sq ft tasting pavilion & private salon",
    summary:
      "Contemporary glass and structural steel hospitality expansion for a heritage Napa Valley estate producer.",
    img: cardCom,
    is_featured: true,
    tags: ["Winery Hospitality", "Steel & Glass", "Private Tasting"],
  },
  {
    id: 4,
    slug: "calistoga-hillside-retreat",
    title: "Calistoga Hillside Retreat",
    category: "Residential",
    category_display: "Custom Residential",
    location: "Calistoga, CA",
    year: 2024,
    scope: "4,800 sq ft concrete, steel, & timber estate",
    summary:
      "Engineered foundation and non-combustible architectural envelope perched above Calistoga's northern valley floor.",
    img: heroImg,
    is_featured: true,
    tags: ["High Fire-Hazard Zone", "Engineered Piers", "Solar Microgrid"],
  },
]

const SERVICES = [
  {
    title: "Custom Residential Estates",
    sub: "Residential Construction",
    href: "/services/residential",
    img: cardRes,
    desc: "Ground-up architectural residences built on challenging vineyard terrain, steep hillside slopes, and sensitive ecological sites.",
    capabilities: ["Engineered Deep Foundations", "Architectural Timber Framing", "WUI Fire-Safe Construction"],
  },
  {
    title: "Commercial & Winery Facilities",
    sub: "Commercial Division",
    href: "/services/commercial",
    img: cardCom,
    desc: "Winery production facilities, private tasting salons, subterranean barrel cellars, and boutique hospitality improvements.",
    capabilities: ["Phased Harvest Construction", "Subterranean Barrel Vaults", "Hospitality Buildouts"],
  },
  {
    title: "Architectural Remodels & Restorations",
    sub: "Estate Modernization",
    href: "/services/residential",
    img: cardHome,
    desc: "Whole-home architectural rehabilitations, historical vineyard estate restorations, structural additions, and custom millwork.",
    capabilities: ["Historic Timber Restoration", "Seismic Structural Upgrades", "Open-Plan Conversions"],
  },
]

const STATS = [
  { value: "25+", label: "Years in Business", sub: "Continuously in California" },
  { value: "1998", label: "Founded", sub: "Premier General Contractor" },
  { value: "100%", label: "Principal-Supervised", sub: "On site every morning" },
  { value: "#849201", label: "CSLB License", sub: "Class B General Building" },
]

const PILLARS = [
  {
    title: "Direct Builder Accountability",
    desc: "The contractor who bids your project is the one directing field trades every morning at 7:00 AM. No administration layers or junior superintendents.",
    icon: ShieldCheck,
  },
  {
    title: "Over Two Decades of Wine Country Mastery",
    desc: "Deep mastery of California soils, steep hillside grading, riparian setbacks, and complex municipal permitting requirements.",
    icon: Compass,
  },
  {
    title: "WUI High Fire-Hazard Expertise",
    desc: "Specialized in California Wildland-Urban Interface (WUI) compliance: non-combustible building envelopes, fire-rated assemblies, and defensible space design.",
    icon: Award,
  },
  {
    title: "Open-Book Time & Materials",
    desc: "Transparent, honest financial management. Every receipt, subcontractor invoice, and material order is accessible with zero hidden markups.",
    icon: Clock,
  },
]

const FALLBACK_TESTIMONIALS: HomeTestimonial[] = [
  {
    id: "1",
    author: "David & Marcus L.",
    role_or_location: "Estate Owners, Silverado Trail, Yountville",
    quote:
      "The project team was on site every morning before the sun cleared the ridge. Their transparent billing meant we knew where every dollar went, and the craftsmanship on our timber framing and stone masonry is unmatched.",
    project_title: "Silverado Trail Estate",
  },
  {
    id: "2",
    author: "Sarah K., Principal Architect",
    role_or_location: "San Francisco & St. Helena Architectural Studio",
    quote:
      "Working with Apex Construction Group is a true collaboration. They translate delicate architectural details into durable, seismic-rated field reality and solve complex engineering issues before they cause delays.",
    project_title: "St. Helena Vineyard Residence",
  },
  {
    id: "3",
    author: "Robert M., Managing Partner",
    role_or_location: "Rutherford Estate Winery",
    quote:
      "When expanding our tasting room, we couldn't afford downtime during harvest. The team phased construction flawlessly, delivered on schedule, and the finished millwork routinely receives compliments from our guests.",
    project_title: "Rutherford Winery Tasting Pavilion",
  },
]

export function HomePage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<"All" | "Residential" | "Commercial">("All")
  const [projects, setProjects] = useState<HomeProject[]>(FALLBACK_FEATURED_PROJECTS)
  const [testimonials, setTestimonials] = useState<HomeTestimonial[]>(FALLBACK_TESTIMONIALS)

  // Fetch dynamic projects & testimonials from backend
  useEffect(() => {
    let isMounted = true
    async function loadData() {
      try {
        const pRes = await fetch("/api/v1/projects/")
        if (pRes.ok) {
          const pData = await pRes.json()
          const pList = Array.isArray(pData) ? pData : pData.results || []
          if (pList.length > 0 && isMounted) {
            const mapped: HomeProject[] = pList.slice(0, 6).map((item: any, idx: number) => {
              const cat = item.category?.toLowerCase() === "commercial" ? "Commercial" : "Residential"
              return {
                id: item.id || idx,
                slug: item.slug,
                title: item.title,
                category: cat,
                category_display: item.category_display || (cat === "Residential" ? "Custom Residential" : "Commercial & Winery"),
                location: item.location || "Napa Valley, CA",
                year: item.year || 2023,
                scope: item.scope || "Custom Architectural Construction",
                summary: item.summary || item.description || "Custom architectural build by Apex Construction Group.",
                img: item.cover_image?.image || FALLBACK_FEATURED_PROJECTS[idx % FALLBACK_FEATURED_PROJECTS.length].img,
                is_featured: Boolean(item.is_featured),
                tags: [item.location || "Napa Valley", item.scope ? item.scope.split(" ").slice(0, 2).join(" ") : "Custom Build"],
              }
            })
            setProjects(mapped)
          }
        }

        const tRes = await fetch("/api/v1/testimonials/")
        if (tRes.ok) {
          const tData = await tRes.json()
          const tList = Array.isArray(tData) ? tData : tData.results || []
          if (tList.length > 0 && isMounted) {
            setTestimonials(tList)
          }
        }
      } catch {
        // Fallback to static data
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  // Filtered projects based on active tab
  const filteredProjects = useMemo(() => {
    if (activeTab === "All") return projects
    return projects.filter((p) => p.category === activeTab)
  }, [projects, activeTab])

  return (
    <PageShell
      seo={{
        title: "Apex Construction Group | Custom Residential & Commercial Builders",
        description:
          "High-end custom residential estates, architectural vineyard homes, and commercial facilities in Napa and Sonoma counties. Master general contracting. Licensed & Insured.",
      }}
    >
      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <section className="relative w-full overflow-hidden bg-slate-950" style={{ minHeight: "92vh" }}>
        {/* Hero Background Image */}
        <img
          src={heroImg}
          alt="Apex Construction Group — luxury estate construction"
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
          fetchPriority="high"
        />

        {/* Sophisticated Dark Indigo Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.78) 52%, rgba(26, 58, 107, 0.45) 100%)",
          }}
        />

        {/* Architectural grid accent watermark */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Top Cobalt Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: BLUE }} />

        <Container size="wide" className="relative z-10">
          <div className="flex flex-col justify-center min-h-[90vh] pt-20 pb-20">
            {/* Architectural Credential Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-xs mb-8 w-fit">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="font-display font-semibold tracking-[0.18em] uppercase text-[11px] text-blue-100">
                Licensed California General Contractor • CSLB #849201
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display font-black tracking-[-0.04em] leading-[1.02] text-white mb-8"
              style={{ fontSize: "clamp(2.85rem, 6.8vw, 5.75rem)", maxWidth: "15ch" }}
            >
              Built by the builder<br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(90deg, #93C5FD 0%, #60A5FA 50%, #FFFFFF 100%)",
                }}
              >
                you called.
              </span>
            </h1>

            {/* Sub-headline */}
            <p
              className="font-body leading-[1.75] text-slate-200 mb-10 max-w-2xl text-base sm:text-lg font-light"
            >
              Over twenty-five years of custom vineyard residences, steep hillside estates, and commercial
              facilities across Northern California. No brokers, no administrative layers — direct
              master-builder supervision from ground-breaking to completion.
            </p>

            {/* CTAs & Direct Contact */}
            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 font-display font-bold text-sm px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                style={{ background: BLUE, color: WHITE }}
              >
                <span>Request an Estimate</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/work"
                className="group inline-flex items-center gap-2.5 font-display font-semibold text-sm px-7 py-4 rounded-xl backdrop-blur-md border border-white/25 text-white hover:bg-white/10 transition-colors duration-200"
              >
                <span>Explore Portfolio</span>
                <ArrowUpRight className="w-4 h-4 text-blue-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <a
                href="tel:707-555-0192"
                className="inline-flex items-center gap-2.5 font-display font-semibold text-sm text-slate-300 hover:text-white transition-colors px-4 py-3"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Direct Line: (707) 555-0192</span>
              </a>
            </div>

            {/* Trust Highlights Floating Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/15">
              {[
                "100% On-Site Field Supervision",
                "Volcanic & Hillside Soil Mastery",
                "WUI High Fire-Hazard Zone Certified",
                "Open-Book Time & Materials Pricing",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/60 border border-white/10 text-xs text-slate-300 font-body backdrop-blur-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* Scroll Cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none hidden md:block">
          <div className="w-px h-8 bg-gradient-to-b from-blue-400/80 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ══════════════════ STATS & AUTHORITY RIBBON ══════════════════ */}
      <section style={{ background: COBALT, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
        <Container size="wide">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {STATS.map((s) => (
              <div key={s.label} className="py-8 px-6 text-center">
                <p
                  className="font-display font-black tracking-[-0.04em] leading-none mb-2 text-white"
                  style={{ fontSize: "clamp(2.25rem, 3.8vw, 3.25rem)" }}
                >
                  {s.value}
                </p>
                <p className="font-display font-bold text-xs uppercase tracking-wider text-blue-200 mb-1">
                  {s.label}
                </p>
                <p className="font-body text-[11px] text-blue-300/80">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════ WHAT WE BUILD (UNIFIED SERVICES) ══════════════════ */}
      <section className="py-24 sm:py-32" style={{ background: "#F8FAFC" }}>
        <Container size="wide">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-blue-800 text-[11px] font-display font-bold uppercase tracking-wider mb-3">
                <Building2 className="w-3.5 h-3.5" /> Construction Divisions
              </div>
              <h2
                className="font-display font-black tracking-[-0.04em] leading-[1.08] text-slate-900"
                style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
              >
                What We Build Across Napa Valley
              </h2>
            </div>
            <Link
              to="/work"
              className="group inline-flex items-center gap-2 font-display font-bold text-sm text-blue-700 hover:text-blue-900 transition-colors"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Unified Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {SERVICES.map((svc) => (
              <Link
                key={svc.title}
                to={svc.href}
                className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-blue-950/8 transition-all duration-300 transform hover:-translate-y-1.5"
              >
                {/* Image - Strict 16:10 ratio */}
                <div className="relative overflow-hidden bg-slate-100 shrink-0" style={{ aspectRatio: "16 / 10" }}>
                  <img
                    src={svc.img}
                    alt={svc.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 font-display font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-white/95 text-slate-800 backdrop-blur-md shadow-xs">
                    {svc.sub}
                  </div>
                </div>

                {/* Body - Strictly Unified Dimensions */}
                <div className="flex flex-col flex-1 p-7">
                  <h3 className="font-display font-extrabold text-xl text-slate-900 group-hover:text-blue-700 transition-colors mb-3 leading-snug min-h-[48px] line-clamp-2">
                    {svc.title}
                  </h3>
                  <p className="font-body text-xs text-slate-600 leading-relaxed mb-5 min-h-[58px] line-clamp-3">
                    {svc.desc}
                  </p>

                  {/* Capabilities Shelf */}
                  <div className="flex flex-wrap gap-1.5 min-h-[30px] mb-6">
                    {svc.capabilities.map((cap, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/60"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>

                  {/* Action Link - Pinned to bottom */}
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 font-display font-bold text-xs text-blue-700 group-hover:text-blue-900 transition-colors">
                    <span>Explore Division</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════ FEATURED ESTATES (DYNAMIC TABS + UNIFIED SIZES) ══════════ */}
      <section className="py-24 sm:py-32" style={{ background: WHITE, borderTop: `1px solid ${PEBBLE}` }}>
        <Container size="wide">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-blue-800 text-[11px] font-display font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Selected Works
              </div>
              <h2
                className="font-display font-black tracking-[-0.04em] leading-[1.08] text-slate-900"
                style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
              >
                Featured Napa & Sonoma Estates
              </h2>
              <p className="font-body text-sm text-slate-600 mt-2 max-w-xl">
                A curated selection of valley-floor vineyard estates, hillside cantilevered homes, and winery facilities.
              </p>
            </div>

            {/* Interactive Tab Selector */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100/80 border border-slate-200/70 self-start lg:self-end">
              {(
                [
                  { id: "All", label: "All Works", icon: Layers },
                  { id: "Residential", label: "Residential", icon: Home },
                  { id: "Commercial", label: "Winery & Commercial", icon: Building2 },
                ] as const
              ).map((tab) => {
                const IconComp = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-display font-semibold text-xs tracking-wide transition-all cursor-pointer"
                    style={
                      isActive
                        ? {
                            background: COBALT,
                            color: WHITE,
                            boxShadow: "0 2px 8px rgba(26, 58, 107, 0.25)",
                          }
                        : {
                            background: "transparent",
                            color: SLATE,
                          }
                    }
                  >
                    <IconComp className="w-3.5 h-3.5" style={{ color: isActive ? WHITE : IRON }} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Unified Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-blue-950/8 transition-all duration-300 transform hover:-translate-y-1.5"
              >
                {/* Image Area - Locked 16:10 ratio */}
                <div className="relative overflow-hidden bg-slate-100 shrink-0" style={{ aspectRatio: "16 / 10" }}>
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Floating Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="font-display font-semibold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full backdrop-blur-md bg-white/90 text-slate-800 shadow-xs border border-white/60 whitespace-nowrap">
                      {project.category_display}
                    </span>
                    <span className="inline-flex items-center gap-1 font-display font-medium text-[10px] px-2.5 py-1 rounded-full backdrop-blur-md bg-black/60 text-white shadow-xs whitespace-nowrap">
                      <MapPin className="w-3 h-3 text-blue-300" />
                      {project.location}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <Link
                      to="/work"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-display font-bold text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>View in Full Portfolio</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  </div>
                </div>

                {/* Content - Strictly Unified Component Heights */}
                <div className="flex flex-col flex-1 p-6">
                  {/* Scope & Year Strip */}
                  <div className="flex items-center justify-between text-xs text-slate-500 font-body mb-2 h-5">
                    <span className="font-semibold tracking-wide truncate max-w-[200px]" style={{ color: BLUE }}>
                      {project.scope}
                    </span>
                    {project.year && (
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {project.year}
                      </span>
                    )}
                  </div>

                  {/* Title - Locked Unified Height */}
                  <h3 className="font-display font-extrabold tracking-[-0.025em] text-lg text-slate-900 group-hover:text-blue-700 transition-colors mb-2 leading-snug line-clamp-2 min-h-[52px]">
                    {project.title}
                  </h3>

                  {/* Summary - Locked Unified Height */}
                  <p className="font-body text-xs leading-[1.65] text-slate-600 line-clamp-2 min-h-[40px] mb-3">
                    {project.summary}
                  </p>

                  {/* Feature Tags - Fixed Height Shelf */}
                  <div className="flex flex-wrap items-center gap-1.5 min-h-[28px] mb-4">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/60 whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Card Action Link - Pinned to Bottom */}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 font-display font-semibold text-xs text-blue-700 group-hover:text-blue-900 transition-colors">
                    <Link to="/work" className="inline-flex items-center gap-1.5">
                      Explore Case Study
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                    <span className="text-[11px] text-slate-400">Direct Build</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════ THE APEX BUILDER DIFFERENCE (SPLIT SECTION) ══════════ */}
      <section className="py-24 sm:py-32" style={{ background: "#F1F5F9" }}>
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-blue-800 text-[11px] font-display font-bold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-3.5 h-3.5" /> The Builder Difference
              </div>
              <h2
                className="font-display font-black tracking-[-0.04em] leading-[1.08] text-slate-900 mb-6"
                style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
              >
                The contractor you speak with<br />
                is the builder on your foundation.
              </h2>
              <p className="font-body text-base text-slate-700 leading-relaxed mb-8 max-w-2xl font-normal">
                In an era where large construction firms pass your project through estimating departments, sales
                reps, and junior superintendents, Apex Construction Group operates on an entirely different standard: direct
                master-builder supervision from ground-breaking to final occupancy.
              </p>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                {PILLARS.map((p, idx) => {
                  const Icon = p.icon
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-display font-bold text-sm text-slate-900 mb-1.5">
                        {p.title}
                      </h4>
                      <p className="font-body text-xs text-slate-600 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-2.5 font-display font-bold text-sm px-6 py-3.5 rounded-xl bg-blue-700 text-white hover:bg-blue-800 transition-colors shadow-xs"
                >
                  <span>About Our Craftsmanship</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="tel:707-555-0192"
                  className="inline-flex items-center gap-2 font-display font-semibold text-sm px-6 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>Call (707) 555-0192</span>
                </a>
              </div>
            </div>

            {/* Right: Craftsmanship Showcase Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                className="relative max-w-sm w-full bg-white rounded-2xl p-4 shadow-xl border border-slate-200"
              >
                <div className="overflow-hidden rounded-xl bg-slate-100" style={{ aspectRatio: "1 / 1" }}>
                  <img
                    src={builderCraftImg}
                    alt="Master Craftsman & General Contractor"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="pt-4 pb-2 text-center">
                  <h4 className="font-display font-black text-lg text-slate-900">
                    Master Builder Standard
                  </h4>
                  <p className="font-body text-xs text-blue-700 font-semibold mb-1">
                    Licensed & Insured • Lic. #849201
                  </p>
                  <p className="font-body text-xs text-slate-500">
                    Over twenty-five years of custom hillside estates, precision timber framing, and winery facilities.
                  </p>
                </div>

                {/* Floating Badge */}
                <div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-display font-black text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md text-white bg-blue-700 whitespace-nowrap"
                >
                  On Site Every Day
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════ CLIENT PRAISE & PRAISE CAROUSEL ══════════════════ */}
      <section className="py-24 sm:py-32" style={{ background: WHITE }}>
        <Container size="wide">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-blue-800 text-[11px] font-display font-bold uppercase tracking-wider mb-3">
              <Quote className="w-3.5 h-3.5" /> Client Experience
            </div>
            <h2
              className="font-display font-black tracking-[-0.04em] leading-[1.08] text-slate-900 mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
            >
              Praised by Valley Estate Owners & Architects
            </h2>
            <p className="font-body text-sm text-slate-600">
              Read how our direct, owner-led field presence translates into peace of mind and precision craft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="flex flex-col h-full p-8 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-xs relative"
              >
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="font-body text-xs leading-relaxed text-slate-700 italic mb-6 flex-1">
                  "{t.quote}"
                </p>

                {/* Author Info */}
                <div className="pt-4 border-t border-slate-200/70">
                  <div className="font-display font-bold text-xs text-slate-900">
                    {t.author}
                  </div>
                  <div className="font-body text-[11px] text-slate-500 mt-0.5">
                    {t.role_or_location}
                  </div>
                  {t.project_title && (
                    <div className="font-display font-semibold text-[10px] text-blue-700 mt-1">
                      Project: {t.project_title}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════ CONSULTATION & DIRECT BUILDER CTA BANNER ══════════ */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1A3A6B 100%)",
          borderTop: `3px solid ${BLUE}`,
        }}
      >
        <Container size="narrow">
          <div className="text-center flex flex-col items-center gap-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-display font-semibold tracking-wider uppercase border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              Direct Builder Consultation
            </div>

            <h2
              className="font-display font-black tracking-[-0.04em] leading-[1.08] text-white"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              Ready to build your Napa Valley vision?
            </h2>

            <p
              className="font-body text-base text-slate-200 leading-relaxed max-w-xl font-light"
            >
              We schedule site walkthroughs directly with our principal builder. Bring your architectural drawings,
              land parcel topographical surveys, or preliminary ideas.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 font-display font-bold text-sm rounded-xl px-8 py-4 bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-xl cursor-pointer"
              >
                <span>Request a Project Estimate</span>
                <ArrowRight className="w-4 h-4 text-blue-700 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="tel:707-555-0192"
                className="inline-flex items-center gap-2.5 font-display font-semibold text-sm rounded-xl px-7 py-4 border border-white/30 text-white hover:bg-white/10 transition-all"
              >
                <Phone className="w-4 h-4 text-blue-300" />
                <span>Call (707) 555-0192</span>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  )
}
