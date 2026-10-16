/**
 * Static test: no client-side event handlers in React Server Components.
 *
 * Regression test for the 2026-10-16 incident where an inline `onClick` on the
 * SHA-256 copy button inside a server component broke 374 app pages during
 * client-side navigation ("This page couldn't load"). Functions cannot be
 * serialized by the React Flight protocol, so any `onXxx={...}` prop in a
 * file without the "use client" directive is a bug.
 *
 * Runs with plain node, no dependencies. Fast (<1s).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components"];

// DOM/React event props that require a client component
const EVENTS = [
  "Click", "DoubleClick", "Change", "Input", "Submit", "Focus", "Blur",
  "KeyDown", "KeyUp", "KeyPress", "MouseEnter", "MouseLeave", "MouseOver",
  "MouseOut", "MouseDown", "MouseUp", "MouseMove", "Scroll", "Wheel",
  "TouchStart", "TouchEnd", "TouchMove", "ContextMenu", "Copy", "Cut",
  "Paste", "PointerDown", "PointerUp", "PointerMove", "DragStart", "DragEnd",
  "DragOver", "Drop", "Load", "Error", "AnimationStart", "AnimationEnd",
  "TransitionEnd", "Select",
];
const HANDLER_RE = new RegExp(`\\son(${EVENTS.join("|")})=\\{`, "g");

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      walk(p, out);
    } else if (/\.tsx$/.test(e.name)) {
      out.push(p);
    }
  }
  return out;
}

function isClientComponent(src) {
  // "use client" must be the first statement; check the head of the file
  const head = src.split("\n").slice(0, 10).join("\n");
  return /["']use client["']/.test(head);
}

export function checkNoServerHandlers(cwd = process.cwd()) {
  const violations = [];
  const files = ROOTS.flatMap((r) => {
    try {
      return walk(join(cwd, r));
    } catch {
      return [];
    }
  });

  for (const f of files) {
    const src = readFileSync(f, "utf8");
    if (isClientComponent(src)) continue;
    const lines = src.split("\n");
    let m;
    HANDLER_RE.lastIndex = 0;
    while ((m = HANDLER_RE.exec(src))) {
      const lineNo = src.slice(0, m.index).split("\n").length;
      const line = lines[lineNo - 1];
      // ignore matches inside line comments
      const attrIdx = line.indexOf(`on${m[1]}`);
      const commentIdx = line.indexOf("//");
      if (commentIdx !== -1 && commentIdx < attrIdx) continue;
      violations.push(`${f}:${lineNo} -> on${m[1]} in server component`);
    }
  }
  return { files: files.length, violations };
}

// standalone run: `node tests/static/no-server-handlers.mjs`
if (process.argv[1] && process.argv[1].endsWith("no-server-handlers.mjs")) {
  const { files, violations } = checkNoServerHandlers();
  console.log(`[static] scanned ${files} tsx files`);
  if (violations.length) {
    console.error(`[static] FAIL: ${violations.length} event handler(s) in server components:`);
    for (const v of violations) console.error(`  ${v}`);
    process.exit(1);
  }
  console.log("[static] PASS: no event handlers in server components");
}
