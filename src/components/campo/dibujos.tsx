import { consultoria } from "@/content/copy";

// Los dibujos de línea de las páginas internas: los cuatro pasos de
// /consultoria (placas vistas en isométrico, sobre azul), las tarjetas de
// «después de la entrega», los iconos de las reglas de trabajo y las capas
// apiladas de «Cómo trabajamos».
//
// Como los del inicio (src/components/inicio/dibujos.tsx): cada trazo lleva
// pathLength="1" y la clase cm-traza, y se dibuja cuando su bloque entra en
// pantalla, en el orden de --i; lo punteado y las letras funden (cm-funde).
// Sin JavaScript están completos. Todos son decorativos (aria-hidden): lo
// que dicen ya lo dice el texto de al lado. Lo que parece dato va bajo el
// rótulo «Ejemplo» de su cuadro.

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;
const TRAZO = { fill: "none", stroke: "currentColor", strokeWidth: 1 };
const traza = (n: number) => ({ pathLength: 1, className: "cm-traza", style: i(n) });
const funde = (n: number) => ({ className: "cm-funde", style: i(n) });
const r = (v: number) => Math.round(v * 10) / 10;

// Una placa vista en isométrico: la cara de arriba es un rombo de medio lado
// `s` (en el plano) con centro en cx, cy.
const rombo = (cx: number, cy: number, s: number) => `M${cx} ${cy - s}L${r(cx + 1.732 * s)} ${cy}L${cx} ${cy + s}L${r(cx - 1.732 * s)} ${cy}Z`;
// Los dos cantos que se ven, de alto t.
const canto = (cx: number, cy: number, s: number, t: number) => `M${r(cx - 1.732 * s)} ${cy}v${t}L${cx} ${cy + s + t}L${r(cx + 1.732 * s)} ${cy + t}V${cy}M${cx} ${cy + s}v${t}`;
// Lo que va dibujado sobre la placa: el mismo plano, con origen en su centro.
const plano = (cx: number, cy: number) => `translate(${cx} ${cy}) matrix(0.866 0.5 -0.866 0.5 0 0)`;

function Placa({ cx, cy, s, t = 10, n = 0, punteada = false }: { cx: number; cy: number; s: number; t?: number; n?: number; punteada?: boolean }) {
  if (punteada) return <path d={rombo(cx, cy, s)} strokeDasharray="3 3" opacity="0.7" {...funde(n)} />;
  return (
    <>
      <path d={rombo(cx, cy, s)} fill="rgb(255 255 255 / 0.05)" strokeLinejoin="round" {...traza(n)} />
      <path d={canto(cx, cy, s, t)} opacity="0.5" strokeLinejoin="round" {...traza(n + 1)} />
    </>
  );
}

// Un rótulo en mono dentro de un dibujo.
function Letra({ x, y, n = 0, ancla = "start", color, tenue = false, children }: { x: number; y: number; n?: number; ancla?: "start" | "middle" | "end"; color?: string; tenue?: boolean; children: string }) {
  return (
    <text x={x} y={y} textAnchor={ancla} fontSize="8.5" letterSpacing="0.6" fill={color ?? "currentColor"} stroke="none" opacity={tenue ? 0.72 : 1} className="cm-funde" style={{ ...i(n), textTransform: "uppercase" }}>
      {children}
    </text>
  );
}

// Una marca con su guía punteada y su rótulo: (x, y) es el punto que señala
// y `hasta`, la altura a la que queda el rótulo.
function Nota({ x, y, hasta, n, fin = false, children }: { x: number; y: number; hasta: number; n: number; fin?: boolean; children: string }) {
  return (
    <>
      <circle cx={x} cy={y} r="2.5" fill="currentColor" stroke="none" {...funde(n)} />
      <path d={`M${x} ${y}V${hasta}`} strokeDasharray="2 4" {...funde(n)} />
      <Letra x={fin ? x - 8 : x + 8} y={hasta + 4} n={n + 0.5} ancla={fin ? "end" : "start"}>
        {children}
      </Letra>
    </>
  );
}

// ---------------------------------------------------------------- Pasos

// El dibujo de cada paso del método, sobre un mismo proceso de ejemplo.
// 01 Lo que se demora y lo que hay detrás. 02 Cuatro procesos; uno, primero.
// 03 Lo regado baja a un solo lugar, con las reglas escritas, y sale un
// borrador. 04 El proceso corre con una persona del equipo al mando, y al
// lado asoma el siguiente.
export function DibujoPaso({ n }: { n: number }) {
  const d = consultoria.recorrido.dibujo;
  return (
    <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid meet" {...TRAZO}>
      {n === 0 && (
        <>
          <Placa cx={200} cy={196} s={96} />
          <g transform={plano(200, 196)}>
            {[
              [-84, -78],
              [20, -78],
              [-84, 56],
              [20, 56],
            ].map(([x, y], k) => (
              <rect key={k} x={x} y={y} width="64" height="22" rx="3" strokeDasharray="3 3" opacity="0.5" {...funde(2 + k * 0.4)} />
            ))}
            <rect x="-52" y="-15" width="104" height="30" rx="3" fill="rgb(255 255 255 / 0.16)" {...traza(3)} />
            <Letra x={0} y={3} n={4} ancla="middle">
              {d.proceso}
            </Letra>
          </g>
          <Nota x={155} y={170} hasta={70} n={5}>
            {d.causas[0]}
          </Nota>
          <Nota x={245} y={222} hasta={104} n={6.5}>
            {d.causas[1]}
          </Nota>
        </>
      )}
      {n === 1 && (
        <>
          <Placa cx={200} cy={200} s={100} />
          <g transform={plano(200, 200)}>
            <rect x="-78" y="-66" width="156" height="24" rx="3" fill="#ffffff" stroke="none" {...funde(3)} />
            <Letra x={-68} y={-50} n={3.5} color="#02070a">
              {d.proceso}
            </Letra>
            {d.otros.map((nombre, k) => (
              <g key={nombre}>
                <rect x="-78" y={-32 + k * 34} width="156" height="24" rx="3" strokeDasharray="3 3" opacity="0.6" {...funde(4 + k * 0.6)} />
                <Letra x={-68} y={-16 + k * 34} n={4.3 + k * 0.6} tenue>
                  {nombre}
                </Letra>
              </g>
            ))}
          </g>
          <Nota x={314} y={212} hasta={96} n={6.5} fin>
            {d.elegido}
          </Nota>
        </>
      )}
      {n === 2 && (
        <>
          {[
            [86, 74],
            [200, 52],
            [314, 74],
          ].map(([x, y], k) => (
            <g key={k}>
              <Placa cx={x} cy={y} s={24} n={k * 0.5} punteada />
              <Letra x={x} y={y - 34} n={0.5 + k * 0.5} ancla="middle" tenue>
                {d.regado[k]}
              </Letra>
              <path d={`M${x} ${y + 24}V${k === 1 ? 162 : 222}`} strokeDasharray="2 4" {...funde(2 + k * 0.5)} />
              <circle cx={x} cy={k === 1 ? 162 : 222} r="2.5" fill="currentColor" stroke="none" {...funde(2.5 + k * 0.5)} />
            </g>
          ))}
          <Placa cx={200} cy={226} s={80} n={3} />
          <g transform={plano(200, 226)}>
            <rect x="-62" y="-50" width="72" height="100" rx="3" fill="rgb(255 255 255 / 0.1)" {...traza(4)} />
            <path d="M-50 -32H-4M-50 -16H-4M-50 0H-14M-50 16H-22" opacity="0.8" {...traza(5)} />
            <Letra x={-62} y={66} n={5.5}>
              {d.reglas}
            </Letra>
            <path d="M10 0H20" {...traza(6)} />
            <rect x="20" y="-13" width="58" height="26" rx="3" fill="#ffffff" stroke="none" {...funde(6.5)} />
            <Letra x={49} y={3} n={7} ancla="middle" color="#02070a">
              {d.borrador}
            </Letra>
          </g>
        </>
      )}
      {n === 3 && (
        <>
          <Placa cx={168} cy={206} s={84} />
          <g transform={plano(168, 206)}>
            <Letra x={-66} y={-22} n={2.5} tenue>
              {d.proceso}
            </Letra>
            {[-66, -18, 30].map((x, k) => (
              <rect key={x} x={x} y="-12" width="36" height="24" rx="3" fill="rgb(255 255 255 / 0.12)" {...traza(3 + k * 0.5)} />
            ))}
            <path d="M-30 0H-18M18 0H30" {...traza(4.5)} />
            <path d="M-66 0H66" pathLength={1} stroke="#ffffff" strokeWidth="2" strokeLinecap="round" className="animate-pulso" />
            <circle cx="-30" cy="50" r="16" opacity="0.8" {...traza(5)} />
          </g>
          <path d="M99 216V168" {...traza(5.5)} />
          <circle cx="99" cy="162" r="6" fill="#ffffff" {...traza(6)} />
          <Letra x={89} y={165} n={6.5} ancla="end">
            {d.equipo}
          </Letra>
          <Placa cx={330} cy={112} s={38} n={7} punteada />
          <path d="M300 190C328 182 332 170 330 154" strokeDasharray="2 4" {...funde(7.5)} />
          <Letra x={330} y={62} n={8} ancla="middle" tenue>
            {d.siguiente}
          </Letra>
        </>
      )}
    </svg>
  );
}

// ---------------------------------------------------------------- Después

// Las tres tarjetas de «después de la entrega»: la vuelta de la revisión, el
// paso a algo mejor y las personas.
export function DibujoDespues({ n }: { n: number }) {
  return (
    <svg viewBox="0 0 240 140" aria-hidden="true" {...TRAZO}>
      {n === 0 && (
        <>
          <circle cx="120" cy="70" r="54" strokeDasharray="2 4" opacity="0.5" {...funde(0)} />
          <path d="M158 70a38 38 0 1 1-11-27" {...traza(1)} />
          <path d="M148 28v15h15" {...traza(2)} />
          <path d="M106 70l10 10 18-20" stroke="var(--color-electrico)" {...traza(3)} />
        </>
      )}
      {n === 1 && (
        <>
          <rect x="34" y="62" width="52" height="52" rx="4" strokeDasharray="3 3" opacity="0.6" {...funde(0)} />
          <path d="M94 88H124M116 80l8 8-8 8" {...traza(1)} />
          <rect x="132" y="34" width="80" height="80" rx="4" fill="rgb(4 58 89 / 0.6)" {...traza(2)} />
          <path d="M172 92V58M160 70l12-12 12 12" stroke="var(--color-electrico)" {...traza(4)} />
        </>
      )}
      {n === 2 && (
        <>
          {[70, 120, 170].map((x, k) => (
            <g key={x} stroke={k === 1 ? "var(--color-electrico)" : undefined}>
              <circle cx={x} cy="50" r="9" {...traza(k)} />
              <path d={`M${x - 17} 92a17 17 0 0 1 34 0`} {...traza(k + 0.5)} />
            </g>
          ))}
          <path d="M40 106H200" opacity="0.7" {...traza(3)} />
          <path d="M87 62H103M137 62H153" strokeDasharray="2 4" opacity="0.7" {...funde(4)} />
        </>
      )}
    </svg>
  );
}

// ---------------------------------------------------------------- Reglas

// Los iconos de las seis reglas de trabajo: renglones escritos, tres casos
// que se cruzan, un borrador que alguien aprueba, una persona al centro, un
// dato dentro de su caja y un no.
export function IconoRegla({ n }: { n: number }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" {...TRAZO}>
      {n === 0 && (
        <>
          <path d="M18 32V20H30M102 32V20H90M18 88V100H30M102 88V100H90" opacity="0.5" {...traza(0)} />
          <path d="M30 38H90" {...traza(1)} />
          <path d="M30 54H90" {...traza(1.5)} />
          <path d="M30 70H74" {...traza(2)} />
          <path d="M30 86H58" {...traza(2.5)} />
        </>
      )}
      {n === 1 && (
        <>
          <circle cx="60" cy="44" r="26" {...traza(0)} />
          <circle cx="42" cy="74" r="26" {...traza(1)} />
          <circle cx="78" cy="74" r="26" {...traza(2)} />
          <circle cx="60" cy="64" r="3" fill="currentColor" stroke="none" {...funde(3)} />
        </>
      )}
      {n === 2 && (
        <>
          <rect x="18" y="18" width="84" height="84" rx="4" strokeDasharray="3 3" opacity="0.6" {...funde(0)} />
          <rect x="38" y="38" width="44" height="44" rx="3" {...traza(1)} />
          <path d="M49 60l8 8 15-17" stroke="var(--color-electrico)" {...traza(2.5)} />
        </>
      )}
      {n === 3 && (
        <>
          <ellipse cx="60" cy="66" rx="46" ry="20" opacity="0.5" {...traza(0)} />
          <ellipse cx="60" cy="66" rx="30" ry="13" {...traza(1)} />
          <ellipse cx="60" cy="66" rx="13" ry="5.5" {...traza(2)} />
          <path d="M60 66V18" {...traza(2.5)} />
          <circle cx="60" cy="18" r="3.5" fill="currentColor" stroke="none" {...funde(3.5)} />
        </>
      )}
      {n === 4 && (
        <>
          <circle cx="60" cy="60" r="46" opacity="0.5" {...traza(0)} />
          <rect x="34" y="34" width="52" height="52" rx="3" {...traza(1)} />
          <rect x="53" y="53" width="14" height="14" fill="var(--color-electrico)" stroke="none" {...funde(2.5)} />
        </>
      )}
      {n === 5 && (
        <>
          <circle cx="60" cy="60" r="50" strokeDasharray="2 4" opacity="0.5" {...funde(0)} />
          <circle cx="60" cy="60" r="38" {...traza(1)} />
          <path d="M33 87L87 33" {...traza(2.5)} />
        </>
      )}
    </svg>
  );
}

// ---------------------------------------------------------------- Capas

// Lo que queda montado: seis placas apiladas, de abajo hacia arriba, con su
// número a la izquierda. La de arriba (control y permisos) lleva la casilla
// aprobada, en eléctrico.
export function DibujoCapas({ className }: { className?: string }) {
  const capas = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 440 400" aria-hidden="true" className={className} {...TRAZO}>
      {capas.map((n) => {
        const cy = 310 - n * 40;
        return (
          <g key={n} className="cp-placa" style={i(n)}>
            <path d={rombo(220, cy, 88)} fill={n === 5 ? "rgb(10 110 166 / 0.55)" : "rgb(4 40 62 / 0.86)"} strokeLinejoin="round" opacity={0.5 + n * 0.1} />
            <text x="56" y={cy + 3} textAnchor="end" fontSize="9" letterSpacing="0.6" fill="currentColor" stroke="none" opacity="0.72" style={{ fontFamily: "var(--font-mono)" }}>
              0{n + 1}
            </text>
            {n === 5 && (
              <g transform={plano(220, cy)}>
                <rect x="-22" y="-22" width="44" height="44" rx="3" />
                <path d="M-11 0l8 8 15-17" stroke="var(--color-electrico)" strokeWidth="1.5" />
                <path d="M-64 -64H-40M64 64H40M-64 -64V-40M64 64V40" opacity="0.6" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
