import { Container } from "@/components/container";
import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";
import { Heading, Para } from "@/components/utils/texts";

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
    <div className="w-full bg-background">
      <MobileNav sections={sections} />

      <Container className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
        {/* left navbar */}
        <aside className="hidden border-r border-border md:block">
          <div className="sticky top-0 h-screen overflow-y-auto pt-14 pr-6 scrollbar-none">
            <Sidebar sections={sections} />
          </div>
        </aside>

        {/* RIGHT: scrolling content */}
        <main className="min-w-0 py-14 md:pl-12">
          <section id="mission" className="scroll-mt-14 pb-24">
            <Heading>
              we build ai infrastructure <br /> to decrease cost & friction <br /> and increase efficiency.
            </Heading>
            <Para className="py-6">
              We save you cost, time and efforts.
            </Para>
          </section>

        
        </main>
      </Container>
    </div>
  );
}