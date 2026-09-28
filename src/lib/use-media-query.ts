"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(consulta: string) {
  const [coincide, setCoincide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(consulta);
    const actualizar = () => setCoincide(mq.matches);
    actualizar();
    mq.addEventListener("change", actualizar);
    return () => mq.removeEventListener("change", actualizar);
  }, [consulta]);
  return coincide;
}
