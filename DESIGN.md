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
  section-y-desktop: 112px
  section-y-desktop-lg: 128px
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
  icon-tile:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.md}"
    size: 48px
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
  línea de consultoría ("FASE 01", enlaces, nodos del lienzo).
- **Cian (#29C4F5, `secondary`):** la luz. Pliegues brillantes de la cinta, foco del
  botón, borde del foco del teclado, acentos de la línea de coaching. Nunca de fondo
  detrás de texto blanco (contraste 2,0:1).
- **Cian profundo (#0B7EA6) y cian claro (#7FE0FF):** extremos del degradado cian.
- **Menta (#E2F3EE, `tertiary`):** confirmaciones (el chulo de "Primera conversación sin
  costo", "Listo") y el brillo más alto de la cinta, en puntos pequeños.
- **Casi negro (#0D0E14, `neutral`/`surface`):** fondo de todo el sitio y de `<html>`.
  Capas: #12141C (vidrio, ventanas), #1A1D28, #10121A (relleno de botones), #0E1019
  (tarjetas apiladas), #08090E (zona de consultoría, más oscura).
- **Texto:** blanco #FFFFFF (19,3:1 sobre el casi negro); atenuado blanco al 66 % (8,6:1);
  tenue blanco al 50 % (5,3:1, mínimo para texto de 15 px o más). Líneas: blanco al 8 %
  y al 14 %.
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
  `clamp(2.3rem, 5.4vw, 4rem)`; h2 de sección `clamp(2rem, 4.6vw, 3.5rem)`; cierre
  `clamp(2rem, 5vw, 3.4rem)`.
- **Etiquetas:** la píldora (`Badge`) va en Inter 500 de 12 px, mayúsculas, 0.12em; la
  línea sobre la portada de cada servicio, 14 px, mayúsculas, 0.16em.
- **Botones:** Inter 500, 17 px en el grande (16 px por debajo de 360 px), 16 px en el
  mediano, 15 px en el pequeño de la barra.

La tipografía no se anima letra por letra ni cambia con el movimiento: las líneas del
titular solo suben desde una máscara al cargar.

## Layout

- Contenedor de 1200 px de ancho máximo, con 20 px de margen lateral en celular y 32 px
  desde 768 px. Unidad base de 4 px (escala de Tailwind).
- Secciones con 56–64 px de aire vertical en celular y 112–128 px en escritorio.
- Hero: 112 px arriba en celular (96 px por debajo de 360 px), 176 px en escritorio. El
  botón "Agendar una conversación" queda dentro de la primera pantalla en todos los
  tamaños, también en 320 × 568.
- Rejillas de tarjetas con 16–20 px de separación; tarjetas con 28 px de relleno (40 px
  en las destacadas).
- Todo lo que se toca mide al menos 44 × 44 px.
- El orden de las secciones del inicio es fijo: hero, franja de herramientas, dos formas
  de trabajar, comparación, quiénes somos, cierre.

## Elevation & Depth

La profundidad viene de la luz y de capas translúcidas, no de sombras grises.

- **Resplandores:** degradados radiales sin `filter: blur` (función `glow()` de
  `src/lib/utils.ts`), en cian o azul, desde las esquinas de cada sección.
- **Vidrio (`.glass`):** degradado blanco del 4,5 % al 1,5 % con borde blanco al 8 %.
- **Sombras:** solo oscuras y anchas para separar ventanas del fondo
  (`0 30px 80px rgba(0,0,0,0.55)`), y halos de color en el botón principal.
- **Barra de navegación:** transparente arriba; al bajar, píldora casi negra al 97 % (75 %
  con desenfoque desde 768 px).
- **La cinta de luz** es la capa más profunda del hero: queda detrás del texto y de las
  ventanas de la maqueta, y se oscurece sola donde hay texto.

## Shapes

Esquinas suaves y consistentes por tamaño:

- 8 px: fichas y chips de las maquetas.
- 12 px: botones, campos, tejas de icono.
- 16 px: ventanas de las maquetas, barra de navegación, menú.
- 22–28 px: tarjetas (22 las de problema, 24 las de línea, 26 formularios y bloques de
  calificación, 28 las fases apiladas).
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
- **Tarjeta de vidrio (`card-glass`):** superficie base de casi todo; en hover cambia el
  borde al tono de su línea. Las dos tarjetas de línea del inicio además suben 4 px con
  mouse (`.tarjeta-sube`).
- **Teja de icono (`icon-tile`):** 48 px, borde y fondo del tono al 10–12 %.
- **Campos:** casi negro al 70 %, borde blanco al 14 %, foco con borde cian al 60 %; error
  con #FF8A9B. Etiqueta visible siempre.
- **Barra de navegación (`nav-compact`):** se encoge a píldora al bajar 24 px.

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
| Escalón entre hermanos | 0.08 s; retraso total de 0.32 s como máximo | `data-escalonar`, `Reveal delay` |
| Barra que crece | 1.4 s | `.crecer` |
| Interacción de botones | 300 ms | hover, foco |
| Bordes de tarjeta y barra | 500 ms | hover, compactar |
| Menú móvil | 200–250 ms | abrir y cerrar |
| Marquesina | 38–40 s lineal | franja de herramientas |
| Flotar / pasear | 7 s / 6 s `ease-in-out` | orbes, cursor de la maqueta |
| Líneas de flujo | 2.4 s lineal (solo desde 768 px) | lienzos de consultoría |
| Escritura | 32 ms por letra, 2 s quieta, 14 ms al borrar | maqueta del hero |
| Halo del botón principal | opacidad 0.65 ↔ 1, 4 s ida y vuelta, `ease-in-out` | `.animate-halo`, foco interior del CTA del hero |
| Deriva de resplandores | ±24 px, 24 s ida y vuelta, solo desde 768 px | `.animate-deriva`: quiénes somos, cierre, zonas de cada línea |
| Tarjeta que sube | 4 px en 300 ms, solo con mouse | `.tarjeta-sube` |
| Barrido del botón | 700 ms, solo al pasar o enfocar | `.boton-barrido` |

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
- Don't: cambiar familias, pesos, tamaños, interlineado ni orden de secciones para
  "hacer espacio" al movimiento.
- Don't: cursivas, serifas de acento, emojis ni colores fuera de la paleta.
- Don't: video de fondo en el hero (pesa, cuenta para LCP y no responde al mouse).
- Don't: cian sólido detrás de texto blanco, ni texto blanco al 50 % por debajo de 15 px.
- Don't: imágenes `data:` en CSS (la CSP solo permite imágenes del propio sitio).
