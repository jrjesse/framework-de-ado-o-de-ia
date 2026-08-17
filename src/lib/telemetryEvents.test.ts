import { describe, expect, it } from "vitest";
import { sanitizeTelemetryPayload } from "./telemetryEvents";

describe("sanitizeTelemetryPayload", () => {
  it("aceita eventos conhecidos", () => {
    expect(sanitizeTelemetryPayload({ event: "session_start" })).toEqual({
      event: "session_start",
    });
  });

  it("exige phase válida em phase_view", () => {
    expect(sanitizeTelemetryPayload({ event: "phase_view" })).toBeNull();
    expect(sanitizeTelemetryPayload({ event: "phase_view", phase: 0 })).toBeNull();
    expect(sanitizeTelemetryPayload({ event: "phase_view", phase: 8 })).toBeNull();
    expect(sanitizeTelemetryPayload({ event: "phase_view", phase: 3 })).toEqual({
      event: "phase_view",
      phase: 3,
    });
  });

  it("rejeita eventos desconhecidos e PII embutida", () => {
    expect(sanitizeTelemetryPayload({ event: "hack" })).toBeNull();
    expect(
      sanitizeTelemetryPayload({
        event: "export_json",
        companyName: "Acme",
        answers: { q1: 3 },
      })
    ).toEqual({ event: "export_json" });
  });
});
