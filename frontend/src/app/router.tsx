import React, { Suspense, lazy } from "react"
import { createBrowserRouter, Outlet, ScrollRestoration } from "react-router-dom"
import { AuthProvider } from "@/features/admin/context/AuthContext"
import { ProtectedRoute } from "@/features/admin/components/ProtectedRoute"
import { AdminLayout } from "@/features/admin/components/AdminLayout"

// Public Pages
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

// Admin Pages
const AdminLoginPage = lazy(() =>
  import("@/features/admin/AdminLoginPage").then((m) => ({ default: m.AdminLoginPage }))
)
const DashboardView = lazy(() =>
  import("@/features/admin/views/DashboardView").then((m) => ({ default: m.DashboardView }))
)
const ProjectsView = lazy(() =>
  import("@/features/admin/views/ProjectsView").then((m) => ({ default: m.ProjectsView }))
)
const ServicesView = lazy(() =>
  import("@/features/admin/views/ServicesView").then((m) => ({ default: m.ServicesView }))
)
const TestimonialsView = lazy(() =>
  import("@/features/admin/views/TestimonialsView").then((m) => ({ default: m.TestimonialsView }))
)
const InquiriesView = lazy(() =>
  import("@/features/admin/views/InquiriesView").then((m) => ({ default: m.InquiriesView }))
)
const FAQView = lazy(() =>
  import("@/features/admin/views/FAQView").then((m) => ({ default: m.FAQView }))
)
const SettingsView = lazy(() =>
  import("@/features/admin/views/SettingsView").then((m) => ({ default: m.SettingsView }))
)

/** Root layout — renders once, handles scroll restoration for all routes. */
function RootLayout(): React.JSX.Element {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
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
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    // Root layout — provides ScrollRestoration for every route
    element: <RootLayout />,
    children: [
  // Public Routes
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

  // Admin Routes (/admin)
  {
    path: "/admin/login",
    element: (
      <AuthProvider>
        <PageWrapper>
          <AdminLoginPage />
        </PageWrapper>
      </AuthProvider>
    ),
  },
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <ProtectedRoute />
      </AuthProvider>
    ),
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: (
              <PageWrapper>
                <DashboardView />
              </PageWrapper>
            ),
          },
          {
            path: "projects",
            element: (
              <PageWrapper>
                <ProjectsView />
              </PageWrapper>
            ),
          },
          {
            path: "services",
            element: (
              <PageWrapper>
                <ServicesView />
              </PageWrapper>
            ),
          },
          {
            path: "testimonials",
            element: (
              <PageWrapper>
                <TestimonialsView />
              </PageWrapper>
            ),
          },
          {
            path: "inquiries",
            element: (
              <PageWrapper>
                <InquiriesView />
              </PageWrapper>
            ),
          },
          {
            path: "faqs",
            element: (
              <PageWrapper>
                <FAQView />
              </PageWrapper>
            ),
          },
          {
            path: "settings",
            element: (
              <PageWrapper>
                <SettingsView />
              </PageWrapper>
            ),
          },
        ],
      },
    ],
  },

  // Catch-all
  {
    path: "*",
    element: (
      <PageWrapper>
        <NotFoundPage />
      </PageWrapper>
    ),
  },
  // End of RootLayout children
  ],
  },
])
