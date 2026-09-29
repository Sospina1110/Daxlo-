import { comparacion } from "../../src/content/copy";
import { bordeBarra, expect, irA, recorrer, test, type Page } from "./apoyo";

// La tabla "Quién construye y sobre qué" del inicio. En celular las dos
// respuestas van lado a lado bajo cada criterio y la cabecera de columnas
// (Coaching / Consultoría) se queda fija bajo la barra mientras se lee.

const tabla = (page: Page) => page.locator("[data-revelar]").filter({ has: page.locator("dl") }).first();
const cabeceraMovil = (page: Page) => tabla(page).locator(":scope > div.sticky");

// Deja la mitad de la tabla arriba de la pantalla, justo bajo la barra: la
// persona va leyendo la tabla y ya no ve su cabecera original.
async function centrarTabla(page: Page) {
  await tabla(page).evaluate((t) => {
    const c = t.getBoundingClientRect();
    window.scrollTo({ top: scrollY + c.top + c.height / 2 - 120, behavior: "instant" });
  });
}

test.describe("comparación en celular", () => {
  test.skip(({ isMobile }) => !isMobile, "la cabecera fija es solo para pantallas angostas");

  test("a mitad de la tabla, la cabecera Coaching / Consultoría sigue a la vista justo debajo de la barra", async ({ page }) => {
    await irA(page, "/");
    await recorrer(page);
    await centrarTabla(page);

    const cabecera = cabeceraMovil(page);
    await expect(cabecera).toBeVisible();
    await expect(cabecera).toHaveText(/Coaching\s*Consultoría/);

    const medidas = await page.evaluate(() => {
      const t = [...document.querySelectorAll("[data-revelar]")].find((e) => e.querySelector("dl")) as HTMLElement;
      const c = t.querySelector(":scope > div.sticky") as HTMLElement;
      // Se mide el texto (las letras), no la caja: la caja lleva 12 px de
      // relleno arriba que pueden quedar bajo la barra sin tapar nada.
      const etiquetas = [...c.children].map((e) => {
        const nodo = [...e.childNodes].find((n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim()) as Text;
        const rango = document.createRange();
        rango.selectNodeContents(nodo);
        const r = rango.getBoundingClientRect();
        const centro = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return { arriba: r.top, abajo: r.bottom, texto: (e.textContent ?? "").trim(), tapada: !(centro && e.contains(centro)) };
      });
      return { tabla: t.getBoundingClientRect().top, cabecera: c.getBoundingClientRect().top, etiquetas };
    });
    const barra = await bordeBarra(page);

    // La tabla empezó bastante más arriba: la cabecera se quedó pegada, no está
    // en su lugar original.
    expect(medidas.tabla).toBeLessThan(-100);
    expect(medidas.cabecera).toBeGreaterThan(medidas.tabla + 100);
    // Justo debajo de la barra: a lo sumo 12 px por encima o por debajo de su borde.
    expect(Math.abs(medidas.cabecera - barra), `cabecera en ${medidas.cabecera}, barra termina en ${barra}`).toBeLessThanOrEqual(12);
    // Las dos etiquetas se leen enteras: debajo de la barra y sin nada encima.
    expect(medidas.etiquetas.map((e) => e.texto)).toEqual(["Coaching", "Consultoría"]);
    for (const e of medidas.etiquetas) {
      expect(e.arriba, `${e.texto} queda debajo de la barra`).toBeGreaterThanOrEqual(barra);
      expect(e.tapada, `${e.texto} tapada por otro elemento`).toBe(false);
    }
  });

  test("al salir de la tabla, la cabecera se va con ella (no se queda flotando sobre lo que sigue)", async ({ page }) => {
    await irA(page, "/");
    await recorrer(page);
    await tabla(page).evaluate((t) => {
      const c = t.getBoundingClientRect();
      // La tabla ya pasó: su borde inferior queda 200 px arriba de la pantalla.
      window.scrollTo({ top: scrollY + c.bottom + 200, behavior: "instant" });
    });
    const abajoCabecera = await cabeceraMovil(page).evaluate((c) => c.getBoundingClientRect().bottom);
    expect(abajoCabecera).toBeLessThanOrEqual(0);
  });

  test("cada criterio muestra las dos respuestas lado a lado", async ({ page }) => {
    await irA(page, "/");
    await recorrer(page);
    const filas = tabla(page).locator("dl > div");
    await expect(filas).toHaveCount(comparacion.filas.length);
    for (let i = 0; i < comparacion.filas.length; i++) {
      const [izq, der] = await filas.nth(i).locator("dd").evaluateAll((dds) => dds.map((d) => d.getBoundingClientRect()).map((r) => ({ x: r.left, y: r.top, ancho: r.width })));
      expect(Math.abs(izq.y - der.y), "las dos respuestas en la misma altura").toBeLessThan(2);
      expect(der.x).toBeGreaterThan(izq.x + izq.ancho - 2);
      await expect(filas.nth(i).locator("dd").first()).toContainText(comparacion.filas[i].coaching);
      await expect(filas.nth(i).locator("dd").last()).toContainText(comparacion.filas[i].consultoria);
    }
  });
});

test.describe("comparación en escritorio", () => {
  test.skip(({ isMobile }) => isMobile, "solo pantallas anchas");

  test("se ve la cabecera de tres columnas y no la fija de celular", async ({ page }) => {
    await irA(page, "/");
    await recorrer(page);
    await centrarTabla(page);
    await expect(cabeceraMovil(page)).toBeHidden();
    await expect(tabla(page).getByText("Coaching 1 a 1", { exact: true })).toBeVisible();
    await expect(tabla(page).getByText("Consultoría de implementación", { exact: true })).toBeVisible();
  });
});
