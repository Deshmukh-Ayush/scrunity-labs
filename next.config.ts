import type { NextConfig } from "next";

// Requests that should get a page's Markdown instead of its HTML: anything that asks for
// text/markdown, and the AI crawlers and assistants that fetch pages on a user's behalf.
// Search crawlers (Googlebot, Bingbot) are deliberately not listed: they get the HTML.
const AI_AGENTS =
  "GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-User|Claude-SearchBot|anthropic-ai|PerplexityBot|Perplexity-User|MistralAI-User|DuckAssistBot|cohere-ai|meta-externalagent|CCBot|Bytespider";
const wantsMarkdown = [
  [{ type: "header" as const, key: "accept", value: "(.*)text/markdown(.*)" }],
  [{ type: "header" as const, key: "user-agent", value: `(.*)(${AI_AGENTS})(.*)` }],
];
// a top-level page path: lower-case letters and dashes only, so assets and /_next never match
const PAGE = ":slug([a-z][a-z-]*)";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return {
      // Before pages, so the same URL can resolve to the Markdown route. beforeFiles rules keep
      // matching after a rewrite, so every page rule comes before the root rules: otherwise
      // "/" → "/md" would match a page rule again and become "/md/md".
      beforeFiles: [
        { source: "/index.md", destination: "/md" },
        { source: `/${PAGE}.md`, destination: "/md/:slug" },
        ...wantsMarkdown.map((has) => ({ source: `/${PAGE}`, has, destination: "/md/:slug" })),
        ...wantsMarkdown.map((has) => ({ source: "/", has, destination: "/md" })),
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
