// La pieza del ecosistema del inicio (src/components/sections/ecosistema.tsx):
// los números que comparten el marcado, el CSS (globals.css, bloque
// "Ecosistema") y las pruebas. Las medidas de cada nodo viven en el CSS, que
// es quien cambia de escritorio a celular; aquí va lo que es del guion.

// Los cuatro estados del escenario, en el orden de ecosistema.pasos.
export const PASOS_ECOSISTEMA = 4;
// Sin JavaScript, con «reducir movimiento» o si React no carga, el escenario
// se queda en su cuadro final: es el valor por defecto del marcado y del CSS.
export const PASO_FINAL = PASOS_ECOSISTEMA - 1;

// En el paso "Hoy" los papeles están amontonados junto a cada persona: tres,
// dos y uno. En los demás pasos circula uno por carril.
export const PAPELES_A_MANO = [3, 2, 1] as const;

// Un papel sale de la herramienta cada CICLO segundos por carril; los tres
// carriles van desfasados un tercio para que no se muevan a la vez. Con el
// pulso de Daxlo son cuatro cosas en movimiento, nunca más.
export const CICLO = 2.4;
export const desfase = (carril: number) => +((carril * CICLO) / 3).toFixed(2);

// Por qué línea de la pantalla tiene que cruzar un paso para ser el activo
// (fracción del alto, desde arriba). En escritorio, el centro. En celular el
// escenario va fijo arriba y ocupa casi media pantalla: el paso que se lee
// queda más abajo.
export const LINEA_ACTIVA = { escritorio: 0.5, celular: 0.72 } as const;
export const ANCHO_ESCRITORIO = 1024;

// rootMargin de un IntersectionObserver que solo ve una línea horizontal a la
// fracción `f` del alto de la pantalla.
export function margenDeLinea(f: number) {
  const arriba = Math.round(f * 1000) / 10;
  const abajo = Math.round((1 - f) * 1000) / 10 - 0.1;
  return `-${arriba}% 0px -${abajo.toFixed(1)}% 0px`;
}
