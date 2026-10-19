// Markdown for the home page. Reached at /index.md, or at / by agents (see next.config.ts).
import { markdownResponse } from "@/lib/markdown-response";

export function GET() {
  return markdownResponse("/");
}
