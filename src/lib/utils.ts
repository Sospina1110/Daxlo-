export function cn(...clases: Array<string | false | null | undefined>) {
  return clases.filter(Boolean).join(" ");
}

// Curva de salida que usa la plantilla en casi todas sus apariciones.
export const EASE = [0.22, 1, 0.36, 1] as const;

export type Tono = "cyan" | "blue" | "dual";

// Resplandor sin filtro. Antes cada resplandor era un círculo con
// filter: blur(150px): se ve bien, pero desenfocar un círculo de 700 px es de
// lo más caro que se le puede pedir a la tarjeta gráfica de un celular. Un
// degradado radial da el mismo halo sin costo. `escala` agranda la caja lo que
// antes agrandaba el desenfoque: (diámetro + 2 × radio de desenfoque) / diámetro.
export function glow(rgb: string, alfa: number, escala = 1.4): import("react").CSSProperties {
  const c = (a: number) => `rgba(${rgb.split(" ").join(",")},${+a.toFixed(3)})`;
  return {
    background: `radial-gradient(closest-side, ${c(alfa)} 0%, ${c(alfa * 0.6)} 40%, ${c(alfa * 0.18)} 72%, ${c(0)} 100%)`,
    scale: String(+escala.toFixed(2)),
  };
}
