import { cn } from "@/lib/utils";

// Una imagen del inicio (public/img/campo), en AVIF con respaldo en WebP. Las
// que van a sangre son el póster de su video: el fotograma inicial, en alta
// resolución. Es lo que se ve mientras el video carga, y lo único que se ve
// sin JavaScript, con «reducir movimiento» o con ahorro de datos.
//
// Todas son decorativas: van siempre dentro de un bloque aria-hidden, con alt
// vacío. El tamaño lo da la caja (campo.css, .cm-foto): la imagen la llena,
// así que no mueve nada al cargar.
//
// Todas están en la paleta de la página: medianoche y azul eléctrico.

const BASE = "/img/campo";

type Props = {
  nombre: string;
  ancho: number;
  alto: number;
  // Hay una toma vertical (nombre-v) para pantallas más altas que anchas.
  vertical?: boolean;
  // La del hero: se pide de primera y sin espera.
  prioridad?: boolean;
  className?: string;
};

// La misma condición decide el póster y el video (fondo-video.tsx).
export const PANTALLA_VERTICAL = "(max-aspect-ratio: 1/1)";

export function Foto({ nombre, ancho, alto, vertical = false, prioridad = false, className }: Props) {
  return (
    <picture>
      {vertical && <source media={PANTALLA_VERTICAL} type="image/avif" srcSet={`${BASE}/${nombre}-v.avif`} />}
      {vertical && <source media={PANTALLA_VERTICAL} type="image/webp" srcSet={`${BASE}/${nombre}-v.webp`} />}
      <source type="image/avif" srcSet={`${BASE}/${nombre}.avif`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/${nombre}.webp`}
        alt=""
        width={ancho}
        height={alto}
        loading={prioridad ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={prioridad ? "high" : undefined}
        draggable={false}
        className={cn("cm-foto", className)}
      />
    </picture>
  );
}
