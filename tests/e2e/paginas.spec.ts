import { desborde, expect, H1, imagenesSinCargar, irAlFinal, recorrer, RUTAS, sinRevelar, test, textosCortados, textosInvisibles, esperarHidratacion } from "./apoyo";

// Cada página, en cada tamaño: carga limpia, no se desliza de lado y todo lo
// que aparece con el scroll termina a la vista. Los errores de consola, las
// excepciones y las respuestas >= 400 los revisa la vigilancia de apoyo.ts.

for (const ruta of RUTAS) {
  test.describe(`página ${ruta}`, () => {
    test("carga con 200, muestra su h1 y no se desliza de lado", async ({ page }) => {
      const res = await page.goto(ruta);
      expect(res?.status()).toBe(200);
      await esperarHidratacion(page);

      const h1 = page.locator("h1");
      await expect(h1).toHaveCount(1);
      await expect(h1).toBeVisible();
      await expect(h1).toContainText(H1[ruta]);
      // El h1 queda dentro de la primera pantalla, debajo de la barra.
      const caja = await h1.boundingBox();
      const vista = page.viewportSize();
      expect(caja && vista && caja.y < vista.height).toBeTruthy();

      const d = await desborde(page);
      expect(d.contenido, `ancho del contenido ${d.contenido} en ventana de ${d.ventana}`).toBeLessThanOrEqual(d.ventana);
    });

    test("al recorrerla todo aparece: bloques revelados, ningún texto invisible, imágenes cargadas, nada cortado", async ({ page }) => {
      await page.goto(ruta);
      await esperarHidratacion(page);
      await recorrer(page);

      await expect.poll(() => sinRevelar(page), { message: "bloques [data-revelar] sin data-visible" }).toEqual([]);
      // Las apariciones más lentas (la conversación de /coaching) tardan unos 3 s.
      await expect.poll(() => textosInvisibles(page), { message: "textos que se quedaron en opacidad 0", timeout: 25_000 }).toEqual([]);
      await expect.poll(() => imagenesSinCargar(page), { message: "imágenes sin cargar" }).toEqual([]);

      await irAlFinal(page);
      const d = await desborde(page);
      expect(d.contenido, `ancho del contenido ${d.contenido} en ventana de ${d.ventana}`).toBeLessThanOrEqual(d.ventana);
      expect(await textosCortados(page), "textos que se salen por los lados de la pantalla").toEqual([]);
    });
  });
}
