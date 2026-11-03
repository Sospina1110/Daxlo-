---
version: alpha
name: Daxlo
description: Sitio daxlo.co. Fondo casi negro, luz azul y cian, superficies de vidrio y bordes degradados. La cinta de luz del hero es la firma en movimiento de la marca.
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
    fontFamily: Outfit
    fontSize: 5rem
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Outfit
    fontSize: 2.7rem
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: -0.03em
  display-giant:
    fontFamily: Outfit
    fontSize: 10.5rem
    fontWeight: 500
    lineHeight: 0.9
    letterSpacing: -0.045em
  headline-page:
    fontFamily: Outfit
    fontSize: 4rem
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Outfit
    fontSize: 3.5rem
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.02em
  headline-support:
    fontFamily: Outfit
    fontSize: 2.5rem
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-support-mobile:
    fontFamily: Outfit
    fontSize: 1.75rem
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-quote:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Outfit
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.375
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.625
  body-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  body-xs:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
  label-button:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 500
    lineHeight: 1.6
  label-button-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.6
  label-button-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.6
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.12em
  label-eyebrow:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.16em
  label-fase:
    fontFamily: Outfit
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.1em
  caption:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.375
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  card-sm: 22px
  card: 24px
  card-lg: 26px
  card-xl: 28px
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter-mobile: 20px
  gutter-desktop: 32px
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
  strike-duration: 600ms
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

## Overview

Consultoría colombiana de IA con dos líneas: coaching 1 a 1 y consultoría de
implementación. El sitio habla a dueños y profesionales de empresas pequeñas y medianas,
muchos de más de 45 años: se lee primero, se admira después.

- **Tono visual:** técnico y sereno. Fondo casi negro, luz de marca (azul y cian) que
  entra de los bordes, superficies de vidrio, bordes con degradado. Nada de neón saturado
  ni de colores fuera de la paleta.
- **Firma en movimiento:** la cinta de luz del hero, una seda translúcida azul y cian que
  ondula lenta y responde al mouse. Es el único fondo vivo de la primera pantalla.
- **Jerarquía:** texto blanco sobre oscuro, un solo llamado principal por pantalla, el
  resto en botones oscuros con borde degradado.
- **Ritmo:** cada página se lee como un argumento (afirmación, dolor, proceso, criterio,
  cierre). Esas partes las separa el aire y una línea de luz fina, no las cajas. Cada
  página tiene un solo momento de movimiento con autoría: la cinta en el inicio, la
  ventana de la sesión en /coaching y el tachado del "Hoy" en /consultoria.
- **Brevedad:** cada página contesta en orden las preguntas de quien lee, un h2 por
  pregunta y una idea por sección; se entiende leyendo solo los h2 y mirando el objeto
  visual de cada sección. Lo largo (lo que sirve a buscadores y a las objeciones) va en
  las preguntas en acordeón, con la respuesta en el HTML pero cerrada.
- **Contenido:** sin cifras inventadas, sin clientes nombrados, sin pantallas de
  clientes. Santiago Ospina y Martín Zárate aparecen juntos siempre.

## Colors

La paleta parte del casi negro y de dos luces de marca. El color va en la luz, no en
grandes superficies.

- **Azul de marca (#1B35D0, `primary`):** el color de Daxlo. Relleno del botón principal
  del hero, cuerpo de la cinta de luz, resplandores de la zona de consultoría.
- **Azul vivo (#3D5AFF, `primary-bright`):** extremo de los degradados, hover del botón
  principal, borde de la línea de consultoría.
- **Azul claro (#8EA0FF, `primary-soft`):** texto de acento e iconos sobre oscuro en la
  línea de consultoría (los números 01–04 del recorrido, enlaces, rótulos, viñetas). En el código es
  el token `--color-blue-soft` (`text-blue-soft`, `bg-blue-soft`, `stroke-blue-soft`):
  no se escribe a mano.
- **Un acento por zona:** la zona de consultoría va solo en azul (azul claro para
  rótulos y nodos, azul vivo para lo destacado); el cian queda para coaching y para el
  foco del teclado; el menta, solo para confirmar ("Listo", el chulo de "Sin costo").
- **Cian (#29C4F5, `secondary`):** la luz. Pliegues brillantes de la cinta, foco del
  botón, borde del foco del teclado, acentos de la línea de coaching. Nunca de fondo
  detrás de texto blanco (contraste 2,0:1).
- **Cian profundo (#0B7EA6) y cian claro (#7FE0FF):** extremos del degradado cian.
- **Menta (#E2F3EE, `tertiary`):** confirmaciones (el chulo de "Primera conversación sin
  costo", "Listo") y el brillo más alto de la cinta, en puntos pequeños.
- **Casi negro (#0D0E14, `neutral`/`surface`):** fondo de todo el sitio y de `<html>`.
  Capas: #12141C (vidrio, ventanas, las dos puertas del inicio al 60 %), #1A1D28,
  #10121A (relleno de botones), #0E1019 (panel, hoy sin uso), #08090E (zona de
  consultoría, más oscura).
- **Texto:** blanco #FFFFFF (19,3:1 sobre el casi negro); atenuado blanco al 66 % (8,6:1);
  tenue blanco al 50 % (5,3:1, mínimo para texto de 15 px o más). Líneas: blanco al 8 %
  y al 14 %. Por debajo de 15 px el texto va al 60 % o más.
- **Selección y foco:** la selección (cian al 35 %) y el foco (cian de 2 px) también salen
  de la paleta. La barra de desplazamiento es la del navegador en modo oscuro
  (`color-scheme: dark`): una propia en #1A1D28 sobre #0D0E14 quedaba en 1,15:1 y no se
  veía.
- **Error (#FF8A9B):** borde y mensaje de campos con error.

Degradados de texto (`text-gradient-*`): dual = cian → #7AD7FF → azul vivo (la segunda
línea del titular del hero); cian = #7FE0FF → cian → #1591C4; azul = #8EA0FF → azul vivo
→ azul de marca. El extremo azul vivo da 3,8:1 sobre el casi negro: solo en titulares
grandes, y con el fondo detrás por debajo de luminancia 0,018 (ver Motion).

## Typography

Dos familias servidas por `next/font` desde el propio sitio.

- **Outfit 500** para todos los titulares (h1–h4), con `letter-spacing: -0.02em` y
  `text-wrap: balance`. El titular del hero baja a -0.03em y la portada gigante de cada
  línea a -0.045em. Sin cursivas, sin serifas, sin palabras de acento en otra fuente.
- **Inter 400/500** para el cuerpo y los botones. Cuerpo base 18 px con interlineado 1,6
  (público mayor: nunca menos de 15 px para texto de lectura).
- **Tamaños fluidos:** hero `clamp(2.7rem, 6.6vw, 5rem)` (2.15rem por debajo de 360 px);
  portada de línea `clamp(3.2rem, 17vw, 10.5rem)`; h1 de página
  `clamp(2.3rem, 5.4vw, 4rem)`; cierre `clamp(2rem, 5vw, 3.4rem)`.
- **Dos escalas de h2** (`SectionHeading escala`), para que la jerarquía la lleve el
  tamaño y no nueve cabeceras clonadas:
  - **Capítulo** (`headline-lg`, `clamp(2rem, 4.6vw, 3.5rem)`, interlineado 1,05, hasta
    880 px de ancho): los h2 del argumento, los que se leen como respuestas en orden
    (el problema, qué cambia, la sesión, cómo trabajamos, las dos puertas, quiénes
    somos). A 880 px el titular queda en dos renglones en escritorio; a 680 px se iba
    a tres.
  - **Apoyo** (`headline-support`, `clamp(1.75rem, 3vw, 2.5rem)`: 28 px en celular,
    40 px en escritorio, interlineado 1,1, hasta 640 px): "¿Esto es para…?" y las
    preguntas de cada línea. Aplicado en la rama; pendiente del OK de Santiago.
- **Corte entre frases** (`enLineas`): un h2 de dos frases va con cada frase en su
  renglón ("Tu gente ya usa IA. / Tu empresa trabaja igual.", "ChatGPT te escribe el
  correo. / Lo demás, a mano."); "Cambia quién sabe, / quién revisa y quién ajusta." se
  corta en la coma. El navegador los partía a mitad de frase. Los renglones son spans
  de bloque separados por un espacio: el texto que leen los lectores de pantalla y los
  buscadores no cambia. Mismo color en los dos renglones: el h2 en dos tonos sigue
  pendiente del OK de Santiago y no está aplicado.
- **Etiquetas:** la píldora (`Badge`) va en Inter 500 de 12 px, mayúsculas, 0.12em; la
  línea sobre la portada de cada servicio, 14 px, mayúsculas, 0.16em. Los rótulos de los
  diagramas van en `caption` (Inter de 13 px) en mayúsculas, peso 500, 0.1em, blanco al
  66 % (azul claro en lo destacado). Un solo par en mayúsculas por página: "Hoy" /
  "Después". "Te llevas", que se repite en cada paso del recorrido, va en minúscula
  (Inter 500 de 15 px, azul claro): cuatro veces en mayúsculas espaciadas gritaba más
  que el entregable.
  Ninguna etiqueta pequeña va en 600: la jerarquía sale del tamaño, no del peso.
- **Filas abiertas:** el título de cada escena del problema va en `headline-sm` (22 px) en
  celular y en `headline-md` (32 px) desde 768 px, y la escena en Inter de 18 px
  atenuado, hasta 60 caracteres por línea. Las escenas de una sola línea (/coaching) van
  en Outfit 500 de 22 px (28 px desde 768 px) blanco al 85 %. En el hoy → después, "Hoy"
  en Inter de 18 px atenuado y "Después" en Outfit 500 de 22 px blanco: el peso cae en el
  resultado.
- **Párrafos y puntos de lista** llevan `text-wrap: pretty` (sin palabras sueltas al
  final), salvo dentro del hero aprobado (`#top`), que conserva sus cortes. "1 a 1" no se parte entre líneas en el texto que se pinta (`sinCorte`, en
  `src/lib/utils.ts`); los metadatos y los datos estructurados lo conservan igual.
- **Botones:** Inter 500, 17 px en el grande (16 px por debajo de 360 px), 16 px en el
  mediano, 15 px en el pequeño de la barra.

La tipografía no se anima letra por letra ni cambia con el movimiento: las líneas del
titular solo suben desde una máscara al cargar.

## Layout

- Contenedor de 1200 px de ancho máximo, con 20 px de margen lateral en celular y 32 px
  desde 768 px. Unidad base de 4 px (escala de Tailwind).
- **Ritmo vertical en cinco pasos** (celular / escritorio). Mucho aire entre bandas y
  poco dentro de cada bloque; más aire arriba de un titular que debajo.
  - Estrecho, 40–48 / 64 px: puente a la otra línea en /nosotros.
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
  escenas en filas abiertas, el hoy → después en filas con rótulos, el recorrido en línea
  de tiempo, "¿Esto es para tu empresa?" (cita, filas y socios) y las preguntas con
  cabecera lateral. En /coaching: escenas, la sesión (ventana y pasos), dos columnas
  con los socios debajo y preguntas con cabecera lateral. Pendiente del OK de
  Santiago, sin aplicar: una banda en #12141C (`surface-container`) detrás del hoy →
  después. Nunca una banda clara ni menta.
- **Portada de cada línea** (/coaching, /consultoria): migas, nombre del servicio,
  titular gigante, sub de una o dos frases (en consultoría, con dos procesos de
  ejemplo) y, en la primera pantalla, la acción: el botón de luz grande "Agendar una
  conversación" con la línea ya elegida, la nota de la línea bajo el botón y el enlace
  "Ver cómo es una sesión" / "Ver cómo trabajamos" hacia su sección. La nota va en
  `body-xs`, en tramos: el primero (lo que cuesta empezar: "Llamada de 15 minutos sin
  costo" / "Primera conversación sin costo") con el chulo menta y, debajo, alineados con
  su texto, los demás (coaching: formato y forma de pago; consultoría: "Precio cerrado
  antes de construir"), separados por "·" desde 640 px y uno por renglón en celular.
  Ningún renglón empieza con el separador. El límite completo ("Si no te servimos, te lo
  decimos") no va aquí: va una vez, en el cierre. Orden en el DOM: botón, nota, enlace;
  en celular se ven así, con el botón a lo ancho; desde 640 px una rejilla pone el
  botón y el enlace en una fila y la nota debajo.
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
  (`0 30px 80px rgba(0,0,0,0.55)`), y halos de color en el botón principal.
- **Barra de navegación:** transparente arriba; al bajar, píldora casi negra al 97 % (75 %
  con desenfoque desde 768 px).
- **Escalones de superficie:** casi negro, vidrio y #12141C al 60 % (las dos puertas
  del inicio). Lo destacado sube un escalón; no gana insignia ni color nuevo. Nada de
  cajas dentro de cajas.
- **Filo de luz:** solo en los botones de luz (1 px de blanco que se apaga hacia los
  lados).
- **Final de zona:** los resplandores de cada zona se apagan en sus últimos 240 px
  (máscara) y la zona de consultoría (#08090E) se funde en 140 px al casi negro: nada
  termina en un borde horizontal duro. El cierre de cada página hace lo mismo con sus
  resplandores (`mask-b`) antes del pie.
- **La cinta de luz** es la capa más profunda del hero: queda detrás del texto y de las
  ventanas de la maqueta, y se oscurece sola donde hay texto.

## Shapes

Esquinas suaves y consistentes por tamaño:

- 8 px: fichas y chips de las maquetas.
- 12 px: botones, campos, tejas de icono.
- 16 px: ventanas de las maquetas, foto de los socios en cada línea, recuadro de cada
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
  1 px cian → blanco al 45 % → azul claro, texto blanco Inter 500 de 17 px (8,5:1 sobre
  #1B35D0, 5,1:1 en el peor punto del degradado). Halo de luz cian y azul alrededor (por
  debajo de 640 px, corto: no cae sobre el subtítulo ni sobre la nota), foco de luz
  interior arriba que respira despacio. 65 px de alto desde 360 px (60 px por debajo, para
  seguir en la primera pantalla en 320 × 568). Hover y foco del teclado: sube 2 px, el
  relleno se aclara a #2A47EA → #4560FA (4,9:1), el halo se abre y un barrido de brillo
  cruza una vez. Foco del teclado: anillo blanco de 2 px a 3 px entre dos bandas casi
  negras (sombra de 7 px #0D0E14), esquinas de 12 px; el anillo cian del resto del sitio
  se perdía contra el halo cian del botón y contra la cinta. Uno solo por pantalla.
- **Botón de luz (`button-glow`):** el resto de botones. Relleno #10121A, borde degradado
  (`.border-gradient`, por tono: dual, cian o azul), foco de luz arriba y línea blanca de
  1 px en el borde superior. Hover: sube 2 px y el foco pasa a opacidad total.
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
  audiencia encima. Después, el h3 en Outfit 28/32 px, la línea en 18 px atenuado y el
  enlace en el tono de la línea. El enlace se estira sobre toda la tarjeta
  (`after:inset-0`) y conserva su nombre accesible. Con mouse o foco: el borde toma el
  tono y la flecha se corre 4 px (quieta con "reducir movimiento").
- **Tarjeta de vidrio (`card-glass`):** superficie base del puente a la otra línea en
  /nosotros y de la ayuda de /preguntas. Si es enlace, en hover cambia el borde al tono
  de su línea; si no, no responde al mouse. Pendiente fuera de esta pasada: las fichas
  de /herramientas todavía cambian de borde sin ser enlace.
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
  fija). En /consultoria, la pregunta que filtra va como cita. En las dos líneas, abajo,
  los dos socios: foto cuadrada de 96 × 96 con ancho y alto fijos (72 px en celular; el
  archivo es un recorte de 240 × 240, no la foto completa), la firma conjunta con
  "en Colombia" y el enlace "Conoce a Martín y Santiago" a /nosotros (44 px de alto).
  La columna usa una pista que puede encogerse (`minmax(0, 1fr)`): nada se sale en
  320 px. Los límites se escriben como límites, nunca como ventaja.
- **Cita (`pull-quote`):** Outfit 500 de 22 px (`headline-sm`) en blanco, con regla
  superior de 1 px blanca al 14 % y 24 px de aire. Para la pregunta que filtra en
  /consultoria (`pull-quote-filter`: 28 px desde 768 px, un escalón por debajo del h2 de
  apoyo de 40 px y dos por encima del cuerpo), el remate de la sesión y la firma de
  quiénes somos,
  siempre en `<p>`: son palabras de Daxlo, no citas de otra fuente. Reemplaza las
  franjas laterales de color.
- **Línea de tiempo (`timeline-step`):** el recorrido de /consultoria en un `<ol>`.
  Desde 1024 px, cuatro columnas con 32 px entre ellas y un nodo de 12 px arriba de
  cada una (borde azul claro, relleno #08090E, todos iguales), unidos por 1 px de azul
  claro al 40 %. Nada cuelga de un paso. En celular, lista vertical con
  la línea a 15 px del borde y 40 px de sangría. Cada paso: número en `label-fase`,
  h3 en `headline-sm`, una línea en `body-sm` atenuado y "Te llevas" (Inter 500 de
  15 px en azul claro, sin mayúsculas) con el entregable en 17 px blanco.
- **Pregunta (acordeón):** botón dentro de un h3 (Inter 500 de 17/18 px, blanco) con
  un "+" blanco al 60 % que gira 45° al abrir (300 ms, quieto con "reducir
  movimiento"). Dos formas:
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
    blanco al 8 % (14 % al pasar o abierta) y fondo blanco al 3,5 % abierta.
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
- **Campos:** casi negro al 70 %, borde blanco al 14 %, foco con borde cian al 60 %; error
  con #FF8A9B. Etiqueta visible siempre.
- **Barra de navegación (`nav-compact`):** se encoge a píldora al bajar 24 px.

### Diagramas y maquetas

- Muestran el mecanismo o lo que el cliente tiene en la mano, no una tecnología.
  /consultoria no lleva diagrama: "Cómo elegimos el primer proceso" (reunión frente a
  documentos, y las cuatro preguntas que lo filtran) no cabía en 1,5 pantallas de
  celular y tres lectores de prueba no le sacaron nada; vive en la pregunta "¿Cómo
  identifican qué proceso cambiar primero?" y en una cláusula del paso 02. Si vuelve
  algo visual de ese contraste, tiene que caber en la regla de densidad.
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
  cada semana con datos de tres hojas de cálculo.

## Motion

El movimiento acompaña la lectura; nunca la retrasa ni la tapa. Todo lo que entra al
cargar corre en CSS, sin esperar a React. Todo lo infinito se pausa fuera de pantalla
(script del layout, atributo `data-pausa`) y se apaga con `prefers-reduced-motion`.

| Token | Valor | Dónde |
|---|---|---|
| Curva de salida | `cubic-bezier(0.22, 1, 0.36, 1)` (`EASE`) | entradas, apariciones, menú, cinta |
| Entrada del hero | 0.9 s, sube 16 px | `.entrada` (retrasos 0 / 0.45 / 0.55 / 0.7 s) |
| Subida del titular | 1 s, desde 105 % bajo máscara | `.subir` (0.1 y 0.22 s) |
| Fundido | 1.6 s, `ease`, 0.2 s de retraso | `.fundir` |
| Aparición al hacer scroll | opacidad 0.7 s + desplazamiento 0.8 s, 24 px | `[data-revelar]` |
| Cabecera de sección | un solo bloque (titular y bajada juntos), sin escalón interno | `SectionHeading` |
| Escalón entre hermanos | 0.08 s; retraso total de 0.32 s como máximo | `data-escalonar`, `Reveal delay` |
| Tachado del "Hoy" | raya de 1 px, `scaleX` de 0 a 1 en 600 ms con `EASE`, 0.35 s después de su fila y 80 ms de escalón entre filas (solo desde 1024 px; fijo por debajo y con "reducir movimiento"; con colores forzados, la raya se pinta en `CanvasText`) | `.tachado-linea` en /consultoria |
| Interacción de botones | 300 ms | hover, foco |
| Bordes de tarjeta y barra | 500 ms | hover, compactar |
| Menú móvil | 200–250 ms | abrir y cerrar |
| Marquesina | 44 s lineal | solo /herramientas (salió del inicio y de /coaching) |
| Flotar / pasear | 7 s / 6 s `ease-in-out` | orbes, cursor de la maqueta |
| Líneas de flujo | 2.4 s lineal (solo desde 768 px) | hoy sin uso; la regla sigue en el CSS |
| Recorrido de /consultoria | un paso tras otro con 0.08 s de escalón (tope de 0.32 s) | `[data-revelar]` |
| Preguntas de cada línea | la lista entera entra como un solo bloque (antes, una entrada por pregunta); el "+" gira 45° en 300 ms; la respuesta que abre fuera de la pantalla se trae a la vista con un desplazamiento suave a los 320 ms (instantáneo con "reducir movimiento") | `PreguntasLinea`, `Pregunta` |
| Escritura | 32 ms por letra, 2 s quieta, 14 ms al borrar | maqueta del hero |
| Halo del botón principal | opacidad 0.65 ↔ 1, 4 s ida y vuelta, `ease-in-out` | `.animate-halo`, foco interior del CTA del hero |
| Deriva de resplandores | ±24 px, 24 s ida y vuelta, solo desde 768 px | `.animate-deriva`: cierre y el resplandor de arriba de cada zona |
| Puerta del inicio | borde al tono en 300 ms; la flecha se corre 4 px (no con "reducir movimiento") | `DosPuertas` |
| Barrido del botón | 700 ms, solo al pasar o enfocar | `.boton-barrido` |
| Titular gigante de la portada | se corre −6 % / +8 % a lo ancho con el scroll | `ZonaPortada` |

**Un momento de autor por página.** En el inicio, la cinta del hero; en /coaching, la
ventana de la sesión (los mensajes entran uno tras otro y la instrucción se escribe
sola); en /consultoria, el tachado del "Hoy" en el hoy → después. El resto del
movimiento responde a lo que hace el usuario o es una sola entrada por bloque. El
escalonado queda para listas que se leen como lista. Nada infinito nuevo, y todo el
contenido se ve sin JavaScript.

**Movimiento ligado al scroll y "reducir movimiento".** `MotionConfig
reducedMotion="user"` no detiene los valores atados a `style`. Por eso el titular
gigante de la portada lee `useReducedMotion()` dentro del propio valor (una
referencia que el efecto actualiza): con "reducir movimiento" se queda quieto, y el HTML
del servidor coincide con el primer render del navegador.

**Cinta de luz del hero.** Shader WebGL propio (sin librerías) en un `<canvas>`
decorativo detrás del contenido (`src/components/ui/cinta-hero.tsx`,
`src/lib/cinta/motor.ts`, `src/lib/cinta/shader.ts`). Tres láminas de seda azul
(#1B35D0 → #3D5AFF) con pliegues cian (#29C4F5) y destellos menta en puntos pequeños,
grano fino y estrellas fijas en lo oscuro. Los dos resplandores de esquina del hero los
pinta el mismo shader cuando hay WebGL.

- Recorrido: en escritorio entra plana por debajo de la fila del botón (al 71,5 % del
  alto, desde la mitad del ancho) y sube por la derecha, lejos del titular; en celular
  cruza en diagonal.
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
- Contraste: cada texto del hero lleva `data-cinta-tope`, la luminancia máxima del fondo
  detrás de él: 0,16 el titular blanco, 0,055 el subtítulo, 0,04 la nota del botón; en la
  barra, 0,06 los enlaces y 0,16 el logo y el botón de menú. El titular en degradado se
  calcula punto por punto (3,3:1 contra el color del degradado en ese punto: de 0,106 en
  lo cian a 0,012 en la punta azul). El tope es plano hasta 6 px del texto y se suelta de
  forma geométrica en 130 px (90 px en celular); cerca del texto la seda pierde el cian y
  la menta. El contraste AA no depende del cuadro.
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
- Do: darle `data-cinta-tope` a cualquier texto nuevo dentro del hero.
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
