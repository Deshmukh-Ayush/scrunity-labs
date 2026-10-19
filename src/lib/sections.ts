import type { Section } from "@/components/on-this-page";

// "On this page" entries per route. Each id must match a <section id=…> on that page (with scroll-mt-14).
export const pageSections: Record<string, Section[]> = {
  "/": [
    { id: "mission", label: "Mission" },
    { id: "what-we-do", label: "What we do" },
    { id: "why-work-with-us", label: "Why work with us" },
    { id: "get-started", label: "Get started" },
  ],
};
