import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { CorreoContacto } from "@/components/ui/correo-contacto";
import { contacto, footer, herramientas } from "@/content/copy";
import { glow } from "@/lib/utils";

// Glifo de Instagram de simple-icons: lucide ya no trae iconos de marcas.
function Instagram({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
    </svg>
  );
}

export function Footer() {
  const f = footer;
  return (
    <footer className="container-page pb-8 pt-4">
      <div className="glass relative overflow-hidden rounded-[28px] p-6 sm:p-8 md:p-12">
        <span aria-hidden className="absolute -right-24 -top-24 h-72 w-72 resplandor" style={glow("27 53 208", 0.35, 1.69)} />
        {/* En celular las columnas de enlaces van de a dos: en una sola
            columna el pie ocupaba casi dos pantallas. */}
        <div className="relative grid grid-cols-2 gap-x-4 gap-y-10 min-[360px]:gap-x-6 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Daxlo, ir al inicio" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/daxlo-logo-claro.png" alt="Daxlo" width={126} height={32} className="h-8 w-auto" loading="lazy" />
            </Link>
            <p className="mt-5 max-w-[280px] text-[17px] leading-relaxed text-muted">{f.lema}</p>
          </div>
          {f.columnas.map((col) => (
            <nav key={col.titulo} aria-label={col.titulo}>
              <p className="font-display text-[17px] text-white">{col.titulo}</p>
              <ul className="mt-2">
                {col.enlaces.map((e) => (
                  <li key={e.h}>
                    <Link href={e.h} className="inline-flex min-h-[44px] items-center py-1 text-[15px] leading-snug text-white/60 transition-colors hover:text-white min-[360px]:text-[16px]">
                      {e.t}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          {/* En celular el contacto va a lo ancho y en fila: en media columna
              el correo no cabía en 320 px. */}
          <div className="col-span-2 sm:col-span-1">
            <p className="font-display text-[17px] text-white">Contacto</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[16px] sm:block sm:space-y-1">
              <li>
                <a href={contacto.whatsapp} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center gap-2 text-white/60 hover:text-white">
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </li>
              <li>
                <CorreoContacto className="inline-flex min-h-[44px] items-center gap-2 text-white/60 hover:text-white" />
              </li>
              <li>
                <a href={contacto.instagram} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center gap-2 text-white/60 hover:text-white">
                  <Instagram size={16} /> Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="relative mt-12 flex flex-col gap-2 border-t border-line pt-6 text-[14px] text-dim md:flex-row md:justify-between">
          <p>{f.derechos}</p>
          <p>{herramientas.aviso}</p>
        </div>
      </div>
    </footer>
  );
}
