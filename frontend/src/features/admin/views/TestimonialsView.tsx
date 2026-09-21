import React, { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Quote } from "lucide-react"
import { adminFetch } from "../api/adminClient"
import { Modal } from "../components/Modal"
import { StatusBadge } from "../components/StatusBadge"
import { useAppDialog } from "../context/DialogContext"
import type { AdminTestimonial, AdminProject } from "../types"

export function TestimonialsView(): React.JSX.Element {
  const { toast, confirm } = useAppDialog()
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([])
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AdminTestimonial | null>(null)
  const [formData, setFormData] = useState({
    author: "",
    role_or_location: "",
    quote: "",
    project: "" as string | null,
    order: 0,
    is_published: true,
  })
  const [isSaving, setIsSaving] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [tRes, pRes] = await Promise.all([
        adminFetch<{ results?: AdminTestimonial[] } | AdminTestimonial[]>("testimonials/"),
        adminFetch<{ results?: AdminProject[] } | AdminProject[]>("projects/"),
      ])
      setTestimonials(Array.isArray(tRes) ? tRes : tRes.results || [])
      setProjects(Array.isArray(pRes) ? pRes : pRes.results || [])
    } catch (err) {
      console.error("Failed to load testimonials:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenCreate = () => {
    setEditingItem(null)
    setFormData({
      author: "",
      role_or_location: "",
      quote: "",
      project: null,
      order: testimonials.length + 1,
      is_published: true,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: AdminTestimonial) => {
    setEditingItem(item)
    setFormData({
      author: item.author,
      role_or_location: item.role_or_location,
      quote: item.quote,
      project: item.project,
      order: item.order,
      is_published: item.is_published,
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const payload = {
      ...formData,
      project: formData.project ? formData.project : null,
    }

    try {
      if (editingItem) {
        await adminFetch(`testimonials/${editingItem.id}/`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
        toast.success(`Testimonial from "${formData.author}" updated`)
      } else {
        await adminFetch("testimonials/", {
          method: "POST",
          body: JSON.stringify(payload),
        })
        toast.success(`Testimonial from "${formData.author}" added`)
      }
      setIsModalOpen(false)
      loadData()
    } catch (err) {
      toast.error("Failed to save testimonial: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (item: AdminTestimonial) => {
    const ok = await confirm({
      title: "Delete Testimonial?",
      message: `Are you sure you want to delete the quote from "${item.author}"?`,
      confirmText: "Delete Testimonial",
      destructive: true,
    })
    if (!ok) return

    try {
      await adminFetch(`testimonials/${item.id}/`, { method: "DELETE" })
      toast.success(`Quote from "${item.author}" deleted`)
      loadData()
    } catch (err) {
      toast.error("Failed to delete: " + (err instanceof Error ? err.message : String(err)))
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0 }}>Client Testimonials & Praise</h2>
          <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0 0" }}>
            Direct quotes from winery proprietors, architects, and custom estate owners
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 16px",
            borderRadius: 8,
            background: "linear-gradient(90deg, #2E5BA8 0%, #1A3A6B 100%)",
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}
        >
          <Plus size={16} />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 18 }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>No testimonials found.</div>
        ) : (
          testimonials.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#FFFFFF",
                borderRadius: 14,
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                padding: 22,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 14,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ color: "#2E5BA8" }}>
                    <Quote size={24} style={{ opacity: 0.8 }} />
                  </div>
                  <StatusBadge status={item.is_published ? "PUBLISHED" : "DRAFT"} />
                </div>

                <p style={{ fontSize: 14, fontStyle: "italic", color: "#334155", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                  "{item.quote}"
                </p>

                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{item.author}</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>{item.role_or_location}</div>
                  {item.project_title && (
                    <div style={{ fontSize: 11, color: "#2E5BA8", fontWeight: 600, marginTop: 4 }}>
                      Build: {item.project_title}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>Display Order: {item.order}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    style={{ padding: 6, borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFFFFF", cursor: "pointer" }}
                  >
                    <Edit2 size={14} color="#475569" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    style={{ padding: 6, borderRadius: 6, border: "1px solid #FEE2E2", background: "#FEF2F2", cursor: "pointer" }}
                  >
                    <Trash2 size={14} color="#DC2626" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Testimonial" : "Add Testimonial"}
        subtitle="Manage client review and reference quotation"
      >
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Client Name / Author *
            </label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="e.g. Thomas & Claire Keller"
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Title, Role, or City *
            </label>
            <input
              type="text"
              required
              value={formData.role_or_location}
              onChange={(e) => setFormData({ ...formData, role_or_location: e.target.value })}
              placeholder="e.g. Estate Owners, St. Helena"
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Associated Portfolio Project (Optional)
            </label>
            <select
              value={formData.project || ""}
              onChange={(e) => setFormData({ ...formData, project: e.target.value || null })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#fff" }}
            >
              <option value="">-- No specific project --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Quote *
            </label>
            <textarea
              rows={4}
              required
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              placeholder="The team's attention to structural detail and honest communication..."
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 6 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                />
                <span>Published on Site</span>
              </label>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
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
              {isSaving ? "Saving..." : "Save Testimonial"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
