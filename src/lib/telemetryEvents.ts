export const TELEMETRY_EVENTS = [
  "session_start",
  "phase_view",
  "export_json",
  "import_json",
  "download_markdown",
  "download_pdf",
  "generate_plan_start",
  "generate_plan_success",
  "generate_plan_error",
  "enabler_toggle",
] as const;

export type TelemetryEventName = (typeof TELEMETRY_EVENTS)[number];

export type TelemetryPayload = {
  event: TelemetryEventName;
  phase?: number;
};

export function isTelemetryEventName(value: unknown): value is TelemetryEventName {
  return typeof value === "string" && (TELEMETRY_EVENTS as readonly string[]).includes(value);
}

/** Aceita só campos anônimos permitidos (sem PII). */
export function sanitizeTelemetryPayload(input: unknown): TelemetryPayload | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  if (!isTelemetryEventName(raw.event)) return null;

  const payload: TelemetryPayload = { event: raw.event };

  if (raw.phase !== undefined) {
    const phase = typeof raw.phase === "number" ? raw.phase : Number(raw.phase);
    if (!Number.isInteger(phase) || phase < 1 || phase > 7) return null;
    payload.phase = phase;
  }

  if (payload.event === "phase_view" && payload.phase === undefined) return null;

  return payload;
}
