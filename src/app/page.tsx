import { Container } from "@/components/container";
import { Sidebar } from "@/components/sidebar";

const sections = [
  { id: "mission", label: "Mission" },
  { id: "what-we-do", label: "What we do" },
  { id: "how-it-works", label: "How it works" },
  { id: "sample-report", label: "Sample report" },
  { id: "security", label: "Security" },
  { id: "pricing", label: "Pricing" },
];

export default function Home() {
  return (
    <div className="w-full bg-white">
      <Container className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
        {/* LEFT: column stretches full page height so the border runs top to bottom */}
        <aside className="hidden border-r border-neutral-200 md:block">
          {/* Inner wrapper is what stays pinned while you scroll */}
          <div className="sticky top-0 h-screen overflow-y-auto pt-14 pr-6">
            <Sidebar sections={sections} />
          </div>
        </aside>

        {/* RIGHT: scrolling content */}
        <main className="min-w-0 py-14 md:pl-12">
          <section id="mission" className="scroll-mt-14 pb-24">
            <h1 className="max-w-[480px] text-[32px] leading-[1.25] tracking-tight text-neutral-900">
              Scrunity Labs audits your company and builds the AI agents that run it.
            </h1>
          </section>

          {/* Placeholder sections so you can test the scroll-spy */}
          {sections.slice(1).map((s) => (
            <section
              key={s.id}
              id={s.id}
              className="min-h-[80vh] scroll-mt-14 border-t border-neutral-200 py-12"
            >
              <h2 className="text-2xl text-neutral-900">{s.label}</h2>
            </section>
          ))}
        </main>
      </Container>
    </div>
  );
}