/**
 * A loudness axis, to scale.
 *
 * The numbers are the real ones: the three targets Nixie offers, and two tracks arriving at the
 * loudness YouTube measured for them. The quiet track deliberately stops short of the target,
 * because Nixie never lifts a track by more than 6 dB: YouTube publishes a loudness and not a
 * true peak, so a quiet master already peaking near full scale would clip if it were lifted
 * blind. A graphic that landed both bars neatly on the line would be a nicer picture and a lie.
 */

const MIN = -24
const MAX = -6

/** Position on the axis, as a percentage. */
const at = (lufs: number) => `${((lufs - MIN) / (MAX - MIN)) * 100}%`

const TARGETS = [-19, -14, -11]
const TARGET = -14

const tracks = [
  {
    name: "Mastered loud",
    measured: -8.3,
    landsAt: TARGET,
    note: "pulled down 5.7 dB",
  },
  {
    name: "Mastered quiet",
    measured: -21.6,
    landsAt: -15.6,
    note: "lifted 6 dB, the limit",
  },
]

export function LufsScale() {
  return (
    <figure className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <p className="mb-6 label text-muted-foreground">
        Integrated loudness, in LUFS
      </p>

      {/* Axis. The bars share this coordinate space exactly, so the ends are aligned rather than
          inset: centring a label on 0% or 100% would hang it off the edge of the card. */}
      <div className="relative mb-7 h-9">
        <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
        {[MIN, ...TARGETS, MAX].map((lufs) => {
          const isTarget = TARGETS.includes(lufs)
          const edge =
            lufs === MIN
              ? { className: "items-start", style: { left: 0 } }
              : lufs === MAX
                ? { className: "items-end", style: { right: 0 } }
                : {
                    className: "items-center -translate-x-1/2",
                    style: { left: at(lufs) },
                  }
          return (
            <div
              key={lufs}
              className={`absolute bottom-0 flex flex-col gap-1.5 ${edge.className}`}
              style={edge.style}
            >
              <span
                className={
                  isTarget
                    ? "font-mono text-xs font-medium"
                    : "font-mono text-xs text-muted-foreground"
                }
              >
                {lufs}
              </span>
              <div
                className={
                  isTarget ? "h-2.5 w-px bg-foreground" : "h-1.5 w-px bg-border"
                }
              />
            </div>
          )
        })}
      </div>

      <div className="relative space-y-5">
        {/* The chosen target, drawn through both tracks. */}
        <div
          className="pointer-events-none absolute inset-y-0 -top-2 border-l border-dashed border-foreground/30"
          style={{ left: at(TARGET) }}
          aria-hidden
        />

        {tracks.map((track) => (
          <div key={track.name}>
            <div className="mb-1.5 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-sm">{track.name}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {track.measured} → {track.landsAt} LUFS, {track.note}
              </span>
            </div>
            <div className="h-7 rounded-sm bg-secondary">
              <div
                className="lufs-bar h-full rounded-sm border-r-2 border-primary bg-primary/20"
                style={
                  {
                    width: at(track.landsAt),
                    "--lufs-from": at(track.measured),
                    "--lufs-to": at(track.landsAt),
                  } as React.CSSProperties
                }
              />
            </div>
          </div>
        ))}
      </div>

      <figcaption className="mt-6 text-sm text-muted-foreground">
        Nixie reads the integrated loudness YouTube already measured for each
        stream, so nothing is analysed and no track waits to start. Loud masters
        come all the way down. Quiet ones come up, but never by more than 6 dB.
      </figcaption>
    </figure>
  )
}
