import React from "react"
import type { InquiryStatus } from "../types"

interface StatusBadgeProps {
  status: InquiryStatus | "PUBLISHED" | "DRAFT" | "ACTIVE" | "INACTIVE"
  label?: string
}

export function StatusBadge({ status, label }: StatusBadgeProps): React.JSX.Element {
  const configs: Record<string, { bg: string; text: string; dot: string; defaultLabel: string }> = {
    NEW: {
      bg: "#EFF6FF",
      text: "#1E40AF",
      dot: "#3B82F6",
      defaultLabel: "New Lead",
    },
    IN_PROGRESS: {
      bg: "#FFFBEB",
      text: "#92400E",
      dot: "#F59E0B",
      defaultLabel: "In Progress",
    },
    CONTACTED: {
      bg: "#ECFDF5",
      text: "#065F46",
      dot: "#10B981",
      defaultLabel: "Contacted",
    },
    ARCHIVED: {
      bg: "#F3F4F6",
      text: "#4B5563",
      dot: "#9CA3AF",
      defaultLabel: "Archived",
    },
    PUBLISHED: {
      bg: "#ECFDF5",
      text: "#065F46",
      dot: "#10B981",
      defaultLabel: "Published",
    },
    DRAFT: {
      bg: "#FEF2F2",
      text: "#991B1B",
      dot: "#EF4444",
      defaultLabel: "Draft",
    },
    ACTIVE: {
      bg: "#ECFDF5",
      text: "#065F46",
      dot: "#10B981",
      defaultLabel: "Active",
    },
    INACTIVE: {
      bg: "#F3F4F6",
      text: "#4B5563",
      dot: "#9CA3AF",
      defaultLabel: "Inactive",
    },
  }

  const conf = configs[status] || configs.NEW

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 9999,
        background: conf.bg,
        color: conf.text,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.02em",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: conf.dot }} />
      {label || conf.defaultLabel}
    </span>
  )
}
