import { ArrowDown, ArrowUpRight } from "lucide-react"
import Link from "next/link"

import { Download } from "@/components/download"
import { LufsScale } from "@/components/lufs-scale"
import { Shot } from "@/components/shot"
import { ButtonLink } from "@/components/ui/button-link"
import { getLatestRelease } from "@/lib/github"
import {
  formatSize,
  PLATFORMS_URL,
  RELEASES_URL,
  SPONSOR_URL,
} from "@/lib/site"

// Next requires this to be a literal, so it cannot read REVALIDATE from lib/site. Keep the two
// in step: one hour.
export const revalidate = 3600

const featureGroups = [
  {
    heading: "Playback",
    items: [
      "Gapless playback on two audio decks. The handoff is armed before the boundary rather than triggered at the end of a track, so joins hold even on a minimized window.",
      "Loudness normalization at -19, -14 or -11 LUFS, or off.",
      "A volume slider that behaves like your ears do, not like a gain multiplier.",
      "Queue with play next, add to queue, reorder and remove. Repeat off, all or one. Shuffle.",
      "Radio from any track, album, artist or playlist.",
      "Autoplay extends an exhausted queue a full track before the end, so the music never stops to wait for a network request.",
      "Three quality levels: data saver, balanced, or highest available.",
    ],
  },
  {
    heading: "Lyrics",
    items: [
      "Time-synced when a source has them, plain text when it does not, and an explicit “instrumental” when there are none to find.",
      "Click any line to seek to it.",
      "Lyric requests carry no cookie and identify neither you nor your account, except to YouTube Music, which is asked over the session already streaming the audio.",
    ],
  },
  {
    heading: "Library and browsing",
    items: [
      "Your home feed, mood chips and infinite scrolling included.",
      "Explore, with charts per country.",
      "Search with live suggestions, filtered by songs, albums, artists or playlists.",
      "Album, artist and playlist pages, with a real track table you can sort.",
      "Create, rename, describe, reorder and delete playlists. Add and remove tracks, like, dislike, save to library, subscribe to artists.",
    ],
  },
  {
    heading: "macOS",
    items: [
      "Now Playing in Control Center, with artwork, and hardware media keys.",
      "A quiet notification naming the next track when the queue moves on by itself. Never while the window is focused, and never with a sound, because the only sound this app makes is the music.",
      "Updates download in the background and install when you quit.",
    ],
  },
  {
    heading: "Privacy",
    items: [
      "No account, no backend, no telemetry, no analytics, no crash uploader.",
      "Sandboxed renderer, context isolation, a strict content security policy and validated IPC.",
      "Media and artwork are served through a restricted custom protocol, so the interface never holds a signed URL or a filesystem path.",
    ],
  },
]

// The preconditions and the promises, as facts rather than prose. macOS 12 is the minimum the
// built app declares (LSMinimumSystemVersion in the Electron bundle it ships).
const spec = [
  {
    heading: "Requires",
    items: ["macOS 12 or later", "YouTube Music Premium"],
  },
  {
    heading: "Included",
    items: [
      "Signed and notarized",
      "Automatic updates",
      "No account, no telemetry",
      "MIT licensed",
    ],
  },
]

const restored = [
  "the queue",
  "the current track",
  "the exact position in it",
  "the volume",
  "repeat",
  "shuffle",
]

export default async function Page() {
  const release = await getLatestRelease()

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-14 sm:pt-24">
        <p className="mb-6 label text-muted-foreground">
          macOS · Beta{release ? ` · ${release.version}` : ""}
        </p>

        <h1 className="headline text-[clamp(2.5rem,7.5vw,4.75rem)] leading-[0.95]">
          Same loudness<span className="text-primary">.</span>
          <br />
          No gaps<span className="text-primary">.</span>
          <br />
          Lyrics that keep up<span className="text-primary">.</span>
        </h1>

        <div className="mt-9 grid gap-12 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-16">
          <div>
            <p className="max-w-2xl text-lg leading-relaxed sm:text-xl">
              Nixie plays your YouTube Music account through a native macOS app
              instead of a browser tab. Free, MIT licensed, and nothing about
              your listening leaves the machine.
            </p>

            <div className="mt-9">
              <Download release={release} />
            </div>

            {/* The short version of the disclaimer, where it is actually read. The full text is
                in the footer of every page. */}
            <p className="mt-9 max-w-xl text-sm leading-relaxed text-muted-foreground">
              An independent, unofficial client. Not affiliated with, endorsed
              by or sponsored by YouTube or Google, and it needs your own
              YouTube Music Premium subscription.
            </p>
          </div>

          {/* What you need and what you get, before you click anything. */}
          <div className="space-y-8 lg:pt-2">
            {spec.map((group) => (
              <dl key={group.heading}>
                <dt className="mb-3 border-b border-border pb-2 label text-muted-foreground">
                  {group.heading}
                </dt>
                {group.items.map((item) => (
                  <dd key={item} className="font-mono text-xs leading-6">
                    {item}
                  </dd>
                ))}
              </dl>
            ))}
          </div>
        </div>
      </section>

      {/* The app itself, before any argument about it. */}
      <section className="mx-auto max-w-6xl px-6 pb-20 sm:pb-28">
        <Shot
          src="/screenshots/home.png"
          alt="Nixie showing a home feed of albums and playlists, with the player bar along the bottom"
          width={1440}
          height={900}
          priority
        />
      </section>

      {/* Why it exists. Each reason is a specific complaint and the specific thing built to
          answer it — the order and pairing come from the project's own README. */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl space-y-20 px-6 py-20 sm:space-y-28 sm:py-28">
          <div>
            <blockquote className="mb-6 border-l-2 border-primary pl-5">
              <p className="max-w-xl text-lg text-muted-foreground">
                One track arrives mastered loud, the next one quiet, and you
                spend the evening on the volume key.
              </p>
            </blockquote>
            <h2 className="max-w-2xl headline text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight">
              So you pick the loudness, once.
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed">
              Three targets, the same three Spotify publishes. -14 LUFS is the
              default, because that is what YouTube itself aims for.
            </p>
            <div className="mt-10">
              <LufsScale />
            </div>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <blockquote className="mb-6 border-l-2 border-primary pl-5">
                <p className="text-lg text-muted-foreground">
                  Close the tab, come back, start over.
                </p>
              </blockquote>
              <h2 className="headline text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight">
                So it comes back where you left it.
              </h2>
              <p className="mt-5 leading-relaxed">
                Reopen Nixie and everything is there, paused, with the stream
                already resolved so the first press of Space starts instantly.
                It comes back paused on purpose: an app that starts making noise
                before you asked it to is not a feature.
              </p>
            </div>
            <ul className="divide-y divide-border rounded-xl border border-border bg-card">
              {restored.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-3 px-5 py-3 font-mono text-sm"
                >
                  <span className="text-primary" aria-hidden>
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <blockquote className="mb-6 border-l-2 border-primary pl-5">
                <p className="text-lg text-muted-foreground">
                  Lyrics are plain text, when they are there at all.
                </p>
              </blockquote>
              <h2 className="headline text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight">
                So three sources are asked, and the synced one wins.
              </h2>
              <p className="mt-5 leading-relaxed">
                LRCLIB, then NetEase, then YouTube Music, stopping at the first
                result good enough — so most tracks never get past the first
                request. Synced lyrics highlight the line you are on, scroll to
                keep it in view, and seek when you click one.
              </p>
            </div>
            <Shot
              src="/screenshots/lyrics.png"
              alt="Time-synced lyrics beside an album track table, with the current line highlighted"
              width={1440}
              height={900}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-16 border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <h2 className="headline text-[clamp(1.75rem,3.5vw,2.5rem)]">
            Everything else it does
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Beyond those three it is simply nicer to use. A real track table, a
            persistent player, a queue you can see, keyboard shortcuts and media
            keys. A desktop app, not a web page in a frame.
          </p>

          <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {featureGroups.map((group) => (
              <div key={group.heading}>
                <h3 className="mb-5 border-b border-border pb-3 label text-primary">
                  {group.heading}
                </h3>
                <ul className="space-y-4 text-sm leading-relaxed">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <Shot
              src="/screenshots/explore.png"
              alt="The Explore page, with charts, moods and new releases"
              width={1440}
              height={900}
            />
          </div>
        </div>
      </section>

      {/* Signing in. The single biggest surprise in the app, so it is explained here rather than
          discovered at first launch. */}
      <section id="signing-in" className="scroll-mt-16 border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h2 className="headline text-[clamp(1.75rem,3.5vw,2.5rem)]">
              There is no password field
            </h2>
            <div className="mt-6 space-y-5 leading-relaxed">
              <p>
                Google refuses sign-in from an embedded browser window, and
                refuses OAuth tokens on the endpoints this app talks to. So
                Nixie never asks for your password. It adopts the session from a
                browser you are already signed in to on the same machine.
              </p>
              <p>
                You pick a profile from Chrome, Brave, Edge, Vivaldi or Chromium
                on macOS, or Firefox anywhere, and Nixie reads that
                profile&apos;s YouTube cookies. They go into a dedicated
                Electron session partition and nowhere else. They are never
                logged, never sent anywhere except YouTube, and never exposed to
                the app&apos;s interface.
              </p>
              <p>
                Nixie reaches YouTube through the private interface the YouTube
                Music apps use, which Google does not publish or support.
                Nothing about you leaves this device to anyone else, but the
                account you link is talking to YouTube through an unofficial
                client, and it carries whatever risk that brings.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <Link
                href="/privacy"
                className="text-sm underline decoration-1 underline-offset-4 transition-colors hover:text-primary"
              >
                What is stored, and what leaves the machine
              </Link>
              <Link
                href="/faq"
                className="text-sm underline decoration-1 underline-offset-4 transition-colors hover:text-primary"
              >
                Read the FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="scroll-mt-16 border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <h2 className="headline text-[clamp(1.75rem,3.5vw,2.5rem)]">
            Get Nixie
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Both builds are signed and notarized by Apple, the disk image as
            well as the app inside it, so each one opens on a double click with
            no right-click trick and no Gatekeeper warning at either step.
          </p>

          {release ? (
            <>
              <ul className="mt-10 max-w-2xl divide-y divide-border rounded-xl border border-border">
                {(
                  [
                    {
                      key: "applesilicon",
                      name: "Apple silicon",
                      detail: "M1 and later",
                    },
                    { key: "intel", name: "Intel", detail: "Intel Macs" },
                  ] as const
                ).map((build) => (
                  <li
                    key={build.key}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{build.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {build.detail} · {formatSize(release[build.key].size)} ·
                        .dmg
                      </p>
                    </div>
                    <ButtonLink
                      href={release[build.key].url}
                      variant="outline"
                      className="h-9 gap-1.5 px-3.5"
                    >
                      <ArrowDown />
                      Download
                    </ButtonLink>
                  </li>
                ))}
              </ul>

              <dl className="mt-10 grid max-w-2xl gap-6 sm:grid-cols-2">
                <div>
                  <dt className="mb-2 label text-muted-foreground">Updates</dt>
                  <dd className="text-sm leading-relaxed">
                    Nixie checks for updates itself, downloads them in the
                    background, and asks nothing of you beyond a restart. If you
                    never restart, the update installs the next time you quit.
                  </dd>
                </div>
                <div>
                  <dt className="mb-2 label text-muted-foreground">
                    Other platforms
                  </dt>
                  <dd className="text-sm leading-relaxed">
                    Windows and Linux are planned, with no date attached.{" "}
                    <a
                      href={PLATFORMS_URL}
                      className="underline decoration-1 underline-offset-4 transition-colors hover:text-primary"
                    >
                      Follow along on GitHub
                    </a>
                    .
                  </dd>
                </div>
              </dl>

              <p className="mt-10 text-sm">
                <a
                  href={release.url}
                  className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
                >
                  Every asset in {release.tag}, including the update archives
                  <ArrowUpRight className="size-3.5" />
                </a>
              </p>
            </>
          ) : (
            <div className="mt-10">
              <ButtonLink href={RELEASES_URL} className="h-11 gap-2 px-5">
                <ArrowDown />
                Open the releases page
              </ButtonLink>
            </div>
          )}
        </div>
      </section>

      {/* Sponsoring, in the project's own register: it buys nothing. */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h2 className="headline text-[clamp(1.75rem,3.5vw,2.5rem)]">
              Nothing is kept behind a donation
            </h2>
            <p className="mt-6 leading-relaxed">
              Nixie is free, MIT licensed, and has no paid tier or premium
              build. What it costs is time: reading upstream responses that
              changed overnight, chasing a race in the audio engine, keeping
              three lyric providers working, and eventually getting Windows and
              Linux out the door.
            </p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              A donation supports the person writing Nixie. It buys no feature,
              no priority, and no entitlement to anything on YouTube.
            </p>
            <div className="mt-8">
              <ButtonLink
                href={SPONSOR_URL}
                variant="outline"
                className="h-10 gap-1.5 px-4"
              >
                Sponsor on GitHub
                <ArrowUpRight />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
