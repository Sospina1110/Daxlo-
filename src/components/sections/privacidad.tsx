import { paginas, privacidad } from "@/content/copy";
import { CorreoContacto } from "@/components/ui/correo-contacto";

// Página /privacidad: la política de tratamiento de datos. Texto largo de
// lectura, así que va en una sola columna angosta, sin apariciones con el
// scroll (se lee de corrido) y con cada sección enlazable por su ancla.
export function Privacidad({ migas }: { migas?: React.ReactNode }) {
  const p = privacidad;
  const r = p.responsable;
  return (
    <section className="relative pb-20 pt-28 md:pb-32 md:pt-36">
      <div className="container-page">
        {migas}
        {/* El texto legal sí se puede seleccionar y copiar (data-copiable). */}
        <article data-copiable="" className="mx-auto mt-10 max-w-[760px] md:mt-14">
          <h1 className="text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.05] text-white">{paginas.privacidad.titulo}</h1>
          <p className="mt-4 text-[15px] text-dim">Vigente desde el {p.vigencia}.</p>
          <p className="mt-8 text-[18px] leading-relaxed text-muted">{p.intro}</p>

          <div className="glass mt-8 rounded-[22px] p-6 md:p-7">
            <h2 className="font-display text-[20px] text-white">Quién es responsable de tus datos</h2>
            <dl className="mt-4 grid gap-3 text-[17px] sm:grid-cols-[140px_1fr]">
              <dt className="text-dim">Responsable</dt>
              <dd className="text-white/85">{r.nombre}</dd>
              <dt className="text-dim">Domicilio</dt>
              <dd className="text-white/85">{r.domicilio}</dd>
              <dt className="text-dim">Correo</dt>
              <dd>
                <CorreoContacto className="inline-flex items-center gap-2 text-white/85 hover:text-white" />
              </dd>
              <dt className="text-dim">WhatsApp</dt>
              <dd className="text-white/85">{r.whatsapp}</dd>
            </dl>
            <p className="mt-4 text-[16px] text-muted">{r.atiende}</p>
          </div>

          {p.secciones.map((s, i) => (
            <section key={s.titulo} id={`seccion-${i + 1}`} className="mt-12 scroll-mt-28">
              <h2 className="text-[clamp(1.5rem,3vw,1.9rem)] leading-tight text-white">{s.titulo}</h2>
              {"lista" in s && s.lista && (
                <ul className="mt-5 space-y-2.5">
                  {s.lista.map((item) => (
                    <li key={item} className="flex gap-3 text-[18px] leading-relaxed text-white/85">
                      <span aria-hidden className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {s.parrafos.map((texto) => (
                <p key={texto} className="mt-4 text-[18px] leading-relaxed text-muted">
                  {texto}
                </p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}
