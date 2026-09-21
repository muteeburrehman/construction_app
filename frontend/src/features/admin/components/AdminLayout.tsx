import React, { useState, useEffect } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  MessageSquareQuote,
  Inbox,
  BotMessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { DialogProvider } from "../context/DialogContext"
import { adminFetch } from "../api/adminClient"
import type { DashboardStats } from "../types"

export function AdminLayout(): React.JSX.Element {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [newInquiriesCount, setNewInquiriesCount] = useState<number>(0)

  useEffect(() => {
    // Fetch dashboard stats to populate badges
    async function fetchBadge() {
      try {
        const data = await adminFetch<DashboardStats>("stats/")
        if (data?.stats?.inquiries?.new) {
          setNewInquiriesCount(data.stats.inquiries.new)
        }
      } catch {
        // silent fail
      }
    }
    fetchBadge()
  }, [location.pathname])

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Projects", path: "/admin/projects", icon: FolderKanban },
    { label: "Services", path: "/admin/services", icon: Briefcase },
    { label: "Testimonials", path: "/admin/testimonials", icon: MessageSquareQuote },
    {
      label: "Inquiries",
      path: "/admin/inquiries",
      icon: Inbox,
      badge: newInquiriesCount > 0 ? `${newInquiriesCount} new` : undefined,
    },
    { label: "Chatbot & FAQs", path: "/admin/faqs", icon: BotMessageSquare },
    { label: "Site Settings", path: "/admin/settings", icon: Settings },
  ]

  const getPageTitle = (): string => {
    if (location.pathname === "/admin") return "Overview Dashboard"
    if (location.pathname.startsWith("/admin/projects")) return "Project Portfolio"
    if (location.pathname.startsWith("/admin/services")) return "Services & Capabilities"
    if (location.pathname.startsWith("/admin/testimonials")) return "Client Testimonials"
    if (location.pathname.startsWith("/admin/inquiries")) return "Client Inquiries & Leads"
    if (location.pathname.startsWith("/admin/faqs")) return "Chatbot Knowledge Base"
    if (location.pathname.startsWith("/admin/settings")) return "Site Settings & Information"
    return "Admin Panel"
  }

  return (
    <DialogProvider>
      <div style={{ display: "flex", minHeight: "100vh", background: "#F8F9FC", fontFamily: "Archivo, system-ui, sans-serif" }}>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.5)",
            zIndex: 40,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          background: "#1E2532", // charcoal
          color: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 50,
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        }}
        className={`fixed md:sticky transition-transform duration-200 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #2E5BA8 0%, #1A3A6B 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 16,
                  color: "#FFFFFF",
                  letterSpacing: "-0.05em",
                }}
              >
                A
              </div>
              <div>
                <h1 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em", margin: 0, color: "#FFFFFF" }}>
                  Apex Construction
                </h1>
                <p style={{ fontSize: 11, color: "#94A3B8", margin: 0, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Executive Portal
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "#94A3B8", background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path)

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      textDecoration: "none",
                      color: isActive ? "#FFFFFF" : "#94A3B8",
                      background: isActive ? "linear-gradient(90deg, #2E5BA8 0%, #1A3A6B 100%)" : "transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Icon size={18} color={isActive ? "#FFFFFF" : "#94A3B8"} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        style={{
                          background: "#EF4444",
                          color: "#FFFFFF",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 9999,
                          textTransform: "uppercase",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(0, 0, 0, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "#2E5BA8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {user?.first_name?.[0] || user?.username?.[0]?.toUpperCase() || "A"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                {user?.full_name || user?.username || "Administrator"}
              </div>
              <div style={{ fontSize: 11, color: "#64748B", display: "flex", alignItems: "center", gap: 4 }}>
                <ShieldCheck size={11} color="#10B981" />
                <span>Admin</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            title="Log Out"
            style={{
              background: "transparent",
              border: "none",
              color: "#94A3B8",
              cursor: "pointer",
              padding: 6,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Header */}
        <header
          style={{
            height: 64,
            background: "#FFFFFF",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer" }}
            >
              <Menu size={22} />
            </button>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", margin: 0 }}>{getPageTitle()}</h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                background: "#FFFFFF",
                color: "#1A3A6B",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              <span>View Public Site</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </header>

        {/* Page Content View */}
        <main style={{ flex: 1, padding: "24px", maxWidth: 1400, width: "100%", margin: "0 auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
    </DialogProvider>
  )
}
