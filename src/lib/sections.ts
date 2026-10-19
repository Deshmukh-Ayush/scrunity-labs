import type { Section } from "@/components/on-this-page";
import { chapters } from "@/components/process/chapters-data";

// "On this page" entries for every route. Each id must match an element on that page with
// scroll-mt-14 (OnThisPage warns in development when one is missing). Every page opens on its
// hero, so each list starts with an Overview entry for `#hero`.
const overview: Section = { id: "hero", label: "Overview" };

export const pageSections: Record<string, Section[]> = {
  "/": [
    overview,
    { id: "mission", label: "Mission" },
    { id: "what-we-do", label: "What we do" },
    { id: "why-work-with-us", label: "Why work with us" },
    { id: "get-started", label: "Get started" },
  ],
  "/services": [
    overview,
    { id: "capabilities", label: "What we offer" },
    { id: "engagement", label: "How we engage" },
    { id: "principles", label: "Our approach" },
    { id: "get-started", label: "Get started" },
  ],
  "/process": [overview, ...chapters, { id: "get-started", label: "Get started" }],
  "/blog": [overview, { id: "workbench", label: "On the workbench" }],
};
