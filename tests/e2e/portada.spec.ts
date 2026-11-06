import { coaching, consultoria } from "../../src/content/copy";
import { expect, irA, test } from "./apoyo";

// La portada de cada línea, sin el orbe de vidrio que iba delante del
// titular gigante: la primera línea arranca al ras del contenedor (donde
// arranca el nombre del servicio) y la segunda conserva su sangría. Con el
// scroll en 0 el paralaje todavía no corrió nada.
for (const [ruta, portada] of [
  ["/coaching", coaching.portada],
  ["/consultoria", consultoria.portada],
] as const) {
  test(`en ${ruta}, sin orbe: la primera línea del gigante al ras y la segunda con su sangría`, async ({ page }) => {
    await irA(page, ruta);
    const h1 = page.locator("h1");
    await expect(h1).toContainText(portada.gigante[0]);
    // Ningún círculo dentro del titular.
    expect(await h1.evaluate((h) => [...h.querySelectorAll("*")].filter((e) => getComputedStyle(e).borderRadius === "9999px").length)).toBe(0);
    // Con las entradas terminadas (suben el 22 % de su alto), se mide el texto.
    await expect
      .poll(() => h1.evaluate((h) => h.getAnimations({ subtree: true }).filter((a) => a.playState === "running" && !(a as CSSAnimation).animationName?.startsWith("paralaje")).length))
      .toBe(0);
    const m = await h1.evaluate((h) => {
      const izquierdaTexto = (el: Element) => {
        const r = document.createRange();
        r.selectNodeContents(el);
        return r.getBoundingClientRect().left;
      };
      const gigante = h.querySelector("[data-cinta-esquivar]") as HTMLElement;
      const [primera, segunda] = [...gigante.querySelectorAll(".subir")];
      return {
        contenedor: (h.closest(".container-page") as HTMLElement).getBoundingClientRect().left + parseFloat(getComputedStyle(h.closest(".container-page") as HTMLElement).paddingLeft),
        primera: izquierdaTexto(primera),
        segunda: izquierdaTexto(segunda),
        fuente: parseFloat(getComputedStyle(gigante).fontSize),
        sangria: parseFloat(getComputedStyle(segunda.parentElement as HTMLElement).paddingLeft),
      };
    });
    expect(Math.abs(m.primera - m.contenedor), JSON.stringify(m)).toBeLessThanOrEqual(2);
    // La sangría de la segunda (0,5em en celular, 1,7em desde 768 px), intacta.
    expect(m.sangria / m.fuente, JSON.stringify(m)).toBeCloseTo((page.viewportSize()?.width ?? 0) >= 768 ? 1.7 : 0.5, 2);
    expect(Math.abs(m.segunda - m.contenedor - m.sangria), JSON.stringify(m)).toBeLessThanOrEqual(2);
  });

  // Con el paralaje al máximo (la portada ya salió por arriba), la primera
  // línea, ahora al ras del contenedor, no se sale de la pantalla: el −6 % se
  // limita a 12 px del borde. Donde hay margen (1440 px) sigue siendo −6 %.
  test(`en ${ruta}, con la página corrida la primera línea del gigante no se sale por la izquierda`, async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "el paralaje atado al scroll es de Chromium (y Safari 26)");
    await irA(page, ruta);
    const linea = page.locator("h1 .paralaje-izquierda");
    const alto = await page.locator(".portada-paralaje").evaluate((p) => (p as HTMLElement).offsetHeight);
    await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), alto);
    await expect.poll(() => linea.evaluate((e) => new DOMMatrixReadOnly(getComputedStyle(e).transform).m41)).toBeLessThan(-1);
    const m = await linea.evaluate((e) => {
      const r = document.createRange();
      r.selectNodeContents(e);
      return { izquierda: r.getBoundingClientRect().left, corrimiento: new DOMMatrixReadOnly(getComputedStyle(e).transform).m41, ancho: (e as HTMLElement).offsetWidth, borde: e.getBoundingClientRect().left - new DOMMatrixReadOnly(getComputedStyle(e).transform).m41 };
    });
    expect(m.izquierda, JSON.stringify(m)).toBeGreaterThanOrEqual(11);
    if (m.borde >= 0.06 * m.ancho + 12) expect(m.corrimiento / m.ancho, JSON.stringify(m)).toBeCloseTo(-0.06, 2);
  });
}
