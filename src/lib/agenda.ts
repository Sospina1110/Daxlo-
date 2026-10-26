import { calcom } from "@/content/copy";

type ConfAgenda = { enlaces: Record<string, string>; lineas: Record<string, string> };

// El enlace a la agenda de Cal.com con lo que la persona ya escribió en el
// formulario, para que no lo repita. El celular no viaja en la URL (quedaría en
// el historial del navegador y en los registros de Cal.com): el OS lo toma de
// la fila del formulario, que une con la cita por el correo. Sin un enlace
// https configurado devuelve null y el formulario muestra el mensaje de siempre.
export function enlaceDeAgenda(linea: string, nombre: string, correo: string, conf: ConfAgenda = calcom): string | null {
  const base = conf.enlaces[linea] || conf.enlaces.no_se || "";
  if (!base.startsWith("https://")) return null;
  const url = new URL(base);
  if (nombre) url.searchParams.set("name", nombre);
  if (correo) url.searchParams.set("email", correo);
  const valorLinea = conf.lineas[linea];
  if (valorLinea) url.searchParams.set("linea", valorLinea);
  return url.toString();
}

// Si hay al menos un tipo de evento configurado, el formulario anuncia que al
// enviarlo se elige la hora.
export const hayAgenda = (conf: ConfAgenda = calcom) => Object.values(conf.enlaces).some((e) => e.startsWith("https://"));

// Aparte para poder reemplazarla en las pruebas: jsdom no navega.
export function irA(url: string) {
  window.location.assign(url);
}
