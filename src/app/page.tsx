import * as Annotation from "@/components/annotation/annotation";
import { TickBarChart } from "@/components/annotation/tick-bar-chart";
import HeroCtas from "@/components/buttons/hero-cta";
import { ClaudeIcon, GeminiIcon, GrokIcon, OpenaiIcon, PerplexityAiIcon } from "@/components/buttons/icons";
import { Container } from "@/components/container";
import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";
import { Separator } from "@/components/ui/separator";
import { Heading, Label, Para } from "@/components/utils/texts";
import { WhatWeDo } from "@/components/what-we-do";
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

          <section id="mission" className="scroll-mt-14 mb-12">
            <Annotation.Root className="flex flex-col gap-5">
              <Para tone="foreground" className="leading-[1.6]">
                We exist to place the world&apos;s{" "}
                <Annotation.Note>
                  <Annotation.Trigger>frontier models</Annotation.Trigger>
                  <Annotation.Card className="w-[min(100%,520px)]">
                    <Annotation.Header>
                      <Annotation.Label>Token share on OpenRouter</Annotation.Label>
                      <Annotation.Meta>By lab · past week</Annotation.Meta>
                    </Annotation.Header>
                    <TickBarChart data={tokenShare} unit="%" />
                    <Annotation.Caption>577 models · 89 labs · 168.3T tokens this week</Annotation.Caption>
                  </Annotation.Card>
                </Annotation.Note>{" "}
                in the hands of the businesses defining the next decade, and to make that power feel effortless.
              </Para>

              <Para tone="foreground" className="leading-[1.6]">
                Intelligence is fast becoming the most valuable raw material in the economy, yet its promise remains{" "}
                <Annotation.Note>
                  <Annotation.Trigger>unevenly distributed.</Annotation.Trigger>
                  <Annotation.Card>
                    <Annotation.Header>
                      <Annotation.Label>Reference 01</Annotation.Label>
                    </Annotation.Header>
                    <Annotation.Quote>
                      The future is already here. <strong>It&apos;s just not very evenly distributed.</strong>
                    </Annotation.Quote>
                    <Annotation.Cite>
                      <strong>William Gibson</strong> · Author of Neuromancer
                    </Annotation.Cite>
                  </Annotation.Card>
                </Annotation.Note>{" "}
                We intend to change that, carrying the dividends of transformative AI to every corner of commerce, not
                merely its edges.
              </Para>

              <Para tone="foreground" className="leading-[1.6]">
                Our team has architected flagship AI systems within some of the industry&apos;s{" "}
                <Annotation.Note>
                  <Annotation.Trigger>most demanding environments,</Annotation.Trigger>
                  <Annotation.Card>
                    <Annotation.Header>
                      <Annotation.Label>Field-tested</Annotation.Label>
                      <Annotation.Meta>Where we&apos;ve built</Annotation.Meta>
                    </Annotation.Header>
                    <p className="text-[14px] leading-[1.65] text-foreground/70">
                      Regulated data, high-volume traffic and systems that can&apos;t go down.{" "}
                      <strong className="font-semibold text-foreground">
                        Places where a demo isn&apos;t enough and production is the only proof.
                      </strong>
                    </p>
                  </Annotation.Card>
                </Annotation.Note>{" "}
                where precision is not a preference but a prerequisite, and where every millisecond carries consequence.
              </Para>

              <Para tone="foreground" className="leading-[1.6]">
                We don&apos;t engineer for today&apos;s model. We engineer for{" "}
                <Annotation.Note>
                  <Annotation.Trigger>the ones still on the horizon:</Annotation.Trigger>
                  <Annotation.Card>
                    <Annotation.Header>
                      <Annotation.Label>Reference 02</Annotation.Label>
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
                </Annotation.Note>{" "}
                foundations designed to{" "}
                <Annotation.Note>
                  <Annotation.Trigger>absorb each new leap</Annotation.Trigger>
                  <Annotation.Card>
                    <Annotation.Header>
                      <Annotation.Label>Reference 03</Annotation.Label>
                      <Annotation.Meta>Amara&apos;s law</Annotation.Meta>
                    </Annotation.Header>
                    <Annotation.Quote>
                      We tend to overestimate the effect of a technology in the short run and{" "}
                      <strong>underestimate the effect in the long run.</strong>
                    </Annotation.Quote>
                    <Annotation.Cite>
                      <strong>Roy Amara</strong> · Futurist, Institute for the Future
                    </Annotation.Cite>
                  </Annotation.Card>
                </Annotation.Note>{" "}
                rather than be undone by it, so what you build now only grows more capable with time.
              </Para>

              <Para tone="foreground" className="leading-[1.6]">
                This is infrastructure as it should be: quiet, rigorous, and{" "}
                <Annotation.Note>
                  <Annotation.Trigger>built to outlast the moment.</Annotation.Trigger>
                  <Annotation.Card>
                    <Annotation.Header>
                      <Annotation.Label>Design principle</Annotation.Label>
                    </Annotation.Header>
                    <p className="text-[14px] leading-[1.65] text-foreground/70">
                      <strong className="font-semibold text-foreground">Model-agnostic by design.</strong> Switch
                      providers, adopt new releases and add new modalities without rewriting what already works.
                    </p>
                  </Annotation.Card>
                </Annotation.Note>{" "}
                The frontier, finally within reach.
              </Para>
            </Annotation.Root>
          </section>
          <Separator />
          <section id="what-we-do" className="scroll-mt-14 my-12">
            <Label>What we do</Label>
            <WhatWeDo />
          </section>
        </main>
      </Container>
    </div>
  );
}