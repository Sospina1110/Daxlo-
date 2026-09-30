"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { contacto } from "@/content/copy";

// El correo se arma en el navegador y no viaja en el HTML. Dos razones:
// Cloudflare tiene activada la ofuscación de correos en daxlo.co y reescribe
// cualquier correo del HTML; eso haría que React viera un texto distinto al
// que espera y repintara la página entera. Ojo: el correo sí viaja en texto
// dentro del JavaScript público; esto no lo esconde de un robot decidido.
export function CorreoContacto({ className }: { className?: string }) {
  const [listo, setListo] = useState(false);
  useEffect(() => setListo(true), []);
  return (
    <a href={listo ? `mailto:${contacto.correo}` : undefined} className={className}>
      <Mail size={16} /> {listo ? contacto.correo : "Correo"}
    </a>
  );
}
