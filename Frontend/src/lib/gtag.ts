/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: any[]) => void;
  }
}

function ensureDataLayer() {
  window.dataLayer = window.dataLayer || [];
}

export function loadGtag(measurementId?: string) {
  if (typeof window === "undefined") return;
  if (!measurementId) return;
  if (window.gtag) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  ensureDataLayer();

  // arguments এর বদলে rest parameters ব্যবহার করলাম
  window.gtag = (...args: any[]) => {
    (window.dataLayer as any[]).push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });
}

export function pageview(path: string) {
  if (!window.gtag) return;
  window.gtag("event", "page_view", { page_path: path });
}

export function gtagEvent(action: string, params?: Record<string, any>) {
  if (!window.gtag) return;
  window.gtag("event", action, params || {});
}
