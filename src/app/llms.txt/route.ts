// The llms.txt index of the site's Markdown pages (https://llmstxt.org).
import { llmsTxt } from "@/lib/agent-docs";

export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
