import {
  sanitizeTelemetryPayload,
  type TelemetryEventName,
  type TelemetryPayload,
} from "./src/lib/telemetryEvents";

type CounterStore = {
  startedAt: string;
  totals: Record<string, number>;
  phases: Record<string, number>;
};

function createStore(): CounterStore {
  return {
    startedAt: new Date().toISOString(),
    totals: {},
    phases: {},
  };
}

const store: CounterStore = createStore();

export function recordTelemetry(payload: TelemetryPayload): void {
  store.totals[payload.event] = (store.totals[payload.event] || 0) + 1;
  if (payload.phase !== undefined) {
    const key = String(payload.phase);
    store.phases[key] = (store.phases[key] || 0) + 1;
  }

  console.log(
    JSON.stringify({
      type: "telemetry",
      at: new Date().toISOString(),
      event: payload.event,
      phase: payload.phase ?? null,
    })
  );
}

export function recordServerEvent(event: TelemetryEventName, phase?: number): void {
  recordTelemetry(phase !== undefined ? { event, phase } : { event });
}

export function getTelemetryStats() {
  const totalEvents = Object.values(store.totals).reduce((a, b) => a + b, 0);
  return {
    ok: true,
    since: store.startedAt,
    totalEvents,
    byEvent: { ...store.totals },
    phaseViews: { ...store.phases },
    note: "Contadores em memória (resetam no redeploy). Sem PII. Logs estruturados no stdout do Fly.",
  };
}

export function parseAndRecordTelemetry(body: unknown): { ok: true } | { ok: false; error: string } {
  const payload = sanitizeTelemetryPayload(body);
  if (!payload) {
    return { ok: false, error: "Evento inválido ou campos não permitidos." };
  }
  recordTelemetry(payload);
  return { ok: true };
}

export { sanitizeTelemetryPayload };
