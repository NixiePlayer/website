import type { Metadata } from "next"
import Link from "next/link"

import {
  EXTENSION_INSTALL_URL,
  INSTALL_DOC_URL,
  LICENSE_URL,
  REPO_URL,
  SIGN_IN_DOC_URL,
  SPONSOR_URL,
} from "@/lib/site"

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Whether you need Premium, why Nixie reads a browser profile instead of asking for a password, what leaves your machine, and when you need the Nixie Link extension.",
}

// Plain headings and paragraphs, all of it visible. An accordion would hide answers from readers
// and from search engines to save scrolling nobody minds.
const groups = [
  {
    heading: "Before you install",
    questions: [
      {
        q: "Do I need YouTube Music Premium?",
        a: (
          <>
            <p>
              Yes. Nixie plays without advertisements, in the background, and
              through its own audio engine, and those are the things YouTube
              sells a subscription for. It checks when you link an account and
              refuses one that does not hold a subscription.
            </p>
            <p>
              Nixie is not a way to get Premium features without Premium, and it
              is not affiliated with or authorized by YouTube.
            </p>
          </>
        ),
      },
      {
        q: "Is this official? Is it made by Google or YouTube?",
        a: (
          <p>
            No. Nixie is an independent, unofficial client, not affiliated with,
            endorsed by or sponsored by Google or YouTube. It is not a YouTube
            Music product, it does not copy or imitate one, and nothing here
            speaks for Google. YouTube and YouTube Music are trademarks of
            Google LLC, used here only to say what Nixie connects to.
          </p>
        ),
      },
      {
        q: "What does it cost?",
        a: (
          <p>
            Nothing. Nixie is free and{" "}
            <a
              href={LICENSE_URL}
              className="text-primary underline decoration-1 underline-offset-4"
            >
              MIT licensed
            </a>
            , with no paid tier and no premium build. Nothing in the app asks
            for money and nothing is kept behind a{" "}
            <a
              href={SPONSOR_URL}
              className="text-primary underline decoration-1 underline-offset-4"
            >
              donation
            </a>
            . A donation supports the person writing it and buys no feature and
            no priority.
          </p>
        ),
      },
      {
        q: "What does it run on?",
        a: (
          <>
            <p>
              macOS, on Apple silicon and Intel Macs, with a build for each.
              Windows 10 and 11, 64-bit. Linux, 64-bit, as an AppImage. Every
              build updates itself.
            </p>
            <p>
              There is no arm64 build for Windows or Linux, and no deb, rpm,
              Homebrew or winget package.{" "}
              <a
                href={INSTALL_DOC_URL}
                className="text-primary underline decoration-1 underline-offset-4"
              >
                The install notes
              </a>{" "}
              cover each platform in detail.
            </p>
          </>
        ),
      },
      {
        q: "Will my computer warn me before it opens?",
        a: (
          <>
            <p>
              On macOS, no. Every release is signed and notarized by Apple, the
              disk image as well as the app inside it, so it opens on a double
              click with no right-click trick and no Gatekeeper warning at
              either step.
            </p>
            <p>
              On Windows, once. The installer is not signed, because a code
              signing certificate is an annual bill this project does not have,
              so SmartScreen shows &quot;Windows protected your PC&quot; on
              first run. Choose More info, then Run anyway. That warning is
              about the absence of a certificate, not about anything found in
              the file. If you did not download it from the releases page, check
              the file against it.
            </p>
            <p>On Linux, no. Mark the AppImage executable and run it.</p>
          </>
        ),
      },
      {
        q: "Is it finished?",
        a: (
          <p>
            No. Nixie is beta software. Things move, and some of them break.{" "}
            <a
              href={`${REPO_URL}/issues`}
              className="text-primary underline decoration-1 underline-offset-4"
            >
              Bug reports
            </a>{" "}
            are welcome.
          </p>
        ),
      },
    ],
  },
  {
    heading: "Signing in",
    questions: [
      {
        q: "Why does it want a browser profile instead of my password?",
        a: (
          <>
            <p>
              Because there is no other way in. Google refuses sign-in from an
              embedded browser window, and refuses OAuth tokens on the endpoints
              this app talks to. So Nixie does not ask for your password at all:
              it adopts the session from a browser you are already signed in to
              on the same machine.
            </p>
            <p>
              There is no password field and no way to paste a session by hand.
            </p>
          </>
        ),
      },
      {
        q: "Which browsers can it read?",
        a: (
          <>
            <p>
              Firefox on every platform. Chrome, Edge, Brave, Vivaldi and
              Chromium on macOS and Linux. On Windows, those same browsers as
              long as their cookie store still uses the older encryption scheme,
              which today means Edge, Brave, Vivaldi and Chromium. You pick
              which profile.
            </p>
            <p>
              Chrome on Windows, from version 127, is the exception: it needs
              the Nixie Link extension. On Linux, a browser installed as a snap
              or flatpak is out of reach for both paths, so install it from its
              vendor&apos;s repository instead.{" "}
              <a
                href={SIGN_IN_DOC_URL}
                className="text-primary underline decoration-1 underline-offset-4"
              >
                The full table is on GitHub
              </a>
              .
            </p>
          </>
        ),
      },
      {
        q: "What is Nixie Link, and do I need it?",
        a: (
          <>
            <p>
              A small browser extension for Chrome, Edge, Brave, Vivaldi and
              Chromium. Chrome on Windows protects its cookies so that only
              Chrome can read them, and Nixie will not impersonate Chrome to get
              at them. So the extension asks Chrome for the YouTube cookies
              through the official extension API and hands them to Nixie on the
              same computer, encrypted, and only when Nixie asks.
            </p>
            <p>
              You need it for Chrome on Windows, and for any other Chromium
              browser on Windows once it adopts the same protection. Everywhere
              else it is optional, and Firefox never needs it. It is not on any
              store: you load it unpacked from the release zip,{" "}
              <a
                href={EXTENSION_INSTALL_URL}
                className="text-primary underline decoration-1 underline-offset-4"
              >
                following its README
              </a>
              . More in the{" "}
              <Link
                href="/#extension"
                className="text-primary underline decoration-1 underline-offset-4"
              >
                extension section
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        q: "Where do those cookies go?",
        a: (
          <>
            <p>
              Into a dedicated Electron session partition, and nowhere else.
              They are never logged, never sent anywhere except YouTube, and
              never exposed to the app&apos;s interface.
            </p>
            <p>
              Google expires the session every few minutes and only the browser
              holds the current value, so Nixie re-reads that profile while it
              runs, at most once a minute, for as long as the account stays
              linked. Signing out clears the session and the parser cache.
            </p>
          </>
        ),
      },
      {
        q: "Is there a risk to my account?",
        a: (
          <p>
            Nixie reaches YouTube through the private interface the YouTube
            Music apps use, which Google does not publish or support. Nothing
            about you leaves your device to anyone else, but the account you
            link is talking to YouTube through an unofficial client, and it
            carries whatever risk that brings.
          </p>
        ),
      },
    ],
  },
  {
    heading: "Using it",
    questions: [
      {
        q: "What does loudness normalization actually do?",
        a: (
          <p>
            It brings every track to a target you choose: -19, -14 or -11 LUFS,
            or off. Nixie reads the integrated loudness YouTube already measured
            for each stream, so there is no analysis pass and no delay before a
            track starts. Loud tracks are pulled all the way down. Quiet ones
            are lifted, but never by more than 6 dB, because YouTube publishes a
            loudness and not a true peak, and a quiet master already peaking
            near full scale would clip if it were lifted blind.
          </p>
        ),
      },
      {
        q: "What if a track has no lyrics?",
        a: (
          <p>
            Nixie asks LRCLIB, then NetEase, then YouTube Music itself, and
            prefers a time-synced result over a plain one whichever source it
            came from. When a track genuinely has none, it says so, and marks a
            track with no words at all as instrumental rather than leaving you
            wondering.
          </p>
        ),
      },
      {
        q: "How do updates work?",
        a: (
          <p>
            The app checks for them itself, downloads them in the background,
            and asks nothing of you beyond a restart. If you never restart, the
            update installs the next time you quit. On Linux this works when
            Nixie runs as the AppImage, which is the ordinary way to run it.
          </p>
        ),
      },
      {
        q: "Does it track me?",
        a: (
          <p>
            No. There is no account, no backend, no telemetry, no analytics and
            no crash uploader. Everything Nixie knows stays on your computer.{" "}
            <Link
              href="/privacy"
              className="text-primary underline decoration-1 underline-offset-4"
            >
              The privacy document
            </Link>{" "}
            lists exactly what is stored and what leaves the machine.
          </p>
        ),
      },
      {
        q: "Can I read the source?",
        a: (
          <p>
            Yes.{" "}
            <a
              href={REPO_URL}
              className="text-primary underline decoration-1 underline-offset-4"
            >
              All of it
            </a>
            , under the MIT license. Every build also ships the full license
            text of every open source package inside it, readable in Settings
            under About.
          </p>
        ),
      },
    ],
  },
]

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <h1 className="headline text-[clamp(2rem,5vw,3rem)] leading-tight">
        Questions
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        The things worth knowing before you install Nixie, and the things people
        ask afterwards.
      </p>

      <div className="mt-14 space-y-14">
        {groups.map((group) => (
          <section key={group.heading}>
            <h2 className="mb-8 border-b border-border pb-3 label text-primary">
              {group.heading}
            </h2>
            <div className="space-y-9">
              {group.questions.map((item) => (
                <div key={item.q}>
                  <h3 className="headline text-lg leading-snug">{item.q}</h3>
                  <div className="mt-3 space-y-3 leading-relaxed [&_p]:text-[0.9375rem]">
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
