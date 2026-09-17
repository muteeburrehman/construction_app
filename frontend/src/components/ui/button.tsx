import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer rounded-sm",
  {
    variants: {
      variant: {
        /* Primary — Blue */
        default:
          "bg-blue text-white hover:bg-cobalt active:bg-cobalt shadow-sm",
        /* Outlined blue */
        outline:
          "border-2 border-blue text-blue bg-transparent hover:bg-blue hover:text-white",
        /* Neutral ghost */
        ghost:
          "bg-transparent text-slate hover:bg-mist",
        /* Charcoal fill */
        charcoal:
          "bg-charcoal text-white hover:bg-ink",
        /* Light — for dark backgrounds */
        light:
          "bg-white text-charcoal hover:bg-cloud shadow-sm",
        /* Light outline — for dark backgrounds */
        "light-outline":
          "border border-white/40 text-white bg-transparent hover:bg-white/10 hover:border-white/70",
        /* Link */
        link:
          "text-blue underline-offset-4 hover:underline p-0 h-auto font-medium",
        /* Wine (legacy, unused) */
        wine:
          "bg-[#7A2535] text-white hover:bg-[#5E1B28]",
      },
      size: {
        sm:      "h-9 px-4 text-xs tracking-wide",
        default: "h-11 px-6 text-sm",
        lg:      "h-[3.25rem] px-8 text-base",
        xl:      "h-14 px-10 text-base",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size:    "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
