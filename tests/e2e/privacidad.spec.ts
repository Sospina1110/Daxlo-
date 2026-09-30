import { rutas } from "../../src/content/copy";
import { esperarHidratacion, expect, recorrer, RUTAS, test } from "./apoyo";

// El sitio no muestra aviso de cookies porque no usa cookies ni guarda nada en
// el navegador (así lo dice /privacidad). Si una librería o un script nuevo
// empieza a hacerlo, esto falla antes de publicar y hay que revisar la
// política. Tampoco debe pedir nada a terceros: todo sale del propio sitio
// (en producción Cloudflare agrega su analítica sin cookies).
for (const ruta of RUTAS) {
  test(`${ruta}: sin cookies, sin almacenamiento en el navegador y sin pedidos a terceros`, async ({ page, context, baseURL }) => {
    const hosts = new Set<string>();
    page.on("request", (r) => hosts.add(new URL(r.url()).host));
    await page.goto(ruta);
    await esperarHidratacion(page);
    await recorrer(page);
    expect(await context.cookies(), "cookies").toEqual([]);
    const almacenamiento = await page.evaluate(() => ({ local: localStorage.length, sesion: sessionStorage.length }));
    expect(almacenamiento).toEqual({ local: 0, sesion: 0 });
    expect([...hosts].filter((h) => h !== new URL(baseURL as string).host)).toEqual([]);
  });
}

test("la política de datos se puede seleccionar y copiar; el resto del contenido no", async ({ page }) => {
  await page.goto(rutas.privacidad);
  await esperarHidratacion(page);
  const seleccion = (selector: string) => page.locator(selector).first().evaluate((el) => getComputedStyle(el).userSelect || getComputedStyle(el).webkitUserSelect);
  expect(await seleccion("article[data-copiable] p")).not.toBe("none");
  expect(await seleccion("footer p")).toBe("none");
  await page.goto(rutas.agendar);
  await esperarHidratacion(page);
  expect(await seleccion("main h1")).toBe("none");
  // Los campos del formulario siguen aceptando selección (y en iOS, escritura).
  expect(await seleccion("#nombre")).not.toBe("none");
});
