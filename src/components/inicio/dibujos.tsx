import { ALTO_X, ANCHO_X, PIEZAS_X } from "@/lib/campo/particulas";

// Los dibujos de línea del inicio: la X de Daxlo, los iconos de los tres
// principios y los diagramas de las seis capas del sistema.
//
// Cada trazo lleva pathLength="1" y la clase cm-traza: se dibuja con
// stroke-dashoffset cuando su bloque entra en pantalla (campo.css), en el
// orden de --i. Lo punteado no se puede dibujar así y funde (cm-funde). Sin
// JavaScript están completos. Todos son decorativos (aria-hidden): lo que
// dicen ya lo dice el texto de al lado.

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;
const puntos = (p: [number, number][]) => p.map((q) => q.join(",")).join(" ");

// La X de Daxlo, en tres piezas: dos del color del texto y el brazo de
// arriba en azul eléctrico.
export function MarcaX({ className }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${ANCHO_X} ${ALTO_X}`} width={ANCHO_X} height={ALTO_X} aria-hidden="true" className={className}>
      {PIEZAS_X.map((pieza, n) => (
        <polygon key={n} points={puntos(pieza.puntos)} fill={pieza.azul ? "var(--color-electrico)" : "currentColor"} />
      ))}
    </svg>
  );
}

const TRAZO = { fill: "none", stroke: "currentColor", strokeWidth: 1 };
const linea = (n: number, extra?: React.CSSProperties) => ({ pathLength: 1, className: "cm-traza", style: { ...i(n), ...extra } });

// ---------------------------------------------------------------- Principios

// [01] La persona al centro del sistema: círculos concéntricos con un punto.
// [02] Leer, borrador, acción: un triángulo en tres franjas.
// [03] Revisar y mejorar: un hexágono con una vuelta que no se cierra.
export function IconoPrincipio({ n }: { n: number }) {
  return (
    <svg viewBox="0 0 180 180" aria-hidden="true" {...TRAZO}>
      {n === 0 && (
        <>
          <circle cx="90" cy="90" r="86" opacity="0.45" {...linea(0)} />
          <circle cx="90" cy="90" r="76" {...linea(1)} />
          <circle cx="90" cy="90" r="33" {...linea(2)} />
          <circle cx="90" cy="90" r="4" {...linea(3)} />
        </>
      )}
      {n === 1 && (
        <>
          <path d="M90 18 L168 156 Q171 162 164 162 L16 162 Q9 162 12 156 Z" strokeLinejoin="round" {...linea(0)} />
          <path d="M66 60 H114" {...linea(2)} />
          <path d="M62 102 H118" {...linea(3)} />
          <path d="M84 136 H96" {...linea(4)} />
        </>
      )}
      {n === 2 && (
        <>
          <path d="M160 90 L125 150.6 H55 L20 90 L55 29.4 H125 Z" strokeLinejoin="round" {...linea(0)} />
          <path d="M170 90 L130 159.3 H50 L10 90 L50 20.7 H130 Z" strokeLinejoin="round" opacity="0.5" {...linea(2, { "--largo": 0.8 } as React.CSSProperties)} />
        </>
      )}
    </svg>
  );
}

// ---------------------------------------------------------------- Capas

// Los seis diagramas del panel. Cada uno dibuja lo que dice su tarjeta.
export function DiagramaCapa({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 240 140" aria-hidden="true" {...TRAZO}>
      {id === "herramientas" && (
        <>
          {/* Cuatro ventanas en rejilla, punteadas: un sobre, una cuadrícula,
              un libro de cuentas y una carpeta. */}
          {[
            [8, 8],
            [126, 8],
            [8, 76],
            [126, 76],
          ].map(([x, y], n) => (
            <rect key={n} x={x} y={y} width="106" height="56" rx="3" strokeDasharray="3 3" opacity="0.6" className="cm-funde" style={i(n)} />
          ))}
          <path d="M42 26 H80 V46 H42 Z M42 26 L61 39 L80 26" {...linea(1)} />
          <path d="M160 24 H198 V48 H160 Z M160 32 H198 M160 40 H198 M173 24 V48 M186 24 V48" {...linea(2)} />
          <path d="M44 92 H78 V118 H44 Z M51 92 V118 M57 100 H72 M57 106 H72 M57 112 H67" {...linea(3)} />
          <path d="M160 96 H172 L176 100 H198 V118 H160 Z" strokeLinejoin="round" {...linea(4)} />
        </>
      )}
      {id === "conexiones" && (
        <>
          {/* Tres puntos, líneas que se juntan en una cápsula y salen en una
              flecha, con un pulso que la recorre. */}
          {[30, 70, 110].map((y, n) => (
            <circle key={y} cx="26" cy={y} r="4" {...linea(n)} />
          ))}
          <path d="M30 30 C70 30 80 58 112 62" opacity="0.7" {...linea(1)} />
          <path d="M30 70 H112" opacity="0.7" {...linea(2)} />
          <path d="M30 110 C70 110 80 82 112 78" opacity="0.7" {...linea(3)} />
          <rect x="112" y="28" width="18" height="84" rx="9" {...linea(4)} />
          <path d="M130 70 H206 M197 61 L206 70 L197 79" {...linea(5)} />
          <path d="M30 70 H206" pathLength={1} stroke="var(--color-electrico)" strokeWidth="2" strokeLinecap="round" className="animate-pulso" />
        </>
      )}
      {id === "conocimiento" && (
        <>
          {/* Tres láminas apiladas en perspectiva, con notas unidas por líneas
              en la de arriba. */}
          <path d="M120 10 L206 42 L120 74 L34 42 Z" strokeLinejoin="round" {...linea(0)} />
          <path d="M34 66 L120 98 L206 66" opacity="0.7" strokeLinejoin="round" {...linea(2)} />
          <path d="M34 90 L120 122 L206 90" opacity="0.45" strokeLinejoin="round" {...linea(3)} />
          <path d="M92 38 L120 28 L150 40 L124 52 Z M124 52 L112 62 M150 40 L172 44" opacity="0.8" {...linea(4)} />
          {[
            [92, 38],
            [120, 28],
            [150, 40],
            [124, 52],
            [112, 62],
            [172, 44],
          ].map(([x, y], n) => (
            <circle key={n} cx={x} cy={y} r="2" fill="currentColor" stroke="none" className="cm-funde" style={i(5 + n * 0.5)} />
          ))}
        </>
      )}
      {id === "agentes" && (
        <>
          {/* Una órbita con una hoja que entra, da la vuelta y sale con una
              casilla marcada. */}
          <ellipse cx="120" cy="70" rx="78" ry="34" {...linea(0)} />
          <ellipse cx="120" cy="70" rx="50" ry="20" opacity="0.45" strokeDasharray="2 4" className="cm-funde" style={i(2)} />
          <path d="M6 70 H30" opacity="0.7" {...linea(1)} />
          <path d="M12 58 H24 V66 M12 58 V82 H24 V74" opacity="0.7" {...linea(1)} />
          <path d="M210 70 H222" opacity="0.7" {...linea(3)} />
          <path d="M224 62 H240 V78 H224 Z M228 70 L231 74 L237 66" stroke="var(--color-electrico)" {...linea(4)} />
          <rect x="-6" y="-8" width="12" height="16" rx="1.5" fill="#06547f" className="animate-orbita" />
        </>
      )}
      {id === "modelos" && (
        <>
          {/* Cuatro tarjetas superpuestas; una sola con el trazo completo. */}
          {[0, 1, 2].map((n) => (
            <rect key={n} x={96 + (2 - n) * 14} y={18 + n * 12} width="104" height="62" rx="5" strokeDasharray="3 3" opacity={0.42 + n * 0.1} className="cm-funde" style={i(n)} />
          ))}
          <rect x="54" y="56" width="104" height="62" rx="5" fill="rgb(4 58 89 / 0.6)" {...linea(3)} />
          <path d="M46 62 V50 H58 M166 112 V124 H154" opacity="0.8" {...linea(4)} />
        </>
      )}
      {id === "control" && (
        <>
          {/* Un candado sobre tres escalones, con una línea de firma debajo. */}
          <path d="M60 112 H100 V92 H140 V72 H180" strokeLinejoin="round" opacity="0.7" {...linea(0)} />
          <rect x="108" y="38" width="24" height="20" rx="3" {...linea(2)} />
          <path d="M113 38 V31 a7 7 0 0 1 14 0 V38" {...linea(3)} />
          <rect x="96" y="14" width="48" height="52" rx="4" strokeDasharray="3 3" opacity="0.45" className="cm-funde" style={i(1)} />
          <path d="M70 130 C82 118 88 138 98 128 S112 122 120 130 H178" stroke="var(--color-electrico)" {...linea(5)} />
        </>
      )}
    </svg>
  );
}
