import { agendar, calcom } from "@/content/copy";

type ConfAgenda = { enlaces: Record<string, string>; lineas: Record<string, string> };

// El enlace a la agenda de Cal.com con lo que la persona ya escribió en el
// formulario, para que no lo repita. El celular no viaja en la URL (quedaría en
// el historial del navegador y en los registros de Cal.com): el OS lo toma de
// la fila del formulario, que une con la cita por el correo. Por eso en Cal.com
// la pregunta del correo va con «Disable input if the URL identifier is
// prefilled»: si la persona lo cambiara allá, el OS abriría dos fichas. Sin un
// enlace https configurado devuelve null y el formulario muestra el mensaje de
// siempre.
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

// La agenda está lista solo si cada opción del formulario lleva a un evento
// (el suyo o el general de no_se). Con una configuración a medias, el
// formulario no promete elegir la hora: sigue como antes.
export const hayAgenda = (conf: ConfAgenda = calcom) => agendar.campos.lineaOpciones.every((o) => enlaceDeAgenda(o.valor, "", "", conf) !== null);

// Aparte para poder reemplazarla en las pruebas: jsdom no navega.
export function irA(url: string) {
  window.location.assign(url);
}
