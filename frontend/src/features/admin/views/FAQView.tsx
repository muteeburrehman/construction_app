import React, { useState, useEffect } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { adminFetch } from "../api/adminClient"
import { Modal } from "../components/Modal"
import { StatusBadge } from "../components/StatusBadge"
import { useAppDialog } from "../context/DialogContext"
import type { AdminFAQ } from "../types"

export function FAQView(): React.JSX.Element {
  const { toast, confirm } = useAppDialog()
  // State
  const [faqs, setFaqs] = useState<AdminFAQ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<AdminFAQ | null>(null)
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general" as AdminFAQ["category"],
    keywords: "",
    order: 0,
    is_active: true,
    is_suggested: true,
  })
  const [isSaving, setIsSaving] = useState(false)

  const loadFaqs = async () => {
    setIsLoading(true)
    try {
      const res = await adminFetch<{ results?: AdminFAQ[] } | AdminFAQ[]>("faqs/")
      const list = Array.isArray(res) ? res : res.results || []
      setFaqs(list)
    } catch (err) {
      console.error("Failed to load FAQs:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFaqs()
  }, [])

  const handleOpenCreate = () => {
    setEditingFaq(null)
    setFormData({
      question: "",
      answer: "",
      category: "general",
      keywords: "",
      order: faqs.length + 1,
      is_active: true,
      is_suggested: false,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (faq: AdminFAQ) => {
    setEditingFaq(faq)
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      keywords: faq.keywords,
      order: faq.order,
      is_active: faq.is_active,
      is_suggested: faq.is_suggested,
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (editingFaq) {
        await adminFetch(`faqs/${editingFaq.id}/`, {
          method: "PATCH",
          body: JSON.stringify(formData),
        })
      } else {
        await adminFetch("faqs/", {
          method: "POST",
          body: JSON.stringify(formData),
        })
      }
      toast.success(editingFaq ? "FAQ updated successfully!" : "FAQ created successfully!")
      setIsModalOpen(false)
      loadFaqs()
    } catch (err) {
      toast.error("Failed to save FAQ: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (faq: AdminFAQ) => {
    const ok = await confirm({
      title: "Delete Question?",
      message: `Are you sure you want to delete "${faq.question}" from the chatbot knowledge base?`,
      confirmText: "Delete Question",
      destructive: true,
    })
    if (!ok) return

    try {
      await adminFetch(`faqs/${faq.id}/`, { method: "DELETE" })
      toast.success("FAQ deleted")
      loadFaqs()
    } catch (err) {
      toast.error("Failed to delete FAQ: " + (err instanceof Error ? err.message : String(err)))
    }
  }

  const filteredFaqs = faqs.filter((f) => {
    return categoryFilter === "all" || f.category === categoryFilter
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Top Banner */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0 }}>
            Chatbot Questions &amp; Answers
          </h2>
          <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0 0" }}>
            These are the questions your website chatbot can answer. Add or edit them anytime.
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
          <span>Add FAQ</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["all", "general", "residential", "commercial", "process", "pricing", "licensing"].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              textTransform: "capitalize",
              border: "1px solid #CBD5E1",
              background: categoryFilter === cat ? "#1A3A6B" : "#FFFFFF",
              color: categoryFilter === cat ? "#FFFFFF" : "#475569",
              cursor: "pointer",
            }}
          >
            {cat === "all" ? "All Questions" : cat}
          </button>
        ))}
      </div>

      {/* FAQs List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>Loading knowledge base...</div>
        ) : filteredFaqs.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>No FAQs found for this category.</div>
        ) : (
          filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              style={{
                background: "#FFFFFF",
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                padding: "18px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: "#EFF6FF",
                        color: "#1E40AF",
                        whiteSpace: "nowrap",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      {faq.category_display || faq.category}
                    </span>
                    {faq.is_suggested && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: "#FEF3C7",
                          color: "#92400E",
                        }}
                      >
                        Public Suggestion Chip
                      </span>
                    )}
                    <StatusBadge status={faq.is_active ? "ACTIVE" : "INACTIVE"} />
                  </div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>{faq.question}</h4>
                </div>

                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(faq)}
                    style={{ padding: 6, borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFFFFF", cursor: "pointer" }}
                  >
                    <Edit2 size={14} color="#475569" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(faq)}
                    style={{ padding: 6, borderRadius: 6, border: "1px solid #FEE2E2", background: "#FEF2F2", cursor: "pointer" }}
                  >
                    <Trash2 size={14} color="#DC2626" />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.5, margin: 0 }}>{faq.answer}</p>

              {faq.keywords && (
                <div style={{ fontSize: 12, color: "#64748B" }}>
                  <strong style={{ color: "#475569" }}>Keyword Triggers:</strong> {faq.keywords}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFaq ? "Edit FAQ" : "Add New FAQ"}
        subtitle="The chatbot will use this to answer visitor questions"
      >
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Visitor Question *
            </label>
            <input
              type="text"
              required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="e.g. Do you build wineries in Napa Valley?"
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as AdminFAQ["category"] })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#fff" }}
              >
                <option value="general">General</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="process">Process &amp; Timeline</option>
                <option value="pricing">Pricing &amp; Billing</option>
                <option value="licensing">Licensing &amp; Insurance</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Keywords
              <span style={{ fontWeight: 400, color: "#94A3B8", marginLeft: 6 }}>Words a visitor might type to find this question (comma separated)</span>
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="e.g. winery, tasting room, barrel cave, hospitality"
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Answer Returned to Visitor *
            </label>
            <textarea
              rows={4}
              required
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Provide an informative, direct response about your capabilities..."
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "8px 0" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={formData.is_suggested}
                onChange={(e) => setFormData({ ...formData, is_suggested: e.target.checked })}
              />
              <span>Show as Quick Suggestion Chip on Chat Widget</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span>Active in Search Engine</span>
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
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
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
