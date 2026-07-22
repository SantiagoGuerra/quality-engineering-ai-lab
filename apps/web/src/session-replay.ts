import type { eventWithTime } from 'rrweb';

declare global {
  interface Window {
    __talentReplay?: { export: () => eventWithTime[]; stop: () => void };
  }
}

/**
 * Local, opt-in rrweb demonstration. Events never leave the browser, all text
 * and inputs are masked, console/network plugins are intentionally absent, and
 * the bounded in-memory buffer disappears when the page closes.
 */
export async function startPrivacyFirstReplay(): Promise<void> {
  if (import.meta.env.VITE_ENABLE_SESSION_REPLAY !== 'true') return;
  const { record } = await import('rrweb');
  const events: eventWithTime[] = [];
  const stop = record({
    emit(event) {
      events.push(event);
      if (events.length > 500) events.shift();
    },
    maskAllInputs: true,
    maskTextFn: (text) => '•'.repeat(text.length),
    blockClass: 'rr-block',
    ignoreClass: 'rr-ignore',
    recordCanvas: false,
    collectFonts: false,
    sampling: { mousemove: false, scroll: 150 },
  });
  if (!stop) return;
  window.__talentReplay = { export: () => structuredClone(events), stop };
}
