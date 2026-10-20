"use client";

import Script from "next/script";
import { useEffect } from "react";
import { CALENDLY_WIDGET_SCRIPT, CALENDLY_WIDGET_STYLESHEET, isCalendlyLink } from "@/lib/calendly";

/**
 * Opens Calendly's popup scheduler when a visitor clicks any link to the booking page.
 *
 * Mounted once in the root layout, so CTAs stay plain links: they just point at CALENDLY_URL.
 * Clicks are caught at the document level, before React and next/link handle them.
 */
export function CalendlyPopup() {
  useEffect(() => {
    function openPopup(event: MouseEvent) {
      // Let ctrl/cmd/shift/middle clicks open the booking page in a new tab as usual
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link || !isCalendlyLink(link.href)) return;

      // Widget not loaded yet (or blocked): fall through to the link itself
      if (!window.Calendly) return;

      event.preventDefault();
      window.Calendly.initPopupWidget({ url: link.href });
    }

    document.addEventListener("click", openPopup, { capture: true });
    return () => document.removeEventListener("click", openPopup, { capture: true });
  }, []);

  return (
    <>
      <link rel="stylesheet" href={CALENDLY_WIDGET_STYLESHEET} precedence="default" />
      <Script src={CALENDLY_WIDGET_SCRIPT} strategy="lazyOnload" />
    </>
  );
}
