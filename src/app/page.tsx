import HeroCtas from "@/components/buttons/hero-cta";
import { ClaudeIcon, GeminiIcon, GrokIcon, OpenaiIcon, PerplexityAiIcon } from "@/components/buttons/icons";
import { Container } from "@/components/container";
import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";
import { Heading, Para } from "@/components/utils/texts";
import Image from "next/image";

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
          <section id="hero" className="scroll-mt-14 my-12">
            <Heading>
              we build ai infrastructure <br /> to decrease cost & friction <br /> and increase efficiency.
            </Heading>
            <Para className="py-6 tracking-[-0.1px]">
              We save you cost, time and efforts.
            </Para>
            
            <HeroCtas />
            <div className="flex max-w-fit items-center gap-6 py-8">
              <span className="text-xs font-medium font-mono tracking-wide text-muted">ASK ABOUT SCRUNITY LABS ON:</span>
              <div className="flex items-center gap-4 [&_svg]:h-4.5 [&_svg]:w-4.5">
                <OpenaiIcon />
                <ClaudeIcon />
                <PerplexityAiIcon />
                <GrokIcon />
                <GeminiIcon />
              </div>
            </div>

            <Image src="/hero-img.png" alt="Hero Image" height={300} width={1200} className="w-full h-auto mt-10 " />
          </section>

          <section id="mission" className="">
            <Para tone="foreground">
              Our mission is to empower businesses with cutting-edge AI solutions that drive real value and innovation.
            </Para>
          </section>
        </main>
      </Container>
    </div>
  );
}