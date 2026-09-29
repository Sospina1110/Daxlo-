import { esperarHidratacion, expect, irA, recorrer, RUTAS, sinRevelar, test } from "./apoyo";

// Criterios propios de la revisión, además de la suite general: cada uno viene
// de un defecto real que se vio al recorrer el sitio como lo vería una persona
// en un celular.

// Textos que se salen de la caja que los recorta (overflow hidden o clip), no
// solo de la pantalla. Así se veía la etiqueta "Borrador para rev" del
// diagrama de consultoría en 320 px: dentro de la pantalla, pero cortada por
// su tarjeta. Cuenta también el texto decorativo (aria-hidden): una persona lo
// ve igual.
async function textosRecortadosPorSuCaja(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const salida: string[] = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const rango = document.createRange();
    while (w.nextNode()) {
      const nodo = w.currentNode;
      const texto = (nodo.textContent ?? "").trim();
      const el = nodo.parentElement;
      if (!texto || !el) continue;
      // Marquesinas (se salen a propósito, con máscara), texto solo para
      // lectores de pantalla, respuestas cerradas de las preguntas.
      if (el.closest("script, style, noscript, template, .mask-x, .sr-only, [role=region][inert]")) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none" || el.getClientRects().length === 0) continue;
      // Caja que recorta más cercana.
      let recorte: Element | null = null;
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        const o = getComputedStyle(a);
        if (["hidden", "clip", "auto", "scroll"].includes(o.overflowX)) {
          recorte = a;
          break;
        }
      }
      if (!recorte) continue;
      const c = recorte.getBoundingClientRect();
      // Cajas de 1 px a propósito (trampa para bots, sr-only).
      if (c.width <= 1 || c.height <= 1) continue;
      const oc = getComputedStyle(recorte);
      const izq = c.left + parseFloat(oc.borderLeftWidth);
      const der = c.right - parseFloat(oc.borderRightWidth);
      rango.selectNodeContents(nodo);
      for (const r of rango.getClientRects()) {
        if (r.width === 0) continue;
        if (r.left < izq - 1 || r.right > der + 1) {
          salida.push(`"${texto.slice(0, 40)}" [${Math.round(r.left)}, ${Math.round(r.right)}] en caja [${Math.round(izq)}, ${Math.round(der)}]`);
          break;
        }
      }
    }
    return salida;
  });
}

for (const ruta of RUTAS) {
  test(`${ruta}: ningún texto queda cortado por la caja que lo contiene`, async ({ page }) => {
    await irA(page, ruta);
    await page.evaluate(() => document.fonts.ready);
    await recorrer(page);
    await expect.poll(() => sinRevelar(page)).toEqual([]);
    expect(await textosRecortadosPorSuCaja(page), "textos cortados por su contenedor").toEqual([]);
  });

  // Un dedo que baja rápido: saltos de 500 px cada 120 ms, sin esperar a que el
  // navegador pinte cada tramo. En Safari, con cuadros lentos, un bloque podía
  // pasar de abajo a arriba de la pantalla entre dos cuadros sin contar nunca
  // como visible y se quedaba oculto.
  test(`${ruta}: después de un scroll rápido de punta a punta no queda nada sin aparecer`, async ({ page }) => {
    await irA(page, ruta);
    await page.evaluate(async () => {
      const max = () => document.documentElement.scrollHeight - innerHeight;
      for (let y = 0; y <= max(); y += 500) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo({ top: max(), behavior: "instant" });
    });
    await expect.poll(() => sinRevelar(page), { message: "bloques [data-revelar] sin data-visible tras el scroll rápido" }).toEqual([]);
  });
}

// Los dos logos (barra y pie) llevan al inicio: en celular se tocan con el
// pulgar, así que su área táctil mide al menos 44 px de alto, como el resto.
test("los logos de la barra y del pie tienen al menos 44 px de alto para tocarlos", async ({ page, isMobile }) => {
  test.skip(!isMobile, "el área táctil se exige en celular");
  await page.goto("/");
  await esperarHidratacion(page);
  for (const logo of [page.locator("header a[aria-label='Daxlo, ir al inicio']"), page.locator("footer a[aria-label='Daxlo, ir al inicio']")]) {
    await logo.scrollIntoViewIfNeeded();
    const alto = await logo.evaluate((a) => Math.round(a.getBoundingClientRect().height));
    expect(alto, "alto del enlace del logo").toBeGreaterThanOrEqual(44);
  }
});

// El botón principal del inicio se ve sin bajar, también en los celulares más
// chicos y con las barras del navegador a la vista.
test("el botón 'Agendar una conversación' del hero queda dentro de la primera pantalla", async ({ page }) => {
  await page.goto("/");
  await esperarHidratacion(page);
  const boton = page.locator("main a", { hasText: "Agendar una conversación" }).first();
  await expect(boton).toBeVisible();
  await expect
    .poll(() => boton.evaluate((b) => Math.round(b.getBoundingClientRect().bottom - innerHeight)), {
      message: "píxeles que el botón queda por debajo del borde de la pantalla (debe ser 0 o menos)",
    })
    .toBeLessThanOrEqual(0);
});
