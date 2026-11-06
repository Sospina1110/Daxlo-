import { cierre, hero } from "../../src/content/copy";
import { expect, irA, quieto, test, type Locator, type Page } from "./apoyo";

// Botón magnético (src/components/ui/iman.tsx): en los tres llamados
// principales (hero, portada de cada línea y cierre) el botón se corre hacia
// el puntero, como mucho 6 px a lo ancho y 4 px a lo alto, y vuelve con un
// resorte al salir. Solo con mouse: ni táctil, ni teclado, ni sin JavaScript.

const PUNTERO_FINO = "(hover: hover) and (pointer: fine)";

type Caso = { nombre: string; ruta: string; cta: (page: Page) => Locator };
const CASOS: Caso[] = [
  { nombre: "hero", ruta: "/", cta: (page) => page.locator("#top").getByRole("link", { name: hero.cta }) },
  { nombre: "portada de /coaching", ruta: "/coaching", cta: (page) => page.locator("main").getByRole("link", { name: hero.cta }).first() },
  { nombre: "cierre del inicio", ruta: "/", cta: (page) => page.locator('section[aria-labelledby="titulo-cierre"]').getByRole("link", { name: cierre.cta }) },
];

// El div que se mueve y el que lo contiene (quieto, el que se mide).
const movil = (cta: Locator) => cta.locator("xpath=ancestor::*[contains(@class,'iman-movil')][1]");

// Desplazamiento actual del div que se mueve (e y f de su matriz).
async function corrimiento(iman: Locator) {
  return iman.evaluate((e) => {
    const t = getComputedStyle(e).transform;
    if (t === "none") return { x: 0, y: 0 };
    const m = new DOMMatrixReadOnly(t);
    return { x: m.e, y: m.f };
  });
}

// La caja del contenedor quieto y la posición, en el documento, de lo que
// viene después de la sección: ninguna de las dos se puede mover.
async function cajas(iman: Locator) {
  return iman.evaluate((e) => {
    const r = (e.parentElement as HTMLElement).getBoundingClientRect();
    const seccion = e.closest("section") ?? e.closest("main > div > div");
    const despues = (seccion?.nextElementSibling ?? document.querySelector("footer")) as HTMLElement;
    return {
      exterior: [r.left, r.top + scrollY, r.width, r.height].map((v) => Math.round(v * 10) / 10),
      despues: Math.round((despues.getBoundingClientRect().top + scrollY) * 10) / 10,
    };
  });
}

// Graba el corrimiento en cada cuadro, con el tiempo, hasta que se pida parar.
async function empezarAGrabar(iman: Locator) {
  await iman.evaluate((e) => {
    const w = window as unknown as { __iman: { t: number; x: number; y: number }[]; __grabar: boolean };
    w.__iman = [];
    w.__grabar = true;
    const paso = () => {
      if (!w.__grabar) return;
      const t = getComputedStyle(e).transform;
      const m = t === "none" ? { e: 0, f: 0 } : new DOMMatrixReadOnly(t);
      w.__iman.push({ t: performance.now(), x: m.e, y: m.f });
      requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  });
}
async function pararDeGrabar(page: Page) {
  return page.evaluate(() => {
    const w = window as unknown as { __iman: { t: number; x: number; y: number }[]; __grabar: boolean };
    w.__grabar = false;
    return w.__iman;
  });
}

test.describe("con mouse (puntero fino)", () => {
  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(isMobile, "con mouse");
    await page.goto("about:blank");
    test.skip(!(await page.evaluate((q) => matchMedia(q).matches, PUNTERO_FINO)), "este navegador no tiene puntero fino");
  });

  for (const caso of CASOS) {
    test(`${caso.nombre}: se corre hacia el puntero, nunca más de 6 × 4 px, y vuelve al salir sin mover nada alrededor`, async ({ page }) => {
      await irA(page, caso.ruta);
      const cta = caso.cta(page);
      await quieto(cta);
      const iman = movil(cta);
      await expect(iman).toHaveCount(1);
      const antes = await cajas(iman);
      const r = await iman.evaluate((e) => (e.parentElement as HTMLElement).getBoundingClientRect().toJSON() as DOMRect);

      // Al borde de abajo a la derecha: casi todo el recorrido, hacia ahí.
      await page.mouse.move(r.right + 40, r.bottom + 40);
      await page.mouse.move(r.right - 1, r.bottom - 1);
      await expect
        .poll(
          async () => {
            const { x, y } = await corrimiento(iman);
            return x > 4.5 && x <= 6.01 && y > 3 && y <= 4.01;
          },
          { timeout: 5_000, message: "el botón no llegó a correrse hacia el puntero (x en (4,5; 6], y en (3; 4])" },
        )
        .toBe(true);
      expect(await cajas(iman)).toEqual(antes);

      // Zigzag por todo el botón: nunca se pasa del tope.
      await empezarAGrabar(iman);
      for (let i = 0; i < 30; i++) {
        const x = i % 2 ? r.right - 2 : r.left + 2;
        const y = r.top + 2 + ((r.height - 4) * (i % 5)) / 4;
        await page.mouse.move(x, y, { steps: 2 });
      }
      const zigzag = await pararDeGrabar(page);
      expect(zigzag.length).toBeGreaterThan(5);
      for (const m of zigzag) {
        expect(Math.abs(m.x)).toBeLessThanOrEqual(6.01);
        expect(Math.abs(m.y)).toBeLessThanOrEqual(4.01);
      }
      expect(await cajas(iman)).toEqual(antes);

      // Afuera: vuelve a su lugar en 600 ms o menos, contados desde que sale.
      await iman.evaluate((e) => {
        const w = window as unknown as { __vuelta: number | null };
        w.__vuelta = null;
        let t0 = 0;
        (e.parentElement as HTMLElement).addEventListener("pointerleave", () => (t0 = performance.now()), { once: true });
        const paso = () => {
          if (t0) {
            const t = getComputedStyle(e).transform;
            const m = t === "none" ? { e: 0, f: 0 } : new DOMMatrixReadOnly(t);
            if (Math.abs(m.e) < 0.1 && Math.abs(m.f) < 0.1) return void (w.__vuelta = performance.now() - t0);
            if (performance.now() - t0 > 3_000) return void (w.__vuelta = Infinity);
          }
          requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
      });
      await page.mouse.move(r.right + 80, r.bottom + 80);
      await expect.poll(() => page.evaluate(() => (window as unknown as { __vuelta: number | null }).__vuelta)).not.toBeNull();
      const vuelta = await page.evaluate(() => (window as unknown as { __vuelta: number }).__vuelta);
      expect(vuelta, `tardó ${Math.round(vuelta)} ms en volver`).toBeLessThanOrEqual(600);
      expect(await cajas(iman)).toEqual(antes);
    });
  }

  test("si el puntero vuelve a mitad de la vuelta, el resorte cambia de destino sin saltar", async ({ page }) => {
    await irA(page, "/");
    const cta = CASOS[0].cta(page);
    await quieto(cta);
    const iman = movil(cta);
    const r = await iman.evaluate((e) => (e.parentElement as HTMLElement).getBoundingClientRect().toJSON() as DOMRect);
    await page.mouse.move(r.right + 40, r.bottom + 40);
    await empezarAGrabar(iman);
    await page.mouse.move(r.right - 1, r.bottom - 1);
    await page.waitForTimeout(400);
    await page.mouse.move(r.right + 40, r.bottom + 40);
    await page.waitForTimeout(80);
    await page.mouse.move(r.right - 1, r.top + 1);
    await page.waitForTimeout(500);
    await page.mouse.move(r.left - 40, r.top - 40);
    await page.waitForTimeout(500);
    const muestras = await pararDeGrabar(page);
    expect(muestras.length).toBeGreaterThan(20);
    // Llegó a moverse (la prueba no pasa por no ver nada).
    expect(Math.max(...muestras.map((m) => Math.abs(m.x)))).toBeGreaterThan(4);
    // Entre dos cuadros seguidos nunca salta más de 1,5 px. Se normaliza a un
    // cuadro de 60 Hz: en el navegador de pruebas un cuadro puede tardar más.
    for (let i = 1; i < muestras.length; i++) {
      const dt = Math.max(muestras[i].t - muestras[i - 1].t, 1000 / 60);
      const salto = Math.max(Math.abs(muestras[i].x - muestras[i - 1].x), Math.abs(muestras[i].y - muestras[i - 1].y)) * (1000 / 60 / dt);
      expect(salto, `salto de ${salto.toFixed(2)} px en el cuadro ${i}`).toBeLessThanOrEqual(1.5);
    }
  });

  test("con el teclado no se mueve, y el anillo de foco blanco se ve", async ({ page }) => {
    await irA(page, "/");
    const cta = CASOS[0].cta(page);
    await page.mouse.move(2, 2);
    for (let i = 0; i < 30 && !(await cta.evaluate((b) => b === document.activeElement)); i++) await page.keyboard.press("Tab");
    await expect(cta).toBeFocused();
    await page.waitForTimeout(300);
    expect(await movil(cta).evaluate((e) => getComputedStyle(e).transform)).toBe("none");
    expect(await cta.evaluate((b) => getComputedStyle(b).outlineColor)).toBe("rgb(255, 255, 255)");
  });
});

test.describe("táctil", () => {
  test("en pantallas táctiles el botón no sigue al puntero", async ({ page, isMobile }) => {
    test.skip(!isMobile, "solo celulares");
    await irA(page, "/");
    expect(await page.evaluate((q) => matchMedia(q).matches, PUNTERO_FINO), "la emulación no da puntero grueso").toBe(false);
    const cta = CASOS[0].cta(page);
    await quieto(cta);
    const r = await cta.evaluate((b) => b.getBoundingClientRect().toJSON() as DOMRect);
    await page.mouse.move(r.left + 2, r.top + 2);
    await page.mouse.move(r.right - 2, r.bottom - 2, { steps: 6 });
    await page.waitForTimeout(400);
    expect(await movil(cta).evaluate((e) => getComputedStyle(e).transform)).toBe("none");
  });
});

test.describe("sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("el llamado del hero se ve y lleva a la agenda", async ({ page }) => {
    await page.goto("/");
    const cta = page.locator("#top").getByRole("link", { name: hero.cta });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/agendar");
  });
});
