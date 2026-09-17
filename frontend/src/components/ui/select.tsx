import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

/* ── Trigger ── */
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(className)}
    style={{
      display: "flex",
      height: "2.75rem",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "2px",
      border: "1px solid #DDE2EC",
      background: "#FFFFFF",
      padding: "0.5rem 0.875rem",
      fontSize: "0.9375rem",
      color: "#1E2532",
      fontFamily: "var(--font-body)",
      cursor: "pointer",
      outline: "none",
      transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    }}
    onFocus={e => {
      e.currentTarget.style.borderColor = "#2E5BA8"
      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(46,91,168,0.12)"
    }}
    onBlur={e => {
      e.currentTarget.style.borderColor = "#DDE2EC"
      e.currentTarget.style.boxShadow = "none"
    }}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown style={{ width: 15, height: 15, opacity: 0.5, flexShrink: 0 }} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

/* ── Content (dropdown panel) ── */
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(className)}
      position={position}
      sideOffset={4}
      style={{
        position: "relative",
        zIndex: 9999,
        minWidth: "var(--radix-select-trigger-width)",
        overflow: "hidden",
        borderRadius: "4px",
        border: "1px solid #DDE2EC",
        background: "#FFFFFF",
        boxShadow: "0 8px 32px rgba(14,20,32,0.12), 0 2px 8px rgba(14,20,32,0.06)",
      }}
      {...props}
    >
      <SelectPrimitive.Viewport style={{ padding: "4px" }}>
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

/* ── Item ── */
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(className)}
    style={{
      position: "relative",
      display: "flex",
      width: "100%",
      alignItems: "center",
      cursor: "pointer",
      userSelect: "none",
      borderRadius: "2px",
      padding: "0.5rem 0.75rem 0.5rem 2rem",
      fontSize: "0.9375rem",
      color: "#1E2532",
      fontFamily: "var(--font-body)",
      outline: "none",
      transition: "background 0.1s ease",
    }}
    onMouseEnter={e => (e.currentTarget.style.background = "#EEF1F7")}
    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    {...props}
  >
    <span
      style={{
        position: "absolute",
        left: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "0.875rem",
        height: "0.875rem",
      }}
    >
      <SelectPrimitive.ItemIndicator>
        <Check style={{ width: 13, height: 13, color: "#2E5BA8" }} />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
}
