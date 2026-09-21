import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  ogType?: "website" | "article"
  ogImage?: string
}

const DEFAULT_TITLE =
  "Apex Construction Group | Custom Luxury General Contractor"
const DEFAULT_DESCRIPTION =
  "High-end custom residential and commercial general contractor. Uncompromising craftsmanship and on-site principal supervision. Call (707) 555-0192."
const SITE_URL = "https://construction.muteeblabs.com"

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogType = "website",
  ogImage = "/static/img/hero_residential.jpg",
}: SEOProps): null {
  const location = useLocation()
  const fullTitle = title
    ? (title.includes("Apex Construction Group") ? title : `${title} | Apex Construction Group`)
    : DEFAULT_TITLE
  const currentCanonical = canonical || `${SITE_URL}${location.pathname}`

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle

    // Helper to set or create meta tag
    const setMeta = (nameOrProperty: "name" | "property", key: string, content: string) => {
      let element = document.querySelector(`meta[${nameOrProperty}="${key}"]`) as HTMLMetaElement | null
      if (!element) {
        element = document.createElement("meta")
        element.setAttribute(nameOrProperty, key)
        document.head.appendChild(element)
      }
      element.setAttribute("content", content)
    }

    // 2. Standard Meta
    setMeta("name", "description", description)
    setMeta("name", "robots", "index, follow")

    // 3. Open Graph
    setMeta("property", "og:title", fullTitle)
    setMeta("property", "og:description", description)
    setMeta("property", "og:type", ogType)
    setMeta("property", "og:url", currentCanonical)
    setMeta("property", "og:image", ogImage)
    setMeta("property", "og:site_name", "Apex Construction Group")

    // 4. Twitter Cards
    setMeta("name", "twitter:card", "summary_large_image")
    setMeta("name", "twitter:title", fullTitle)
    setMeta("name", "twitter:description", description)
    setMeta("name", "twitter:image", ogImage)

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonicalLink) {
      canonicalLink = document.createElement("link")
      canonicalLink.setAttribute("rel", "canonical")
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute("href", currentCanonical)
  }, [fullTitle, description, currentCanonical, ogType, ogImage])

  return null
}
