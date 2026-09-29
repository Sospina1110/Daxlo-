"use client";

import { useEffect } from "react";
import { LazyMotion, MotionConfig } from "motion/react";

const cargarFunciones = () => import("./motion-features").then((m) => m.default);

// Quien tiene activado "reducir movimiento" en su sistema ve la página sin
// desplazamientos: las apariciones quedan solo en opacidad.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  // Señal para la red de seguridad del layout: React ya tomó el control.
  useEffect(() => {
    const d = document.documentElement;
    d.dataset.hidratado = "1";
    // Si la red de seguridad llegó a activarse (celular lento), se quita apenas
    // React toma el control: sus !important anulaban para siempre las
    // transformaciones de Motion, como el apilado de fases.
    d.classList.remove("forzar-visible");
  }, []);
  // LazyMotion carga solo las funciones de animación que se usan (sin layout
  // ni arrastre), y las pide aparte, después de hidratar: son unos 29 KB
  // comprimidos que ya no frenan el arranque en celular. strict hace fallar
  // cualquier <motion.x> que se cuele: todas las islas usan <m.x>.
  return (
    <LazyMotion features={cargarFunciones} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
