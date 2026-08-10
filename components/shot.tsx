import Image from "next/image"

import { cn } from "@/lib/utils"

/**
 * A screenshot in a dark frame.
 *
 * Every capture is of the app in dark mode, and the site follows the reader's system theme, so
 * on a light page the frame has to declare that the darkness belongs to the app. The glow behind
 * it is the same red wash as the project's banner.
 */
export function Shot({
  src,
  alt,
  width,
  height,
  priority,
  className,
}: {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute -inset-x-6 -inset-y-8 -z-10 opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 45%, var(--primary), transparent 70%)",
        }}
        aria-hidden
      />
      {/* In dark mode the frame is the same colour as the page, so the ring has to switch sides
          to keep the screenshot from floating. */}
      <div className="rounded-xl bg-[#0f0f0f] p-1.5 ring-1 ring-black/40 sm:rounded-2xl sm:p-2 dark:ring-white/10">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes="(max-width: 768px) 100vw, 1152px"
          className="w-full rounded-lg sm:rounded-xl"
        />
      </div>
    </div>
  )
}
