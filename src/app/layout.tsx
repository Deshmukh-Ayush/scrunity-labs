import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Container } from "@/components/container";
import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scrunity Labs",
  description: "We’re the end-to-end partner that helps companies turn frontier models into measurable business results.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground scrollbar-thin">
        <MobileNav />

        <Container className="grid min-h-screen w-full grid-cols-1 md:grid-cols-[240px_1fr]">
          {/* left navbar, shared by every route */}
          <aside className="hidden border-r border-border md:block">
            <div className="sticky top-0 h-screen overflow-y-auto pt-14 pr-6 scrollbar-none">
              <Sidebar />
            </div>
          </aside>

          {/* RIGHT: scrolling page content */}
          <main className="min-w-0 py-14 md:pl-12">{children}</main>
        </Container>
      </body>
    </html>
  );
}
