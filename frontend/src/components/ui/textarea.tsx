import * as React from "react"
import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(className)}
        style={{
          display: "flex",
          minHeight: "130px",
          width: "100%",
          borderRadius: "2px",
          border: "1px solid #DDE2EC",
          background: "#FFFFFF",
          padding: "0.625rem 0.875rem",
          fontSize: "0.9375rem",
          color: "#1E2532",
          fontFamily: "var(--font-body)",
          resize: "vertical",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          outline: "none",
          lineHeight: "1.6",
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = "#2E5BA8"
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(46,91,168,0.12)"
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = "#DDE2EC"
          e.currentTarget.style.boxShadow = "none"
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
