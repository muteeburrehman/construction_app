import React, { useState, useEffect } from "react"
import { Search, Mail, Phone, Save } from "lucide-react"
import { adminFetch } from "../api/adminClient"
import { Modal } from "../components/Modal"
import { StatusBadge } from "../components/StatusBadge"
import { useAppDialog } from "../context/DialogContext"
import type { AdminInquiry, InquiryStatus } from "../types"

export function InquiriesView(): React.JSX.Element {
  const { toast } = useAppDialog()
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  // Selected Inquiry Drawer/Modal
  const [selectedInquiry, setSelectedInquiry] = useState<AdminInquiry | null>(null)
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState<InquiryStatus>("NEW")
  const [isSaving, setIsSaving] = useState(false)

  const loadInquiries = async () => {
    setIsLoading(true)
    try {
      const res = await adminFetch<{ results?: AdminInquiry[] } | AdminInquiry[]>("inquiries/")
      const list = Array.isArray(res) ? res : res.results || []
      setInquiries(list)
    } catch (err) {
      console.error("Failed to load inquiries:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInquiries()
  }, [])

  const handleOpenDetail = (inq: AdminInquiry) => {
    setSelectedInquiry(inq)
    setNotes(inq.notes || "")
    setStatus(inq.status)
  }

  const handleUpdateInquiry = async () => {
    if (!selectedInquiry) return
    setIsSaving(true)
    try {
      const updated = await adminFetch<AdminInquiry>(`inquiries/${selectedInquiry.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ notes, status }),
      })
      setSelectedInquiry(updated)
      loadInquiries()
      toast.success("Inquiry updated successfully!")
    } catch (err) {
      toast.error("Failed to save changes: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setIsSaving(false)
    }
  }

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.project_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || inq.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header & Filter Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0 }}>
            Client Inquiries
          </h2>
          <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0 0" }}>
            People who reached out about a project. Click a row to view details and update status.
          </p>
        </div>

        <div style={{ display: "flex", gap: 6, background: "#FFFFFF", padding: 4, borderRadius: 8, border: "1px solid #E2E8F0", flexWrap: "wrap" }}>
          {[
            { value: "ALL",         label: "All Leads" },
            { value: "NEW",         label: "New" },
            { value: "IN_PROGRESS", label: "In Progress" },
            { value: "CONTACTED",   label: "Contacted" },
            { value: "ARCHIVED",    label: "Archived" },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: statusFilter === value ? "#2E5BA8" : "transparent",
                color: statusFilter === value ? "#FFFFFF" : "#64748B",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: "relative", maxWidth: 460 }}>
        <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
        <input
          type="text"
          placeholder="Filter by name, email, location, or message content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px 8px 36px",
            borderRadius: 8,
            border: "1px solid #CBD5E1",
            fontSize: 13,
            outline: "none",
            background: "#FFFFFF",
          }}
        />
      </div>

      {/* Table */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 14,
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", fontWeight: 600 }}>
                <th style={{ padding: "14px 20px" }}>Client</th>
                <th style={{ padding: "14px 16px" }}>Type & Location</th>
                <th style={{ padding: "14px 16px" }}>Budget / Timeline</th>
                <th style={{ padding: "14px 16px" }}>Date Received</th>
                <th style={{ padding: "14px 16px" }}>Status</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>
                    Loading inquiries...
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    onClick={() => handleOpenDetail(inq)}
                    style={{
                      borderBottom: "1px solid #F1F5F9",
                      cursor: "pointer",
                      background: inq.status === "NEW" ? "#F8FAFC" : "#FFFFFF",
                      transition: "background 0.15s ease",
                    }}
                  >
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 14 }}>{inq.name}</div>
                      <div style={{ fontSize: 12, color: "#64748B", display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
                        <span>{inq.email}</span>
                        {inq.phone && <span>• {inq.phone}</span>}
                      </div>
                    </td>

                    <td style={{ padding: "16px 16px" }}>
                      <div style={{ fontWeight: 600, color: "#334155" }}>{inq.project_type_display}</div>
                      <div style={{ fontSize: 12, color: "#64748B" }}>{inq.project_location || "Napa Valley"}</div>
                    </td>

                    <td style={{ padding: "16px 16px" }}>
                      <div style={{ color: inq.estimated_budget ? "#0F172A" : "#94A3B8", fontWeight: 600 }}>
                        {inq.estimated_budget || "Not specified"}
                      </div>
                      <div style={{ fontSize: 11, color: "#64748B" }}>{inq.timeline || "Flexible"}</div>
                    </td>

                    <td style={{ padding: "16px 16px", color: "#64748B", fontSize: 12 }}>
                      {new Date(inq.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td style={{ padding: "16px 16px" }}>
                      <StatusBadge status={inq.status} />
                    </td>

                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenDetail(inq)
                        }}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          border: "1px solid #CBD5E1",
                          background: "#FFFFFF",
                          color: "#1A3A6B",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Review Lead
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      <Modal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title={selectedInquiry?.name || "Inquiry Details"}
        subtitle={`Submitted on ${selectedInquiry ? new Date(selectedInquiry.created_at).toLocaleString() : ""}`}
        maxWidth={640}
      >
        {selectedInquiry && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Quick Contact Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "#F8FAFC",
                borderRadius: 10,
                border: "1px solid #E2E8F0",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {selectedInquiry.phone && (
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      color: "#2E5BA8",
                      fontWeight: 600,
                      fontSize: 13,
                      textDecoration: "none",
                    }}
                  >
                    <Phone size={14} />
                    <span>{selectedInquiry.phone}</span>
                  </a>
                )}
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Eric Sherwood Construction Inquiry`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#2E5BA8",
                    fontWeight: 600,
                    fontSize: 13,
                    textDecoration: "none",
                  }}
                >
                  <Mail size={14} />
                  <span>{selectedInquiry.email}</span>
                </a>
              </div>

              {/* Status Select */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#64748B" }}>Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as InquiryStatus)}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 6,
                    border: "1px solid #CBD5E1",
                    padding: "4px 10px",
                    background: "#FFFFFF",
                  }}
                >
                  <option value="NEW">New Lead</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            {/* Project Specs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
              <div style={{ padding: "12px", borderRadius: 8, background: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 2 }}>
                  Project Type & Scope
                </span>
                <span style={{ fontWeight: 700, color: "#0F172A" }}>{selectedInquiry.project_type_display}</span>
              </div>

              <div style={{ padding: "12px", borderRadius: 8, background: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 2 }}>
                  Location / Parcel
                </span>
                <span style={{ fontWeight: 700, color: "#0F172A" }}>{selectedInquiry.project_location || "Napa Valley"}</span>
              </div>

              <div style={{ padding: "12px", borderRadius: 8, background: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 2 }}>
                  Target Budget
                </span>
                <span style={{ fontWeight: 700, color: "#0F172A" }}>{selectedInquiry.estimated_budget || "Undisclosed"}</span>
              </div>

              <div style={{ padding: "12px", borderRadius: 8, background: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 2 }}>
                  Target Start Date
                </span>
                <span style={{ fontWeight: 700, color: "#0F172A" }}>{selectedInquiry.timeline || "Immediate"}</span>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 6 }}>
                Client Message:
              </span>
              <div
                style={{
                  padding: 16,
                  borderRadius: 10,
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#1E293B",
                  whiteSpace: "pre-wrap",
                }}
              >
                {selectedInquiry.message}
              </div>
            </div>

            {/* Staff Internal Notes */}
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 6 }}>
                Internal Staff Notes:
              </span>
              <textarea
                rows={3}
                placeholder="Log phone calls, site walks with Eric, architect details, or next steps..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #CBD5E1",
                  fontSize: 13,
                  outline: "none",
                  background: "#FFFBEB",
                  color: "#78350F",
                }}
              />
            </div>

            {/* Footer Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", cursor: "pointer", fontSize: 13 }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleUpdateInquiry}
                disabled={isSaving}
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  background: "linear-gradient(90deg, #2E5BA8 0%, #1A3A6B 100%)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  border: "none",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  fontSize: 13,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Save size={14} />
                <span>{isSaving ? "Saving..." : "Save Status & Notes"}</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
