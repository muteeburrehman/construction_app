import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Phone } from "lucide-react"
import { PageShell } from "@/components/PageShell"
import { Container } from "@/components/ui/layout"
import heroH  from "@/assets/wix/hero_home.jpg"
import heroR  from "@/assets/wix/hero_residential.jpg"
import heroC  from "@/assets/wix/hero_commercial.jpg"
import cardH  from "@/assets/wix/card_home.jpg"
import cardR  from "@/assets/wix/card_residential.jpg"
import cardC  from "@/assets/wix/card_commercial.jpg"

const COBALT   = "#1A3A6B"
const BLUE     = "#2E5BA8"
const CHARCOAL = "#1E2532"
const SLATE    = "#4A5568"
const IRON     = "#8A94A6"
const CLOUD    = "#F8F9FC"
const MIST     = "#EEF1F7"
const PEBBLE   = "#DDE2EC"
const WHITE    = "#FFFFFF"

const PROJECTS = [
  { id: 1, title: "Meehan Residence", category: "Residential", location: "Napa Valley, CA", description: "Featured in the Kitchens in the Vineyard tour. Custom estate home on challenging vineyard terrain — ground-up from foundation to finish.", img: heroR },
  { id: 2, title: "Ellman Family Vineyards", category: "Commercial", location: "Napa Valley, CA", description: "Complete tasting room renovation — structural work, architectural millwork, and premium hospitality finishes.", img: heroC },
  { id: 3, title: "CAMi Art and Wine Gallery", category: "Commercial", location: "Calistoga, CA", description: "Adaptive reuse and interior buildout of the CAMi Art and Wine Gallery in downtown Calistoga.", img: cardC },
  { id: 4, title: "Vineyard Estate Remodel", category: "Residential", location: "Sonoma County, CA", description: "Historic vineyard estate rehabilitation — new structural framing, stone foundations, and precision architectural timber.", img: cardR },
  { id: 5, title: "Custom Hillside Home", category: "Residential", location: "Napa, CA", description: "Ground-up custom residence on steep hillside terrain in Napa's high fire-hazard severity zone. Owner-led from foundation to finish.", img: heroH },
  { id: 6, title: "Winery Production Facility", category: "Commercial", location: "Napa Valley, CA", description: "Structural expansion of an existing winery production facility — phased to keep operations running throughout construction.", img: cardH },
]

const CATEGORIES = ["All", "Residential", "Commercial"]

export function WorkPage(): React.JSX.Element {
  const [active, setActive] = React.useState("All")
  const filtered = active === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === active)

  return (
    <PageShell
      seo={{
        title: "Selected Work & Portfolio | Eric Sherwood Construction",
        description: "Portfolio of custom residential estates, architectural remodels, and commercial winery facilities built across Napa and Sonoma counties since 1979.",
      }}
    >
      {/* ── Page Header ── */}
      <section style={{ background: CLOUD, borderBottom: `1px solid ${PEBBLE}` }}>
        <Container size="wide">
          <div className="py-20 sm:py-24">
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: 32, height: 1, background: BLUE }} />
              <span className="font-display font-semibold tracking-[0.15em] uppercase" style={{ fontSize: "0.625rem", color: BLUE }}>Portfolio</span>
            </div>
            <h1 className="font-display font-extrabold tracking-[-0.04em] leading-[1.04] mb-5" style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)", color: CHARCOAL }}>
              Selected Work
            </h1>
            <p className="font-body leading-[1.7]" style={{ fontSize: "1.0625rem", color: IRON, maxWidth: "52ch" }}>
              Custom homes, vineyard estates, and commercial facilities built across Napa Valley since 1979.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Filter + Grid ── */}
      <section className="py-16 sm:py-20" style={{ background: WHITE }}>
        <Container size="wide">
          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-12 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase()}`}
                onClick={() => setActive(cat)}
                className="font-display font-semibold text-sm rounded-sm px-5 py-2 transition-all duration-200"
                style={
                  active === cat
                    ? { background: BLUE, color: WHITE }
                    : { background: MIST, color: SLATE }
                }
                onMouseEnter={e => { if (active !== cat) { e.currentTarget.style.background = PEBBLE; e.currentTarget.style.color = CHARCOAL } }}
                onMouseLeave={e => { if (active !== cat) { e.currentTarget.style.background = MIST; e.currentTarget.style.color = SLATE } }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <article
                key={project.id}
                className="group overflow-hidden rounded-sm"
                style={{ background: WHITE, border: `1px solid ${PEBBLE}`, boxShadow: "0 1px 4px rgba(14,20,32,0.05)" }}
              >
                <div className="overflow-hidden" style={{ height: 220 }}>
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display font-semibold tracking-[0.12em] uppercase" style={{ fontSize: "0.5625rem", color: BLUE }}>
                      {project.category}
                    </span>
                    <span className="font-display font-semibold tracking-wide uppercase" style={{ fontSize: "0.5625rem", color: IRON }}>
                      {project.location}
                    </span>
                  </div>
                  <h2 className="font-display font-extrabold tracking-[-0.025em] mb-3" style={{ fontSize: "1.1875rem", color: CHARCOAL }}>
                    {project.title}
                  </h2>
                  <p className="font-body leading-[1.7]" style={{ fontSize: "0.9375rem", color: SLATE }}>
                    {project.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 pt-12 text-center flex flex-col items-center gap-5" style={{ borderTop: `1px solid ${PEBBLE}` }}>
            <p className="font-body" style={{ fontSize: "1.0625rem", color: IRON }}>Interested in working together?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="group inline-flex items-center gap-2 font-display font-semibold rounded-sm px-7 py-3.5 transition-colors duration-200" style={{ background: BLUE, color: WHITE, fontSize: "0.9375rem" }}
                onMouseEnter={e => (e.currentTarget.style.background = COBALT)}
                onMouseLeave={e => (e.currentTarget.style.background = BLUE)}>
                Request an Estimate <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a href="tel:707-255-3875" className="inline-flex items-center gap-2 font-display font-semibold rounded-sm px-7 py-3.5 transition-colors duration-200" style={{ border: `1px solid ${PEBBLE}`, color: CHARCOAL, fontSize: "0.9375rem" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = BLUE)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = PEBBLE)}>
                <Phone style={{ width: 15, height: 15 }} /> 707-255-3875
              </a>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  )
}
