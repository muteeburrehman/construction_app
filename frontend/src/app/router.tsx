import React, { Suspense, lazy, useEffect } from "react"
import { createBrowserRouter, useLocation } from "react-router-dom"

const HomePage = lazy(() =>
  import("@/features/home/HomePage").then((m) => ({ default: m.HomePage }))
)
const WorkPage = lazy(() =>
  import("@/features/work/WorkPage").then((m) => ({ default: m.WorkPage }))
)
const ResidentialServicePage = lazy(() =>
  import("@/features/services/ResidentialServicePage").then((m) => ({
    default: m.ResidentialServicePage,
  }))
)
const CommercialServicePage = lazy(() =>
  import("@/features/services/CommercialServicePage").then((m) => ({
    default: m.CommercialServicePage,
  }))
)
const AboutPage = lazy(() =>
  import("@/features/about/AboutPage").then((m) => ({ default: m.AboutPage }))
)
const ContactPage = lazy(() =>
  import("@/features/contact/ContactPage").then((m) => ({
    default: m.ContactPage,
  }))
)
const StyleguidePage = lazy(() =>
  import("@/features/styleguide/StyleguidePage").then((m) => ({
    default: m.StyleguidePage,
  }))
)
const NotFoundPage = lazy(() =>
  import("@/features/notFound/NotFoundPage").then((m) => ({
    default: m.NotFoundPage,
  }))
)

/** Scrolls to the top of the page on every route change. */
function ScrollToTop(): null {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])
  return null
}

function PageWrapper({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F9FC" }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid #2E5BA8", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
        </div>
      }
    >
      <ScrollToTop />
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PageWrapper>
        <HomePage />
      </PageWrapper>
    ),
  },
  {
    path: "/work",
    element: (
      <PageWrapper>
        <WorkPage />
      </PageWrapper>
    ),
  },
  {
    path: "/services/residential",
    element: (
      <PageWrapper>
        <ResidentialServicePage />
      </PageWrapper>
    ),
  },
  {
    path: "/services/commercial",
    element: (
      <PageWrapper>
        <CommercialServicePage />
      </PageWrapper>
    ),
  },
  {
    path: "/about",
    element: (
      <PageWrapper>
        <AboutPage />
      </PageWrapper>
    ),
  },
  {
    path: "/contact",
    element: (
      <PageWrapper>
        <ContactPage />
      </PageWrapper>
    ),
  },
  {
    path: "/styleguide",
    element: (
      <PageWrapper>
        <StyleguidePage />
      </PageWrapper>
    ),
  },
  {
    path: "*",
    element: (
      <PageWrapper>
        <NotFoundPage />
      </PageWrapper>
    ),
  },
])
