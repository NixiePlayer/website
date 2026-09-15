import { ArrowDown, ArrowUpRight } from "lucide-react"
import Link from "next/link"

import explore from "@/assets/explore.png"
import home from "@/assets/home.png"
import lyrics from "@/assets/lyrics.png"
import { Download } from "@/components/download"
import { LufsScale } from "@/components/lufs-scale"
import { Shot } from "@/components/shot"
import { ButtonLink } from "@/components/ui/button-link"
import { getLatestRelease } from "@/lib/github"
import {
  builds,
  EXTENSION_DOWNLOAD_URL,
  EXTENSION_INSTALL_URL,
  EXTENSION_PRIVACY_URL,
  formatSize,
  INSTALL_DOC_URL,
  LICENSE_URL,
  RELEASES_URL,
  REPO_URL,
  SIGN_IN_DOC_URL,
  SITE_URL,
  SPONSOR_URL,
} from "@/lib/site"

const featureGroups = [
  {
    heading: "Playback",
    items: [
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
    heading: "Desktop",
    items: [
      "Now Playing in Control Center on macOS and in the media transport controls on Windows, with artwork, and hardware media keys everywhere they exist.",
      "A quiet notification naming the next track when the queue moves on by itself. Never while the window is focused, and never with a sound, because the only sound this app makes is the music.",
      "Keyboard shortcuts follow the platform: Cmd+K to search on macOS, Ctrl+K and Ctrl+Left / Ctrl+Right on Windows and Linux.",
      "Updates download in the background and install when you quit, on all three platforms.",
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

// Where the Nixie Link extension stands on each platform. The Windows column is decided by how
// the browser encrypts its cookie store, not by its name, which is why Chrome is called out.
const extensionMatrix = [
  {
    label: "Required",
    text: "Chrome on Windows, version 127 and later. Any other Chromium browser on Windows once it adopts app-bound encryption. Nixie hides such profiles from the sign-in list and offers the extension first.",
  },
  {
    label: "Optional",
    text: "Chrome, Edge, Brave, Vivaldi and Chromium on macOS and Linux, and on Windows while they still use the older cookie scheme. Reading the profile from disk already works there.",
  },
  {
    label: "Never",
    text: "Firefox, on every platform. Its profile is read from disk, and there is no Firefox version of the extension.",
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

  // Structured data for the one thing this site is about. Written from the same constants the
  // page renders, so a changed URL or version cannot leave the markup lying.
  // ponytail: no FAQPage on /faq. Google dropped those rich results for everyone except
  // government and health sites in 2023, so it would be markup nobody reads.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Nixie",
    url: SITE_URL,
    description:
      "A desktop client for YouTube Music for macOS, Windows and Linux, with loudness normalization you can set, time-synced lyrics, and a session that comes back where you left it.",
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Music player",
    operatingSystem: "macOS, Windows, Linux",
    softwareVersion: release?.version,
    downloadUrl: release?.applesilicon.url ?? RELEASES_URL,
    releaseNotes: `${SITE_URL}/changelog`,
    softwareHelp: `${SITE_URL}/faq`,
    license: LICENSE_URL,
    isAccessibleForFree: true,
    screenshot: [home, lyrics, explore].map(
      (image) => `${SITE_URL}${image.src}`
    ),
    // No aggregateRating: there are no ratings to report, and inventing them is what gets
    // structured data ignored.
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: {
      "@type": "Person",
      name: "Edoardo Ranghieri",
      url: "https://github.com/TheEdoRan",
    },
    codeRepository: REPO_URL,
  }

  return (
    <>
      <script
        type="application/ld+json"
        // Version and URLs come from the GitHub API, so escape "<" and a release tag can never
        // close this script tag early.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-14 sm:pt-24">
        <h1 className="headline text-[clamp(2.5rem,7.5vw,4.75rem)] leading-[0.95]">
          A native desktop player for{" "}
          <span className="text-primary">YouTube Music</span>
        </h1>

        <p className="mt-9 max-w-2xl text-lg leading-relaxed sm:text-xl">
          Nixie plays your YouTube Music account through a desktop app for
          macOS, Windows and Linux instead of a browser tab. Free, MIT licensed,
          and nothing about your listening leaves the machine.
        </p>

        <div className="mt-9">
          <Download release={release} />
        </div>

        {/* The short version of the disclaimer, where it is actually read. The full text is
            in the footer of every page. */}
        <p className="mt-9 max-w-xl text-sm leading-relaxed text-muted-foreground">
          An independent, unofficial client. Not affiliated with, endorsed by or
          sponsored by YouTube or Google, and it needs your own YouTube Music
          Premium subscription.
        </p>
      </section>

      {/* The app itself, before any argument about it. */}
      <section className="mx-auto max-w-6xl px-6 pb-20 sm:pb-28">
        <Shot
          src={home}
          alt="Nixie showing a home feed of albums and playlists, with the player bar along the bottom"
          priority
        />
      </section>

      {/* Why it exists. Each reason is a specific complaint and the specific thing built to
          answer it. The order and pairing come from the project's own README. */}
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
                result good enough, so most tracks never get past the first
                request. Synced lyrics highlight the line you are on, scroll to
                keep it in view, and seek when you click one.
              </p>
            </div>
            <Shot
              src={lyrics}
              alt="Time-synced lyrics beside an album track table, with the current line highlighted"
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
              src={explore}
              alt="The Explore page, with charts, moods and new releases"
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
                You pick a profile from Firefox, Chrome, Brave, Edge, Vivaldi or
                Chromium, and Nixie reads that profile&apos;s YouTube cookies
                off disk. The one exception is Chrome on Windows, which keeps
                its cookies readable by Chrome alone. Nixie does not work around
                that: there, a small browser extension called{" "}
                <Link
                  href="/#extension"
                  className="underline decoration-1 underline-offset-4 transition-colors hover:text-primary"
                >
                  Nixie Link
                </Link>{" "}
                hands the cookies over instead.
              </p>
              <p>
                Either way the cookies go into a dedicated Electron session
                partition and nowhere else. They are never logged, never sent
                anywhere except YouTube, and never exposed to the app&apos;s
                interface.
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
              <a
                href={SIGN_IN_DOC_URL}
                className="text-sm underline decoration-1 underline-offset-4 transition-colors hover:text-primary"
              >
                Which browser works where
              </a>
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

      {/* The extension. It exists for one platform and one browser, so the page says exactly
          when it is needed rather than presenting it as a general step. */}
      <section id="extension" className="scroll-mt-16 border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="headline text-[clamp(1.75rem,3.5vw,2.5rem)]">
                Nixie Link, for Chrome on Windows
              </h2>
              <div className="mt-6 space-y-5 leading-relaxed">
                <p>
                  Since version 127, Chrome on Windows protects its cookies with
                  app-bound encryption, so that only Chrome itself can read
                  them. Getting at them would mean pretending to be Chrome,
                  which this project will not do. Nixie Link is the honest
                  route: a browser extension that asks Chrome for the YouTube
                  cookies through the official extension API and passes them to
                  Nixie on the same computer.
                </p>
                <p>
                  It never pushes anything. Nixie asks, proves it knows the
                  pairing code you pasted once, and receives only the cookies it
                  needs, encrypted, over native messaging. The extension makes
                  no network requests, runs no code on web pages, and stores
                  nothing but a random profile ID and that pairing code.
                </p>
                <p className="text-muted-foreground">
                  It is not on the Chrome Web Store. You load it unpacked from
                  the release zip, in a minute, following the steps in its
                  README. On Linux it cannot reach a snap or flatpak browser.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <ButtonLink
                  href={EXTENSION_DOWNLOAD_URL}
                  variant="outline"
                  className="h-10 gap-1.5 px-4"
                >
                  <ArrowDown />
                  Get Nixie Link
                </ButtonLink>
                <a
                  href={EXTENSION_INSTALL_URL}
                  className="text-sm underline decoration-1 underline-offset-4 transition-colors hover:text-primary"
                >
                  Install steps
                </a>
                <a
                  href={EXTENSION_PRIVACY_URL}
                  className="text-sm underline decoration-1 underline-offset-4 transition-colors hover:text-primary"
                >
                  Privacy notice
                </a>
              </div>
            </div>
            <dl className="divide-y divide-border rounded-xl border border-border bg-card">
              {extensionMatrix.map((row) => (
                <div key={row.label} className="px-5 py-4">
                  <dt className="mb-1.5 label text-primary">{row.label}</dt>
                  <dd className="text-sm leading-relaxed">{row.text}</dd>
                </div>
              ))}
            </dl>
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
            One download per platform. Nixie checks for updates itself
            afterwards, so this is normally the only time you come here.
          </p>

          {release ? (
            <>
              <ul className="mt-10 max-w-2xl divide-y divide-border rounded-xl border border-border">
                {builds.map((build) => (
                  <li
                    key={build.key}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{build.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {build.detail} · {formatSize(release[build.key].size)}
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
                  <dt className="mb-2 label text-muted-foreground">macOS</dt>
                  <dd className="text-sm leading-relaxed">
                    Both builds are signed and notarized by Apple, the disk
                    image as well as the app inside it, so each one opens on a
                    double click with no right-click trick and no Gatekeeper
                    warning at either step.
                  </dd>
                </div>
                <div>
                  <dt className="mb-2 label text-muted-foreground">Windows</dt>
                  <dd className="text-sm leading-relaxed">
                    The installer is not signed, because a code signing
                    certificate is an annual bill this project does not have.
                    SmartScreen will say &quot;Windows protected your PC&quot;
                    on first run: choose More info, then Run anyway. It installs
                    per user, with no administrator prompt. Signing in with
                    Chrome needs{" "}
                    <Link
                      href="/#extension"
                      className="underline decoration-1 underline-offset-4 transition-colors hover:text-primary"
                    >
                      Nixie Link
                    </Link>
                    .
                  </dd>
                </div>
                <div>
                  <dt className="mb-2 label text-muted-foreground">Linux</dt>
                  <dd className="text-sm leading-relaxed">
                    A single AppImage. Mark it executable and run it. It updates
                    itself only when run as the AppImage, which is the ordinary
                    way to run it. Reading a Chromium browser&apos;s cookies
                    needs libsecret-tools and an unlocked keyring; Firefox needs
                    neither.
                  </dd>
                </div>
                <div>
                  <dt className="mb-2 label text-muted-foreground">Updates</dt>
                  <dd className="text-sm leading-relaxed">
                    Nixie checks for updates itself, downloads them in the
                    background, and asks nothing of you beyond a restart. If you
                    never restart, the update installs the next time you quit.
                    There is no arm64 build for Windows or Linux, and no deb,
                    rpm, Homebrew or winget package.{" "}
                    <a
                      href={INSTALL_DOC_URL}
                      className="underline decoration-1 underline-offset-4 transition-colors hover:text-primary"
                    >
                      Full install notes
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
              three lyric providers working, and keeping three platforms
              building.
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
