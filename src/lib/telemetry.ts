import type { TelemetryEventName, TelemetryPayload } from "./telemetryEvents";

const ENDPOINT = "/api/telemetry";

function buildBody(event: TelemetryEventName, phase?: number): string {
  const payload: TelemetryPayload = { event };
  if (phase !== undefined) payload.phase = phase;
  return JSON.stringify(payload);
}

/**
 * Envia evento anônimo (sem PII). Falhas são ignoradas para não afetar a UX.
 */
export function track(event: TelemetryEventName, opts?: { phase?: number }): void {
  try {
    const body = buildBody(event, opts?.phase);
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      const queued = navigator.sendBeacon(ENDPOINT, blob);
      if (queued) return;
    }

    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // telemetria nunca deve quebrar o app
  }
}
