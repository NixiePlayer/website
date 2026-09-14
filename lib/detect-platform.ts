export type Arch = "arm" | "x86"

/**
 * Read the architecture out of a WebGL unmasked renderer string.
 *
 * This is the only signal available in Safari and Firefox, because every Mac browser reports
 * "Intel Mac OS X" in its user agent regardless of the chip it is running on. Returns null when
 * the string says nothing useful, so the caller decides the default rather than this guessing.
 */
export function archFromRenderer(renderer: string): Arch | null {
  if (/apple\s+(m\d|gpu|silicon)/i.test(renderer)) return "arm"
  if (/intel|amd|radeon|nvidia|geforce/i.test(renderer)) return "x86"
  return null
}

/**
 * Whether a user agent describes a Mac.
 *
 * Every Mac browser puts "Macintosh" in its user agent, so navigator.platform adds nothing and
 * is deprecated besides. An iPad in desktop mode says "Macintosh" too, and a touch count is the
 * only thing separating it from a real Mac: no Mac reports more than one touch point, and every
 * iPad reports five.
 */
export function isMac(userAgent: string, maxTouchPoints: number): boolean {
  if (/iphone|ipad|ipod/i.test(userAgent)) return false
  if (maxTouchPoints > 1) return false
  return /mac/i.test(userAgent)
}
