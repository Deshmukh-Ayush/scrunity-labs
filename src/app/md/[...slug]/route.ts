// Markdown for every other page. Reached at /<page>.md, or at /<page> by agents (see next.config.ts).
import { agentDocs, slugOf } from "@/lib/agent-docs";
import { markdownResponse } from "@/lib/markdown-response";

export function generateStaticParams() {
  return agentDocs.filter(({ route }) => route !== "/").map(({ route }) => ({ slug: slugOf(route) }));
}

// unknown pages get a 404 from markdownResponse
export async function GET(_: Request, ctx: RouteContext<"/md/[...slug]">) {
  const { slug } = await ctx.params;
  return markdownResponse(`/${slug.join("/")}`);
}
