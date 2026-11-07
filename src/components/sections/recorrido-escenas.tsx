import type { CSSProperties } from "react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Package,
  Plus,
  Receipt,
  Repeat,
  Table2,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { consultoria } from "@/content/copy";
import { cn } from "@/lib/utils";

// Las cuatro escenas del recorrido animado de /consultoria, una por paso.
// Son ilustrativas: el mismo proceso genérico de punta a punta (las
// cotizaciones), sin cifras ni resultados y sin la pantalla de ningún
// cliente; el escenario lleva el rótulo "Ejemplo" a la vista. Son decorativas
// para lectores de pantalla (el escenario es aria-hidden): lo que cuentan ya
// está en el texto de cada paso.
//
// Cómo se mueven: solo CSS (globals.css, "Recorrido de /consultoria"), con
// las curvas y las duraciones del sitio. Cada pieza lleva su retraso en --t,
// en segundos desde que arranca la escena. El estilo de base de cada pieza es
// su cuadro final: sin animación (con "reducir movimiento", al saltar a un
// paso en pausa o al terminar) se ve la escena completa y quieta, y con la
// animación en pausa antes de arrancar se ve el primer cuadro. Solo se anima
// transform y opacity.
//
// Cada escena se dibuja en una caja de 260 × 172 px (.escena) que el CSS
// agranda con zoom según el ancho de la pantalla: las posiciones van en px de
// esa caja y el texto nunca baja de 13 px.

const e = consultoria.recorrido.animacion.escenas;

// Retraso de una pieza (s) y otras variables de su animación.
const en = (t: number, otras: Record<string, string | number> = {}) => ({ "--t": `${t}s`, ...otras }) as CSSProperties;
const caja = (left: number, top: number, width: number, height: number): CSSProperties => ({ left, top, width, height });

// La ola del sitio (DESIGN.md, Escalón en ola): cada intervalo 15 % más corto.
const ola = (i: number) => Math.round((0.08 * (1 - Math.pow(0.85, i))) / 0.15 * 1000) / 1000;

const ICONO = { size: 16, strokeWidth: 1.5, "aria-hidden": true } as const;

// Ficha de las maquetas: 8 px de radio, borde blanco al 14 %, #12141C.
const FICHA = "absolute flex items-center gap-2 rounded-lg border border-line-2 bg-ink-2 px-2.5 text-[13px] font-medium leading-snug text-white/85";

// Trazo de 1 px en azul claro al 50 %, que crece desde su origen (a la
// izquierda o arriba; `origen="center"`, desde el medio). El origen va en
// línea: las reglas .ce-traza-* van fuera de capa y le ganarían a una
// utilidad.
function Trazo({ eje, origen, style }: { eje: "x" | "y"; origen?: "center"; style: CSSProperties }) {
  return <span className={cn("absolute bg-blue-soft/50", eje === "x" ? "ce-traza-x" : "ce-traza-y")} style={origen ? { ...style, transformOrigin: origen } : style} />;
}

// ------------------------------------------------------------ 01

// Reloj sin números: dos agujas que corren (el tiempo que se va en la tarea).
// Corren rápido 1,4 s y después siguen despacio hasta que termina el paso:
// el tiempo no se detiene mientras se lee. Cada aguja gira alrededor del
// centro de la esfera desde su punta de abajo (@keyframes ce-gira).
function Reloj() {
  const aguja = "ce-gira absolute w-[1.5px] rounded-full bg-white/80";
  return (
    <span className="relative h-4 w-4 shrink-0 rounded-full border border-white/45">
      <span className={aguja} style={{ left: "calc(50% - 0.75px)", top: "calc(50% - 5px)", height: 5, ...en(0.5, { "--giro": "0deg", "--vueltas": "-720deg", "--resto": "-90deg" }) }} />
      <span className={aguja} style={{ left: "calc(50% - 0.75px)", top: "calc(50% - 3.5px)", height: 3.5, ...en(0.5, { "--giro": "120deg", "--vueltas": "-60deg", "--resto": "-8deg" }) }} />
    </span>
  );
}

function Causa({ Icono, texto, style }: { Icono: LucideIcon; texto: string; style: CSSProperties }) {
  return (
    <div className="ce-entra absolute flex flex-col gap-1.5 rounded-lg border border-line-2 bg-ink-2 p-2.5 text-[13px] font-medium leading-snug text-white/85" style={style}>
      <Icono {...ICONO} className="text-blue-soft" />
      <span>{texto}</span>
    </div>
  );
}

// 01 Vemos qué te está costando: llega la tarea que se demora, el reloj corre
// y debajo aparece lo que hay detrás (las dos causas del texto del paso),
// unidas a la tarea por un trazo en ángulo recto.
export function EscenaCosto() {
  return (
    <>
      <div className={cn(FICHA, "ce-entra")} style={{ ...caja(40, 4, 180, 44), ...en(0.2) }}>
        <FileText {...ICONO} className="shrink-0 text-blue-soft" />
        <span className="flex-1">{e.proceso}</span>
        <Reloj />
      </div>
      <Trazo eje="y" style={{ ...caja(130, 48, 1, 18), ...en(1.65, { "--d": "0.2s" }) }} />
      <Trazo eje="x" origen="center" style={{ ...caja(64, 66, 133, 1), ...en(1.8, { "--d": "0.24s" }) }} />
      <Trazo eje="y" style={{ ...caja(64, 66, 1, 14), ...en(1.98, { "--d": "0.15s" }) }} />
      <Trazo eje="y" style={{ ...caja(196, 66, 1, 14), ...en(1.98, { "--d": "0.15s" }) }} />
      <Causa Icono={UserRound} texto={e.causas[0]} style={{ ...caja(6, 80, 116, 78), ...en(2.12) }} />
      <Causa Icono={Repeat} texto={e.causas[1]} style={{ ...caja(138, 80, 116, 78), ...en(2.3) }} />
    </>
  );
}

// ------------------------------------------------------------ 02

const PROCESOS: { texto: string; Icono: LucideIcon; x: number; y: number }[] = [
  { texto: e.proceso, Icono: FileText, x: 0, y: 34 },
  { texto: e.otros[0], Icono: Receipt, x: 136, y: 34 },
  { texto: e.otros[1], Icono: Package, x: 0, y: 92 },
  { texto: e.otros[2], Icono: CalendarDays, x: 136, y: 92 },
];

// 02 Elegimos por dónde empezar: cuatro procesos llegan en ola; la selección
// los recorre uno por uno (se cruza lo que dicen las personas con los
// documentos) y se queda en las cotizaciones, que se marcan "Primero"
// mientras las otras se apagan.
export function EscenaEmpezar() {
  return (
    <>
      {/* La selección: detrás de las fichas, 4 px más grande por lado. Su
          recorrido está en @keyframes ce-anillo. */}
      <span className="ce-anillo absolute rounded-[11px] border border-blue-soft bg-blue-bright/15" style={{ ...caja(-4, 30, 132, 54), ...en(1.1) }} />
      {PROCESOS.map(({ texto, Icono, x, y }, i) => (
        <div key={texto} className={cn("absolute", i > 0 && "ce-atenua")} style={{ ...caja(x, y, 124, 46), ...(i > 0 ? en(3.15 + (i - 1) * 0.04, { "--hasta": 0.4 }) : {}) }}>
          <div className={cn(FICHA, "ce-entra inset-0")} style={en(0.2 + ola(i))}>
            <Icono {...ICONO} className="shrink-0 text-blue-soft" />
            <span>{texto}</span>
          </div>
        </div>
      ))}
      <span className="ce-entra absolute rounded-full bg-blue px-2 py-px text-[13px] font-medium leading-snug text-white" style={{ left: 78, top: 22, ...en(3.15) }}>
        {e.elegido}
      </span>
    </>
  );
}

// ------------------------------------------------------------ 03

// Personas de tu equipo: círculos de 28 px que se montan un poco, sin nombre
// ni foto (no son personas reales). Llegan una tras otra, cada 0,12 s.
function Equipo({ n, left, top, t }: { n: number; left: number; top: number; t: number }) {
  return Array.from({ length: n }, (_, i) => (
    <span
      key={i}
      className="ce-entra absolute flex h-7 w-7 items-center justify-center rounded-full border border-line-2 bg-ink-2"
      style={{ left: left + i * 20, top, ...en(t + i * 0.12) }}
    >
      <UserRound size={14} strokeWidth={1.5} aria-hidden className="text-white/70" />
    </span>
  ));
}

// Hojas de cálculo y documentos regados (dx, dy desde el centro de la tabla).
const HOJAS: { Icono: LucideIcon; dx: number; dy: number; giro: number }[] = [
  { Icono: FileSpreadsheet, dx: -108, dy: -48, giro: -10 },
  { Icono: FileText, dx: 100, dy: -50, giro: 8 },
  { Icono: FileSpreadsheet, dx: -110, dy: 52, giro: 6 },
  { Icono: FileText, dx: 104, dy: 58, giro: -7 },
  { Icono: FileSpreadsheet, dx: -6, dy: 76, giro: 4 },
];

// Anchos de las celdas de cada fila (px): parecen datos sin decir ninguno.
const FILAS = [
  [46, 30, 22],
  [38, 36, 18],
  [50, 26, 24],
  [34, 32, 20],
];

// 03 Ordenamos antes de automatizar: el primer cuadro son las hojas regadas;
// se juntan en el centro y de ahí sale una sola tabla, que se llena fila por
// fila y se prueba (una marca menta por fila: probado con casos reales).
// Debajo llegan dos personas de tu equipo: se construye con tu gente.
export function EscenaOrdenar() {
  return (
    <>
      <div className="ce-escala absolute overflow-hidden rounded-lg border border-line-2 bg-ink-2" style={{ ...caja(30, 10, 200, 126), ...en(0.85) }}>
        <div className="flex h-6 items-center gap-2 border-b border-line bg-white/[0.04] px-3">
          {[40, 34, 28].map((w) => (
            <span key={w} className="h-[5px] rounded-full bg-blue-soft/45" style={{ width: w }} />
          ))}
        </div>
        {FILAS.map((celdas, i) => (
          <div key={i} className="ce-fila flex h-[25px] items-center gap-2 border-b border-line px-3 last:border-b-0" style={en(1.1 + ola(i))}>
            {celdas.map((w, j) => (
              <span key={j} className="h-[5px] rounded-full bg-white/20" style={{ width: w }} />
            ))}
            <Check size={14} strokeWidth={2} aria-hidden className="ce-marca ml-auto text-mint" style={en(2.1 + i * 0.22)} />
          </div>
        ))}
      </div>
      {HOJAS.map(({ Icono, dx, dy, giro }, i) => (
        <span
          key={i}
          className="ce-junta absolute flex items-center justify-center rounded-md border border-line-2 bg-ink-2"
          style={{ ...caja(115, 55, 30, 36), ...en(0.35 + i * 0.06, { "--dx": `${dx}px`, "--dy": `${dy}px`, "--inclinacion": `${giro}deg` }) }}
        >
          <Icono {...ICONO} className="text-blue-soft" />
        </span>
      ))}
      <Equipo n={2} left={30} top={142} t={3.15} />
    </>
  );
}

// ------------------------------------------------------------ 04

// 04 Tu equipo lo opera: el proceso ya funciona (marca menta) y se corre a la
// izquierda; abajo llega tu equipo, que lo opera; a la derecha, una flecha
// lleva al siguiente proceso, todavía en borrador (borde punteado): "Si
// quieres, seguimos con el siguiente" (lo que te llevas del 04).
export function EscenaSiguiente() {
  return (
    <>
      <div className={cn(FICHA, "ce-desliza")} style={{ ...caja(0, 50, 140, 44), ...en(0.3, { "--dx": "60px" }) }}>
        <Table2 {...ICONO} className="shrink-0 text-blue-soft" />
        <span className="flex-1">{e.proceso}</span>
        <Check size={14} strokeWidth={2} aria-hidden className="shrink-0 text-mint" />
      </div>
      <Equipo n={3} left={4} top={110} t={0.95} />
      <span className="ce-funde absolute text-[13px] font-medium leading-snug text-white/85" style={{ left: 76, top: 114, ...en(1.3) }}>
        {e.equipo}
      </span>
      <Trazo eje="x" style={{ ...caja(144, 72, 22, 1), ...en(1.9, { "--d": "0.2s" }) }} />
      <ChevronRight size={14} strokeWidth={1.5} aria-hidden className="ce-funde absolute text-blue-soft/70" style={{ left: 158, top: 65, ...en(2.05) }} />
      <div className="ce-entra absolute flex flex-col gap-1 rounded-lg border border-dashed border-blue-soft/60 p-2.5 text-[13px] font-medium leading-snug text-blue-soft" style={{ ...caja(172, 34, 88, 76), ...en(2.2) }}>
        <Plus {...ICONO} />
        <span>{e.siguiente}</span>
      </div>
    </>
  );
}
