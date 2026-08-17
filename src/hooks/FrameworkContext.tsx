import { createContext, useContext } from "react";
import type { FrameworkState } from "../hooks/useFrameworkState";

export const FrameworkContext = createContext<FrameworkState | null>(null);

export function useFramework(): FrameworkState {
  const ctx = useContext(FrameworkContext);
  if (!ctx) {
    throw new Error("useFramework deve ser usado dentro de FrameworkContext.Provider");
  }
  return ctx;
}
