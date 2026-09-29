# Daxlo

Sitio de **Daxlo** en [daxlo.co](https://daxlo.co). Dos líneas de servicio:
coaching 1 a 1 y consultoría de implementación.

> Implementamos la IA. Transferimos la capacidad.

## Stack

El diseño toma como referencia la plantilla Fusion AI de Framer. Framer compila
a React + Framer Motion con HTML pre-renderizado; este es el equivalente en código:

- **Next.js 16** en exportación estática: `next build` deja el sitio listo en `out/`.
- **React 19**
- **Motion** (antes Framer Motion): tarjetas apiladas con el scroll, titular de
  portada que se desliza, barra que se transforma y menú del celular. Las
  apariciones al hacer scroll y la entrada del hero son CSS: no esperan a que
  cargue React.
- **Tailwind CSS 4**
- Tipografías de marca: **Outfit** en títulos, **Inter** en cuerpo. Se sirven
  desde el propio sitio, sin peticiones a Google.

## Cambiar un texto

**Todo el texto vive en [`src/content/copy.ts`](src/content/copy.ts).** No hace
falta tocar ningún componente para cambiar una frase.

Reglas de voz: `docs/03_tono_voz_copy.md` en el repo `daxlo-marketing`. Sin
guiones largos, sin cifras sin fuente, sin nombres de clientes.

## Páginas

El inicio es el índice: presenta las dos líneas y manda a cada visitante a la
página de la que le interesa.

| Ruta | Qué tiene |
|---|---|
| `/` | Hero, las dos formas de trabajar, la comparación, quiénes somos en corto |
| `/coaching` | Coaching 1 a 1 completo, sus preguntas y el puente a consultoría |
| `/consultoria` | Consultoría de implementación completa, sus preguntas y el puente a coaching |
| `/herramientas` | Las herramientas que enseñamos y qué hacemos con cada una |
| `/nosotros` | Quiénes somos |
| `/preguntas` | Todas las preguntas frecuentes (con anclas `#coaching` y `#consultoria`) |
| `/agendar` | El formulario. `/agendar?linea=coaching` o `?linea=consultoria` llega con la opción elegida |

Las rutas están en `rutas` de `src/content/copy.ts`; ningún componente escribe
una ruta a mano. Los enlaces viejos del sitio de una sola página
(`daxlo.co/#agendar`, `#coaching`, etc.) saltan a la ruta nueva.

### SEO

- Cada página tiene su título, descripción, URL canónica y tarjeta para redes
  (`paginas` en `copy.ts`, armados por `metadatosPagina` en `src/lib/sitio.ts`).
- Datos estructurados (schema.org): la organización en todas las páginas; el
  sitio web en el inicio; el servicio en coaching y consultoría; las preguntas
  frecuentes en `/preguntas`; migas de pan en todas las internas.
- `sitemap.xml` y `robots.txt` se generan al compilar.
- Un solo `h1` por página.

## Trabajar en local

```bash
npm install
npm run dev        # http://localhost:3000 con recarga en vivo
npm run build      # genera out/ (y corre scripts/precarga-segmentos.mjs)
npm start          # sirve out/ en http://localhost:3000
```

## Estructura

```
src/
  app/            layout (barra, pie, metadatos, fuentes) y una carpeta por ruta
  content/        copy.ts: todo el texto, las rutas y los metadatos
  components/
    ui/           piezas base: badge, botón, orbe, marquesina, aparición, migas
    sections/     las secciones que arman cada página
  lib/            sitio.ts (SEO), logos de herramientas, utilidades
scripts/          precarga-segmentos.mjs (ver abajo)
public/           favicon, imagen para redes, logo claro, foto del equipo
```

## Formulario

Envía a un Google Apps Script con estos campos exactos: `linea`, `nombre`,
`whatsapp`, `correo`, `empresa`, `interes`, `website` (trampa para bots),
`tiempo_llenado_segundos`, `origen`. **Si se cambia un nombre, el lead deja de
guardarse en la hoja.** Está en `src/components/sections/formulario.tsx`.

Si el JavaScript no llega a cargar, el formulario se envía directo al Apps
Script por POST (nunca por GET: los datos no quedan en la URL).

## Por qué hay un paso después del build

Next 16 guarda los datos de precarga de cada página en una subcarpeta
(`out/coaching/__next.coaching/__PAGE__.txt`), pero el navegador los pide con
puntos (`out/coaching/__next.coaching.__PAGE__.txt`). Sin la copia que hace
`scripts/precarga-segmentos.mjs`, cada enlace visible daba un 404 y la página
siguiente no quedaba precargada. Corre solo con `npm run build`.

## Deploy

Cloudflare Pages, conectado a este repositorio. Configuración de build:

| Campo | Valor |
|---|---|
| Preset | Next.js (Static HTML Export) |
| Comando de build | `npm run build` |
| Carpeta de salida | `out` |
| Versión de Node | 22 (archivo `.node-version`) |

Cada push a `main` publica. Las otras ramas generan una vista previa.

## Contacto

hola@daxlo.co
