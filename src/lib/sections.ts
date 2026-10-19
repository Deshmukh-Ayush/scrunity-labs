import type { Section } from "@/components/on-this-page";

// "On this page" entries per route. Each id must match a <section id=…> on that page (with scroll-mt-14).
export const pageSections: Record<string, Section[]> = {
  "/": [
    { id: "mission", label: "Mission" },
    { id: "what-we-do", label: "What we do" },
    { id: "why-work-with-us", label: "Why work with us" },
    { id: "get-started", label: "Get started" },
  ],
  "/services": [
    { id: "capabilities", label: "What we offer" },
    { id: "engagement", label: "How we engage" },
    { id: "principles", label: "Our approach" },
    { id: "get-started", label: "Get started" },
  ],
};
