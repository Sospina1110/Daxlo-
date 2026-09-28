# Daxlo

Landing de **Daxlo** en [daxlo.co](https://daxlo.co). Dos líneas de servicio:
coaching 1 a 1 y consultoría de implementación.

> Implementamos la IA. Transferimos la capacidad.

## Stack

El diseño toma como referencia la plantilla Fusion AI de Framer. Framer compila
a React + Framer Motion con HTML pre-renderizado; este es el equivalente en código:

- **Next.js 16** en exportación estática: `next build` deja el sitio listo en `out/`.
- **React 19**
- **Motion** (antes Framer Motion): apariciones, texto que se escribe solo,
  tarjetas apiladas con el scroll, navbar que se transforma.
- **Tailwind CSS 4**
- Tipografías de marca: **Outfit** en títulos, **Inter** en cuerpo. Se sirven
  desde el propio sitio, sin peticiones a Google.

## Cambiar un texto

**Todo el texto vive en [`src/content/copy.ts`](src/content/copy.ts).** No hace
falta tocar ningún componente para cambiar una frase.

Reglas de voz: `docs/03_tono_voz_copy.md` en el repo `daxlo-marketing`. Sin
guiones largos, sin cifras sin fuente, sin nombres de clientes.

## Trabajar en local

```bash
npm install
npm run dev        # http://localhost:3000 con recarga en vivo
npm run build      # genera out/
npm start          # sirve out/ en http://localhost:3000
```

## Estructura

```
src/
  app/            layout (metadatos, fuentes) y página
  content/        copy.ts: todo el texto
  components/
    ui/           piezas base: badge, botón, orbe, marquesina, aparición
    sections/     cada sección de la página
  lib/            logos de herramientas, utilidades
public/           favicon, imagen para redes, logo claro, foto del equipo
```

## Formulario

Envía a un Google Apps Script con estos campos exactos: `linea`, `nombre`,
`whatsapp`, `correo`, `empresa`, `interes`, `website` (trampa para bots),
`tiempo_llenado_segundos`, `origen`. **Si se cambia un nombre, el lead deja de
guardarse en la hoja.** Está en `src/components/sections/cierre.tsx`.

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
