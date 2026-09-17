import React from "react"
import { cn } from "@/lib/utils"

export interface DisplayProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "div"
  size?: "lg" | "xl" | "2xl"
  weight?: 600 | 800
}

export function Display({
  as: Component = "h1",
  size = "xl",
  weight = 800,
  className,
  children,
  ...props
}: DisplayProps): React.JSX.Element {
  const sizeClasses = {
    "2xl": "text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] leading-[0.96] tracking-[-0.04em]",
    xl:    "text-4xl sm:text-5xl md:text-6xl leading-[1.02] tracking-[-0.035em]",
    lg:    "text-3xl sm:text-4xl md:text-5xl leading-[1.08] tracking-[-0.03em]",
  }[size]
  const weightClass = weight === 800 ? "font-extrabold" : "font-semibold"

  return (
    <Component
      className={cn("font-display text-charcoal", sizeClasses, weightClass, className)}
      {...props}
    >
      {children}
    </Component>
  )
}

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div" | "p"
  weight?: 600 | 800
}

export function Heading({
  level = 2,
  as,
  weight = 600,
  className,
  children,
  ...props
}: HeadingProps): React.JSX.Element {
  const defaultTag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  const Component = as ?? defaultTag

  const levelClasses: Record<number, string> = {
    1: "text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em] leading-[1.1]",
    2: "text-2xl sm:text-3xl lg:text-[2.25rem] tracking-[-0.025em] leading-[1.16]",
    3: "text-xl sm:text-2xl lg:text-3xl tracking-[-0.02em] leading-[1.25]",
    4: "text-lg sm:text-xl tracking-[-0.015em] leading-[1.3]",
    5: "text-base sm:text-lg tracking-[-0.01em] leading-[1.4]",
    6: "text-sm sm:text-base tracking-tight leading-[1.45]",
  }

  const weightClass = weight === 800 ? "font-extrabold" : "font-semibold"

  return (
    <Component
      className={cn("font-display text-charcoal", levelClasses[level], weightClass, className)}
      {...props}
    >
      {children}
    </Component>
  )
}

export interface LeadProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "div"
}

export function Lead({
  as: Component = "p",
  className,
  children,
  ...props
}: LeadProps): React.JSX.Element {
  return (
    <Component
      className={cn(
        "font-body text-lg sm:text-xl lg:text-2xl leading-[1.55] text-graphite max-w-[62ch]",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export interface ProseProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "div" | "article"
  size?: "sm" | "base" | "lg"
}

export function Prose({
  as: Component = "p",
  size = "base",
  className,
  children,
  ...props
}: ProseProps): React.JSX.Element {
  const sizeClasses = {
    sm:   "text-sm leading-[1.7] font-body",
    base: "text-base sm:text-lg leading-[1.75] font-body",
    lg:   "text-lg sm:text-xl leading-[1.8] font-body",
  }[size]

  return (
    <Component
      className={cn("text-graphite max-w-[66ch]", sizeClasses, className)}
      {...props}
    >
      {children}
    </Component>
  )
}
