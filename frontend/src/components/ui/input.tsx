import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(className)}
        style={{
          display: "flex",
          height: "2.75rem",
          width: "100%",
          borderRadius: "2px",
          border: "1px solid #DDE2EC",
          background: "#FFFFFF",
          padding: "0.5rem 0.875rem",
          fontSize: "0.9375rem",
          color: "#1E2532",
          fontFamily: "var(--font-body)",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          outline: "none",
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
Input.displayName = "Input"

export { Input }
