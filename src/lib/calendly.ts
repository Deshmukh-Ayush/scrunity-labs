// Booking links for every "Book a call" / "Talk to Sales" CTA.
//
// Any link on the site that points at CALENDLY_URL opens Calendly's popup scheduler instead of
// leaving the page (see src/components/calendly-popup.tsx). Before the widget script has loaded,
// or if it's blocked, the link falls back to opening the booking page directly.

export const CALENDLY_URL = "https://calendly.com/ayush-scrunity/30min";

export const CALENDLY_WIDGET_SCRIPT = "https://assets.calendly.com/assets/external/widget.js";
export const CALENDLY_WIDGET_STYLESHEET = "https://assets.calendly.com/assets/external/widget.css";

/** The slice of Calendly's embed API (window.Calendly) that the site uses. */
type CalendlyWidget = {
  initPopupWidget: (options: { url: string }) => void;
};

declare global {
  interface Window {
    Calendly?: CalendlyWidget;
  }
}

/** True for any link to the booking page, with or without query params or a trailing slash. */
export function isCalendlyLink(href: string) {
  return href === CALENDLY_URL || href.startsWith(`${CALENDLY_URL}/`) || href.startsWith(`${CALENDLY_URL}?`);
}
