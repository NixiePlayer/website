import type { VariantProps } from "class-variance-authority"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * An anchor wearing the button's styling.
 *
 * Every call to action on this site navigates or downloads, so it is a link. Base UI's Button
 * keeps native button semantics even when its render prop is an anchor, which costs the element
 * its link behaviour, so the variants are borrowed and applied to a real <a> instead.
 */
export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"a"> & VariantProps<typeof buttonVariants>) {
  return (
    <a
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
