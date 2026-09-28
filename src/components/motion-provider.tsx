"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";

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
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
