import React, { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  Phone,
  MapPin,
  Calendar,
  Search,
  X,
  Sparkles,
  Building2,
  Home,
  Layers,
  Eye,
  CheckCircle2,
  ArrowUpRight
} from "lucide-react"
import { PageShell } from "@/components/PageShell"
import { Container } from "@/components/ui/layout"
import heroH from "@/assets/wix/hero_home.jpg"
import heroR from "@/assets/wix/hero_residential.jpg"
import heroC from "@/assets/wix/hero_commercial.jpg"
import cardH from "@/assets/wix/card_home.jpg"
import cardR from "@/assets/wix/card_residential.jpg"
import cardC from "@/assets/wix/card_commercial.jpg"

const COBALT = "#1A3A6B"
const BLUE = "#2E5BA8"
const CHARCOAL = "#0F172A"
const SLATE = "#475569"
const IRON = "#94A3B8"
const PEBBLE = "#E2E8F0"
const WHITE = "#FFFFFF"

interface ProjectImage {
  id: string
  image: string
  alt_text?: string
  caption?: string
  is_cover?: boolean
}

interface ProjectItem {
  id: string | number
  slug?: string
  title: string
  category: "Residential" | "Commercial"
  category_display?: string
  location: string
  year?: number | string
  scope?: string
  summary: string
  body?: string
  is_featured?: boolean
  cover_image?: ProjectImage | null
  img?: string
  tags?: string[]
}

const FALLBACK_PROJECTS: ProjectItem[] = [
  {
    id: 1,
    slug: "meehan-residence",
    title: "Meehan Residence",
    category: "Residential",
    category_display: "Custom Residential",
    location: "Napa Valley, CA",
    year: 2023,
    scope: "Ground-Up 6,400 sq ft Vineyard Estate",
    summary:
      "Featured in the Kitchens in the Vineyard tour. Custom estate home built on challenging vineyard terrain — owner-led from foundation to finish.",
    body:
      "Perched directly above active valley-floor vineyards, the Meehan Residence was engineered with reinforced grade beams and architectural concrete walls to navigate expansive vineyard soils. Features custom Douglas fir timber trusses, wide-plank French white oak flooring, and seamless indoor-outdoor sliding glass pocket doors.",
    img: heroR,
    is_featured: true,
    tags: ["Ground-Up Build", "Vineyard Topography", "Architectural Timber", "Custom Kitchen"],
  },
  {
    id: 2,
    slug: "ellman-family-vineyards",
    title: "Ellman Family Vineyards",
    category: "Commercial",
    category_display: "Commercial & Winery",
    location: "Napa Valley, CA",
    year: 2022,
    scope: "Architectural Tasting Room & Hospitality Buildout",
    summary:
      "Complete tasting room renovation — structural modifications, bespoke architectural millwork, and premium hospitality finishes tailored for estate guests.",
    body:
      "A comprehensive adaptive hospitality buildout designed for private tastings. Includes structural steel reinforcement, integrated climate-controlled bottle displays, sound-dampened acoustic ceilings, and custom blackened-steel entry portals.",
    img: heroC,
    is_featured: true,
    tags: ["Winery Hospitality", "Architectural Millwork", "Steel Glazing", "Napa Valley"],
  },
  {
    id: 3,
    slug: "cami-art-and-wine-gallery",
    title: "CAMi Art and Wine Gallery",
    category: "Commercial",
    category_display: "Commercial & Winery",
    location: "Calistoga, CA",
    year: 2021,
    scope: "Downtown Commercial Adaptive Reuse",
    summary:
      "Adaptive reuse and interior buildout of the CAMi Art and Wine Gallery in downtown Calistoga, balancing historic charm with modern exhibition spaces.",
    body:
      "Transformation of a historic Calistoga downtown building into an art gallery and curated wine-tasting salon. Included seismic stabilization, restoration of historic masonry, and museum-grade directional lighting.",
    img: cardC,
    is_featured: false,
    tags: ["Adaptive Reuse", "Historic Calistoga", "Art Gallery", "Commercial"],
  },
  {
    id: 4,
    slug: "vineyard-estate-remodel",
    title: "Vineyard Estate Remodel",
    category: "Residential",
    category_display: "Custom Residential",
    location: "Sonoma County, CA",
    year: 2022,
    scope: "Historic Estate Rehabilitation & Addition",
    summary:
      "Historic vineyard estate rehabilitation — new structural framing, stone foundations, and precision architectural timber throughout.",
    body:
      "A delicate modernization of an iconic 1920s Sonoma farmhouse. Retained original structural character while adding high-performance thermal envelopes, fire-rated metal roof lines, and an expansive covered veranda overlooking estate vines.",
    img: cardR,
    is_featured: false,
    tags: ["Historic Rehabilitation", "Timber Framing", "Sonoma Valley", "Custom Joinery"],
  },
  {
    id: 5,
    slug: "custom-hillside-home",
    title: "Custom Hillside Home",
    category: "Residential",
    category_display: "Custom Residential",
    location: "Napa, CA",
    year: 2024,
    scope: "5,200 sq ft Steep Hillside Modern Residence",
    summary:
      "Ground-up custom residence on steep hillside terrain in Napa's high fire-hazard severity zone. Engineered foundation and owner-led construction.",
    body:
      "Built on a 30-degree Napa hillside slope within a designated WUI fire-hazard zone. Features deep drilled-pier foundations, non-combustible architectural zinc and fiber-cement cladding, and an infinity pool deck cantilevered over the oak canyon.",
    img: heroH,
    is_featured: true,
    tags: ["Hillside Topography", "WUI Fire-Zone", "Drilled-Pier Foundation", "Cantilever Deck"],
  },
  {
    id: 6,
    slug: "winery-production-facility",
    title: "Winery Production Facility",
    category: "Commercial",
    category_display: "Commercial & Winery",
    location: "Napa Valley, CA",
    year: 2023,
    scope: "Subterranean Barrel Cellar & Production Expansion",
    summary:
      "Structural expansion of an existing winery production facility — phased to keep crush and hospitality operations running throughout construction.",
    body:
      "Subterranean barrel cellar expansion and crush pad enhancement. Required complex vibration isolation to protect fermenting vintages in adjacent halls, reinforced shotcrete retaining walls, and custom hygienic drainage systems.",
    img: cardH,
    is_featured: false,
    tags: ["Winery Production", "Phased Construction", "Barrel Cellar", "Reinforced Concrete"],
  },
]

export function WorkPage(): React.JSX.Element {
  const [activeCategory, setActiveCategory] = useState<"All" | "Residential" | "Commercial">("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<ProjectItem[]>(FALLBACK_PROJECTS)
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [modalDetails, setModalDetails] = useState<{ body?: string; images?: ProjectImage[] } | null>(null)
  const [loadingModal, setLoadingModal] = useState(false)
  const [activeModalImage, setActiveModalImage] = useState<string>("")

  // Fetch dynamic projects from API with fallback to rich defaults
  useEffect(() => {
    let isMounted = true
    async function fetchProjects() {
      try {
        const res = await fetch("/api/v1/projects/")
        if (!res.ok) throw new Error("API not available")
        const data = await res.json()
        const apiList = Array.isArray(data) ? data : data.results || []

        if (apiList.length > 0 && isMounted) {
          const mapped: ProjectItem[] = apiList.map((item: any, idx: number) => {
            const cat =
              item.category?.toLowerCase() === "commercial" ? "Commercial" : "Residential"
            // Assign smart tags based on scope or title
            const tags: string[] = []
            if (item.scope?.toLowerCase().includes("sq ft")) tags.push(item.scope.split(" ").slice(0, 3).join(" "))
            if (item.location) tags.push(item.location)
            if (item.is_featured) tags.push("Featured Estate")

            return {
              id: item.id || `api-${idx}`,
              slug: item.slug,
              title: item.title,
              category: cat,
              category_display: item.category_display || (cat === "Residential" ? "Custom Residential" : "Commercial & Winery"),
              location: item.location || "Napa Valley, CA",
              year: item.year || 2023,
              scope: item.scope || "Custom Construction",
              summary: item.summary || item.description || "Custom architectural construction by Eric Sherwood.",
              body: item.body,
              is_featured: Boolean(item.is_featured),
              cover_image: item.cover_image,
              img: item.cover_image?.image || FALLBACK_PROJECTS[idx % FALLBACK_PROJECTS.length].img,
              tags: tags.length > 0 ? tags : ["Napa Valley", "Custom Construction"],
            }
          })
          setProjects(mapped)
        }
      } catch {
        // Fallback to FALLBACK_PROJECTS gracefully
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchProjects()
    return () => {
      isMounted = false
    }
  }, [])

  // When a project modal opens, fetch full details if available
  useEffect(() => {
    if (!selectedProject) {
      setModalDetails(null)
      setActiveModalImage("")
      return
    }

    const defaultImg = selectedProject.cover_image?.image || selectedProject.img || ""
    setActiveModalImage(defaultImg)

    if (selectedProject.slug) {
      setLoadingModal(true)
      fetch(`/api/v1/projects/${selectedProject.slug}/`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setModalDetails({
              body: data.body || selectedProject.body,
              images: data.images && data.images.length > 0 ? data.images : undefined,
            })
            if (data.images && data.images.length > 0) {
              const cover = data.images.find((img: ProjectImage) => img.is_cover) || data.images[0]
              setActiveModalImage(cover.image)
            }
          }
        })
        .catch(() => {
          // Keep existing selected project body
        })
        .finally(() => setLoadingModal(false))
    }
  }, [selectedProject])

  // Keydown to close modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedProject(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Calculate counts
  const counts = useMemo(() => {
    const resCount = projects.filter((p) => p.category === "Residential").length
    const commCount = projects.filter((p) => p.category === "Commercial").length
    return { all: projects.length, residential: resCount, commercial: commCount }
  }, [projects])

  // Filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory
      const query = searchQuery.trim().toLowerCase()
      if (!query) return matchesCategory

      const matchesSearch =
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        (p.scope && p.scope.toLowerCase().includes(query)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(query)))

      return matchesCategory && matchesSearch
    })
  }, [projects, activeCategory, searchQuery])

  return (
    <PageShell
      seo={{
        title: "Selected Work & Portfolio | Eric Sherwood Construction",
        description:
          "Explore custom residential estates, architectural vineyard renovations, and commercial winery facilities built across Napa and Sonoma counties since 1979.",
      }}
    >
      {/* ─── Hero / Header Section ─── */}
      <section
        style={{
          background: "linear-gradient(180deg, #F8FAFC 0%, #EEF2F7 100%)",
          borderBottom: `1px solid ${PEBBLE}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle architectural grid pattern accent */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(46, 91, 168, 0.08) 1px, transparent 1px), radial-gradient(rgba(46, 91, 168, 0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            backgroundPosition: "0 0, 14px 14px",
            opacity: 0.8,
            pointerEvents: "none",
          }}
        />

        <Container size="wide">
          <div className="py-16 sm:py-24 relative z-10">
            {/* Architectural Sub-heading Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-xs mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full" style={{ background: BLUE }} />
              <span
                className="font-display font-semibold tracking-[0.16em] uppercase text-[11px]"
                style={{ color: COBALT }}
              >
                Napa & Sonoma County Portfolio
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
              <div className="lg:col-span-8">
                <h1
                  className="font-display font-black tracking-[-0.04em] leading-[1.04] mb-5"
                  style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)", color: CHARCOAL }}
                >
                  Selected Work
                </h1>
                <p
                  className="font-body leading-[1.75]"
                  style={{ fontSize: "1.125rem", color: SLATE, maxWidth: "56ch" }}
                >
                  Custom homes, vineyard estates, and commercial winery facilities built across Napa Valley
                  since 1979. Every project is owner-supervised by Eric Sherwood with direct craftsman accountability.
                </p>
              </div>

              {/* Quick Trust Highlights Pill Bar */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <div
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-sm"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(46, 91, 168, 0.08)", color: BLUE }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-slate-900 leading-tight">
                      45+ Years in Napa Valley
                    </div>
                    <div className="font-body text-xs text-slate-500">
                      Continuously licensed & active since 1979
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-sm"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(46, 91, 168, 0.08)", color: BLUE }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-slate-900 leading-tight">
                      100% Owner-Supervised
                    </div>
                    <div className="font-body text-xs text-slate-500">
                      No broker handoffs, direct builder on site
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Filter & Search Bar + Project Grid ─── */}
      <section className="py-14 sm:py-20" style={{ background: WHITE }}>
        <Container size="wide">
          {/* Controls Bar: Search & Category Pills */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-12 pb-8 border-b border-slate-100">
            {/* Category Segmented Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100/80 border border-slate-200/70 overflow-x-auto">
              {(
                [
                  { id: "All", label: "All Projects", count: counts.all, icon: Layers },
                  { id: "Residential", label: "Residential", count: counts.residential, icon: Home },
                  { id: "Commercial", label: "Commercial & Winery", count: counts.commercial, icon: Building2 },
                ] as const
              ).map((cat) => {
                const IconComponent = cat.icon
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    id={`filter-${cat.id.toLowerCase()}`}
                    onClick={() => setActiveCategory(cat.id)}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg font-display font-semibold text-xs tracking-wide transition-all duration-200 whitespace-nowrap cursor-pointer"
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
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.7)"
                        e.currentTarget.style.color = CHARCOAL
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent"
                        e.currentTarget.style.color = SLATE
                      }
                    }}
                  >
                    <IconComponent className="w-3.5 h-3.5" style={{ color: isActive ? WHITE : IRON }} />
                    <span>{cat.label}</span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={
                        isActive
                          ? { background: "rgba(255, 255, 255, 0.22)", color: WHITE }
                          : { background: "rgba(148, 163, 184, 0.18)", color: SLATE }
                      }
                    >
                      {cat.count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Quick Live Search Bar */}
            <div className="relative min-w-[280px] sm:w-72">
              <Search
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: IRON }}
              />
              <input
                type="text"
                placeholder="Search projects or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white font-body text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Results feedback banner if searching */}
          {searchQuery && (
            <div className="flex items-center justify-between gap-4 mb-8 px-4 py-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-slate-700">
              <div>
                Showing results for <span className="font-bold text-slate-900">"{searchQuery}"</span>{" "}
                ({filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"} found)
              </div>
              <button
                onClick={() => setSearchQuery("")}
                className="font-semibold text-blue-700 hover:text-blue-900 underline"
              >
                Reset filter
              </button>
            </div>
          )}

          {/* Project Grid */}
          {loading && projects.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-slate-100 rounded-2xl h-96 border border-slate-200/60" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-24 px-6 border-2 border-dashed border-slate-200 rounded-2xl">
              <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <h3 className="font-display font-bold text-lg text-slate-800 mb-2">
                No matching projects found
              </h3>
              <p className="font-body text-sm text-slate-500 max-w-md mx-auto mb-6">
                We couldn't find any projects matching your current filters. Try changing your search query or view all works.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All")
                  setSearchQuery("")
                }}
                className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-display font-semibold text-xs transition-colors"
              >
                Show All Projects
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => {
                const coverUrl = project.cover_image?.image || project.img || ""
                return (
                  <article
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-950/8 transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5"
                    style={{ borderColor: "#E2E8F0" }}
                  >
                    {/* Image Area with Aspect Ratio and Floating Badges */}
                    <div className="relative overflow-hidden bg-slate-100 shrink-0" style={{ aspectRatio: "16 / 10" }}>
                      <img
                        src={coverUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Top Badges Overlay */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                        <span
                          className="font-display font-semibold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full backdrop-blur-md bg-white/90 text-slate-800 shadow-xs border border-white/60 white-space-nowrap"
                        >
                          {project.category_display || project.category}
                        </span>

                        <span
                          className="inline-flex items-center gap-1 font-display font-medium text-[10px] px-2.5 py-1 rounded-full backdrop-blur-md bg-black/60 text-white shadow-xs whitespace-nowrap"
                        >
                          <MapPin className="w-3 h-3 text-blue-300" />
                          {project.location}
                        </span>
                      </div>

                      {/* Hover Overlay Button */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-display font-bold text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>View Project Details</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Card Content - Unified Dimensions */}
                    <div className="flex flex-col flex-1 p-6">
                      {/* Scope & Year Strip */}
                      <div className="flex items-center justify-between text-xs text-slate-500 font-body mb-2 h-5">
                        <span className="font-semibold tracking-wide truncate max-w-[200px]" style={{ color: BLUE }}>
                          {project.scope || `${project.category} Build`}
                        </span>
                        {project.year && (
                          <span className="text-[11px] text-slate-400 shrink-0">
                            Completed {project.year}
                          </span>
                        )}
                      </div>

                      {/* Title - Locked Unified Height */}
                      <h2
                        className="font-display font-extrabold tracking-[-0.025em] text-lg text-slate-900 group-hover:text-blue-700 transition-colors mb-2 leading-snug line-clamp-2 min-h-[52px]"
                      >
                        {project.title}
                      </h2>

                      {/* Description Summary - Locked Unified Height */}
                      <p className="font-body text-xs leading-[1.65] text-slate-600 line-clamp-2 min-h-[40px] mb-3">
                        {project.summary}
                      </p>

                      {/* Architectural Tags - Fixed Height Shelf */}
                      <div className="flex flex-wrap items-center gap-1.5 min-h-[28px] mb-3">
                        {(project.tags && project.tags.length > 0
                          ? project.tags.slice(0, 3)
                          : ["Napa Valley", "Custom Craft"]
                        ).map((tag, idx) => (
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
                        <span className="inline-flex items-center gap-1.5">
                          Explore Case Study
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                        <span className="text-[11px] text-slate-400 group-hover:text-slate-600">
                          Direct Build
                        </span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {/* ─── Bottom Architectural Philosophy & Consultation Banner ─── */}
          <div
            className="mt-20 p-8 sm:p-12 rounded-2xl relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0F172A 0%, #1A3A6B 100%)",
              color: WHITE,
              boxShadow: "0 10px 30px -5px rgba(15, 23, 42, 0.25)",
            }}
          >
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-display font-semibold tracking-wider uppercase mb-5 border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                The Eric Sherwood Standard
              </div>

              <h2
                className="font-display font-extrabold tracking-[-0.03em] leading-tight mb-4"
                style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.35rem)" }}
              >
                The builder you speak with is the builder on your job site.
              </h2>

              <p
                className="font-body text-sm sm:text-base leading-[1.75] text-slate-300 mb-8 max-w-2xl"
              >
                We limit our project roster each season so that Eric Sherwood directly oversees site engineering,
                subcontractor craft, and finish detail. No sales layers or junior superintendents.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-display font-bold text-sm bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-md cursor-pointer"
                >
                  <span>Request an Estimate</span>
                  <ArrowRight className="w-4 h-4 text-blue-700 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="tel:707-255-3875"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-display font-semibold text-sm text-white border border-white/25 hover:border-white/60 hover:bg-white/5 transition-all"
                >
                  <Phone className="w-4 h-4 text-blue-300" />
                  <span>Call 707-255-3875</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Interactive Project Modal / Lightbox ─── */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar with Close Button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xs uppercase tracking-wider px-2.5 py-1 rounded bg-blue-100/80 text-blue-800">
                  {selectedProject.category_display || selectedProject.category}
                </span>
                <span className="text-xs text-slate-500 font-body flex items-center gap-1.5">
                  Napa Valley Construction Archive
                  {loadingModal && (
                    <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                  )}
                </span>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[82vh] overflow-y-auto">
              {/* Main Photo Display */}
              <div className="relative bg-slate-900" style={{ maxHeight: "440px" }}>
                <img
                  src={activeModalImage || selectedProject.cover_image?.image || selectedProject.img}
                  alt={selectedProject.title}
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-md text-xs font-display">
                  {selectedProject.location}
                </div>
              </div>

              {/* Gallery Thumbnails Strip (if available) */}
              {modalDetails?.images && modalDetails.images.length > 1 && (
                <div className="flex gap-2 p-4 bg-slate-900/95 overflow-x-auto border-t border-slate-800">
                  {modalDetails.images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveModalImage(img.image)}
                      className="relative rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer"
                      style={{
                        width: 72,
                        height: 48,
                        borderColor: activeModalImage === img.image ? "#3B82F6" : "transparent",
                        opacity: activeModalImage === img.image ? 1 : 0.6,
                      }}
                    >
                      <img src={img.image} alt={img.alt_text || "Thumbnail"} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Project Details Sheet */}
              <div className="p-6 sm:p-8">
                {/* Title & Scope */}
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2 font-body">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      {selectedProject.location}
                    </span>
                    {selectedProject.year && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {selectedProject.year}
                      </span>
                    )}
                    {selectedProject.scope && (
                      <span className="text-blue-700 font-medium">
                        • {selectedProject.scope}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                    {selectedProject.title}
                  </h3>
                </div>

                {/* Narrative Description */}
                <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 space-y-4 mb-8">
                  <p className="font-medium text-slate-800 text-base leading-relaxed">
                    {selectedProject.summary}
                  </p>
                  <p className="font-body text-slate-600">
                    {modalDetails?.body || selectedProject.body || (
                      "Executed under direct field supervision by Eric Sherwood. Foundation engineering, seismic and hillside structural design, high-end millwork installations, and strict adherence to Napa County WUI building standards."
                    )}
                  </p>
                </div>

                {/* Key Specifications Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-8">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-display">
                      Category
                    </div>
                    <div className="text-xs font-bold text-slate-800 font-display mt-0.5">
                      {selectedProject.category_display || selectedProject.category}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-display">
                      Location
                    </div>
                    <div className="text-xs font-bold text-slate-800 font-display mt-0.5">
                      {selectedProject.location}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-display">
                      Builder
                    </div>
                    <div className="text-xs font-bold text-slate-800 font-display mt-0.5">
                      Eric Sherwood
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-display">
                      Supervision
                    </div>
                    <div className="text-xs font-bold text-emerald-700 font-display mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 100% On-Site
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
                  <div className="text-xs text-slate-500 font-body text-center sm:text-left">
                    Considering a build like this in Napa or Sonoma?
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link
                      to={`/contact?project=${encodeURIComponent(selectedProject.title)}`}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-display font-semibold text-xs transition-colors shadow-sm"
                      onClick={() => setSelectedProject(null)}
                    >
                      <span>Discuss Similar Project</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <a
                      href="tel:707-255-3875"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-display font-semibold text-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>707-255-3875</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}
