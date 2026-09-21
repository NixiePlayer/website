import assert from "node:assert/strict"
import { test } from "node:test"

import en from "../messages/en.json" with { type: "json" }
import it from "../messages/it.json" with { type: "json" }

// Every key path in a messages file, with its array lengths and rich-text tags folded into the
// string, so a missing key, a dropped list item or a lost link all show up as a difference.
function shape(value: unknown, path = ""): string[] {
  if (typeof value === "string") {
    const tags = [...value.matchAll(/<(\w+)>/g)].map((m) => m[1]).toSorted()
    const args = [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).toSorted()
    return [`${path} ${tags.join(",")} ${args.join(",")}`]
  }
  if (Array.isArray(value))
    return [
      `${path}[${value.length}]`,
      ...value.flatMap((v, i) => shape(v, `${path}.${i}`)),
    ]
  return Object.entries(value as object).flatMap(([k, v]) =>
    shape(v, path ? `${path}.${k}` : k)
  )
}

test("Italian has exactly the keys, list items, tags and arguments English has", () => {
  assert.deepEqual(shape(it), shape(en))
})

const empty = (v: unknown): boolean =>
  typeof v === "string"
    ? v.trim() === ""
    : Object.values(v as object).some(empty)

test("no message is left empty", () => {
  assert.equal(empty(en), false)
  assert.equal(empty(it), false)
})
