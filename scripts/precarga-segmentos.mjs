// Corre después de `next build` (script "postbuild").
//
// Next 16 con `output: "export"` guarda los datos de precarga de cada página
// en una subcarpeta (coaching/__next.coaching/__PAGE__.txt), pero el
// navegador los pide con puntos (coaching/__next.coaching.__PAGE__.txt). Sin
// esta copia, cada enlace visible produce un 404 al precargarse y la página
// siguiente no queda lista antes del toque. Si una versión futura de Next
// corrige la ruta, el archivo ya existe y aquí no se toca nada.
import fs from "node:fs";
import path from "node:path";

const SALIDA = "out";
let copiados = 0;

function recorrer(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const ruta = path.join(dir, e.name);
    if (!e.isDirectory() || e.name === "_next") continue;
    if (e.name.startsWith("__next.")) aplanar(ruta, dir, e.name);
    else recorrer(ruta);
  }
}

// Copia cada archivo de dentro de la carpeta __next.X al nombre con puntos
// que pide el navegador, junto a la carpeta.
function aplanar(carpeta, padre, prefijo) {
  for (const e of fs.readdirSync(carpeta, { withFileTypes: true })) {
    const ruta = path.join(carpeta, e.name);
    const nombre = `${prefijo}.${e.name}`;
    if (e.isDirectory()) aplanar(ruta, padre, nombre);
    else if (!fs.existsSync(path.join(padre, nombre))) {
      fs.copyFileSync(ruta, path.join(padre, nombre));
      copiados++;
    }
  }
}

recorrer(SALIDA);
console.log(`precarga-segmentos: ${copiados} archivo(s) copiados`);
