"use client";

import { useEffect, useRef, useState } from "react";
import { admiteVideo } from "@/lib/campo/entorno";
import type { VideoFondo as Video } from "@/lib/campo/video";
import { cn } from "@/lib/utils";
import { PANTALLA_VERTICAL } from "./foto";

// El video de fondo de una escena, encima de su póster (la imagen que ya
// está en la página y es lo que se ve sin JavaScript).
//
// - Solo se monta si el archivo existe (lo decide el build,
//   src/lib/campo/video.ts) y si el equipo lo admite: nunca con «reducir
//   movimiento», con ahorro de datos ni con render por software.
// - Va silenciado, en bucle, sin controles y con preload="none": no se pide
//   nada hasta que le toca reproducirse.
// - `modo="visible"`: se reproduce mientras está en pantalla y se pausa al
//   salir. El del hero (`espera`) aguanta hasta que la página terminó de
//   cargar, para no competir con el póster, que es la imagen más grande de la
//   primera pantalla.
// - `modo="mandado"`: lo prende y lo apaga quien lo usa (la escena fijada,
//   que solo corre el video del tiempo que toca).
// - Aparece fundiendo cuando ya tiene cuadros (data-listo), así el cambio del
//   póster al video no se nota.
type Props = {
  video: Video;
  // La toma vertical, para pantallas más altas que anchas.
  vertical?: Video | null;
  modo?: "visible" | "mandado";
  espera?: boolean;
  className?: string;
};

export function FondoVideo({ video, vertical, modo = "visible", espera = false, className }: Props) {
  const [fuente, setFuente] = useState<Video | null>(null);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!admiteVideo()) return;
    const elegir = () => setFuente(vertical && matchMedia(PANTALLA_VERTICAL).matches ? vertical : video);
    if (!espera || document.readyState === "complete") {
      elegir();
      return;
    }
    window.addEventListener("load", elegir, { once: true });
    return () => window.removeEventListener("load", elegir);
  }, [video, vertical, espera]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const listo = () => v.setAttribute("data-listo", "");
    v.addEventListener("playing", listo, { once: true });
    if (modo === "mandado") return () => v.removeEventListener("playing", listo);
    const io = new IntersectionObserver(
      (es) => {
        if (es[es.length - 1].isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "80px" },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      v.removeEventListener("playing", listo);
    };
  }, [fuente, modo]);

  if (!fuente) return null;
  return (
    <video ref={ref} muted loop playsInline preload="none" tabIndex={-1} disablePictureInPicture className={cn("cm-foto cm-video", className)}>
      {fuente.webm && <source src={fuente.webm} type="video/webm" />}
      {fuente.mp4 && <source src={fuente.mp4} type="video/mp4" />}
    </video>
  );
}
