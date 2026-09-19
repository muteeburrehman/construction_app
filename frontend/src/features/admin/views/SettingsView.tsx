import React, { useState, useEffect } from "react"
import { Save, CheckCircle2 } from "lucide-react"
import { adminFetch } from "../api/adminClient"
import { useAppDialog } from "../context/DialogContext"
import type { AdminSiteSettings } from "../types"

export function SettingsView(): React.JSX.Element {
  const { toast } = useAppDialog()
  const [settings, setSettings] = useState<AdminSiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      const res = await adminFetch<AdminSiteSettings>("settings/")
      setSettings(res)
    } catch (err) {
      console.error("Failed to load settings:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    setIsSaving(true)
    setSavedSuccess(false)

    try {
      const updated = await adminFetch<AdminSiteSettings>("settings/", {
        method: "PATCH",
        body: JSON.stringify(settings),
      })
      setSettings(updated)
      setSavedSuccess(true)
      toast.success("Site settings saved successfully!")
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (err) {
      toast.error("Failed to save settings: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !settings) {
    return <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>Loading settings...</div>
  }

  return (
    <div style={{ maxWidth: 800, display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0 }}>
          Site Settings
        </h2>
        <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0 0" }}>
          Update your contact details, business hours, and social media links. Changes save to your live website.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Core Identity */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>Company Information</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                Company Name
              </label>
              <input
                type="text"
                required
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                CSLB License Number
              </label>
              <input
                type="text"
                required
                value={settings.license_number}
                onChange={(e) => setSettings({ ...settings, license_number: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Website Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                Direct Phone
              </label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                Inquiry Email
              </label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
              />
            </div>
          </div>
        </div>

        {/* Location & Coverage */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>Service Area & Location</h3>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Service Area Description
            </label>
            <input
              type="text"
              value={settings.service_area}
              onChange={(e) => setSettings({ ...settings, service_area: e.target.value })}
              placeholder="e.g. Napa County, Sonoma County, St. Helena, Yountville, Calistoga"
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Operating Hours
            </label>
            <input
              type="text"
              value={settings.hours || "Monday – Friday: 7:00 AM – 5:00 PM PST"}
              onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                City
              </label>
              <input
                type="text"
                value={settings.city || "Napa"}
                onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                State
              </label>
              <input
                type="text"
                value={settings.state || "California"}
                onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                Postal Code
              </label>
              <input
                type="text"
                value={settings.postal_code || "94558"}
                onChange={(e) => setSettings({ ...settings, postal_code: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
              />
            </div>
          </div>
        </div>

        {/* Social Media URLs */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>Social Media Profiles</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                YouTube Channel
              </label>
              <input
                type="url"
                value={settings.youtube_url || ""}
                onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                placeholder="https://www.youtube.com/..."
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={settings.linkedin_url || ""}
                onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                placeholder="https://www.linkedin.com/..."
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                Facebook Page
              </label>
              <input
                type="url"
                value={settings.facebook_url || ""}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                placeholder="https://www.facebook.com/..."
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {savedSuccess ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#059669", fontSize: 13, fontWeight: 600 }}>
              <CheckCircle2 size={16} />
              <span>Settings successfully updated across the website!</span>
            </div>
          ) : (
            <div />
          )}

          <button
            type="submit"
            disabled={isSaving}
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              background: "linear-gradient(90deg, #2E5BA8 0%, #1A3A6B 100%)",
              color: "#FFFFFF",
              fontWeight: 700,
              border: "none",
              cursor: isSaving ? "not-allowed" : "pointer",
              fontSize: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <Save size={16} />
            <span>{isSaving ? "Saving Settings..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
