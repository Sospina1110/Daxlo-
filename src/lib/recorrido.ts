// Ritmo del recorrido animado de /consultoria (DESIGN.md, Motion). Lo leen el
// reproductor (src/components/sections/recorrido.tsx) y las pruebas.
//
// Cuánto dura cada paso, en segundos. Es lo que tarda en llenarse su tramo de
// la barra; al llenarse, pasa al siguiente. Cada escena termina su acción
// entre los 2,4 y los 3 s y el resto es una pausa sobre el cuadro terminado:
// el ojo alcanza a ir del dibujo al título y a "Te llevas" (unas diez
// palabras, unos 3 s para quien lee despacio). El paso 03 dura más porque su
// escena hace más (las hojas se juntan, la tabla se llena y se prueba) y su
// texto es el más largo. Nadie lee el párrafo completo en 5 s, y no hace
// falta: el dibujo cuenta el paso, se puede pausar o saltar a cualquier
// paso, y al terminar la secuencia se queda quieta en el 04. En total,
// 21,5 s: quien se queda a mirar ve los cuatro sin aburrirse.
export const DURACION_PASO = [5, 5.5, 6, 5] as const;

// Qué tanto del escenario tiene que verse para que arranque, y por debajo de
// cuánto se pausa: la mitad.
export const VISIBLE_PARA_ARRANCAR = 0.5;
