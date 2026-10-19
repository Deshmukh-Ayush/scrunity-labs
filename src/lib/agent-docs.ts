// The Markdown version of every page, for AI agents. One document per route.
//
// Served three ways (see next.config.ts and src/app/md/[[...slug]]/route.ts):
// - at the page's own URL to requests that send `Accept: text/markdown` or come from a known AI agent,
// - at the page's `.md` URL (`/services.md`, and `/index.md` for the home page),
// - in the site's Agent view (the Human / Agent switch in the navigation).
// `/llms.txt` indexes them.
//
// Keep each document in step with its page: when the copy on a page changes, change it here too.

export type AgentDoc = {
  route: string;
  title: string;
  /** One line for the llms.txt index. */
  summary: string;
  markdown: string;
};

export const SITE_NAME = "Scrunity Labs";

/** The `.md` URL of a route: `/` → `/index.md`, `/services` → `/services.md`. */
export const mdPathOf = (route: string) => (route === "/" ? "/index.md" : `${route}.md`);

/** The route-handler slug of a route: `/` → `[]`, `/services` → `["services"]`. */
export const slugOf = (route: string) => (route === "/" ? [] : route.slice(1).split("/"));

const NAV = `## Site

- [Home](/index.md): mission, what we do and why work with us
- [Services](/services.md): what we offer, how we engage and our approach
- [Process](/process.md): how an engagement unfolds, chapter by chapter
- [Blog](/blog.md): field notes, coming soon
- Talk to us: /contact`;

const home = `# ${SITE_NAME}

> We build AI infrastructure to decrease cost and friction and increase efficiency. We save you cost, time and effort.

${SITE_NAME} is the end-to-end partner that helps companies turn frontier models into measurable business results.

## Mission

We exist to place the world's frontier models in the hands of the businesses defining the next decade, and to make that power feel effortless.

Intelligence is fast becoming the most valuable raw material in the economy, yet its promise remains unevenly distributed. We intend to change that, carrying the dividends of transformative AI to every corner of commerce, not merely its edges.

Our team has architected flagship AI systems within some of the industry's most demanding environments, where precision is not a preference but a prerequisite, and where every millisecond carries consequence: regulated data, high-volume traffic and systems that can't go down.

We don't engineer for today's model. We engineer for the ones still on the horizon: foundations designed to absorb each new leap rather than be undone by it, so what you build now only grows more capable with time.

This is infrastructure as it should be: quiet, rigorous, and built to outlast the moment. Model-agnostic by design: switch providers, adopt new releases and add new modalities without rewriting what already works. The frontier, finally within reach.

## What we do

- **Frontier intelligence, delivered.** The world's most capable models, woven into your data, workflows and teams, so their power arrives as results rather than research.
- **Infrastructure that holds.** Production-grade AI systems engineered for demanding environments: secure, observable and composed under pressure.
- **Built for the next model.** Model-agnostic foundations that absorb every new release, so today's investment compounds instead of expiring.

## Why work with us

1. **A direct line to the frontier.** ${SITE_NAME} was purpose-built to put frontier AI to work. We stay close to the people shaping it, so new capabilities reach you early.
2. **We find what holds you back.** We sit with your team, learn how the whole company runs and pinpoint the bottlenecks. Then we clear them with frontier intelligence.
3. **Crafted, never copied.** Every product gets a visual language of its own, considered down to the detail.
4. **Proven in our own arena.** We're already building agentic systems that replace legacy CRMs and go-to-market tools. That depth comes with us into your work.
5. **With you, end to end.** We don't hand off a repo and disappear. We work alongside your team from roadmap to deployment, building what you need to compete.

## Get started

Put the frontier to work. Tell us where your business feels the friction, and we'll show you what frontier intelligence can do about it. See the [process](/process.md) or talk to us at /contact.

${NAV}`;

const services = `# Services · ${SITE_NAME}

> From roadmap to production, end to end. We deploy frontier AI at scale: production systems built alongside your team, not proof-of-concept demos handed over in a repo.

## What we offer

Six ways we put frontier models to work. Most engagements combine several.

1. **Strategy & roadmap.** We learn how your business actually runs, find where frontier AI pays off and sequence the work from quick wins to the bigger bets. Includes: workflow audit, opportunity map, success metrics.
2. **Production AI systems.** Agents and AI features engineered for real traffic: integrated with your stack, observable and built to hold, not demos that stall. Includes: agents, integrations, observability.
3. **Evals & reliability.** Evaluation suites that measure what matters, catch regressions before your users do and make every model swap a safe one. Includes: eval suites, regression gates.
4. **Document intelligence.** Contracts, invoices and forms turned into clean, structured data your systems can trust, with a person in the loop where it counts. Includes: extraction, validation.
5. **Fine-tuning & adaptation.** When an off-the-shelf model isn't enough, we adapt it to your domain, data and voice, and prove the lift against a baseline. Includes: fine-tuning, benchmarks.
6. **AI-native product design.** Interfaces designed for how AI really behaves: streaming, probabilistic and agentic. People see its work, so they trust the result. Includes: interaction design, front-end engineering.

## How we engage

One team from first conversation to production, and we stay once it's live.

1. **Discover.** We sit with your team, map how the business runs end to end and pinpoint where friction costs the most. Deliverables: workflow audit, bottleneck map.
2. **Roadmap.** A sequenced plan from quick wins to transformational bets, each with a clear owner and a measurable outcome. Deliverables: ranked roadmap, success metrics.
3. **Build.** Veteran engineers build alongside your people, not behind a wall: evaluated, observable, secure systems in your stack. Deliverables: production code, eval suites.
4. **Deploy & evolve.** We ship to production and stay on, upgrading as new models land so what you built keeps getting more capable. Deliverables: rollout, model upgrades, team handover.

## Our approach

- **Frontier.** A direct line to the people shaping frontier AI, so new capabilities reach your roadmap early.
- **Production.** Systems engineered to scale with the business, measured in production rather than in a pitch.
- **Elite.** Veteran engineers and former founders, fluent in both applied AI and full-stack product.
- **Experience.** Deep applied-AI project experience that de-risks the work and shortens the path to value.
- **Transformation.** End to end, from the first roadmap conversation to systems running in production.

## Get started

Put the frontier to work. Tell us where your business feels the friction, and we'll show you what frontier intelligence can do about it. See the [process](/process.md) or talk to us at /contact.

${NAV}`;

const process = `# Process · ${SITE_NAME}

> Every engagement follows one arc: friction, then flow. Here's how a business goes from manual work to frontier AI in production, told one chapter at a time.

## Chapter 1: The friction

It starts with friction. Somewhere in your business, smart people are doing work a model could do: re-keying invoices, chasing handoffs, rebuilding the same report every Monday.

Outcome: you know AI could help. The hard part is knowing where, and getting it to production.

## Chapter 2: We listen

First, we listen. We sit with the people closest to the work, watch how it really gets done and write down every place it snags.

Outcome: a workflow audit and a map of where friction costs you the most.

## Chapter 3: The map

Then we draw the map. Every opportunity is weighed by impact and effort, so the first thing we build is the one that pays for the rest.

Outcome: a ranked roadmap, with a success metric for every step on it.

## Chapter 4: The build

We build it with you. Our engineers work inside your team, not behind a wall. Every change is measured against evals, so quality climbs with each commit.

Outcome: production code your team understands, owns and can extend.

## Chapter 5: The launch

It goes live, carefully. We roll out in stages, watch every metric and only widen the release once the numbers hold.

Outcome: a system in production, observed and supported from day one.

## Chapter 6: What's next

And the story keeps going. New models land every few months. We test each one against your workload and upgrade when it wins, so what you built keeps getting better.

Outcome: a system that compounds instead of expiring.

## Get started

Book a call at /contact. See what we offer on the [services](/services.md) page.

${NAV}`;

const blog = `# Blog · ${SITE_NAME}

> Field notes, still on the platen. Status: coming soon. No posts are published yet.

We're writing up what we learn putting frontier models into production: what holds, what breaks and what we'd do again. The first posts are being typed now.

## First topics

- LLM evals
- Document extraction
- Reliability
- AI-assisted coding
- Fine-tuning
- UI design for AI

## On the workbench

The page shows an interactive typewriter: visitors can type on it, and it types "coming soon. notes from the bench on frontier ai at work." while idle.

${NAV}`;

export const agentDocs: AgentDoc[] = [
  {
    route: "/",
    title: SITE_NAME,
    summary: "Mission, what we do and why work with us.",
    markdown: home,
  },
  {
    route: "/services",
    title: `Services · ${SITE_NAME}`,
    summary: "Strategy, production AI systems, evals, document intelligence, fine-tuning and AI-native design; how we engage.",
    markdown: services,
  },
  {
    route: "/process",
    title: `Process · ${SITE_NAME}`,
    summary: "How an engagement unfolds, from friction to a system in production that keeps improving.",
    markdown: process,
  },
  {
    route: "/blog",
    title: `Blog · ${SITE_NAME}`,
    summary: "Field notes on putting frontier models to work. Coming soon.",
    markdown: blog,
  },
];

export const agentDocFor = (route: string) => agentDocs.find((doc) => doc.route === route);

/** The llms.txt index (https://llmstxt.org). */
export function llmsTxt() {
  return `# ${SITE_NAME}

> The end-to-end partner that helps companies turn frontier models into measurable business results: AI infrastructure that decreases cost and friction and increases efficiency.

Every page is also available as Markdown at its \`.md\` URL, or at its own URL with \`Accept: text/markdown\`.

## Pages

${agentDocs.map((doc) => `- [${doc.title}](${mdPathOf(doc.route)}): ${doc.summary}`).join("\n")}
`;
}
