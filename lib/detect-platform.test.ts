import assert from "node:assert/strict"
import { test } from "node:test"

import { archFromRenderer, isMac } from "./detect-arch.ts"

// Real UNMASKED_RENDERER_WEBGL strings. The Apple silicon ones must never be read as x86: an
// Intel Mac cannot open the arm64 build at all, so a wrong guess in that direction is a
// download that does nothing.
test("archFromRenderer reads Apple silicon", () => {
  assert.equal(archFromRenderer("Apple GPU"), "arm")
  assert.equal(archFromRenderer("Apple M1"), "arm")
  assert.equal(
    archFromRenderer("ANGLE (Apple, ANGLE Metal Renderer: Apple M3 Pro, ...)"),
    "arm"
  )
})

test("archFromRenderer reads Intel Macs", () => {
  assert.equal(archFromRenderer("AMD Radeon Pro 5300 OpenGL Engine"), "x86")
  assert.equal(
    archFromRenderer("ANGLE (Intel, Intel(R) Iris(TM) Plus Graphics 655, ...)"),
    "x86"
  )
  assert.equal(archFromRenderer("Intel Iris Pro OpenGL Engine"), "x86")
})

test("archFromRenderer declines to guess", () => {
  assert.equal(archFromRenderer(""), null)
  assert.equal(archFromRenderer("WebKit WebGL"), null)
})

test("isMac accepts real Macs", () => {
  assert.equal(
    isMac("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 0),
    true
  )
})

test("isMac rejects iPads reporting themselves as Macs", () => {
  assert.equal(
    isMac("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 5),
    false
  )
  assert.equal(
    isMac("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)", 5),
    false
  )
})

test("isMac rejects other platforms", () => {
  assert.equal(isMac("Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 0), false)
  assert.equal(isMac("Mozilla/5.0 (X11; Linux x86_64)", 0), false)
})
