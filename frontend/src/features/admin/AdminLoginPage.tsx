import React, { useState } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import { Lock, User, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react"
import { useAuth } from "./context/AuthContext"

export function AdminLoginPage(): React.JSX.Element {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login(username, password)
      navigate("/admin", { replace: true })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to sign in. Please verify your credentials.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #1A3A6B 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "Archivo, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#FFFFFF",
          borderRadius: 16,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          padding: "36px 32px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: "linear-gradient(135deg, #2E5BA8 0%, #1A3A6B 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              marginBottom: 16,
              boxShadow: "0 4px 12px rgba(46, 91, 168, 0.3)",
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
            Apex Construction Group
          </h1>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
            Sign in to access the administrative control suite
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              marginBottom: 20,
              padding: "12px 14px",
              borderRadius: 8,
              background: "#FEF2F2",
              border: "1px solid #FEE2E2",
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#991B1B",
              fontSize: 13,
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label
              htmlFor="username"
              style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}
            >
              Username
            </label>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94A3B8",
                  pointerEvents: "none",
                }}
              >
                <User size={16} />
              </div>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 38px",
                  borderRadius: 8,
                  border: "1px solid #CBD5E1",
                  fontSize: 14,
                  outline: "none",
                  transition: "border-color 0.15s ease",
                  color: "#0F172A",
                  background: "#FFFFFF",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="password"
              style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94A3B8",
                  pointerEvents: "none",
                }}
              >
                <Lock size={16} />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 38px",
                  borderRadius: 8,
                  border: "1px solid #CBD5E1",
                  fontSize: 14,
                  outline: "none",
                  transition: "border-color 0.15s ease",
                  color: "#0F172A",
                  background: "#FFFFFF",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "none",
              background: isSubmitting ? "#94A3B8" : "linear-gradient(90deg, #2E5BA8 0%, #1A3A6B 100%)",
              color: "#FFFFFF",
              fontSize: 14,
              fontWeight: 700,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.1s ease",
            }}
          >
            <span>{isSubmitting ? "Verifying..." : "Sign In to Admin"}</span>
            {!isSubmitting && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center", borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>
            Demo credentials: <strong style={{ color: "#334155" }}>admin</strong> / <strong style={{ color: "#334155" }}>admin123</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
