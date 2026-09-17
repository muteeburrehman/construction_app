import React from "react"
import { cn } from "@/lib/utils"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "main" | "header" | "footer" | "article"
  size?: "default" | "narrow" | "wide"
}

export function Container({
  as: Component = "div",
  size = "default",
  className,
  children,
  ...props
}: ContainerProps): React.JSX.Element {
  const sizeClasses = {
    narrow:  "max-w-[760px]",
    default: "max-w-[1200px]",
    wide:    "max-w-[1440px]",
  }[size]

  return (
    <Component
      className={cn("w-full mx-auto px-6 sm:px-8 lg:px-12", sizeClasses, className)}
      {...props}
    >
      {children}
    </Component>
  )
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "article"
  spacing?: "none" | "tight" | "default" | "loose"
  bg?: "white" | "warm" | "mist" | "charcoal" | "forest"
}

export function Section({
  as: Component = "section",
  spacing = "default",
  bg = "white",
  className,
  children,
  ...props
}: SectionProps): React.JSX.Element {
  const spacingClasses = {
    none:    "py-0",
    tight:   "py-12 sm:py-16",
    default: "py-20 sm:py-24 lg:py-28",
    loose:   "py-28 sm:py-32 lg:py-36",
  }[spacing]

  const bgClasses = {
    white:    "bg-chalk text-charcoal",
    warm:     "bg-warm text-charcoal",
    mist:     "bg-mist text-charcoal",
    charcoal: "bg-charcoal text-chalk",
    forest:   "bg-forest text-chalk",
  }[bg]

  return (
    <Component
      className={cn("w-full relative", spacingClasses, bgClasses, className)}
      {...props}
    >
      {children}
    </Component>
  )
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: "sm" | "md" | "lg" | "xl"
}

export function Grid({
  cols = 3,
  gap = "lg",
  className,
  children,
  ...props
}: GridProps): React.JSX.Element {
  const colClasses = {
    1:  "grid-cols-1",
    2:  "grid-cols-1 md:grid-cols-2",
    3:  "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4:  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5:  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
    6:  "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    12: "grid-cols-12",
  }[cols]

  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8 sm:gap-10",
    xl: "gap-12 sm:gap-16",
  }[gap]

  return (
    <div
      className={cn("grid", colClasses, gapClasses, className)}
      {...props}
    >
      {children}
    </div>
  )
}
