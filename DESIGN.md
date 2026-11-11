---
version: alpha
name: Daxlo
description: Sitio daxlo.co. Dirección «Encendido» — lo que se hace a mano está apagado y lo que ya funciona, encendido. Fondo casi negro, placas azules con filo de luz, papeles menta y un campo azul en el cierre. La cinta de luz del hero es la firma y de ella sale el hilo que baja por la página.
colors:
  primary: "#1B35D0"
  primary-bright: "#3D5AFF"
  primary-soft: "#8EA0FF"
  on-primary: "#FFFFFF"
  secondary: "#29C4F5"
  secondary-deep: "#0B7EA6"
  secondary-light: "#7FE0FF"
  tertiary: "#E2F3EE"
  neutral: "#0D0E14"
  surface: "#0D0E14"
  surface-container: "#12141C"
  surface-container-high: "#1A1D28"
  surface-deep: "#08090E"
  surface-panel: "#0E1019"
  surface-button: "#10121A"
  on-surface: "#FFFFFF"
  on-surface-muted: "rgba(255, 255, 255, 0.66)"
  on-surface-dim: "rgba(255, 255, 255, 0.5)"
  outline: "rgba(255, 255, 255, 0.14)"
  outline-variant: "rgba(255, 255, 255, 0.08)"
  error: "#FF8A9B"
typography:
  display-hero:
    fontFamily: Schibsted Grotesk
    fontSize: clamp(2.625rem, 6.2vw, 5.25rem)
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: -0.035em
  display-giant:
    fontFamily: Schibsted Grotesk
    fontSize: clamp(3.25rem, 14.5vw, 9rem)
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: -0.04em
  headline-page:
    fontFamily: Schibsted Grotesk
    fontSize: clamp(2.25rem, 5vw, 4rem)
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: -0.03em
  statement:
    fontFamily: Schibsted Grotesk
    fontSize: clamp(1.75rem, 3.1vw, 2.75rem)
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Schibsted Grotesk
    fontSize: clamp(2.1rem, 4.2vw, 3.5rem)
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: -0.025em
  headline-support:
    fontFamily: Schibsted Grotesk
    fontSize: clamp(1.7rem, 2.9vw, 2.5rem)
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.022em
  headline-row:
    fontFamily: Schibsted Grotesk
    fontSize: clamp(1.45rem, 2.5vw, 2.25rem)
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Schibsted Grotesk
    fontSize: 1.375rem
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.015em
  numeral:
    fontFamily: Schibsted Grotesk
    fontSize: clamp(3rem, 6vw, 4.5rem)
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.02em
  label:
    fontFamily: Schibsted Grotesk
    fontSize: 0.8125rem
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.08em
  body-lg:
    fontFamily: Schibsted Grotesk
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-md:
    fontFamily: Schibsted Grotesk
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: Schibsted Grotesk
    fontSize: 1.0625rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-xs:
    fontFamily: Schibsted Grotesk
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  caption:
    fontFamily: Schibsted Grotesk
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.005em
  label-button:
    fontFamily: Schibsted Grotesk
    fontSize: 1.0625rem
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
rounded:
  ficha: 8px
  control: 12px
  placa: 20px
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter-mobile: 20px
  gutter-tablet: 32px
  gutter-desktop: 48px
  rhythm-chapter-mobile: 88px
  rhythm-chapter-desktop: 144px
  rhythm-continue-mobile: 64px
  rhythm-continue-desktop: 96px
  rhythm-inner-mobile: 32px
  rhythm-inner-desktop: 48px
  closing-y-mobile: 96px
  closing-y-desktop: 160px
  section-y-mobile: 56px
  section-y-desktop: 96px
  section-y-desktop-lg: 128px
  section-y-tight-mobile: 40px
  section-y-tight-desktop: 64px
  section-y-continue-mobile: 48px
  section-y-continue-desktop: 80px
  section-y-base-desktop: 96px
  section-y-chapter-mobile: 64px
  section-y-close-mobile: 80px
  heading-gap: 16px
  heading-to-content-mobile: 40px
  heading-to-content-desktop: 56px
  measure-lead: 620px
  measure-body: 680px
  heading-chapter-max: 880px
  heading-support-max: 640px
  side-header-top: 112px
  faq-row-min: 64px
  row-open-y: 28px
  row-open-y-desktop: 36px
  diagram-text-min: 13px
  timeline-node: 12px
  timeline-gap: 32px
  scene-width: 260px
  scene-height: 172px
  strike-duration: 600ms
  press-duration: 120ms
  exit-duration: 150ms
  ui-duration: 200ms
  move-duration: 300ms
  enter-duration: 600ms
  headline-duration: 800ms
  magnet-max-x: 6px
  magnet-max-y: 4px
  hero-top-mobile: 112px
  hero-top-desktop: 176px
  card-padding: 28px
  card-padding-lg: 40px
  grid-gap: 20px
  touch-min: 44px
components:
  button-hero:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-button}"
    rounded: "{rounded.md}"
    padding: 18px 32px
    height: 65px
  button-hero-hover:
    backgroundColor: "{colors.primary-bright}"
    textColor: "{colors.on-primary}"
  button-glow:
    backgroundColor: "{colors.surface-button}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-button}"
    rounded: "{rounded.md}"
    padding: 16px 28px
    height: 61px
  button-glow-sm:
    backgroundColor: "{colors.surface-button}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-button-sm}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    height: 44px
  badge:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: 6px 14px
  card-glass:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-padding}"
  card-feature:
    backgroundColor: "{colors.surface-panel}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.card-xl}"
    padding: "{spacing.card-padding-lg}"
  row-open:
    backgroundColor: transparent
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body-md}"
    padding: 28px 0
  row-open-title:
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-sm}"
  pull-quote:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-sm}"
    padding: 24px 0 0
  pull-quote-filter:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-quote}"
    padding: 24px 0 0
  faq-row:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    typography: "{typography.label-button}"
    padding: 20px 0
    height: 64px
  faq-box:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    typography: "{typography.label-button}"
    rounded: "{rounded.lg}"
    padding: 16px 20px
    height: 56px
  diagram-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.lg}"
    padding: 16px
  diagram-node:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary-soft}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    size: 32px
  diagram-node-active:
    backgroundColor: "rgba(61, 90, 255, 0.15)"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
  timeline-step:
    backgroundColor: transparent
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body-sm}"
    padding: 32px 0 0
  recorrido-stage:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.caption}"
    rounded: "{rounded.lg}"
    padding: 40px 0 20px
    height: 232px
  recorrido-chapter:
    backgroundColor: transparent
    textColor: "{colors.primary-soft}"
    typography: "{typography.label-fase}"
    height: 64px
  door-card:
    backgroundColor: "rgba(18, 20, 28, 0.6)"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-padding-lg}"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 14px 16px
  nav-compact:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 10px 16px
---

# Daxlo — sistema visual de daxlo.co

Fuente de verdad del aspecto y del movimiento del sitio. Los valores salen del código
(`src/app/globals.css`, `src/components/ui/primitives.tsx`, `src/lib/utils.ts` y las
secciones). Si el código y este archivo no coinciden, se corrige el que esté mal y se
avisa: no se inventan valores nuevos sin decidirlos.

`Paleta de Colores Daxlo.txt` (raíz del repo) es la paleta del sitio anterior (naranja
#ff6b35, azul #64CEFB, "hero negro con video"). Ya no rige: no usar sus valores.

## Dirección «Encendido» (noviembre de 2026)

Esta sección manda sobre todo lo que sigue. Las secciones de más abajo
(Components, Diagramas, Motion) describen también las páginas que todavía no
se rediseñan (/coaching, /consultoria y las de apoyo): donde contradigan lo de
aquí, vale lo de aquí.

**La idea, en una frase.** Lo que hoy se hace a mano está apagado; lo que tu
gente ya sabe hacer con IA queda encendido. El sitio hace lo mismo: nace de la
cinta de luz del hero, un hilo de esa luz baja por la página y va encendiendo
lo que toca, y el final es un campo azul.

**Dos estados para todo.**

| | Apagado (a mano, todavía no) | Encendido (funciona, lo maneja tu gente) |
|---|---|---|
| Superficie | sin relleno, borde de 1 px blanco al 14 % | placa azul profunda con filo de luz cian arriba |
| Texto | blanco al 35 % (pasos y palabras que esperan su turno) | blanco |
| Número de paso | contorno | relleno |
| Movimiento | quieto | el filo se dibuja de izquierda a derecha y la placa funde |

**Cuatro objetos, siempre con la misma forma y el mismo color.** Es el
vocabulario propio de Daxlo: el escenario del ecosistema, los mini diagramas de
las puertas y la leyenda usan estos y solo estos.

| Objeto | Forma | Color | Qué es |
|---|---|---|---|
| Tu gente | círculo | blanco (en contorno hasta que aprende) | las personas de la empresa |
| El trabajo | ficha de 8 px de radio | menta #E2F3EE con texto casi negro (16,8:1) | una factura, una cotización, un informe. Es lo más claro de la pantalla y lo que se mueve |
| Agentes | placa de 12 px de radio | azul #3D5AFF a #1B35D0 con filo cian claro | la IA que hace una tarea completa |
| Automatizaciones | línea de 1 px | cian #29C4F5 | lo que lleva el trabajo de un lado a otro |

Las herramientas de la empresa son tejas oscuras (#12141C con borde): ya
estaban. Daxlo es su equis, al lado y fuera del marco de la empresa, unida por
una línea (sólida mientras monta; punteada cuando se queda al lado).

**El inicio, en cinco secciones** (src/app/page.tsx):

1. **Hero** (`hero.tsx`): cabe en la primera pantalla (`min(100svh, 900px)`,
   mínimo 640). La frase y el titular a todo el ancho; debajo, a la izquierda
   el sub, el botón y su nota, y a la derecha el recuadro que escribe, entero.
   La cinta pasa por detrás del recuadro (que es opaco) y lo rodea de luz. Al
   terminar de escribirse la primera tarea, un papel menta sale del borde
   inferior del recuadro: ahí nace el hilo. El fondo se funde en sus últimos
   160 px.
2. **Qué es Daxlo** (`manifiesto.tsx`): un solo párrafo en `statement`. El
   arranque es el h2, en blanco; lo que sigue se enciende palabra por palabra
   al cruzar la pantalla. Nada más: ni icono, ni botón, ni etiqueta.
3. **El ecosistema** (`ecosistema.tsx`, `pieza-pasos.tsx`): la pieza. Un
   escenario fijo, rotulado «Ejemplo», pasa de «a mano» a «encendido» en cuatro
   pasos mientras se baja. Ver «La pieza del ecosistema», abajo.
4. **Las dos puertas** (`intro.tsx`): dos filas a todo el ancho, no dos
   tarjetas. Cada fila es un solo enlace: la regla en `headline-row`, el
   servicio y su línea, un mini diagrama con los cuatro objetos y la flecha en
   un círculo. Apagada por defecto; se enciende con el puntero, con el foco o,
   en táctil, al cruzar el centro de la pantalla.
5. **Cierre** (`CtaFinal`): campo azul a todo el ancho. Es de todas las
   páginas.

Desde el 2026-11-11 no hay sección de quiénes somos: salió la parte de los
socios. Con nombre aparece solo el fundador, en la última línea de
/nosotros (que pasó a ser «Cómo trabajamos») y en los textos legales.

**La pieza del ecosistema.** HTML y CSS, sin SVG, canvas ni librerías.

- Tres carriles rectos (dos en celular): herramienta, agente y persona, con la
  línea de la automatización entre ellos y los papeles viajando. Por eso todo
  se mueve con `translate`, `scaleX` y `opacity`.
- Cuatro estados en `data-paso`: 0 Hoy (huecos punteados «A mano» y el
  desorden: seis papeles regados, girados entre -7° y 9° y fuera de su carril,
  que llegan uno por uno cuando el escenario entra en pantalla; cuatro en
  celular), 1 Lo montamos (cada papel endereza y viaja al arranque de su
  carril en 520 ms, delante del lector; llegan los agentes, las líneas se
  dibujan, el trabajo circula, aparece Daxlo), 2 Lo aprende tu gente
  (los círculos se rellenan, «Aprueba», el pulso de «Ajusta»), 3 Nos quedamos
  (la línea de Daxlo pasa a punteada, su rótulo alterna «Lo revisa» y «Lo
  mejora», aparece el carril «Siguiente proceso»).
- El marcado sale del servidor en el cuadro final (paso 3) con los cuatro pasos
  encendidos. `PiezaPasos` solo decide el paso activo con un
  `IntersectionObserver` que ve una línea de la pantalla (el centro en
  escritorio; el 72 % en celular, donde el escenario va fijo arriba) y marca
  `data-vivo`, `data-paso`, `data-activo` y `data-pausa`. Nada de scroll ni de
  trabajo por cuadro en JavaScript.
- Composición: en escritorio, los pasos en las columnas 1 a 4 (64vh cada uno)
  y el escenario en las columnas 5 a 12, `sticky` a 112 px; en celular, el
  escenario fijo arriba, a sangre y opaco, con una barra de cuatro puntos y el
  rótulo del paso. La composición fija la decide el CSS (`.js` y sin «reducir
  movimiento»), no la hidratación: nada cambia de lugar cuando React carga.
- Lo infinito (un papel por carril cada 2,4 s, desfasados; el pulso de Daxlo
  cada 6 s) corre solo en los pasos 1 a 3 y con el escenario a la vista.
- Con «reducir movimiento» o sin JavaScript: nada se fija, el escenario queda
  arriba en su cuadro final y los pasos van debajo, todos encendidos, en dos
  columnas.
- Accesibilidad: el escenario es `role="img"` con su descripción; lo de adentro
  y la leyenda no se anuncian. Los pasos son h3 y párrafos reales. Ningún
  rótulo baja de 13 px (en celular los papeles no llevan letra).
- Se apartó de la especificación en dos cosas: el escenario no sale a sangre
  por la derecha (en pantallas anchas quedaba una placa con un tercio vacío) y
  Daxlo va centrado bajo la columna de agentes también en celular.

**El hilo de luz** (`src/components/fondos/`). Una línea cian de 1 px que nace
en `[data-hilo-origen]` (el borde inferior del recuadro del hero), cruza al
margen izquierdo por el borde inferior del hero, baja por el margen (24 px a la
izquierda del texto desde 1280 px; a 10 px del borde de la pantalla por
debajo), alimenta cada línea de capítulo (`[data-hilo-capitulo]`) con una rama
que se apaga hacia la derecha, entra al campo azul y muere en el botón del
cierre (`[data-hilo-fin]`) con un punto de luz menta. Se dibuja con
`animation-timeline: scroll(root)`; JavaScript solo mide la página. Sin
soporte o con «reducir movimiento» queda dibujado y quieto. Va al final de la
raíz de la página, que tiene que ser `relative`. Hoy solo lo lleva el inicio.

**Contorno primero, relleno después.** Es «apagado → encendido» hecho
dibujo, y se usa como sistema: lo apagado va en contorno fino y lo encendido
se rellena con una capa que solo cambia de opacidad. Hoy lo llevan los
numerales (`Numeral`), las personas del ecosistema (círculo en contorno hasta
que aprenden), el hueco punteado que pasa a ser agente, los objetos de los
mini diagramas de las puertas, el círculo de la flecha de cada puerta y el
eslogan del pie. Falta el trazado por lados de cada placa al entrar (va con
el encendido de sección de la fase 4).

**Lo que salió** (no se usa en ninguna página): el orbe y la esfera de vidrio,
las píldoras sobre los titulares, el pie como tarjeta, la rejilla de fondo del
hero, el retrato, las cabeceras centradas y el degradado de texto fuera de la
segunda línea del h1 del inicio.

## Overview

Daxlo es una consultoría de IA colombiana con dos líneas: coaching 1 a 1 para
personas y consultoría de implementación para empresas. El sitio tiene siete
rutas y es estático (Next.js con exportación, Cloudflare Pages).

- Público: gente que lee, muchos de más de 45 años. Texto de 15 px como
  mínimo para leer y 13 px para rótulos.
- Tono: tuteo, frases cortas, situaciones de trabajo, sin palabras de
  consultora. Todo el texto vive en `src/content/copy.ts`.
- Sin cifras inventadas, sin clientes, sin testimonios, sin logos ni pantallas
  de clientes. Lo que parezca interfaz va rotulado «Ejemplo».
- Con nombre aparece solo el fundador, Santiago Ospina, y solo donde toca (la
  última línea de «Cómo trabajamos» y los textos legales).
- La cinta de luz del hero es la firma gráfica: grande y una vez. Todo lo
  demás que brilla ilumina un objeto o no va.

## Colors

Los colores de marca son fijos: casi negro #0D0E14, azul #1B35D0, cian #29C4F5
y menta #E2F3EE, con sus derivados. Ninguna paleta nueva. Cada color tiene un
oficio y dice qué es cada cosa, no en qué página estás (se retiró la regla de
«un acento por zona»):

- **Blanco:** el texto y la gente.
- **Menta #E2F3EE:** el trabajo (los papeles), las confirmaciones (los chulos)
  y el botón del cierre. Es la única superficie clara del sitio y siempre es
  un objeto pequeño, nunca una banda. Texto casi negro encima: 16,8:1.
- **Azul #1B35D0 y #3D5AFF:** lo encendido. Placas, agentes, el botón
  principal del hero y el campo del cierre.
- **Cian #29C4F5 y #7FE0FF:** la luz que se mueve. El hilo, los pulsos, los
  filos y el foco del teclado. Nunca de relleno ni detrás de texto.

Cinco niveles de superficie (variables en `:root`, globals.css):

| Nivel | Nombre | Valor | Dónde |
|---|---|---|---|
| 0 | Noche | `#0D0E14` (`--color-ink`) | fondo |
| 1 | Penumbra | `#12141C` (`--color-ink-2`) | ventanas, tejas de herramienta, campos |
| 2 | Placa apagada | sin relleno, borde `--borde-apagado` (blanco al 14 %) | lo que todavía es a mano |
| 3 | Placa encendida | `--placa-encendida`: `linear-gradient(180deg, #132069, #111949 50%, #0F132E)`, borde `--borde-encendido`, filo `--filo` | el escenario, la fila activa |
| 4 | Campo azul | `--campo-azul`: #1B35D0 con un realce radial #3D5AFF arriba a la derecha | el cierre de cada página, a todo el ancho |
| 5 | Papel | `#E2F3EE`, texto `#0D0E14` | fichas de trabajo, el botón del cierre |

Contraste: blanco sobre el campo azul, 8,5:1; blanco al 86 % sobre el campo
azul, 6,6:1; menta sobre azul, 7,4:1; cian sobre azul, 4,2:1 (solo trazos).
La cinta de luz conserva su tinte por línea en las portadas (shader) y sus
topes de contraste detrás de cada texto (`data-cinta-tope`).

## Typography

**Schibsted Grotesk en todo el sitio**: titulares, rótulos, números y cuerpo
(estudio de tipografía del 2026-11-11). Razones: su I mayúscula lleva remates,
así que «la IA» se lee IA y no «la lA»; es un solo archivo variable (peso 400
a 900, unos 46 KB el subconjunto latino, el único que se precarga) y no es una
de las letras «por defecto» de los sitios oscuros.

- La carga `src/app/layout.tsx` con `next/font/google` (se descarga al
  compilar y se sirve desde el propio sitio: la CSP no deja cargar nada de
  terceros). **Cambiar de familia es cambiar esa línea**: todo el sitio lee
  `--font-display` y `--font-sans`, que globals.css arma con `--fuente-marca`.
- Ninguna medida depende de las métricas de una familia: tamaños en rem y vw,
  tracking en em, anchos de lectura en `ch` y `em`, y `text-wrap: balance` en
  titulares.
- No tiene tamaño óptico: el ajuste por tamaño lo hace el tracking de cada
  nivel.
- Pesos: 400 cuerpo, 500 manifiesto, 600 titulares, rótulos y botones, 700
  numerales y el eslogan del pie, 800 portada gigante.

Cada token es una utilidad `text-*` de Tailwind que trae tamaño, interlineado,
tracking y peso (`@theme` en globals.css):

| Token | Tamaño | Peso | Interlineado | Tracking | Uso |
|---|---|---|---|---|---|
| `display-hero` | `clamp(2.625rem, 6.2vw, 5.25rem)` | 600 | 0,98 | -0.035em | h1 del inicio |
| `display-giant` | `clamp(3.25rem, 14.5vw, 9rem)` | 800 | 0,88 | -0.04em | «Para ti.» / «Para tu empresa.» |
| `headline-page` | `clamp(2.25rem, 5vw, 4rem)` | 600 | 1,02 | -0.03em | h1 de las páginas de apoyo |
| `statement` | `clamp(1.75rem, 3.1vw, 2.75rem)` | 500 | 1,18 | -0.02em | qué es Daxlo |
| `headline-lg` | `clamp(2.1rem, 4.2vw, 3.5rem)` | 600 | 1,04 | -0.025em | h2 de capítulo |
| `headline-support` | `clamp(1.7rem, 2.9vw, 2.5rem)` | 600 | 1,1 | -0.022em | h2 de apoyo; título de cada paso |
| `headline-row` | `clamp(1.45rem, 2.5vw, 2.25rem)` | 600 | 1,12 | -0.02em | la regla de cada puerta |
| `headline-sm` | 22 px | 600 | 1,25 | -0.015em | h3 |
| `numeral` | `clamp(3rem, 6vw, 4.5rem)` | 700 | 1 | -0.02em, cifras tabulares | números de paso |
| `label` (`.rotulo`) | 13 px, mayúsculas | 600 | 1,4 | 0.08em | rótulos |
| `body-lg` / `md` / `sm` / `xs` | 20 / 18 / 17 / 15 px | 400 | 1,55 / 1,6 | 0 | cuerpo |
| `caption` | 13 px | 400 | 1,4 | 0.005em | notas |

Reglas: ningún texto de lectura por debajo de 15 px y ninguno por debajo de
13 px. El degradado de texto queda solo en la segunda línea del h1 del inicio.
Sin fuente monoespaciada: los rótulos «técnicos» en mono son la marca más
común de sitio hecho con IA. El contorno de los números apagados y del
eslogan del pie: relleno del color del fondo y trazo de 2 px con
`paint-order: stroke fill` (queda 1 px limpio).

## Layout

**Vigente desde «Encendido»:**

- Contenedor de **1280 px**, 12 columnas, 24 px entre columnas. Márgenes
  (`--margen`): 20 px en celular, 32 px desde 768 px, 48 px desde 1280 px.
- A sangre: la cinta del hero, el campo azul del cierre y el escenario del
  ecosistema en celular.
- Todo a la izquierda; centrado no queda nada, tampoco el cierre.
  `SectionHeading` tiene dos formas: titular y bajada una debajo de la otra, o
  `alineacion="columnas"` (desde 1024 px, el h2 en las columnas 1 a 7 y la
  bajada en las columnas 9 a 12, alineada con la base del h2).
- Tres pasos de ritmo vertical (escritorio / celular): capítulo 144 / 88 px
  (`.seccion-capitulo`), continuación 96 / 64 px (`.seccion-continuacion`),
  interior 48 / 32 px (`--ritmo-interior`). El cierre lleva 160 / 96 px.
- Tres radios: 8 px (fichas), 12 px (botones, campos, agentes), 20 px (placas
  y ventanas). Utilidades `rounded-ficha`, `rounded-control` y `rounded-placa`.
- Filas antes que tarjetas: lo que es lista va en filas con línea de 1 px
  (`Fila`). Placa (`Placa`) solo para un objeto: un escenario, una ventana, un
  formulario.
- Primitivos (`src/components/ui/primitives.tsx`): `Placa` (`encendida`,
  `viva`), `Rotulo`, `Fila`, `Numeral`, y `GlowButton` con la variante
  `papel` (menta, solo sobre el campo azul).

Lo que sigue describe el ritmo de las páginas que todavía no se rediseñan.

- Contenedor de 1200 px de ancho máximo, con 20 px de margen lateral en celular y 32 px
  desde 768 px. Unidad base de 4 px (escala de Tailwind).
- **Ritmo vertical en cinco pasos** (celular / escritorio). Mucho aire entre bandas y
  poco dentro de cada bloque; más aire arriba de un titular que debajo.
  - Estrecho, 40–48 / 64 px: puente a la otra línea en /nosotros y en /herramientas
    (desde el 2026-11-06, las mismas dos tarjetas entre las fichas y el cierre).
  - Continuación, 48 / 80 px: la sección que sigue la idea de la anterior (escenas del
    problema tras la portada, "¿Esto es para…?"). Las escenas arrancan a 64 px en
    escritorio porque la portada ya deja 64 abajo.
  - Base, 56 / 96 px: preguntas de cada línea.
  - Capítulo, 64 / 96 px, con la **línea de capítulo** arriba: las dos puertas y
    quiénes somos (inicio), la sesión (/coaching), qué cambia y cómo trabajamos
    (/consultoria). Bajó de 112 a 96 px en escritorio al quitar texto: con secciones
    más cortas, 224 px entre una y otra se leían como huecos.
  - Cierre, 80 / 128 px, también con la línea.
- **Línea de capítulo (`LineaCapitulo`):** 1 px a lo ancho del contenedor, degradado
  transparente → tono → transparente (cian al 35 %, azul vivo al 45 % o blanco al 15 %).
  Es la misma luz que separa las zonas, más tenue. Las secciones que continúan una idea
  no la llevan.
- **Cabecera de sección:** 16 px del titular a la bajada; 40 px de la cabecera al
  contenido en celular y 56 px en escritorio. Bajada de 620 px como máximo; párrafo de
  una columna, 680 px. El h2 de capítulo llega a 880 px; el de apoyo, a 640 px.
- **Cabecera lateral** (preguntas de cada línea): desde 1024 px, dos columnas
  (0.8fr / 1.2fr, 64 px entre ellas): a la izquierda el h2 de apoyo y "Ver todas las
  preguntas", fijos a 112 px del borde superior mientras se leen las preguntas; a la
  derecha las preguntas en filas abiertas. En celular, una debajo de la otra. La
  cabecera sobre el contenido dejaba la mitad derecha vacía y alargaba la página.
- **Alineación:** a la izquierda todo lo que se lee como recorrido o lista (problema,
  qué cambia, cómo trabajamos, la sesión, "¿Esto es para…?", preguntas); centrados solo
  el cierre y la cabecera de las dos puertas del inicio. Por debajo de 640 px las
  cabeceras de sección van a la izquierda: una bajada de cinco líneas centrada cuesta
  leerla. El h1 centrado de /herramientas y /preguntas sigue centrado en todos los
  anchos, con sus migas.
- **Alternancia:** dos bandas seguidas no repiten el mismo contenedor. En /consultoria:
  escenas en filas abiertas, el hoy → después en filas con rótulos, el recorrido como
  secuencia animada (escenario, barra de capítulos y el texto del paso), "¿Esto es para
  tu empresa?" (cita y filas) y las preguntas con
  cabecera lateral. En /coaching: escenas, la sesión (ventana y pasos), dos columnas
  y preguntas con cabecera lateral. Pendiente del OK de
  Santiago, sin aplicar: una banda en #12141C (`surface-container`) detrás del hoy →
  después. Nunca una banda clara ni menta.
- **Portada de cada línea** (/coaching, /consultoria): migas, nombre del servicio,
  titular gigante (sin orbe: la primera línea arranca al ras del contenedor y la
  segunda conserva su sangría), sub de una o dos frases (en consultoría, con dos
  procesos de ejemplo) y, en la primera pantalla, la acción: el botón de luz grande "Agendar una
  conversación" con la línea ya elegida, la nota de la línea bajo el botón y el enlace
  "Ver cómo es una sesión" / "Ver cómo trabajamos" hacia su sección. La nota va en
  `body-xs`, en tramos: el primero (lo que cuesta empezar: "Llamada de 15 minutos sin
  costo" / "Primera conversación sin costo") con el chulo menta y, debajo, alineados con
  su texto, los demás (coaching: formato y forma de pago; consultoría: "Precio cerrado
  antes de construir"), separados por "·" desde 640 px y uno por renglón en celular.
  Ningún renglón empieza con el separador. El límite completo ("Si no te servimos, te lo
  decimos") no va aquí: va una vez, en el cierre. Orden en el DOM: botón, nota, enlace;
  en celular se ven así, con el botón a lo ancho; desde 640 px una rejilla pone el
  botón y el enlace en una fila y la nota debajo. Detrás, la cinta de luz con el
  tinte de la línea (ver Motion).
- **Densidad:** como máximo un párrafo de dos líneas por sección y ninguna bajada si el
  h2 se entiende solo. Cada sección cabe en un pantallazo de 1440 × 900 y en 1,5 de
  celular.
- Hero: 112 px arriba en celular (96 px por debajo de 360 px), 176 px en escritorio. El
  botón "Agendar una conversación" queda dentro de la primera pantalla en todos los
  tamaños, también en 320 × 568.
- Rejillas de tarjetas con 16–20 px de separación; tarjetas con 28 px de relleno (40 px
  en las destacadas).
- Todo lo que se toca mide al menos 44 × 44 px, también los enlaces de texto sueltos
  ("Para qué sirve cada una", "Ver todas las preguntas", "Inicio" de las migas, con
  margen negativo para no mover la línea).
- El orden de las secciones es fijo. Inicio: hero, dos puertas, quiénes somos, cierre.
  /coaching: portada, escenas, la sesión (#como-funciona), "¿Esto es para ti?"
  (#para-ti), preguntas, cierre. /consultoria: portada, escenas, qué cambia
  (#que-automatizamos), cómo trabajamos (#como-trabajamos), "¿Esto es para tu empresa?"
  (#para-tu-empresa), preguntas, cierre. Un solo final: preguntas y cierre, sin botón de
  calificación, sin puente aparte ni marquesina antes.
- **Quiénes somos (inicio):** desde 768 px, retrato de 240 px a la izquierda y texto a
  la derecha; en celular, el retrato va a la izquierda como el texto, de 150 px de
  ancho (200 px de alto). Centrado y de 195 px ocupaba la pantalla entera antes del
  titular.

## Elevation & Depth

La profundidad viene de la luz y de capas translúcidas, no de sombras grises.

- **Resplandores:** degradados radiales sin `filter: blur` (función `glow()` de
  `src/lib/utils.ts`), en cian o azul. Contención: solo en la portada (uno por zona,
  arriba) y en el cierre de cada página, más el halo de la ventana de la sesión. Nunca
  detrás de cada panel.
- **Vidrio (`.glass`):** degradado blanco del 4,5 % al 1,5 % con borde blanco al 8 %.
- **Sombras:** solo oscuras y anchas para separar ventanas del fondo
  (`0 30px 80px rgba(0,0,0,0.55)`), y halos de color en el botón principal. Ninguna
  sombra se anima: el halo abierto del botón principal es una capa aparte que solo
  cambia de opacidad.
- **Barra de navegación:** transparente arriba; al bajar, píldora casi negra al 97 % (75 %
  con desenfoque desde 768 px). El vidrio (fondo, borde, sombra y desenfoque) es una capa
  que funde en 200 ms.
- **Escalones de superficie:** casi negro, vidrio y #12141C al 60 % (las dos puertas
  del inicio). Lo destacado sube un escalón; no gana insignia ni color nuevo. Nada de
  cajas dentro de cajas.
- **Filo de luz:** solo en los botones de luz (1 px de blanco que se apaga hacia los
  lados).
- **Final de zona:** los resplandores de cada zona se apagan en sus últimos 240 px
  (máscara) y la zona de consultoría (#08090E) se funde en 140 px al casi negro: nada
  termina en un borde horizontal duro. El cierre de cada página hace lo mismo con sus
  resplandores (`mask-b`) antes del pie.
- **La cinta de luz** es la capa más profunda del hero y de la portada de cada línea:
  queda detrás del texto (y de las ventanas de la maqueta del hero), encima del
  resplandor de la zona, y se oscurece sola donde hay texto.

## Shapes

Esquinas suaves y consistentes por tamaño:

- 8 px: fichas y chips de las maquetas.
- 12 px: botones, campos, tejas de icono.
- 16 px: ventanas de las maquetas, recuadro de cada
  pregunta en /preguntas, barra de navegación, menú.
- 24 px: las dos puertas del inicio (las únicas tarjetas, porque son enlaces) y el
  retrato de quiénes somos.
- 28 px: paneles destacados (ventana de la sesión, puente a la otra línea en
  /nosotros, pie).
- 22 px (`card-sm`) y 26 px (`card-lg`) quedan solo en páginas fuera de esta pasada (el
  recuadro de ayuda de /preguntas, /privacidad y el formulario de /agendar), y las fichas
  de /herramientas usan 20 px. Al tocarlas pasan a 24, 28 y 16; después se retiran
  `card-sm` y `card-lg`.
- Píldora completa: etiquetas y puntos de estado.

## Components

- **Botón principal del hero (`button-hero`, `GlowButton variante="principal"`):** relleno
  degradado del azul de marca al azul vivo (120°: #1B35D0 → #2A47EA → #3D5AFF), borde de
  1 px cian → blanco al 45 % → azul claro, texto blanco Schibsted Grotesk 500 de 17 px (8,5:1 sobre
  #1B35D0, 5,1:1 en el peor punto del degradado). Halo de luz cian y azul alrededor (por
  debajo de 640 px, corto: no cae sobre el subtítulo ni sobre la nota), foco de luz
  interior arriba, fijo al 85 %. 65 px de alto desde 360 px (60 px por debajo, para
  seguir en la primera pantalla en 320 × 568). Hover (solo con mouse): el botón se corre
  hacia el puntero (imán, ver Motion), el relleno se aclara a #2A47EA → #4560FA (4,9:1),
  el halo se abre y el foco de luz sube a 100 %, en 200 ms; ya no sube 2 px ni lo cruza
  un barrido de brillo, y el foco de luz ya no respira. Al presionar baja a 0.98. Foco del
  teclado: anillo blanco de 2 px a 3 px entre dos bandas casi negras (sombra de 7 px
  #0D0E14), esquinas de 12 px, relleno claro y foco de luz a 100 %, todo en el primer
  cuadro (no sube ni funde); el anillo cian del resto del sitio se perdía contra el halo
  cian del botón y contra la cinta. Uno solo por pantalla.
- **Botón de luz (`button-glow`):** el resto de botones. Relleno #10121A, borde degradado
  (`.border-gradient`, por tono: dual, cian o azul), foco de luz arriba y línea blanca de
  1 px en el borde superior. Hover (solo con mouse, y sin "reducir movimiento"): sube
  2 px y el foco pasa a opacidad total, en 200 ms. Al presionar baja a 0.97 y el foco se
  enciende. En los llamados con imán (portada y cierre) no sube: se corre hacia el
  puntero.
- **Etiqueta (`badge`):** píldora con borde degradado sobre casi negro, mayúsculas.
  Marca la línea del hero y va sobre el h1 de las páginas sin portada (/herramientas,
  /preguntas, /agendar, /nosotros). Las cabeceras de sección bajo el hero no llevan
  etiqueta encima del titular: si traía una palabra de búsqueda, esa palabra va en el
  h2 o en la bajada. Fuera de esta pasada, el puente a la otra línea de /nosotros
  todavía la lleva sobre su título; se quita cuando se toque esa página.
- **Puerta del inicio (`door-card`):** tarjeta plana, borde blanco al 14 %, #12141C al
  60 %, 24 px de radio, 24 px de relleno en celular, 32 px desde 640 px y 40 px desde
  768 px, sin vidrio ni resplandor. Abre con el pictograma de la regla (SVG de 120 × 56,
  decorativo: un nodo unido a una barra en coaching; tres nodos que llegan a la misma
  barra en consultoría) y la regla escrita en 15 px, en la misma fila; sin píldora de
  audiencia encima. Después, el h3 en Schibsted Grotesk 28/32 px, la línea en 18 px atenuado y el
  enlace en el tono de la línea. El enlace se estira sobre toda la tarjeta
  (`after:inset-0`) y conserva su nombre accesible. Con mouse o foco el borde toma el
  tono en 200 ms (con foco del teclado, de una vez); la flecha se corre 4 px solo con el
  mouse (quieta con "reducir movimiento"); al presionar, la tarjeta baja a 0.99. La
  aparición va en un envoltorio aparte (`div[data-revelar]`): en el mismo elemento, su
  transición le ganaba a la del borde.
- **Tarjeta de vidrio (`card-glass`):** superficie base del puente a la otra línea en
  /nosotros y /herramientas y de la ayuda de /preguntas. Si es enlace, en hover cambia el borde al tono
  de su línea en 200 ms y al presionar baja a 0.99 (`.tarjeta-pulsable`); si no, no
  responde al mouse. Las fichas de /herramientas ya no cambian de borde ni encienden su
  resplandor al pasar: no son enlaces.
- **Fila abierta (`row-open`):** sin fondo ni caja, con regla superior de 1 px blanca al
  8 % y un tramo de 40 px del tono de la línea encima de esa regla. 28 px de aire (36 px
  en escritorio) en las escenas; 24–28 px en las razones. Título en `headline-sm`
  (`headline-md` desde 768 px) a la izquierda y texto a la derecha desde
  1024 px (columnas 0.9fr / 1.1fr); en celular, uno debajo del otro. Sirve para las
  escenas del problema, los pasos de la sesión, "Es para… si / No es para… si" y el hoy →
  después de /consultoria: rejilla [1fr 48px 1fr] desde 1024 px, hoy en blanco al 75 % y
  tachado con la raya al 40 % (al 66 % con la raya al 45 % costaba leerlo), flecha azul
  claro y después en blanco (en celular, uno debajo del otro, con la raya de 10 × 2 px).
  Cada "hoy" cabe en una línea desde 1024 px. Tres filas: una concreta y dos de
  organización. La lista no lleva regla inferior cuando la sección siguiente abre con
  línea de capítulo.
- **Viñeta de puntos:** raya de 10 × 2 px del tono de la línea (cian, azul claro o
  menta), a la altura del centro de la primera línea. Reemplaza el destello de cuatro
  puntas.
- **"¿Esto es para…?" (`ParaQuien`):** sin tarjeta, sin botón propio y sin
  resplandor. "No es para… si" va en filas abiertas con un guion (`Minus`) blanco al
  50 % y texto de 17 px blanco al 85 %; "Es para ti si", con el chulo del tono. La última
  fila de "No es para… si" termina en el enlace a la otra línea (tono de la zona, 44 px
  de alto; en una línea desde 640 px y partido en celular si no cabe, con la flecha
  fija). En /consultoria, la pregunta que filtra va como cita. La franja de los socios
  salió el 2026-11-11.
  La columna usa una pista que puede encogerse (`minmax(0, 1fr)`): nada se sale en
  320 px. Los límites se escriben como límites, nunca como ventaja.
- **Cita (`pull-quote`):** Schibsted Grotesk 500 de 22 px (`headline-sm`) en blanco, con regla
  superior de 1 px blanca al 14 % y 24 px de aire. Para la pregunta que filtra en
  /consultoria (`pull-quote-filter`: 28 px desde 768 px, un escalón por debajo del h2 de
  apoyo de 40 px y dos por encima del cuerpo), el remate de la sesión y la firma de
  quiénes somos,
  siempre en `<p>`: son palabras de Daxlo, no citas de otra fuente. Reemplaza las
  franjas laterales de color.
- **Recorrido animado (/consultoria, #como-trabajamos):** los cuatro pasos del método
  como un video corto (`src/components/sections/recorrido.tsx`, escenas en
  `recorrido-escenas.tsx`). Tres piezas:
  - **Escenario (`recorrido-stage`):** panel de diagrama (casi negro al 95 %, borde
    blanco al 14 %, 16 px de radio) con la rejilla del hero tenue y apagada hacia los
    bordes, y el rótulo "Ejemplo" arriba a la derecha (píldora rellena de azul claro al
    10 %, sin borde, 13 px). Alto fijo: 232 px en celular, 268 px desde 375 px, 320 px
    desde 640 px y 352 px desde 1024 px. Es `aria-hidden`: lo que cuenta ya está en el
    texto de cada paso.
  - **Barra de capítulos:** debajo del escenario, como la de un video. A la izquierda,
    el botón de pausa (44 × 44, 12 px de radio, borde blanco al 14 %, ícono de 16 px;
    "Pausar la animación" / "Seguir la animación" / "Volver a ver" al terminar). A la
    derecha, un botón por paso (64 px de alto, todo el ancho de su tramo): el nodo de
    12 px (borde azul claro, relleno #08090E; lleno de azul claro si ya pasó o es el de
    ahora, y el de ahora con un halo de 24 px al 20 %), la pista de 1 px en azul claro al
    30 % y lo corrido en 2 px de azul claro, y el número en `label-fase` (blanco el de
    ahora). El nombre accesible es "Ver el paso 01: …" y el de ahora lleva
    `aria-current="step"`. El tramo del último paso llega hasta el final, como el de un
    video.
  - **Texto del paso:** el `<ol>` de siempre, con los cuatro pasos completos: número en
    `label-fase`, h3 en `headline-sm`, una línea en `body-sm` atenuado y "Te llevas"
    (Schibsted Grotesk 500 de 15 px en azul claro, sin mayúsculas) con el entregable en 17 px
    blanco. Los cuatro van apilados en la misma celda (toma el alto del más largo) y se
    ve el del momento; los otros quedan en opacidad 0, en el DOM y para lectores de
    pantalla (no se anuncia el cambio: no hay `aria-live` en algo que avanza solo).
  Desde 1024 px el escenario y la barra van a la izquierda (1.3fr) y el texto a la
  derecha (1fr), centrado con el escenario, 56 px entre columnas. Por debajo, uno debajo
  del otro: escenario, barra y texto; en 390 px todo cabe en una pantalla. Sin
  JavaScript (sin `.js`) no se pintan ni el escenario ni la barra y el `<ol>` es la
  **línea de tiempo (`timeline-step`)** de antes: desde 1024 px, cuatro columnas con
  32 px entre ellas y un nodo de 12 px arriba de cada una, unidos por 1 px de azul claro
  al 40 %; en celular, lista vertical con la línea a 15 px del borde y 40 px de
  sangría. La clase `.js` la pone el layout antes de pintar: el reproductor sale armado
  del HTML y nada salta al hidratar.
- **Pregunta (acordeón):** botón dentro de un h3 (Schibsted Grotesk 500 de 17/18 px, blanco) con
  un "+" blanco al 60 % que gira 45° al abrir (200 ms, antes de que termine de abrir;
  baja a 0.9 al presionar; quieto con "reducir movimiento" y con el teclado). Dos
  formas:
  - `faq-row` (/coaching y /consultoria): fila abierta, regla de 1 px blanca al 8 %
    arriba de la lista y debajo de cada pregunta, sin relleno lateral, 64 px de alto
    como mínimo; respuesta en 17 px atenuado hasta 64 caracteres por línea. Al pasar,
    el "+" se pone blanco. Nueve recuadros apilados se leían como una pila de
    tarjetas.
  - En las dos: si al terminar de abrir se ven menos de 96 px de la respuesta (la
    última pregunta, en celular, abre pegada al borde de abajo), la respuesta se trae a
    la vista lo justo (`scrollIntoView`, `nearest`), sin animar con "reducir
    movimiento". Sin eso, el toque parecía no hacer nada.
  - `faq-box` (/preguntas, fuera de esta pasada): recuadro de 16 px de radio, borde
    blanco al 8 % (14 % al pasar o abierta, en 200 ms) y fondo blanco al 3,5 % abierta;
    al presionar, el fondo se aclara al 4 % al instante.
- **Enlace de WhatsApp del cierre:** solo en el cierre del inicio, /coaching y
  /consultoria (`CtaFinal whatsapp`); /preguntas ya tiene su botón en la ayuda y
  /herramientas y /nosotros no lo llevan. Texto de 15 px blanco al 75 % con subrayado
  siempre visible (blanco al 30 %, 5 px por debajo) que se pone blanco al pasar; 44 px
  de alto. Sin subrayado se leía como otra nota y no como enlace.
- **Línea de datos bajo el botón:** `body-xs` blanco al 70 %, chulo menta delante del
  primer tramo, separadores "·" en blanco al 40 % ocultos a lectores de pantalla (ver
  Portada de cada línea, en Layout).
- **Números:** 01–04 del recorrido de /consultoria y 1–3 de la sesión de coaching,
  porque ahí el orden importa. No hay numerales decorativos ni en degradado.
- **Qué pasa después de enviar (/agendar):** debajo del formulario, que sigue arriba,
  la línea de nodos del recorrido sin JavaScript con tres puntos (envías tus datos,
  eliges el día y la hora o te escribimos por WhatsApp, conversamos sin costo). Nodos
  de 12 px iguales y línea de 1 px en blanco tenue (borde al 50 %, línea al 25 %), como
  el grupo "Coaching o consultoría" de /preguntas: la página es de las dos líneas. En
  fila desde 640 px; en celular, uno debajo del otro con la línea a la izquierda. Sin
  números: la línea ya dice el orden.
- **Enlace a cada línea en /preguntas:** bajo el título del grupo de cada línea, "Ver
  el coaching" o "Ver la consultoría" (el texto de las puertas del inicio), como "Ver
  todas las preguntas": 16 px en el tono del grupo, flecha, 44 px de alto. El grupo que
  decide entre las dos va primero y sin enlace; bajo el h1, la bajada con qué es Daxlo y
  la regla.
- **Campos:** casi negro al 70 %, borde blanco al 14 %, foco con borde cian al 60 %; error
  con #FF8A9B. Etiqueta visible siempre.
- **Barra de navegación (`nav-compact`):** se encoge a píldora al bajar 24 px (lo avisa un
  IntersectionObserver sobre un centinela de 24 px arriba del documento, solo al cruzar el
  umbral; nada corre en cada cuadro de scroll): ancho y relleno en 300 ms con la curva de
  mover, el vidrio funde en 200 ms. El vidrio es una
  capa centrada que mide siempre el ancho compacto (hasta 1000 px), así su esquina no se
  mueve y Chrome no lo cuenta como layout shift; desde 1240 px el encogimiento se ve con
  `scale` (1.2 → 1). La entrada de la barra no se queda rellenando al terminar
  (`animation-fill-mode: backwards`): si no, la barra se vuelve raíz del
  `backdrop-filter` y el vidrio deja de desenfocar. El menú de celular
  sale del botón (origen en el centro de la hamburguesa), y el ícono ☰/✕ se cruza en
  150 ms en la misma celda. La hamburguesa baja a 0.95 al presionar; las filas del menú
  se aclaran al presionar, sin escala y sin bajar de opacidad (`active:opacity-100`: no
  son enlaces de texto).
- **Enlaces de texto:** al tocar bajan a opacidad 0.7 y vuelven al soltar, sin
  transición, como un enlace nativo. Los que llevan flecha la corren 4 px solo con el
  mouse.

### Diagramas y maquetas

- Muestran el mecanismo o lo que el cliente tiene en la mano, no una tecnología.
  /consultoria no lleva un diagrama del método: "Cómo elegimos el primer proceso"
  (reunión frente a documentos, y las cuatro preguntas que lo filtran) no cabía en 1,5
  pantallas de celular y tres lectores de prueba no le sacaron nada; vive en la pregunta
  "¿Cómo identifican qué proceso cambiar primero?" y en una cláusula del paso 02. Si
  vuelve algo visual de ese contraste, tiene que caber en la regla de densidad.
- **Escenas del recorrido de /consultoria:** maquetas ilustrativas, una por paso, con el
  mismo proceso genérico de punta a punta (las cotizaciones, de la lista de "¿Por dónde
  empieza…?"), sin cifras ni resultados y con "Ejemplo" a la vista. Fichas de 8 px de
  radio (#12141C, borde blanco al 14 %, Schibsted Grotesk 500 de 13 px blanco al 85 %), íconos de
  16 px en azul claro con trazo de 1,5, trazos de 1 px en azul claro al 50 % con
  bifurcaciones en ángulo recto, personas como círculos de 28 px sin cara ni nombre, y
  menta solo en las marcas de "probado" y "funciona". Guion:
  01 llega la tarea que se demora ("Cotizaciones"), el reloj corre y debajo aparecen las
  dos causas del texto (un cliente que espera, un error que se repite);
  02 cuatro procesos llegan en ola, la selección los recorre y se queda en las
  cotizaciones ("Primero") mientras los otros se apagan;
  03 hojas de cálculo y documentos regados se juntan en una sola tabla, que se llena,
  se prueba fila por fila y recibe a dos personas del equipo;
  04 el proceso ya funciona y se corre a un lado, llega "Tu equipo" a operarlo y una
  flecha lleva al "Siguiente proceso", en borde punteado.
  Cada escena se dibuja en una caja de 260 × 172 px que se agranda con `zoom` (1, 1.2
  desde 375 px, 1.45 desde 640 px, 1.6 desde 1024 px): el texto nunca baja de 13 px.
- Rótulos genéricos y estructura honesta: sin cifras, porcentajes, horas, nombres de
  empresa ni pantallas de clientes. Un ejemplo lleva el rótulo de ejemplo a la vista.
- Panel (`diagram-panel`): casi negro al 95 %, borde blanco al 14 %, 16 px de radio.
  Texto de 13 px como mínimo (líneas de 14–15 px). Microrrótulos en mayúsculas: como
  máximo uno por sección ("Hoy" / "Después", "Te llevas"). Texto estático nunca en
  píldoras con borde: se leen como botones o filtros. La ventana de la sesión es
  `aria-hidden`: lo que cuenta ya está en los pasos.
- Trazos de 1 px con `vector-effect: non-scaling-stroke`, en azul claro al 30–60 % en
  consultoría (cian en coaching). Las bifurcaciones van en ángulo recto. Nodos de 32 px
  con 12 px de radio; uno solo destacado por diagrama.
- Consultoría se cuenta en clave de empresa, no de documentos: qué cambia en la empresa
  (hoy → después: quién arma y quién aprueba, dónde viven las reglas, quién está a
  cargo), con qué se construye y qué te llevas de cada paso.
- Los puntos de ventana de macOS van solo en la maqueta del hero. La ventana de la
  sesión no los lleva, ni "En vivo" ni un pulso animado: es un ejemplo y no debe leerse
  como una sesión real. Es solo el chat, sin barra lateral de temas (el ojo la
  emparejaba con los pasos 1-2-3), y el ejemplo no es de contabilidad: un informe de
  cada semana con datos de tres hojas de cálculo. Desde el 2026-11-06 la conversación
  termina con una ficha de las maquetas ("Instrucciones guardadas para el próximo
  lunes": 8 px de radio, borde blanco al 14 %, ícono cian y la marca menta de listo),
  alineada con las burbujas de Daxlo y que crece como ellas: muestra lo que te llevas
  para repetirlo (paso 3).

## Motion

**Lo que suma «Encendido»** (todo con `transform` y `opacity`, o CSS atado al
scroll; nada por cuadro en JavaScript fuera de la cinta):

| Qué | Cómo | Tiempos | Sin soporte o con «reducir movimiento» |
|---|---|---|---|
| El hilo | `animation-timeline: scroll(root)`; cada tramo es una línea que se desliza dentro de su caja | sigue el scroll | dibujado y quieto |
| La frase que se enciende | cada palabra, de 0,35 a 1 de opacidad en su tramo del paso del párrafo por la pantalla (línea de tiempo con nombre) | sigue el scroll | todas encendidas |
| Ecosistema | `data-paso` cambia el cuadro; llegadas de 6 px y 0,96 (200 ms opacidad, 300 ms forma), trazos con `scaleX` | por estado; papeles cada 2,4 s; pulso de Daxlo cada 6 s | cuadro final quieto, sin nada fijo |
| Puertas | `--on` 0 o 1: la placa funde, el filo se dibuja, el mini diagrama se rellena en ola, la flecha avanza 4 px | 200 ms; filo 600 ms | cambia de una vez |
| Papel del hero | sale de detrás del recuadro y baja 40 px, 400 ms después de escrita la primera tarea | 600 ms y funde | no aparece |
| El cierre amanece | el campo azul sube con el frente curvo y un filo cian: un domo (media elipse de 220 vw; 320 vw en celular) con `translateY` y `scaleX` atados al paso de la sección por la pantalla (`view-timeline`); el contenido funde con la misma línea de tiempo | sigue el scroll | campo completo y plano. Sin `animation-timeline`: crece desde arriba (`scaleY`, 700 ms) y el contenido funde una vez |
| Desorden que se ordena | los papeles regados de «Hoy» son transiciones de `transform` disparadas por `data-paso` (posiciones en `src/lib/ecosistema.ts`, en cqw del escenario) | llegada 240 ms, 70 ms entre uno y otro; orden 520 ms con la curva de mover | cuadro final |
| Eslogan del pie | la capa rellena funde sobre el contorno al entrar del todo en pantalla (`view()`) | sigue el scroll | relleno |

Lo que dispara el teclado sigue sin animarse (`:has(:focus-visible)` y
`[data-tab]`). Lo infinito se pausa fuera de la vista: las clases `animate-*`,
con el script del layout; el escenario del ecosistema, con `data-pausa` que le
pone `PiezaPasos`. Las transiciones entre páginas (View Transitions), el
barrido de la barra y el punto del enlace activo llegan en la fase 4.

El movimiento acompaña la lectura; nunca la retrasa ni la tapa. Todo lo que entra al
cargar corre en CSS, sin esperar a React. Todo lo infinito se pausa fuera de pantalla
(script del layout, atributo `data-pausa`) y se apaga con `prefers-reduced-motion`.

**Lenguaje de movimiento.** Dos curvas y un resorte, nada más. Lo que se leía como
plantilla no era la curva: eran la duración, la distancia y la uniformidad (60 bloques
que entraban igual, un halo que respiraba sin fin, un barrido de brillo).

- Ninguna UI pasa de 300 ms; solo las entradas de página llegan a 0,6–0,8 s.
- Las salidas son más cortas que las entradas (menú: 200 ms al entrar, 150 ms al salir).
- Lo que dispara el teclado no se anima: Enter, Espacio, Escape y Tab cambian en 0 ms
  (ni presión, ni subida, ni flechas con foco, ni salida del menú). Con Tab, también lo
  que pierde el foco: el script del layout marca `[data-tab]` en `<html>` y lo quita con
  el primer movimiento del puntero. El anillo de foco
  aparece completo en el primer cuadro, y un bloque que todavía no apareció se muestra
  completo y quieto apenas algo de adentro recibe el foco.
- El hover solo existe con `hover: hover` y `pointer: fine` (el `hover:` de Tailwind ya
  va dentro de `@media (hover: hover)`; el CSS propio pide además puntero fino). En
  pantallas táctiles un toque no deja nada pegado.
- Al presionar (`:active`, dedo o mouse abajo; nunca el clic) todo lo pulsable responde:
  botones a 0.97, el botón principal a 0.98, la hamburguesa de 44 px a 0.95, el "+" a
  0.9, las tarjetas-enlace a 0.99; las filas a todo lo ancho solo aclaran el fondo; los
  enlaces de texto bajan a opacidad 0.7. Sin el recuadro gris del navegador al tocar
  (`-webkit-tap-highlight-color: transparent`), y en iOS el `:active` funciona desde el
  HTML (oyente vacío de `touchstart` en el script del layout).
- Sin rebote en ningún lado.
- Solo `transform` y `opacity` (y `scale`/`translate`, que son transform). Dos
  excepciones documentadas que no se extienden: el alto del acordeón
  (`grid-template-rows`, lo dispara el usuario y no cuenta para CLS) y el ancho y el
  relleno de la barra (elemento fijo, un cambio por dirección; si en un celular de gama
  media pasa de 2 ms de layout por cuadro, se pasa a FLIP). Que sea fijo no lo saca del
  CLS: Chrome cuenta lo que se corre dentro de la barra. Por eso el vidrio va centrado y
  con ancho fijo (ver Components); lo que queda son el logo y los botones, que se corren
  unos 90 px una vez por dirección (CLS medido por debajo de 0,01 al recorrer cada
  página, `tests/e2e/estabilidad.spec.ts`).
- Con "reducir movimiento" queda solo opacidad: nada se desplaza ni se escala (lo
  pulsable se atenúa a 0.85 en 100 ms, el menú solo funde).
- En celular no hay efectos de puntero, y lo infinito caro sigue apagado por debajo de
  768 px.

| Token | Valor | Dónde |
|---|---|---|
| Curva de salida | `--ease-salida`: `cubic-bezier(0.22, 1, 0.36, 1)` (`EASE` en JS); utilidad `ease-salida` y curva por defecto de toda utilidad `transition-*` | todo lo que entra, aparece, responde o se presiona |
| Curva de mover | `--ease-mover`: `cubic-bezier(0.77, 0, 0.175, 1)`; utilidad `ease-mover` | solo algo que ya está en pantalla y cambia de forma: el ancho y el relleno de la barra |
| Resorte | `RESORTE_IMAN`: rigidez 300, amortiguación 30, masa 1 (ζ ≈ 0,87, se asienta en ~0,27 s, rebasa menos de 0,03 px); por rigidez, no por duración | botón magnético |
| Duraciones | `--dur-presion` 120 ms · `--dur-rapida` 150 ms · `--dur-ui` 200 ms (por defecto de las utilidades) · `--dur-mover` 300 ms (tope de UI) · `--dur-entrada` 0,6 s · `--dur-titular` 0,8 s | `:root` en `globals.css` |
| Distancias por rol | protagonista (titular de sección) 16 px · apoyo 8 px (por defecto) · maqueta del hero 20 px · burbuja 6 px + 0.96 · adorno 0 (solo funde) · titular gigante de la portada 22 % de su alto | `--y` (prop `y` de `Reveal`), `--desde`, `--subir-desde` |
| Entrada del hero | frase 0 / 600 ms / 8 px; titular 60 y 140 ms / 800 ms / 105 % bajo máscara; sub 280 ms; fila del botón 360 ms; maqueta 480 ms / 750 ms / 20 px. El botón queda quieto a 0,96 s y el hero completo a 1,23 s | `.entrada`, `.subir` (variables `--retraso`, `--desde`, `--duracion`) |
| Barra y migas | solo funden, 0,4 s (`--desde: 0`) | `nav`, `Migas` |
| Fundido | 1.6 s, `ease`, 0.2 s de retraso | `.fundir` (banda de la cinta) |
| Aparición al hacer scroll | opacidad 0,5 s + desplazamiento 0,6 s, curva de salida; distancia por rol | `[data-revelar]` |
| Cabecera de sección | un solo bloque (titular y bajada juntos), sube 16 px, sin escalón interno | `SectionHeading` |
| Escalón en ola | retraso(i) = min(0,32, e·(1 − 0,85^i)/0,15), e = 0,08 s (0,06 s en /herramientas, 0,05 s en las preguntas de /preguntas): 0 / 0,08 / 0,148 / 0,206 / 0,255 / 0,297 / 0,32 s. Cada intervalo es 15 % más corto que el anterior | `data-escalonar` (script del layout) |
| Retrasos a mano por rol | protagonista 0; apoyo +0,08 s; la acción y su nota juntas +0,14 s; adorno 0 | cierre, /agendar, portada (sub 0,18 s, botón 0,26 s) |
| Presión | baja en 120 ms y vuelve en 120 ms (`--dur-presion`; la duración va por propiedad: el `translate` del hover y la opacidad siguen en 200 ms), curva de salida; `scale` 0.97 (`--escala-presion`), 0.98 el principal, 0.95 la hamburguesa, 0.99 tarjetas-enlace; no con teclado (`:not(:focus-visible)`) | `.pulsable`, `.tarjeta-pulsable` |
| Interacción de botones | 200 ms (hover, color, borde, foco de luz); con foco del teclado, 0 ms al entrar y al salir con Tab (`[data-tab]`, script del layout) | `GlowButton` |
| Imán | hacia el puntero, como mucho 6 × 4 px (con el puntero en el borde; 0 en el centro), resorte al volver, interrumpible; solo mouse con puntero fino y sin "reducir movimiento"; reemplaza la subida de 2 px. Con esas mismas condiciones el div que se mueve (`.iman-movil`) lleva `will-change: transform`: sin capa propia el botón y su halo se repintaban en cada cuadro | `Iman`: hero, portada de cada línea y cierre |
| Flecha | 2 px dentro de botones, 4 px en enlaces y tarjetas, 2 px hacia abajo en el atajo de la portada; 200 ms, solo con mouse | `transition-[translate]` + `motion-safe:group-hover:` |
| Bordes de tarjeta y barra | 200 ms; el ancho y el relleno de la barra, 300 ms con la curva de mover | hover, compactar |
| Menú móvil | entra en 200 ms desde el botón (6 px y 0.97), sale en 150 ms (4 px y 0.98); fondo 200 / 150 ms; con teclado, 0 ms; con "reducir movimiento", solo opacidad 150 / 100 ms. Sin escalón en las filas | `Nav` (transform en string: va por WAAPI) |
| Ícono del menú | ☰ y ✕ en la misma celda: opacidad, escala 0.8 y 2 px de desenfoque, 150 ms; con teclado de una vez | `Nav` |
| Preguntas | el "+" gira 45° en 200 ms; abrir: alto 260 ms y opacidad 200 ms con 60 ms de retraso; cerrar: alto 200 ms y opacidad 120 ms; la respuesta que abre fuera de la pantalla se trae a la vista a los 280 ms (de una vez con teclado o "reducir movimiento") | `Pregunta`, `PreguntasLinea` |
| Escritura | letra i: 26 ms + (0, 18, 6, 30, 12, 24, 4, 34)[i mod 8]; +120 ms después de coma o punto; +60 ms después de cada tercer espacio; 1,8 s quieta; seleccionada 260 ms y borrada de una vez; 300 ms vacía. Al borrarse, la frase sale en un solo bloque, todavía seleccionada: una copia sube 6 px y se apaga en 150 ms (`--dur-rapida`) dentro de esa pausa, así el ritmo del bucle no cambia (con "reducir movimiento" no hay salida). El cursor parpadea solo en las pausas (opacidad) y es el borde final de una capa quieta que repite el texto en transparente: no se corre con cada letra, sin layout shift | `TextoQueSeEscribe`: maqueta del hero y ventana de /coaching |
| Búsqueda tachada (hero) | lo primero que escribe el recuadro del hero es una búsqueda (`hero.busqueda`), con el ritmo de la escritura. No se selecciona: 400 ms después de escrita la cruza la raya del "Hoy" (1 px blanco al 40 %, `scaleX` de 0 a 1 en 600 ms, `--dur-entrada` con la curva de salida; una raya por renglón, la del segundo 150 ms después) y el texto baja al 75 % en el mismo tiempo (opacidad); tachada se queda 1 s y sale como las demás frases (la copia, todavía tachada, sube 6 px y se apaga en 150 ms). Después vienen las tareas y el bucle vuelve a la búsqueda. Las rayas se miden una vez, al terminar de escribirse; nada por cuadro. Con "reducir movimiento" no aparece: queda la primera tarea, quieta. Con colores forzados la raya va en `CanvasText` | `TextoQueSeEscribe busqueda`, `.raya-busqueda`, `.texto-tachado` |
| Burbujas | crecen desde su cola: 6 px y 0.96, opacidad 0,2 s (`--dur-ui`) y forma 0,3 s (`--dur-mover`); retrasos de conversación (0,3 / 1,05 / 1,8 s; la ficha de las instrucciones, 2,55 s). La ventana solo funde | `.burbuja` en /coaching |
| Éxito del formulario | el panel llega desde 8 px y 0.98 en 300 ms (`--dur-mover`); el chulo entra desde 0.9 a los 120 ms (funde en 200 ms, crece en 300 ms), sin rebote; "Enviar" ↔ "Enviando" con 2 px de desenfoque en 150 ms. Los errores no se animan | `.exito-panel`, `.exito-icono`, `.cambio-etiqueta` |
| Tachado del "Hoy" | raya de 1 px, `scaleX` de 0 a 1 en 600 ms con la curva de salida, 0.35 s después de su fila (solo desde 1024 px; fijo por debajo y con "reducir movimiento"; con colores forzados, la raya se pinta en `CanvasText`) | `.tachado-linea` en /consultoria |
| Flecha del hoy → después | llega con el tachado: 0,55 s después de su fila (0,2 s después de que arranca la raya), se corre 8 px hacia "Después" en 300 ms (`--dur-mover`) y funde en 200 ms; solo desde 1024 px; quieta con "reducir movimiento" y sin JavaScript | `.flecha-cambio` en /consultoria |
| Recorrido animado: ritmo | 5 / 5,5 / 6 / 5 s por paso (21,5 s en total, `DURACION_PASO`). Cada escena termina su acción entre los 2,4 y los 3 s y el resto es una pausa sobre el cuadro terminado, para ir del dibujo al título y a "Te llevas"; el 03 dura más porque hace más y su texto es el más largo. Arranca cuando se ve la mitad del escenario; se pausa si deja de verse la mitad o si la pestaña se oculta, y sigue al volver. Al terminar se queda en el 04 | `Recorrido`, `src/lib/recorrido.ts` |
| Recorrido animado: barra | el tramo del paso se llena lineal en lo que dura el paso (es tiempo, como en un video) y al llenarse pasa al siguiente; nodo y halo funden en 200 ms. Pausar congela escena y barra en el mismo cuadro (`animation-play-state`). Un nodo salta a su paso: corriendo, sigue desde ahí; en pausa, muestra el paso con su escena completa y quieta, y "Seguir" lo corre desde el principio | `.recorrido-relleno`, `[data-estado]`, `[data-cuadro]` |
| Recorrido animado: escenas | solo CSS, con `--t` por pieza. Lo que llega: 6 px y 0.96, opacidad 200 ms y forma 300 ms, curva de salida (como las burbujas). Trazos: crecen desde su origen en 150 a 300 ms. Lo que ya está y cambia de lugar (las hojas que se juntan, la ficha que se corre, la selección que salta): curva de mover, 600 ms o 300 ms por salto. Lo que se apaga: a 0,4 en 300 ms. El reloj: dos vueltas en 1,4 s y despacio hasta el final del paso. Del segundo paso en adelante la escena entra fundiéndose en 200 ms, como un corte | `.ce-*`, `.escena-corte` |
| Recorrido animado: texto | el paso que sale se apaga en 150 ms; el que entra sube 6 px y aparece en 300 ms, 100 ms después | `.recorrido-paso[data-activo]` |
| Recorrido animado: sin movimiento | con "reducir movimiento" nada avanza solo: no hay botón de pausa, los nodos cambian de paso, cada escena queda en su cuadro final y el texto solo funde (200 ms). Sin JavaScript, la línea de tiempo de antes con los cuatro pasos a la vista. Si React no carga (`.forzar-visible`), la escena queda en su cuadro final | `globals.css` |
| Marquesina | 44 s lineal; se detiene bajo el mouse (solo puntero fino) | solo /herramientas |
| Flotar / pasear | 6 px en 9 s / 6 s, curva de ida y vuelta de CSS (ease in-out) | ya no se usa: el orbe salió de todo el sitio en noviembre de 2026 |
| Líneas de flujo | 2.4 s lineal (solo desde 768 px) | hoy sin uso; la regla sigue en el CSS |
| Deriva de resplandores | ±24 px, 24 s ida y vuelta, solo desde 768 px | `.animate-deriva`: cierre y el resplandor de arriba de cada zona |
| Titular gigante de la portada | se corre −6 % / +8 % a lo ancho mientras la portada sale por arriba, sin resorte (la primera línea, al ras del contenedor, nunca a menos de 12 px del borde de la pantalla: en celular se corre 8 px); animación de CSS atada al scroll (`view-timeline` de la portada, rango `exit-crossing`), sin JavaScript por cuadro; sin soporte (Firefox, Safari anterior a 26) y con "reducir movimiento", quieto. La cinta de la portada vuelve a medir sus zonas de lectura con el scroll | `ZonaPortada`, `.paralaje-izquierda`, `.paralaje-derecha` |

**Lo que salió y no vuelve.** El halo que respiraba en el botón principal
(`animate-halo`), el barrido de brillo (`.boton-barrido`), el blob flotante de 14 px, el
borrado letra por letra y el resplandor de las fichas de /herramientas. Tampoco van:
transiciones entre páginas, rebotes, contadores, inclinación 3D, cursor propio, parallax
en más secciones, titulares letra por letra ni un segundo imán.

**Un momento de autor por página.** En el inicio, la cinta del hero; en /coaching, la
ventana de la sesión (los mensajes entran uno tras otro y la instrucción se escribe
sola); en /consultoria, desde el 2026-11-06, el recorrido animado (antes era el tachado
del "Hoy", que sigue como la entrada de su sección). El resto del movimiento responde
a lo que hace el usuario o es una sola entrada por bloque. El escalonado queda para
listas que se leen como lista. Nada infinito nuevo (el recorrido termina y se queda
quieto), y todo el contenido se ve sin JavaScript.

**Movimiento ligado al scroll y "reducir movimiento".** `MotionConfig
reducedMotion="user"` no detiene los valores atados a `style`: lo que se ate al scroll
con Motion tiene que leer `useReducedMotion()` dentro del propio valor. El titular
gigante de la portada ya no lo necesita: su paralaje es una animación de CSS atada al
scroll y "reducir movimiento" la apaga en globals.css.

**Cinta de luz del hero.** Shader WebGL propio (sin librerías) en un `<canvas>`
decorativo detrás del contenido (`src/components/ui/cinta-hero.tsx`,
`src/lib/cinta/motor.ts`, `src/lib/cinta/shader.ts`). Tres láminas de seda azul
(#1B35D0 → #3D5AFF) con pliegues cian (#29C4F5) y destellos menta en puntos pequeños,
grano fino y estrellas fijas en lo oscuro. Los dos resplandores de esquina del hero los
pinta el mismo shader cuando hay WebGL.

- Recorrido: en escritorio entra plana por debajo de la fila del botón (al 71,5 % del
  alto, desde la mitad del ancho) y sube por la derecha, lejos del titular; en celular
  cruza en diagonal.
- Portada de cada línea (`CintaHero variante="portada"`, el mismo motor y el mismo
  shader): plana por debajo del titular gigante (al 78 % del alto en escritorio, por el
  hueco a la izquierda del sub; al 72 % en celular, detrás del sub) y sube pasado el
  borde derecho del titular, que el motor mide (`data-cinta-esquivar`): "ti." es corto y
  "empresa." llega casi al borde. El margen, 8 % del ancho, cubre lo que la segunda
  línea se corre con el paralaje; no pasa detrás del gigante (llega, a lo sumo, su halo
  tenue, que las zonas recortan). Detrás del sub sí puede
  pasar, sin brillos, por su tope. Tinte por línea con un uniform (`uTinte`), solo con
  colores de la paleta: en coaching el cuerpo va del cian profundo al cian; en
  consultoría el pico es el azul suave y casi sin menta. Banda de respaldo propia
  (`.cinta-quieta-portada`, en cian o azul). El paralaje mueve el titular: con la cinta a
  la vista, el motor vuelve a medir las zonas en el scroll (una vez por cuadro, solo
  lecturas) y al terminar cada transición de entrada. Los topes se calculan contra lo
  más claro que queda debajo del lienzo: el centro del resplandor de la zona
  (`uFondo`), no el casi negro con rejilla del hero.
- Bucle propio, sin costura (las fases se calculan en la CPU y se reducen a 0..2π):
  ondas de 18 s y 11 s, giro de la seda de 23 s, respiración del ancho de 15 s; la lámina
  trasera a 0,62 de eso. Al aparecer, la amplitud sube de 0,6 a 1 en 1,6 s.
- Mouse (solo con `hover: hover` y `pointer: fine`): la cinta se inclina hacia el puntero
  (caída gaussiana de max(20 % del ancho, 140 px), hasta 16 % del alto), lo sigue con
  inercia (constante de 220 ms), se enciende alrededor de él, se corre en paralaje (cada
  lámina distinto) y se tuerce más si el puntero va rápido (sube en 90 ms, baja en
  800 ms). Al salir del hero o de la ventana vuelve a su reposo en ~1,1 s. Sin saltos.
- Celular: el bucle solo, a 30 cuadros; un toque deja un pulso suave que sube en 250 ms y
  se apaga en 0,9 s. Pasivo: no intercepta el scroll ni los toques en enlaces.
- Con "reducir movimiento", ahorro de datos o 2 GB de memoria o menos: un solo cuadro
  quieto, sin bucle ni reacción. Sin WebGL: la banda quieta de CSS.
- Sin GPU (WebGL por software, como el Chromium de Lighthouse y PageSpeed): la banda
  quieta de CSS, sin compilar el shader. El contexto se pide con
  `failIfMajorPerformanceCaveat` y, si llega, se lee el renderizador
  (SwiftShader, llvmpipe, softpipe, "software", Basic Render). Además, un guardián mide
  lo que tarda el hilo principal en cada uno de los 4 primeros cuadros (del callback a
  la tarea siguiente: por software casi todo el costo cae fuera del callback); si todos
  pasan de 50 ms, el motor se apaga y vuelve la banda.
- Contraste: cada texto del hero lleva `data-cinta-tope`, la luminancia máxima del fondo
  detrás de él: 0,16 el titular blanco, 0,055 el subtítulo, 0,04 la nota del botón; en la
  barra, 0,06 los enlaces y 0,16 el logo y el botón de menú. El titular en degradado se
  calcula punto por punto (3,3:1 contra el color del degradado en ese punto: de 0,106 en
  lo cian a 0,012 en la punta azul). El tope es plano hasta 6 px del texto y se suelta de
  forma geométrica en 130 px (90 px en celular); cerca del texto la seda pierde el cian y
  la menta. El contraste AA no depende del cuadro.
- Contraste en la portada: 0,04 las migas, 0,06 el nombre del servicio, 0,16 la primera
  línea del gigante, 0,07 el sub (blanco al 80 %), 0,06 el botón, 0,05 la nota y 0,04 el
  enlace. La segunda línea lleva el degradado de su línea, no el del hero: tope fijo de
  0,035 en cian (3,3:1 contra #1591C4) y de 0,02 en azul, donde el extremo #1B35D0 no
  llega a 3:1 ni sobre negro: la seda queda fuera de esa palabra sin dejar una caja
  oscura alrededor.
- El shader recibe hasta 12 zonas de lectura (`MAX_ZONAS`, un solo valor para el motor y
  el GLSL). En pantallas angostas el texto se parte en más líneas: se fusionan líneas
  vecinas del mismo texto (la caja conserva su tope) y ninguna zona se descarta; el logo
  y el botón de menú siempre quedan protegidos.
- Se pausa fuera de pantalla y con la pestaña oculta. Resolución en px CSS, sin
  multiplicar por el DPR (0,75 en celular), con tope de 1,6 megapíxeles. Si los cuadros
  se atrasan, primero baja de 60 a 30 cuadros (un navegador que limita a 30 Hz sigue a
  resolución completa y con la reacción al mouse); solo si a 30 tampoco alcanza baja la
  resolución (0,75, 0,5625, 0,5), y si ni así alcanza queda un cuadro quieto. Se
  recupera: cada 18 s vuelve a probar 60 cuadros, sube la resolución tras dos ventanas
  holgadas (con castigo creciente si la subida falla) y al volver el foco o la pestaña
  sale del cuadro quieto.

## Do's and Don'ts

- Do: un solo botón principal relleno de azul de marca por pantalla; el resto, botones de
  luz oscuros.
- Do: medir el contraste con el fondo en movimiento, en el peor cuadro, no en uno bonito.
- Do: resplandores con degradado radial; nunca `filter: blur` grandes ni filtros SVG.
- Do: pausar todo lo infinito fuera de pantalla y apagarlo con "reducir movimiento".
- Do: animar solo `opacity` y `transform` en el DOM; lo demás va en el shader.
- Do: darle `data-cinta-tope` a cualquier texto nuevo dentro del hero o de una portada.
- Do: alternar una banda con tarjetas y una banda abierta; nunca dos bandas seguidas con
  el mismo contenedor.
- Do: mostrar en cada paso lo que el cliente tiene en la mano al terminarlo ("Te
  llevas").
- Do: poner los límites donde se decide (en el primer paso de cada línea, en "No es
  para… si", en la respuesta a quién lo opera y en el cierre): se acortan, no
  desaparecen. Bajo el botón de la portada van datos (costo de empezar, formato, pago).
- Do: lo largo a las preguntas en acordeón, con la respuesta en el HTML.
- Do: cada promesa, una vez en el cuerpo de cada página ("tu equipo lo opera" en
  /consultoria: portada, paso 04 y la pregunta que filtra); las preguntas la amplían.
- Do: h2 de capítulo para el argumento y h2 de apoyo para "¿Esto es para…?" y las
  preguntas; un h2 de dos frases, una frase por renglón.
- Don't: recuadros apilados para las preguntas de /coaching y /consultoria, ni un panel
  alrededor de un diagrama que ya tiene cajas.
- Do: un solo acento por zona: azul en consultoría, cian en coaching, menta solo para
  confirmar.
- Do: hover solo en lo que se puede pulsar.
- Do: la acción en la primera pantalla de cada portada de línea.
- Don't: cambiar familias, pesos, tamaños, interlineado ni orden de secciones para
  "hacer espacio" al movimiento.
- Don't: cursivas, serifas de acento, emojis ni colores fuera de la paleta.
- Don't: video de fondo en el hero (pesa, cuenta para LCP y no responde al mouse).
- Don't: cian sólido detrás de texto blanco, ni texto blanco al 50 % por debajo de 15 px.
- Don't: imágenes `data:` en CSS (la CSP solo permite imágenes del propio sitio).
- Don't: etiquetas encima de los titulares de sección bajo el hero.
- Don't: píldora ni etiqueta encima del h3 de una tarjeta (las puertas del inicio dicen
  para quién son con el pictograma y la regla).
- Don't: texto en degradado fuera del titular del hero y de la portada gigante de cada
  línea.
- Don't: bordes laterales de color de más de 1 px en tarjetas, citas o avisos.
- Don't: tres tarjetas iguales de icono + título + texto como estructura de una sección.
- Don't: marquesinas de logos, contadores, cifras sin fuente, logos de clientes ni
  botones flotantes (WhatsApp va como enlace de texto bajo el botón del cierre).
- Don't: números de sección donde el orden no informa.
- Don't: texto de menos de 13 px en maquetas y diagramas, ni peso 600 en etiquetas
  pequeñas.
- Don't: colores escritos a mano que ya son token (#8EA0FF es `blue-soft`).
