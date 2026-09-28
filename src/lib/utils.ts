export function cn(...clases: Array<string | false | null | undefined>) {
  return clases.filter(Boolean).join(" ");
}

// Curva de salida que usa la plantilla en casi todas sus apariciones.
export const EASE = [0.22, 1, 0.36, 1] as const;

export type Tono = "cyan" | "blue" | "dual";
