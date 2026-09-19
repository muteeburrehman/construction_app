import React, { useState, useEffect } from "react"
import { Briefcase, Edit2, Trash2 } from "lucide-react"
import { adminFetch } from "../api/adminClient"
import { Modal } from "../components/Modal"
import { StatusBadge } from "../components/StatusBadge"
import { useAppDialog } from "../context/DialogContext"
import type { AdminService } from "../types"

export function ServicesView(): React.JSX.Element {
  const { toast } = useAppDialog()
  const [services, setServices] = useState<AdminService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<AdminService | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "residential" as "residential" | "commercial",
    summary: "",
    body: "",
    capabilities: [] as string[],
    is_published: true,
  })
  const [capabilityInput, setCapabilityInput] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const loadServices = async () => {
    setIsLoading(true)
    try {
      const res = await adminFetch<{ results?: AdminService[] } | AdminService[]>("services/")
      const list = Array.isArray(res) ? res : res.results || []
      setServices(list)
    } catch (err) {
      console.error("Failed to load services:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadServices()
  }, [])

  const handleOpenEdit = (service: AdminService) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      category: service.category,
      summary: service.summary,
      body: service.body,
      capabilities: service.capabilities || [],
      is_published: service.is_published,
    })
    setIsEditModalOpen(true)
  }

  const handleAddCapability = () => {
    if (!capabilityInput.trim()) return
    setFormData({
      ...formData,
      capabilities: [...formData.capabilities, capabilityInput.trim()],
    })
    setCapabilityInput("")
  }

  const handleRemoveCapability = (idx: number) => {
    setFormData({
      ...formData,
      capabilities: formData.capabilities.filter((_, i) => i !== idx),
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingService) return
    setIsSaving(true)

    try {
      await adminFetch(`services/${editingService.id}/`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      })
      toast.success(`"${formData.title}" updated successfully!`)
      setIsEditModalOpen(false)
      loadServices()
    } catch (err) {
      toast.error("Failed to save service: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.03em" }}>
          Services & Divisions
        </h2>
        <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0 0" }}>
          Edit your service offerings and update capabilities shown to clients
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 20 }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>Loading services...</div>
        ) : (
          services.map((svc) => {
            const isResidential = svc.category === "residential"
            const accentColor = isResidential ? "#2E5BA8" : "#374151"
            const accentBg = isResidential ? "#EEF4FF" : "#F3F4F6"
            const capColor = isResidential
              ? { bg: "#EEF4FF", text: "#2E5BA8", border: "#C7D9F8" }
              : { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" }

            return (
            <div
              key={svc.id}
              style={{
                background: "#FFFFFF",
                borderRadius: 16,
                border: "1px solid #E8EEF6",
                boxShadow: "0 2px 10px rgba(15,23,42,0.06)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(15,23,42,0.10)"
                ;(e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 10px rgba(15,23,42,0.06)"
                ;(e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"
              }}
            >
              {/* Top accent */}
              <div style={{ height: 4, background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}55 100%)` }} />

              <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: accentBg,
                        color: accentColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0, lineHeight: 1.3 }}>{svc.title}</h3>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: accentColor,
                          background: accentBg,
                          padding: "2px 8px",
                          borderRadius: 9999,
                          display: "inline-flex",
                          alignItems: "center",
                          whiteSpace: "nowrap",
                          marginTop: 3,
                        }}
                      >
                        {svc.category_display || svc.category}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={svc.is_published ? "PUBLISHED" : "DRAFT"} />
                </div>

                {/* Summary */}
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0 }}>{svc.summary}</p>

                {/* Capabilities */}
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: 8,
                    }}
                  >
                    Capabilities · {svc.capabilities?.length || 0}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {svc.capabilities?.map((cap, i) => (
                      <span
                        key={i}
                        style={{
                          background: capColor.bg,
                          border: `1px solid ${capColor.border}`,
                          color: capColor.text,
                          padding: "3px 9px",
                          borderRadius: 9999,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "12px 22px",
                  borderTop: "1px solid #F1F5F9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#FAFBFF",
                }}
              >
                <span style={{ fontSize: 12, color: "#64748B" }}>
                  <strong style={{ color: "#0F172A" }}>{svc.projects_count || 0}</strong> projects linked
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(svc)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: `1px solid ${capColor.border}`,
                    background: accentBg,
                    color: accentColor,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  <Edit2 size={13} />
                  <span>Edit Content</span>
                </button>
              </div>
            </div>
            )
          })
        )}
      </div>

      {/* Edit Service Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Service: ${editingService?.title || ""}`}
        subtitle="Update overview, description, and list of capabilities"
        maxWidth={640}
      >
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Service Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Summary Overview
            </label>
            <textarea
              rows={2}
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Detailed Description Body
            </label>
            <textarea
              rows={4}
              required
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
              Capabilities List
            </label>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input
                type="text"
                placeholder="e.g. Hillside Foundation Engineering"
                value={capabilityInput}
                onChange={(e) => setCapabilityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddCapability()
                  }
                }}
                style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
              />
              <button
                type="button"
                onClick={handleAddCapability}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  background: "#2E5BA8",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: 13,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {formData.capabilities.map((cap, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 12px",
                    borderRadius: 6,
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    fontSize: 13,
                  }}
                >
                  <span>{cap}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCapability(i)}
                    style={{ color: "#DC2626", background: "none", border: "none", cursor: "pointer" }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", cursor: "pointer", fontSize: 13 }}
            >
              Cancel
            </button>
            <button
              type="submit"
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
              }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
