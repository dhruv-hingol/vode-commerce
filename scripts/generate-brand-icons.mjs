// Preserve the supplied PNG; the SVG viewport frames its existing transparent margins.
// Regenerate with: node scripts/generate-brand-icons.mjs
import { readFile, writeFile } from "node:fs/promises";
const logo = await readFile(
  new URL("../public/vode-logo.png", import.meta.url),
);
const icon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="208" height="208" viewBox="146 148 208 208"><rect x="146" y="148" width="208" height="208" rx="20" fill="#f9f8f4"/><image width="500" height="500" href="data:image/png;base64,' +
  logo.toString("base64") +
  '"/></svg>';
await writeFile(new URL("../app/icon.svg", import.meta.url), icon);
