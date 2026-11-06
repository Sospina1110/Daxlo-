export function cn(...clases: Array<string | false | null | undefined>) {
  return clases.filter(Boolean).join(" ");
}

// Lenguaje de movimiento del sitio: dos curvas y un resorte (DESIGN.md, Motion).
// Las curvas viven en CSS como --ease-salida y --ease-mover (globals.css); aquí
// van sus equivalentes para Motion.

// Curva de salida: todo lo que entra, aparece, responde o se presiona. Arranca
// rápido (el ojo ve la respuesta en el primer cuadro) y se asienta despacio.
// Es la misma que --ease-salida.
export const EASE = [0.22, 1, 0.36, 1] as const;

// Resorte del botón magnético (Iman). Con masa 1, ζ = 30 / (2·√300) ≈ 0,87:
// rebasa menos de 0,5 % (menos de 0,03 px en 6 px), se asienta en ~0,27 s y,
// como todo resorte, conserva la velocidad si el puntero cambia de idea a
// mitad de camino. Va por rigidez y amortiguación, no por duración: en motion
// 13.4.4 un resorte definido por tiempo (visualDuration/bounce) pone la
// velocidad en 0 cada vez que cambia de destino y la vuelta deja de ser
// continua.
export const RESORTE_IMAN = { stiffness: 300, damping: 30, mass: 1 } as const;

// Lo más que se corre el botón hacia el puntero, con el puntero en el borde:
// se nota como respuesta y nunca saca el botón de debajo del puntero.
export const IMAN_MAX_X = 6;
export const IMAN_MAX_Y = 4;

export type Tono = "cyan" | "blue" | "dual";

// "1 a 1" sin corte de línea ("sesiones 1 a / 1."). Solo para el texto que se
// pinta: los metadatos, los datos estructurados y los nombres accesibles que
// buscan las pruebas conservan los espacios normales.
export const sinCorte = (texto: string) => texto.replace(/\b1 a 1\b/g, "1 a 1");

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
