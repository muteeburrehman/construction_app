import React, { useState, useEffect } from "react"
import {
  Plus,
  Search,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Star,
  Upload,
} from "lucide-react"
import { adminFetch } from "../api/adminClient"
import { Modal } from "../components/Modal"
import { StatusBadge } from "../components/StatusBadge"
import { useAppDialog } from "../context/DialogContext"
import type { AdminProject } from "../types"

interface ProjectFormData {
  title: string
  category: "residential" | "commercial"
  location: string
  year: number
  scope: string
  summary: string
  body: string
  is_featured: boolean
  is_published: boolean
  order: number
}

const defaultFormData: ProjectFormData = {
  title: "",
  category: "residential",
  location: "",
  year: new Date().getFullYear(),
  scope: "",
  summary: "",
  body: "",
  is_featured: false,
  is_published: true,
  order: 0,
}

export function ProjectsView(): React.JSX.Element {
  const { toast, confirm } = useAppDialog()
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null)
  const [formData, setFormData] = useState<ProjectFormData>(defaultFormData)
  const [isSaving, setIsSaving] = useState(false)

  // Gallery Modal state
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false)
  const [galleryProject, setGalleryProject] = useState<AdminProject | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadAlt, setUploadAlt] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const loadProjects = async () => {
    setIsLoading(true)
    try {
      // Direct call to admin projects endpoint (optimized zero N+1)
      const res = await adminFetch<{ results?: AdminProject[] } | AdminProject[]>("projects/")
      const list = Array.isArray(res) ? res : res.results || []
      setProjects(list)
    } catch (err) {
      console.error("Failed to fetch projects:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleOpenCreate = () => {
    setEditingProject(null)
    setFormData(defaultFormData)
    setIsEditModalOpen(true)
  }

  const handleOpenEdit = (project: AdminProject) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      category: project.category,
      location: project.location,
      year: project.year,
      scope: project.scope,
      summary: project.summary,
      body: project.body,
      is_featured: project.is_featured,
      is_published: project.is_published,
      order: project.order,
    })
    setIsEditModalOpen(true)
  }

  const handleOpenGallery = (project: AdminProject) => {
    setGalleryProject(project)
    setIsGalleryModalOpen(true)
  }

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      if (editingProject) {
        await adminFetch(`projects/${editingProject.id}/`, {
          method: "PATCH",
          body: JSON.stringify(formData),
        })
        toast.success(`"${formData.title}" updated successfully!`)
      } else {
        await adminFetch("projects/", {
          method: "POST",
          body: JSON.stringify(formData),
        })
        toast.success(`"${formData.title}" created successfully!`)
      }
      setIsEditModalOpen(false)
      loadProjects()
    } catch (err) {
      toast.error("Error saving project: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProject = async (project: AdminProject) => {
    const ok = await confirm({
      title: "Delete Project?",
      message: `Are you sure you want to delete "${project.title}"? All associated gallery images and project data will be permanently removed.`,
      confirmText: "Delete Project",
      destructive: true,
    })
    if (!ok) return

    try {
      await adminFetch(`projects/${project.id}/`, { method: "DELETE" })
      toast.success(`"${project.title}" deleted`)
      loadProjects()
    } catch (err) {
      toast.error("Failed to delete project: " + (err instanceof Error ? err.message : String(err)))
    }
  }

  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!galleryProject || !uploadFile) return

    setIsUploading(true)
    const data = new FormData()
    data.append("image", uploadFile)
    data.append("alt_text", uploadAlt || galleryProject.title)

    try {
      await adminFetch(`projects/${galleryProject.id}/upload_image/`, {
        method: "POST",
        body: data,
      })
      setUploadFile(null)
      setUploadAlt("")
      const updated = await adminFetch<AdminProject>(`projects/${galleryProject.id}/`)
      setGalleryProject(updated)
      loadProjects()
      toast.success("Image uploaded to project gallery")
    } catch (err) {
      toast.error("Upload failed: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!galleryProject) return
    const ok = await confirm({
      title: "Delete Photo?",
      message: "Are you sure you want to remove this image from the gallery?",
      confirmText: "Delete Photo",
      destructive: true,
    })
    if (!ok) return

    try {
      await adminFetch(`projects/${galleryProject.id}/images/${imageId}/`, {
        method: "DELETE",
      })
      const updated = await adminFetch<AdminProject>(`projects/${galleryProject.id}/`)
      setGalleryProject(updated)
      loadProjects()
      toast.success("Photo removed from gallery")
    } catch (err) {
      toast.error("Failed to delete image: " + (err instanceof Error ? err.message : String(err)))
    }
  }

  const handleSetCover = async (imageId: string) => {
    if (!galleryProject) return
    try {
      await adminFetch(`projects/${galleryProject.id}/images/${imageId}/set-cover/`, {
        method: "PATCH",
      })
      const updated = await adminFetch<AdminProject>(`projects/${galleryProject.id}/`)
      setGalleryProject(updated)
      loadProjects()
      toast.success("Cover image updated")
    } catch (err) {
      toast.error("Failed to set cover image: " + (err instanceof Error ? err.message : String(err)))
    }
  }

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.scope.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = categoryFilter === "all" || p.category === categoryFilter
    return matchesSearch && matchesCat
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Action Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 280, maxWidth: 500 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Search projects by title, city, or scope..."
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

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #CBD5E1",
              fontSize: 13,
              background: "#FFFFFF",
              color: "#334155",
              cursor: "pointer",
            }}
          >
            <option value="all">All Categories</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
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
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Plus size={16} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid #E8EEF6",
          boxShadow: "0 2px 10px rgba(15,23,42,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Column Headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 190px 140px 110px 90px 90px",
            padding: "10px 20px",
            background: "#F8FAFC",
            borderBottom: "1px solid #E8EEF6",
            fontSize: 11,
            fontWeight: 700,
            color: "#94A3B8",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          <span>Project</span>
          <span>Category</span>
          <span>Location & Year</span>
          <span>Status</span>
          <span>Photos</span>
          <span style={{ textAlign: "right" }}>Actions</span>
        </div>

        {isLoading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#94A3B8", fontSize: 13 }}>Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#94A3B8", fontSize: 13 }}>No projects found.</div>
        ) : (
          filteredProjects.map((project, idx) => {
            const isResidential = project.category === "residential"
            const catColor = isResidential
              ? { bg: "#EEF4FF", text: "#2E5BA8", border: "#C7D9F8" }
              : { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" }

            const categoryLabel =
              project.category === "commercial" ||
              project.category_display?.toLowerCase().includes("commercial")
                ? "Commercial & Winery"
                : "Custom Residential"

            return (
              <div
                key={project.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 190px 140px 110px 90px 90px",
                  padding: "14px 20px",
                  alignItems: "center",
                  borderBottom: idx < filteredProjects.length - 1 ? "1px solid #F1F5F9" : "none",
                  background: "#FFFFFF",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#FAFBFF")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#FFFFFF")}
              >
                {/* Project name + scope */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  {/* Color accent dot */}
                  <div
                    style={{
                      width: 6,
                      height: 36,
                      borderRadius: 3,
                      background: isResidential ? "#2E5BA8" : "#6B7280",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, color: "#0F172A", fontSize: 13 }}>{project.title}</span>
                      {project.is_featured && (
                        <span
                          style={{
                            background: "#FFFBEB",
                            color: "#B45309",
                            border: "1px solid #FDE68A",
                            padding: "1px 6px",
                            borderRadius: 9999,
                            fontSize: 10,
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Star size={9} fill="#B45309" />
                          Featured
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        color: "#94A3B8",
                        fontSize: 11,
                        marginTop: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 280,
                      }}
                    >
                      {project.scope}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      whiteSpace: "nowrap",
                      background: catColor.bg,
                      color: catColor.text,
                      border: `1px solid ${catColor.border}`,
                      padding: "4px 10px",
                      borderRadius: 9999,
                      fontSize: 11,
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {categoryLabel}
                  </span>
                </div>

                {/* Location & Year */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>{project.location}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>{project.year}</div>
                </div>

                {/* Status */}
                <div>
                  <StatusBadge status={project.is_published ? "PUBLISHED" : "DRAFT"} />
                </div>

                {/* Gallery */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleOpenGallery(project)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 10px",
                      borderRadius: 8,
                      border: "1px solid #E2E8F0",
                      background: "#FFFFFF",
                      color: "#2E5BA8",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <ImageIcon size={13} />
                    {project.images_count || project.images?.length || 0}
                  </button>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(project)}
                    title="Edit"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid #E2E8F0",
                      background: "#FFFFFF",
                      color: "#475569",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#F1F5F9")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF")}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(project)}
                    title="Delete"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid #FEE2E2",
                      background: "#FEF2F2",
                      color: "#DC2626",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#FEE2E2")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#FEF2F2")}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Edit / Create Project Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={editingProject ? `Edit: ${editingProject.title}` : "Add New Project"}
        subtitle="Manage portfolio specifications and presentation"
        maxWidth={680}
      >
        <form onSubmit={handleSaveProject} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. St. Helena Vineyard Residence"
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as "residential" | "commercial" })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#fff" }}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Yountville, CA"
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                Completion Year
              </label>
              <input
                type="number"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2024 })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Scope & Dimensions *
            </label>
            <input
              type="text"
              required
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              placeholder="e.g. Ground-up 6,500 sq ft custom residential build with infinity pool"
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Short Summary (Card Overview)
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
              Full Project Description
            </label>
            <textarea
              rows={4}
              required
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "12px 0" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              />
              <span>Feature on Homepage Showcase</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              />
              <span>Published (Visible to Public)</span>
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
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
              {isSaving ? "Saving..." : editingProject ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Gallery Manager Modal */}
      <Modal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        title={`Gallery: ${galleryProject?.title || ""}`}
        subtitle="Upload photos, select cover image, and manage project photography"
        maxWidth={760}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Upload Form */}
          <form
            onSubmit={handleUploadImage}
            style={{
              padding: 16,
              background: "#F8FAFC",
              borderRadius: 10,
              border: "1px dashed #CBD5E1",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              style={{ fontSize: 12 }}
            />
            <input
              type="text"
              placeholder="Caption / Alt text..."
              value={uploadAlt}
              onChange={(e) => setUploadAlt(e.target.value)}
              style={{ flex: 1, minWidth: 160, padding: "6px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12 }}
            />
            <button
              type="submit"
              disabled={isUploading || !uploadFile}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                background: "#2E5BA8",
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 600,
                border: "none",
                cursor: isUploading ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Upload size={13} />
              <span>{isUploading ? "Uploading..." : "Add Photo"}</span>
            </button>
          </form>

          {/* Photos Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 14,
            }}
          >
            {(!galleryProject?.images || galleryProject.images.length === 0) && (
              <div style={{ gridColumn: "1 / -1", padding: 32, textAlign: "center", color: "#94A3B8", fontSize: 13 }}>
                No photos uploaded for this project yet.
              </div>
            )}

            {galleryProject?.images?.map((img) => (
              <div
                key={img.id}
                style={{
                  borderRadius: 10,
                  border: img.is_cover ? "2px solid #2E5BA8" : "1px solid #E2E8F0",
                  overflow: "hidden",
                  position: "relative",
                  background: "#FFFFFF",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ height: 120, background: "#F1F5F9", position: "relative" }}>
                  <img
                    src={img.image_url || img.image}
                    alt={img.alt_text}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {img.is_cover && (
                    <span
                      style={{
                        position: "absolute",
                        top: 6,
                        left: 6,
                        background: "#2E5BA8",
                        color: "#FFFFFF",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      Cover
                    </span>
                  )}
                </div>

                <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                  <button
                    type="button"
                    onClick={() => handleSetCover(img.id)}
                    disabled={img.is_cover}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: img.is_cover ? "#94A3B8" : "#2E5BA8",
                      background: "none",
                      border: "none",
                      cursor: img.is_cover ? "default" : "pointer",
                      padding: 0,
                    }}
                  >
                    {img.is_cover ? "Main Cover" : "Make Cover"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    style={{
                      color: "#DC2626",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 2,
                    }}
                    title="Delete Image"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}
