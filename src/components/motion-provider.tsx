"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";

// Quien tiene activado "reducir movimiento" en su sistema ve la página sin
// desplazamientos: las apariciones quedan solo en opacidad.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  // Señal para la red de seguridad del layout: React ya tomó el control.
  useEffect(() => {
    document.documentElement.dataset.hidratado = "1";
  }, []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
