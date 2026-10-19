import * as Annotation from "@/components/annotation/annotation";
import { TickBarChart } from "@/components/annotation/tick-bar-chart";
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

// Sample data from the reference recording; swap for real metrics
const tokenShare = [
  { label: "DeepSeek", value: 27.6 },
  { label: "Z.ai", value: 11.5 },
  { label: "OpenAI", value: 8.7 },
  { label: "Stepfun", value: 8.3 },
  { label: "Anthropic", value: 8.0 },
  { label: "Xiaomi", value: 7.6 },
  { label: "Tencent", value: 6.3 },
  { label: "NVIDIA", value: 4.8 },
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

          <section id="mission" className="scroll-mt-14">
            <Annotation.Root>
              <Para tone="foreground" className="leading-[1.6]">
                Our mission is to empower businesses with{" "}
                <Annotation.Note>
                  <Annotation.Trigger>cutting-edge AI solutions</Annotation.Trigger>
                  <Annotation.Card className="w-[min(100%,520px)]">
                    <Annotation.Header>
                      <Annotation.Label>Token share on OpenRouter</Annotation.Label>
                      <Annotation.Meta>By lab · past week</Annotation.Meta>
                    </Annotation.Header>
                    <TickBarChart data={tokenShare} unit="%" />
                    <Annotation.Caption>577 models · 89 labs · 168.3T tokens this week</Annotation.Caption>
                  </Annotation.Card>
                </Annotation.Note>{" "}
                that drive{" "}
                <Annotation.Note>
                  <Annotation.Trigger>real value and innovation.</Annotation.Trigger>
                  <Annotation.Card>
                    <Annotation.Header>
                      <Annotation.Label>Reference 01</Annotation.Label>
                    </Annotation.Header>
                    <Annotation.Quote>
                      One of the things missing from today&apos;s systems is the ability to online learn and
                      continually learn. So, you know, we train these systems, we balance them, we post-train them,
                      and then <strong>they don&apos;t continue to learn out in the world like we would.</strong>
                    </Annotation.Quote>
                    <Annotation.Cite>
                      <strong>Demis Hassabis</strong> · CEO of Google DeepMind
                    </Annotation.Cite>
                  </Annotation.Card>
                </Annotation.Note>
              </Para>
            </Annotation.Root>
          </section>
        </main>
      </Container>
    </div>
  );
}