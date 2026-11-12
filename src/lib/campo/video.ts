import fs from "node:fs";
import path from "node:path";

// Los videos de fondo del inicio, en public/video/. Se revisa en el build
// (este archivo solo corre en el servidor): si un video no está, la página ni
// lo nombra, así que nunca se pide un archivo que dé 404 y queda su póster
// (public/img/campo/, el fotograma inicial).
//
//   daxlo-hero            el hero
//   daxlo-hero-vertical   el hero en pantallas más altas que anchas
//   daxlo-problema        la escena fijada, tiempo 01
//   daxlo-giro            la escena fijada, tiempo 02
//   daxlo-operacion       la escena fijada, tiempo 03
//   daxlo-bodega          la frase sobre una toma a sangre
//   daxlo-mesa            «En tu empresa, con tu equipo»
//   daxlo-luz             el panel del cierre
//
// Cada uno en .webm, en .mp4 o en los dos (se prefiere .webm). Van a 720p,
// sin audio y pensados para bucle. Para cambiar uno basta reemplazar el
// archivo (y su póster) y volver a compilar.

export type VideoFondo = { webm?: string; mp4?: string };

export function videoDe(nombre: string): VideoFondo | null {
  const carpeta = path.join(process.cwd(), "public", "video");
  const ruta = (ext: string) => (fs.existsSync(path.join(carpeta, `${nombre}.${ext}`)) ? `/video/${nombre}.${ext}` : undefined);
  const webm = ruta("webm");
  const mp4 = ruta("mp4");
  return webm || mp4 ? { webm, mp4 } : null;
}
