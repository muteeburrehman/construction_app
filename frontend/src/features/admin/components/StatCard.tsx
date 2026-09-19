import React from "react"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  accentColor?: string
  badge?: {
    text: string
    color: "blue" | "amber" | "emerald" | "slate" | "violet"
  }
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = "#2E5BA8",
  badge,
}: StatCardProps): React.JSX.Element {
  const badgeStyles = {
    blue:    { bg: "#EEF4FF", text: "#2E5BA8", border: "#C7D9F8" },
    amber:   { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
    emerald: { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
    slate:   { bg: "#F8FAFC", text: "#475569", border: "#E2E8F0" },
    violet:  { bg: "#F5F3FF", text: "#5B21B6", border: "#DDD6FE" },
  }

  const activeBadge = badge ? badgeStyles[badge.color] : null

  // Derive a soft tint from accentColor for the icon background
  const iconBg = accentColor + "18"

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        padding: "22px 24px 18px",
        border: "1px solid #E8EEF6",
        boxShadow: "0 2px 8px rgba(15,23,42,0.06), 0 0 0 0 transparent",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 24px rgba(15,23,42,0.10)"
        ;(e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 8px rgba(15,23,42,0.06)"
        ;(e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"
      }}
    >
      {/* Subtle top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}88 100%)`,
          borderRadius: "16px 16px 0 0",
        }}
      />

      {/* Icon + Badge row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accentColor,
          }}
        >
          <Icon size={20} strokeWidth={2} />
        </div>

        {badge && activeBadge && (
          <span
            style={{
              background: activeBadge.bg,
              color: activeBadge.text,
              border: `1px solid ${activeBadge.border}`,
              padding: "3px 9px",
              borderRadius: 9999,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}
          >
            {badge.text}
          </span>
        )}
      </div>

      {/* Value + Title */}
      <div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: "#0F172A",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            fontFamily: "Archivo, Inter, sans-serif",
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#64748B",
            marginTop: 5,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {title}
        </div>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div
          style={{
            fontSize: 12,
            color: "#94A3B8",
            borderTop: "1px solid #F1F5F9",
            paddingTop: 10,
            marginTop: -4,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  )
}
