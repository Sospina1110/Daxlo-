import { agendar, cierre } from "@/content/copy";
import { hayAgenda } from "@/lib/agenda";

const numero = (n: number) => String(n).padStart(2, "0");

// ------------------------------------------------ /agendar

// Qué pasa después de enviar: tres pasos numerados, bajo el titular. El del
// medio depende de si hay agenda de Cal.com configurada (hayAgenda).
export function PasosAgendar() {
  const p = agendar.pasos;
  const pasos = [{ texto: p.enviar }, { texto: hayAgenda() ? cierre.meta.agenda : cierre.meta.whatsapp }, { texto: p.conversar, nota: p.duracion }];
  return (
    <ol aria-label={p.titulo} className="cp-agendar-pasos">
      {pasos.map((paso, n) => (
        <li key={paso.texto} className="cp-agendar-paso">
          <span aria-hidden="true" className="cm-mono">
            {numero(n + 1)}
          </span>
          <span className="cm-texto-l">{paso.texto}</span>
          {paso.nota && <small>{paso.nota}</small>}
        </li>
      ))}
    </ol>
  );
}
