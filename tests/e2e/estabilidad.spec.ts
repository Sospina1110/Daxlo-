import { hero } from "../../src/content/copy";
import { caja, expect, irA, quieto, recorrer, RUTAS, test, type Page } from "./apoyo";

// Sin layout shift (CLS): el movimiento va en transform y opacity, y los
// envoltorios nuevos (el botón magnético, el div de las puertas) no cambian la
// caja. Solo Chromium: WebKit no expone las entradas layout-shift.

type Ventana = { __cls: number; __saltos: { valor: number; nodos: string[] }[]; __tops: (number | null)[] };

// Suma los layout-shift que no vienen de una acción reciente (los que cuentan
// para CLS) desde el arranque de la página, y anota de dónde vienen.
function vigilarCls() {
  const w = window as unknown as Ventana;
  w.__cls = 0;
  w.__saltos = [];
  new PerformanceObserver((lista) => {
    for (const e of lista.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean; sources?: { node?: Node }[] })[]) {
      if (e.hadRecentInput) continue;
      w.__cls += e.value;
      w.__saltos.push({
        valor: e.value,
        nodos: (e.sources ?? []).map((s) => {
          const n = s.node as Element | undefined;
          return n?.nodeType === 1 ? `${n.tagName.toLowerCase()}.${[...n.classList].slice(0, 3).join(".")}` : String(n?.nodeName ?? "?");
        }),
      });
    }
  }).observe({ type: "layout-shift", buffered: true });
}

const cls = (page: Page) => page.evaluate(() => {
  const w = window as unknown as Ventana;
  return { total: w.__cls, saltos: w.__saltos };
});

test.describe("sin layout shift", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "solo Chromium expone layout-shift");

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(vigilarCls);
  });

  for (const ruta of RUTAS) {
    test(`${ruta}: cargar, esperar, recorrer y usar los llamados no mueve la página`, async ({ page, isMobile }) => {
      await irA(page, ruta);
      await page.waitForTimeout(2_000);
      await recorrer(page);
      if (isMobile) {
        // El menú se abre y se cierra sobre la página, sin empujarla.
        const boton = page.getByRole("navigation", { name: "Principal" }).getByRole("button", { name: /menú/ });
        await boton.tap();
        await expect(page.locator("#menu-movil")).toBeVisible();
        await boton.tap();
        await expect(page.locator("#menu-movil")).toHaveCount(0);
      } else {
        // Pasar por cada llamado con imán, presionarlo y soltarlo fuera.
        const ctas = page.locator("main .iman-movil a");
        const n = await ctas.count();
        for (let i = 0; i < n; i++) {
          const cta = ctas.nth(i);
          await quieto(cta);
          const b = await caja(cta);
          await page.mouse.move(b.x + b.width - 2, b.y + b.height - 2, { steps: 4 });
          await page.waitForTimeout(300);
          await page.mouse.move(b.x + 2, b.y + 2, { steps: 4 });
          // Se presiona y se suelta encima; el clic se frena en la página
          // (captura en window), así no se navega.
          await page.evaluate(() =>
            addEventListener(
              "click",
              (e) => {
                e.preventDefault();
                e.stopPropagation();
              },
              { capture: true, once: true },
            ),
          );
          await page.mouse.down();
          await page.waitForTimeout(150);
          await page.mouse.up();
          await page.mouse.move(2, 2);
          await page.waitForTimeout(400);
        }
        await expect(page).toHaveURL(ruta);
      }
      await page.waitForTimeout(500);
      const { total, saltos } = await cls(page);
      expect(total, `CLS ${total.toFixed(4)}: ${JSON.stringify(saltos.slice(0, 8))}`).toBeLessThan(0.01);
    });
  }

  test("lo que sigue al hero está en el mismo lugar a los 0,3 s y a los 1,5 s", async ({ page }) => {
    // Desde el arranque, a los 300 ms y a los 1500 ms, la posición en el
    // documento de la sección que sigue al hero.
    await page.addInitScript(() => {
      const w = window as unknown as Ventana;
      w.__tops = [null, null];
      const metas = [300, 1500];
      const paso = () => {
        const s = document.getElementById("top")?.nextElementSibling;
        metas.forEach((m, i) => {
          if (w.__tops[i] === null && performance.now() >= m && s) w.__tops[i] = Math.round(s.getBoundingClientRect().top + scrollY);
        });
        if (w.__tops.some((t) => t === null)) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    });
    await page.goto("/");
    await expect(page.locator("#top").getByRole("link", { name: hero.cta })).toBeVisible();
    await expect.poll(() => page.evaluate(() => (window as unknown as Ventana).__tops.every((t) => t !== null))).toBe(true);
    const [a, b] = await page.evaluate(() => (window as unknown as Ventana).__tops);
    expect(b).toBe(a);
  });
});
