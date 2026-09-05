type EventParams = Record<string, string | number | boolean>

declare global {
  interface Window {
    gtag?: (command: 'event', name: string, params?: EventParams) => void
  }
}

export function trackEvent(name: string, params?: EventParams) {
  if (typeof window !== 'undefined' && window.gtag) {
    const debug = new URLSearchParams(window.location.search).get('ga_debug') === '1'
    window.gtag('event', name, debug ? { ...params, debug_mode: true } : params)
  }
}