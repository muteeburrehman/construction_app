import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  FolderKanban,
  Inbox,
  MessageSquareQuote,
  BotMessageSquare,
  Sparkles,
  ArrowUpRight,
  Clock,
  Mail,
  Phone,
  RefreshCw,
} from "lucide-react"
import { adminFetch } from "../api/adminClient"
import { StatCard } from "../components/StatCard"
import { useAppDialog } from "../context/DialogContext"
import type { DashboardStats, InquiryStatus } from "../types"

export function DashboardView(): React.JSX.Element {
  const { toast } = useAppDialog()
  const [data, setData] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadData = async (silent = false) => {
    if (!silent) setIsLoading(true)
    else setIsRefreshing(true)

    try {
      const res = await adminFetch<DashboardStats>("stats/")
      setData(res)
    } catch (err) {
      console.error("Failed to load dashboard stats:", err)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStatusChange = async (inquiryId: string, newStatus: InquiryStatus) => {
    try {
      await adminFetch(`inquiries/${inquiryId}/`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      })
      toast.success(`Inquiry marked as ${newStatus}`)
      loadData(true)
    } catch (err) {
      toast.error("Failed to update inquiry status: " + (err instanceof Error ? err.message : String(err)))
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "3px solid #2E5BA8",
            borderTopColor: "transparent",
            animation: "spin 0.7s linear infinite",
          }}
        />
      </div>
    )
  }

  const stats = data?.stats

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Top Banner & Refresh */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.03em" }}>
            Your Site at a Glance
          </h2>
          <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0 0" }}>
            A quick look at your projects, incoming inquiries, and chatbot activity.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              background: "#FFFFFF",
              color: "#334155",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Stats"}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard
          title="Portfolio Projects"
          value={stats?.projects?.total || 0}
          subtitle={`${stats?.projects?.featured || 0} featured on homepage`}
          icon={FolderKanban}
          accentColor="#2E5BA8"
          badge={{ text: `${stats?.projects?.published || 0} Published`, color: "emerald" }}
        />

        <StatCard
          title="Client Inquiries"
          value={stats?.inquiries?.total || 0}
          subtitle={`${stats?.inquiries?.in_progress || 0} in progress`}
          icon={Inbox}
          accentColor="#D97706"
          badge={
            stats?.inquiries?.new && stats.inquiries.new > 0
              ? { text: `${stats.inquiries.new} New Leads`, color: "amber" }
              : { text: "Up to Date", color: "slate" }
          }
        />

        <StatCard
          title="Testimonials"
          value={stats?.testimonials?.total || 0}
          subtitle="Client quotes & references"
          icon={MessageSquareQuote}
          accentColor="#7C3AED"
          badge={{ text: "Active", color: "violet" }}
        />

        <StatCard
          title="Chatbot Knowledge"
          value={stats?.faq?.total || 0}
          subtitle={`${stats?.faq?.active || 0} active FAQs`}
          icon={BotMessageSquare}
          accentColor="#059669"
          badge={{ text: "$0 Cost", color: "emerald" }}
        />

        <StatCard
          title="Chat Queries"
          value={stats?.chat?.total_conversations || 0}
          subtitle={`${stats?.chat?.faq_resolved || 0} auto-resolved`}
          icon={Sparkles}
          accentColor="#0EA5E9"
          badge={{ text: "Local Search", color: "blue" }}
        />
      </div>

      {/* Main Grid: Inquiries & Chatbot Stream */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: 24 }}>
        {/* Recent Inquiries Panel */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 16,
            border: "1px solid #E8EEF6",
            boxShadow: "0 2px 10px rgba(15,23,42,0.06)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "18px 22px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAFBFF" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#2E5BA8" }}>
                <Inbox size={16} />
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: 0 }}>Recent Estimate Requests</h3>
                <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>Latest client inquiries</p>
              </div>
            </div>
            <Link
              to="/admin/inquiries"
              style={{ fontSize: 12, fontWeight: 600, color: "#2E5BA8", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 8, border: "1px solid #C7D9F8", background: "#EEF4FF" }}
            >
              <span>View All ({stats?.inquiries?.total || 0})</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "14px 16px", gap: 8 }}>
            {(!data?.recent_inquiries || data.recent_inquiries.length === 0) && (
              <div style={{ padding: "32px 0", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>
                No inquiries received yet.
              </div>
            )}

            {data?.recent_inquiries?.map((inq) => {
              const statusBorderColor = inq.status === "NEW" ? "#D97706" : inq.status === "IN_PROGRESS" ? "#2E5BA8" : inq.status === "CONTACTED" ? "#059669" : "#CBD5E1"
              return (
              <div
                key={inq.id}
                style={{ padding: "12px 14px 12px 16px", borderRadius: 12, background: "#FAFBFF", border: "1px solid #EEF2F8", borderLeft: `3px solid ${statusBorderColor}`, display: "flex", flexDirection: "column", gap: 7 }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontWeight: 700, color: "#0F172A", fontSize: 13 }}>{inq.name}</span>
                    <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 6 }}>· {inq.project_location || inq.project_type_display}</span>
                  </div>
                  <select
                    value={inq.status}
                    onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                    style={{ fontSize: 11, fontWeight: 600, borderRadius: 8, border: "1px solid #E2E8F0", padding: "3px 8px", background: "#FFFFFF", color: "#334155", cursor: "pointer" }}
                  >
                    <option value="NEW">New Lead</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
                <p style={{ fontSize: 12, color: "#64748B", margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontStyle: "italic" }}>
                  "{inq.message}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11, color: "#94A3B8" }}>
                  {inq.phone && <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Phone size={11} /> {inq.phone}</span>}
                  {inq.email && <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Mail size={11} /> {inq.email}</span>}
                  {inq.estimated_budget && <span style={{ fontWeight: 700, color: "#0F172A", marginLeft: "auto" }}>{inq.estimated_budget}</span>}
                </div>
              </div>
              )
            })}
          </div>
        </div>

        {/* Local Chatbot Activity Stream */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 16,
            border: "1px solid #E8EEF6",
            boxShadow: "0 2px 10px rgba(15,23,42,0.06)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "18px 22px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAFBFF" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}>
                <BotMessageSquare size={16} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: 0 }}>Visitor Questions</h3>
                  <span style={{ background: "#ECFDF5", color: "#065F46", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 9999, border: "1px solid #A7F3D0" }}>$0 Cost</span>
                </div>
                <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>Resolved by local FAQ engine</p>
              </div>
            </div>
            <Link
              to="/admin/faqs"
              style={{ fontSize: 12, fontWeight: 600, color: "#059669", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 8, border: "1px solid #A7F3D0", background: "#ECFDF5" }}
            >
              <span>Manage FAQs</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "14px 16px", gap: 8 }}>
            {(!data?.recent_chats || data.recent_chats.length === 0) && (
              <div style={{ padding: "32px 0", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>
                No chat questions recorded yet. Try asking the chatbot on the website!
              </div>
            )}

            {data?.recent_chats?.map((chat) => (
              <div
                key={chat.id}
                style={{ padding: "12px 14px 12px 16px", borderRadius: 12, background: "#FAFBFF", border: "1px solid #EEF2F8", borderLeft: "3px solid #059669", display: "flex", flexDirection: "column", gap: 6 }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1E293B", lineHeight: 1.4 }}>
                    "{chat.user_message}"
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 9999, background: "#EFF6FF", color: "#1E40AF", border: "1px solid #DBEAFE", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {chat.source_display}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: "#64748B", margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {chat.response_text}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: "#94A3B8" }}>
                  <Clock size={10} />
                  <span>{new Date(chat.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  {chat.matched_intent && <span style={{ color: "#475569", fontWeight: 500 }}>· {chat.matched_intent}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
