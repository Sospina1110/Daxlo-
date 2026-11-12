// PENDIENTE (inicio «Campo», 2026-11-12): estas pruebas son de un inicio
// anterior. El hilo de luz y la frase del manifiesto ya no existen: hay que
// reescribirlas para el inicio nuevo o retirarlas. Mientras tanto, el texto
// que usaban vive aquí, para que el archivo siga compilando.
const manifiesto = {
  fuerte: "Daxlo es el aliado de IA de tu empresa.",
  sigue: "Armamos el sistema completo, se lo enseñamos a tu gente y seguimos ahí cuando haya que revisarlo, mejorarlo o sumar el siguiente proceso.",
};
import { expect, irA, recorrer, test, type Page } from "./apoyo";

// El hilo de luz (src/components/fondos/fondo-hilo.tsx) y lo que en el inicio
// va atado al scroll con CSS (la frase que se enciende y el eslogan del pie).
// - El hilo es adorno: no se anuncia, no recibe eventos, no ensancha la
//   página y nunca pasa por encima de un texto.
// - Nace del recuadro del hero y muere en el botón del cierre.
// - Con «reducir movimiento» queda dibujado y quieto; sin soporte de
//   animation-timeline, también (es el valor por defecto del CSS).

const hilo = (page: Page) => page.locator(".fondo-hilo");

// Cajas de la línea de cada tramo (1 px), en coordenadas de la página.
async function lineas(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll(".fondo-hilo .hilo-tramo")].map((t) => {
      const r = t.getBoundingClientRect();
      const v = t.classList.contains("hilo-v");
      const x = v ? r.left + r.width / 2 : r.left;
      const y = v ? r.top : r.top + r.height / 2;
      return { v, rama: t.classList.contains("hilo-rama"), left: x, right: v ? x + 1 : r.right, top: y + scrollY, bottom: (v ? r.bottom : y + 1) + scrollY };
    }),
  );
}

test.describe("hilo de luz del inicio", () => {
  test("es adorno, queda armado al cargar y no ensancha la página", async ({ page }) => {
    await irA(page, "/");
    await expect(hilo(page)).toHaveAttribute("data-listo", "");
    await expect(hilo(page)).toHaveAttribute("aria-hidden", "true");
    await expect(hilo(page)).toHaveCSS("pointer-events", "none");
    expect(await page.locator(".fondo-hilo .hilo-tramo").count()).toBeGreaterThanOrEqual(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  });

  test("nace en el borde del recuadro del hero y muere junto al botón del cierre", async ({ page }) => {
    await irA(page, "/");
    await expect(hilo(page)).toHaveAttribute("data-listo", "");
    // Se vuelve a medir cuando el recuadro termina de entrar.
    await page.waitForTimeout(2_000);
    const geo = await page.evaluate(() => {
      const caja = (sel: string) => {
        const r = document.querySelector(sel)!.getBoundingClientRect();
        return { left: r.left, right: r.right, top: r.top + scrollY, bottom: r.bottom + scrollY };
      };
      return { recuadro: caja("[data-cinta-recuadro]"), boton: caja("[data-hilo-fin] a"), llegada: caja(".hilo-llegada") };
    });
    const tramos = await lineas(page);
    const primero = tramos.filter((t) => t.v && !t.rama).sort((a, b) => a.top - b.top)[0];
    expect(Math.abs(primero.top - geo.recuadro.bottom)).toBeLessThanOrEqual(3);
    expect(primero.left).toBeGreaterThan(geo.recuadro.left);
    expect(primero.left).toBeLessThan(geo.recuadro.right);
    // El punto de llegada queda a la altura del botón, a su izquierda.
    const centroY = (geo.llegada.top + geo.llegada.bottom) / 2;
    expect(centroY).toBeGreaterThan(geo.boton.top);
    expect(centroY).toBeLessThan(geo.boton.bottom);
    expect(geo.llegada.right).toBeLessThanOrEqual(geo.boton.left + 6);
  });

  test("no pasa por encima de ningún texto", async ({ page }) => {
    await irA(page, "/");
    await expect(hilo(page)).toHaveAttribute("data-listo", "");
    await page.waitForTimeout(2_000);
    await recorrer(page);
    const tramos = await lineas(page);
    const choques = await page.evaluate((ts) => {
      const salida: string[] = [];
      const w = document.createTreeWalker(document.querySelector("main")!, NodeFilter.SHOW_TEXT);
      const rango = document.createRange();
      while (w.nextNode()) {
        const el = w.currentNode.parentElement;
        const texto = (w.currentNode.textContent ?? "").trim();
        if (!el || !texto || el.closest("script, style, .sr-only, [aria-hidden=true], [data-escenario]")) continue;
        if (getComputedStyle(el).visibility === "hidden") continue;
        rango.selectNodeContents(w.currentNode);
        for (const c of rango.getClientRects()) {
          if (c.width < 2) continue;
          const r = { left: c.left, right: c.right, top: c.top + scrollY, bottom: c.bottom + scrollY };
          for (const t of ts) {
            // Las ramas corren sobre la línea de capítulo, en el aire entre
            // secciones: tampoco pueden tocar texto.
            if (t.left < r.right && t.right > r.left && t.top < r.bottom && t.bottom > r.top) salida.push(`${texto.slice(0, 40)} ↔ ${t.v ? "vertical" : "horizontal"} en ${Math.round(t.left)},${Math.round(t.top)}`);
          }
        }
      }
      return salida;
    }, tramos);
    expect(choques).toEqual([]);
  });

  test("va atado al scroll: arriba casi no se ve y al final está dibujado", async ({ page }) => {
    await irA(page, "/");
    await expect(hilo(page)).toHaveAttribute("data-listo", "");
    const soporta = await page.evaluate(() => CSS.supports("animation-timeline: scroll()"));
    test.skip(!soporta, "sin animation-timeline el hilo queda dibujado y quieto");
    await page.waitForTimeout(2_000);
    // Cuánto se ve de cada línea vertical: su corrimiento dentro de la caja.
    const corridas = () =>
      page.evaluate(() =>
        [...document.querySelectorAll(".fondo-hilo .hilo-v .hilo-linea")].map((l) => {
          const m = new DOMMatrixReadOnly(getComputedStyle(l).transform);
          return Math.round(m.m42);
        }),
      );
    expect((await corridas()).some((y) => y < -10)).toBe(true);
    await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await expect.poll(async () => (await corridas()).every((y) => y === 0)).toBe(true);
  });
});

test.describe("con 'reducir movimiento'", () => {
  test.use({ reducedMotion: "reduce" });

  test("el hilo queda dibujado y quieto, la frase del manifiesto encendida y el eslogan del pie relleno", async ({ page }) => {
    await irA(page, "/");
    await expect(hilo(page)).toHaveAttribute("data-listo", "");
    await page.waitForTimeout(1_000);
    expect(await hilo(page).evaluate((h) => h.getAnimations({ subtree: true }).length)).toBe(0);
    expect(await page.evaluate(() => [...document.querySelectorAll(".fondo-hilo .hilo-linea")].every((l) => getComputedStyle(l).transform === "none"))).toBe(true);
    // Todas las palabras de la frase, encendidas y sin animación.
    const palabras = page.locator(".manifiesto .palabra");
    await expect(palabras).toHaveCount(manifiesto.sigue.split(" ").length);
    expect(await palabras.evaluateAll((ps) => ps.every((p) => getComputedStyle(p).opacity === "1" && p.getAnimations().length === 0))).toBe(true);
    await expect(page.locator(".pie-lema-relleno")).toHaveCSS("opacity", "1");
  });
});

test.describe("la frase que se enciende", () => {
  test("es un solo párrafo de lectura: el arranque es el h2 y lo que sigue, texto completo", async ({ page }) => {
    await irA(page, "/");
    await expect(page.getByRole("heading", { level: 2, name: manifiesto.fuerte })).toBeVisible();
    await expect(page.locator(".manifiesto p")).toHaveText(manifiesto.sigue);
  });

  test("las palabras se encienden al cruzar la pantalla: apagadas al asomar, encendidas al pasar el centro", async ({ page }) => {
    await irA(page, "/");
    const soporta = await page.evaluate(() => CSS.supports("animation-timeline: view()"));
    test.skip(!soporta, "sin animation-timeline la frase queda encendida");
    const opacidades = () => page.locator(".manifiesto .palabra").evaluateAll((ps) => ps.map((p) => parseFloat(getComputedStyle(p).opacity)));
    // El párrafo apenas asoma por abajo: todas apagadas, y nunca por debajo
    // de 0,35 (se sigue leyendo).
    await page.locator(".manifiesto").evaluate((m) => scrollTo({ top: scrollY + m.getBoundingClientRect().top - innerHeight * 0.92, behavior: "instant" }));
    await expect.poll(async () => Math.max(...(await opacidades()))).toBeLessThan(0.5);
    expect(Math.min(...(await opacidades()))).toBeGreaterThanOrEqual(0.34);
    // Pasado el centro: todas encendidas.
    await page.locator(".manifiesto").evaluate((m) => {
      const r = m.getBoundingClientRect();
      scrollTo({ top: scrollY + r.top + r.height / 2 - innerHeight * 0.3, behavior: "instant" });
    });
    await expect.poll(async () => Math.min(...(await opacidades()))).toBe(1);
  });
});
