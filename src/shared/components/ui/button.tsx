import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/shared/lib/utils"

/** shadcn/ui button, restyled to the Timber Glow design system (pill shape, ember = buy). */
const buttonVariants = cva(
  "group/btn inline-flex shrink-0 cursor-pointer items-center justify-center gap-3 rounded-full font-semibold whitespace-nowrap no-underline transition-[background-color,color,box-shadow,transform] duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:brightness-90 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      variant: {
        default: "bg-ember text-ink hover:bg-ember-ink hover:text-surface hover:shadow-sm",
        paper: "bg-surface text-ink hover:bg-ink hover:text-surface",
        outline: "bg-transparent text-ink shadow-[inset_0_0_0_1.5px_var(--color-line-control)] hover:bg-ink hover:text-surface",
        secondary: "bg-forest-tint text-forest-deep hover:bg-forest-line",
        ghost: "bg-transparent text-ink hover:bg-surface-sunken",
        link: "h-auto px-0 text-ink underline underline-offset-4 hover:text-ember-ink",
        onDark:
          "bg-transparent text-on-forest shadow-[inset_0_0_0_1.5px_rgb(241_240_233/0.6)] hover:bg-on-forest hover:text-forest-deep",
      },
      size: {
        default: "min-h-[52px] px-7 text-[15px]",
        sm: "min-h-[42px] px-5 text-sm",
        lg: "min-h-14 px-8 text-base",
        icon: "size-11 rounded-full p-0 [&_svg:not([class*='size-'])]:size-[22px]",
        "icon-lg": "size-12 rounded-full p-0 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
