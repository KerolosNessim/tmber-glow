import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/shared/lib/utils"

/** shadcn/ui badge with the design system's pill badges. */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 rounded-full px-3 py-[7px] text-xs leading-none font-semibold whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        new: "bg-ember text-ink",
        cotton: "bg-white/92 text-forest-deep backdrop-blur-md",
        forest: "bg-forest-tint text-forest-deep",
        gold: "bg-gold-tint text-gold-ink",
        outline: "border border-line-strong text-ink",
      },
    },
    defaultVariants: {
      variant: "new",
    },
  }
)

function Badge({
  className,
  variant = "new",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
