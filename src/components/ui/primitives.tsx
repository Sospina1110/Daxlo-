import Link from "next/link";
import { cn, type Tono } from "@/lib/utils";

const bordePorTono: Record<Tono, React.CSSProperties> = {
  dual: {},
  cyan: { ["--from" as string]: "#29c4f5", ["--to" as string]: "#0b7ea6" },
  blue: { ["--from" as string]: "#6f86ff", ["--to" as string]: "#1b35d0" },
};

// Píldora con borde degradado: marca la audiencia dentro de una tarjeta ("Para
// ti", "Para tu empresa"), la línea del hero y el h1 de las páginas sin
// portada. No va encima de los titulares de sección.
export function Badge({ children, tono = "dual", className }: { children: React.ReactNode; tono?: Tono; className?: string }) {
  return (
    <span
      style={bordePorTono[tono]}
      className={cn(
        "border-gradient inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-medium uppercase tracking-[0.12em] text-white/90",
        className,
      )}
    >
      {children}
    </span>
  );
}

// Foco de luz del borde superior del botón. Degradado radial en vez de
// filter: blur, que en un celular se paga en cada botón de la página.
const brilloPorTono: Record<Tono, string> = {
  dual: "radial-gradient(closest-side at 35% 50%, rgba(41,196,245,0.75), transparent), radial-gradient(closest-side at 65% 50%, rgba(61,90,255,0.75), transparent)",
  cyan: "radial-gradient(closest-side, rgba(41,196,245,0.85), rgba(11,126,166,0.3) 60%, transparent)",
  blue: "radial-gradient(closest-side, rgba(61,90,255,0.9), rgba(27,53,208,0.3) 60%, transparent)",
};

type GlowButtonProps = {
  children: React.ReactNode;
  href?: string;
  tono?: Tono;
  tamano?: "sm" | "md" | "lg";
  // "principal": el único botón relleno de azul de marca (el del hero). El
  // resto del sitio usa el botón de luz oscuro.
  // "papel": menta con texto casi negro. Solo sobre el campo azul del cierre,
  // donde el botón principal se invierte (menta sobre azul da 7,4:1).
  variante?: "luz" | "principal" | "papel";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  // Sube 2 px al pasar el mouse. Los tres llamados con botón magnético (Iman:
  // hero, portada y cierre) lo apagan: ahí el botón ya se mueve hacia el
  // puntero y las dos cosas juntas se sentían de juguete.
  elevar?: boolean;
};

// Foco de luz del botón principal: cian claro, fijo al 85 %. Sube a 100 % al
// pasar el mouse, al presionar o con foco del teclado (en 200 ms; con foco, de
// una vez, y al salir con Tab también: [data-tab] en globals.css). Antes respiraba sin fin de 0,65 a 1: un brillo que late solo es de
// los recursos que más delatan una página hecha con plantilla.
const brilloPrincipal = "radial-gradient(closest-side, rgba(127,224,255,0.95), rgba(41,196,245,0.45) 55%, transparent)";

// Botón oscuro con borde degradado y un foco de luz en el borde superior,
// como el "Get Started" de la plantilla.
//
// Movimiento (DESIGN.md, Motion): .pulsable (globals.css) lo baja a 0.97 al
// presionar (0.98 el principal) en 120 ms y lo devuelve en 120 ms; solo anima
// translate, scale y opacity. Antes llevaba la utilidad `transition`, que
// anima unas 20 propiedades (box-shadow, filter y backdrop-filter incluidas):
// un transition: all encubierto. La subida de hover va solo con mouse
// (hover de Tailwind) y sin "reducir movimiento".
export function GlowButton({ children, href, tono = "dual", tamano = "md", variante = "luz", className, type = "button", disabled, onClick, elevar = true }: GlowButtonProps) {
  const principal = variante === "principal";
  const papel = variante === "papel";
  if (papel) {
    // Sin foco de luz ni borde degradado: es un papel, plano. La flecha y el
    // texto van en casi negro (16,8:1 sobre menta).
    const clasesPapel = cn(
      "group pulsable boton-papel relative inline-flex items-center justify-center gap-2 rounded-control px-4 py-4 text-[16px] font-semibold text-ink min-[360px]:px-8 min-[360px]:py-[18px] min-[360px]:text-[17px]",
      className,
    );
    const interiorPapel = <span className="relative inline-flex items-center gap-2">{children}</span>;
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className={clasesPapel}>
          {interiorPapel}
        </Link>
      );
    }
    return (
      <a href={href} className={clasesPapel}>
        {interiorPapel}
      </a>
    );
  }
  const clases = cn(
    "group pulsable relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-control font-semibold text-white disabled:pointer-events-none disabled:opacity-60",
    elevar && "motion-safe:hover:-translate-y-0.5",
    principal ? "boton-principal" : "border-gradient",
    tamano === "sm" && "min-h-[44px] px-4 py-2 text-[15px]",
    tamano === "md" && "px-4 py-3 text-[16px] min-[360px]:px-5",
    // En pantallas de 320 px el padding completo partía "Agendar una
    // conversación" en dos líneas.
    tamano === "lg" && !principal && "px-4 py-4 text-[16px] min-[360px]:px-7 min-[360px]:text-[17px]",
    // El principal es un poco más grande desde 360 px (64-65 px de alto); por
    // debajo queda igual, para no salirse de la primera pantalla en 320 px.
    tamano === "lg" && principal && "px-4 py-4 text-[16px] min-[360px]:px-8 min-[360px]:py-[18px] min-[360px]:text-[17px]",
    className,
  );
  const estilo = principal ? undefined : ({ ...bordePorTono[tono], ["--fill" as string]: "#10121a", ["--angle" as string]: "120deg" } as React.CSSProperties);
  const interior = (
    <>
      {/* Foco de luz: solo cambia de opacidad, con la curva y los 200 ms por
          defecto de las utilidades transition-* (globals.css, @theme). */}
      {principal ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-5 left-1/2 h-10 w-[90%] -translate-x-1/2 opacity-85 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-focus-visible:duration-0 group-active:opacity-100"
          style={{ background: brilloPrincipal }}
        />
      ) : (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-5 left-1/2 h-10 w-[90%] -translate-x-1/2 opacity-60 transition-opacity group-hover:opacity-100 group-active:opacity-100"
          style={{ background: brilloPorTono[tono] }}
        />
      )}
      <span aria-hidden className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  );
  // Las rutas del propio sitio van con Link: la página siguiente se precarga y
  // se abre sin recargar. Los enlaces externos (WhatsApp) quedan como <a>.
  if (href?.startsWith("/")) {
    return (
      <Link href={href} className={clases} style={estilo}>
        {interior}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={clases} style={estilo}>
        {interior}
      </a>
    );
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={clases} style={estilo}>
      {interior}
    </button>
  );
}

// ------------------------------------------------ Primitivos de «Encendido»

// Placa: la superficie de un objeto (un escenario, una ventana, un
// formulario). Apagada es un borde; `encendida`, el azul profundo con el filo
// de luz arriba. `viva` la enciende con el puntero, con el foco o al cruzar el
// centro de la pantalla en táctil (globals.css, .placa). Lo que es lista va en
// filas (Fila), no en placas.
export function Placa({
  children,
  encendida = false,
  viva = false,
  className,
}: {
  children: React.ReactNode;
  encendida?: boolean;
  viva?: boolean;
  className?: string;
}) {
  return (
    <div data-encendida={encendida ? "" : undefined} className={cn("placa", viva && "placa-viva", className)}>
      {children}
    </div>
  );
}

// Rótulo: 13 px, mayúsculas, la letra de los titulares. Nombra un paso o una
// columna; nunca va encima de un titular de sección.
export function Rotulo({ children, className, as: Comp = "p" }: { children: React.ReactNode; className?: string; as?: "p" | "span" }) {
  return <Comp className={cn("rotulo", className)}>{children}</Comp>;
}

// Fila: lo que es lista va en filas con una línea de 1 px arriba, no en
// tarjetas.
export function Fila({ children, className, as: Comp = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "li" }) {
  return <Comp className={cn("relative border-t border-line-2", className)}>{children}</Comp>;
}

// Número de paso en dos capas: el contorno (apagado) y el relleno (encendido),
// que solo cambia de opacidad. `lleno` lo deja encendido; sin él, lo enciende
// el contenedor con [data-activo] o [data-encendida] (globals.css, .numeral).
export function Numeral({ children, lleno = false, className }: { children: React.ReactNode; lleno?: boolean; className?: string }) {
  return (
    <span data-lleno={lleno ? "" : undefined} className={cn("numeral text-numeral font-display tabular-nums", className)}>
      <span aria-hidden className="numeral-contorno">
        {children}
      </span>
      <span className="numeral-relleno">{children}</span>
    </span>
  );
}

// Los tres puntos de ventana: solo en las maquetas de pantalla (el hero y la
// sesión en vivo), no en diagramas.
export function WindowDots({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("flex items-center gap-1.5", className)}>
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
    </span>
  );
}

// La X de Daxlo (blanca, cuña cian) en un círculo casi negro: el avatar de
// Daxlo en las maquetas de chat.
export function MarcaX({ tamano = 32, className }: { tamano?: number; className?: string }) {
  const ancho = Math.round(tamano * 0.56);
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full border border-line-2 bg-ink", className)}
      style={{ width: tamano, height: tamano }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/daxlo-x.png" alt="" width={ancho} height={Math.round((ancho * 162) / 219)} />
    </span>
  );
}

