export function cn(...clases: Array<string | false | null | undefined>) {
  return clases.filter(Boolean).join(" ");
}

// La curva base del movimiento, para Motion (el menú de la barra): todo lo
// que entra, aparece o responde. Arranca rápido (el ojo ve la respuesta en el
// primer cuadro) y se asienta despacio. Es la misma que --ease-base
// (campo.css) y --ease-salida (globals.css).
export const EASE = [0.22, 1, 0.36, 1] as const;

// "1 a 1" sin corte de línea ("sesiones 1 a / 1."). Solo para el texto que se
// pinta: los metadatos, los datos estructurados y los nombres accesibles que
// buscan las pruebas conservan los espacios normales.
export const sinCorte = (texto: string) => texto.replace(/\b1 a 1\b/g, "1 a 1");
