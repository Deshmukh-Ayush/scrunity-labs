import { agentDocFor } from "@/lib/agent-docs";

/** A page's Markdown as an HTTP response, or a 404 when the route has no document. */
export function markdownResponse(route: string) {
  const doc = agentDocFor(route);
  if (!doc) return new Response("Not found\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(doc.markdown + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // the same URL serves HTML to browsers and Markdown to agents
      Vary: "Accept, User-Agent",
    },
  });
}
