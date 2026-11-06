import { agendar, dosFormas, faq, hero, nav, preguntasLinea } from "../../src/content/copy";
import { caja, expect, irA, quieto, test, type Locator, type Page } from "./apoyo";

// Respuesta al presionar y teclado (DESIGN.md, Motion): todo lo pulsable baja
// al presionar con dedo o mouse (0.98 el botón principal, 0.97 los demás,
// 0.99 las tarjetas-enlace) en 120 ms y vuelve en 120 ms: soltar no puede ser
// la fase lenta. Lo que dispara el teclado no se anima.

type Medida = { __bajada: number | null; __vuelta: number | null };

// Presiona con el mouse y suelta sobre el mismo elemento. El clic que sigue se
// frena en la página (fase de captura en window: ni React ni el navegador lo
// ven), así no se navega; soltar fuera arrastraría el enlace. Dentro de la
// página, cuadro a cuadro, se mide cuánto tarda la escala de `medir` en llegar
// a `escala` desde pointerdown, y en volver a none desde pointerup.
async function presionar(page: Page, apretar: Locator, medir: Locator, escala: string) {
  await quieto(apretar);
  const b = await caja(apretar);
  await page.mouse.move(b.x + b.width / 2, b.y + Math.min(b.height / 2, 30));
  await medir.evaluate((el, escala) => {
    const w = window as unknown as Medida;
    w.__bajada = null;
    w.__vuelta = null;
    let abajo = 0;
    let arriba = 0;
    const frenar = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    addEventListener("click", frenar, { capture: true, once: true });
    addEventListener("pointerdown", () => (abajo = performance.now()), { capture: true, once: true });
    addEventListener("pointerup", () => (arriba = performance.now()), { capture: true, once: true });
    const inicio = performance.now();
    const paso = () => {
      const s = getComputedStyle(el).scale;
      if (abajo && w.__bajada === null && s === escala) w.__bajada = performance.now() - abajo;
      if (arriba && w.__vuelta === null && s === "none") return void (w.__vuelta = performance.now() - arriba);
      if (performance.now() - inicio > 10_000) return;
      requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }, escala);
  await page.mouse.down();
  await expect.poll(() => page.evaluate(() => (window as unknown as Medida).__bajada), { message: `no llegó a ${escala}` }).not.toBeNull();
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => (window as unknown as Medida).__vuelta), { message: "no volvió a none" }).not.toBeNull();
  return page.evaluate(() => {
    const w = window as unknown as Medida;
    return { bajada: w.__bajada as number, vuelta: w.__vuelta as number };
  });
}

test.describe("al presionar con el mouse", () => {
  test.skip(({ isMobile }) => isMobile, "con mouse");

  test("el botón principal baja a 0.98, un botón de luz a 0.97 y una puerta a 0.99; vuelven al soltar", async ({ page }) => {
    await irA(page, "/");
    const principal = page.locator("#top").getByRole("link", { name: hero.cta });
    const luz = page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: nav.cta.label, exact: true });
    const puerta = page.locator("article").filter({ hasText: dosFormas.coaching.regla });
    for (const [nombre, apretar, medir, escala] of [
      ["botón principal", principal, principal, "0.98"],
      ["botón de luz", luz, luz, "0.97"],
      ["puerta", puerta.getByText(dosFormas.coaching.regla, { exact: true }), puerta, "0.99"],
    ] as const) {
      const { bajada, vuelta } = await presionar(page, apretar, medir, escala);
      expect(bajada, `${nombre}: tardó ${Math.round(bajada)} ms en bajar a ${escala}`).toBeLessThanOrEqual(150);
      // 120 ms y un cuadro de margen (antes volvía en 200 ms y el tope era 300).
      expect(vuelta, `${nombre}: tardó ${Math.round(vuelta)} ms en volver`).toBeLessThanOrEqual(170);
    }
    // Ningún clic llegó a navegar.
    await expect(page).toHaveURL("/");
  });
});

test.describe("con el teclado", () => {
  test.skip(({ isMobile }) => isMobile, "con teclado");

  // Foco por teclado (Tab y luego al elemento) y Espacio apretado: el
  // elemento queda :active, pero no se escala.
  async function espacioApretado(page: Page, boton: Locator, medir: Locator) {
    await quieto(boton);
    await page.mouse.move(2, 2);
    await page.keyboard.press("Tab");
    await boton.focus();
    expect(await boton.evaluate((b) => b.matches(":focus-visible"))).toBe(true);
    await page.keyboard.down("Space");
    try {
      expect(await boton.evaluate((b) => b.matches(":active")), "el navegador no marcó :active con Espacio").toBe(true);
      await page.waitForTimeout(200);
      expect(await medir.evaluate((el) => getComputedStyle(el).scale)).toBe("none");
    } finally {
      await page.keyboard.up("Space");
    }
  }

  test("Espacio sobre una pregunta no escala el '+', y sobre Enviar no escala el botón", async ({ page }) => {
    await irA(page, "/coaching");
    const q = faq.grupos[preguntasLinea.coaching.grupo].preguntas[0];
    const pregunta = page.getByRole("button", { name: q.p, exact: true });
    await espacioApretado(page, pregunta, pregunta.locator("svg"));
    // Se abrió con el teclado: el '+' gira de una vez, sin transición.
    await expect(pregunta).toHaveAttribute("aria-expanded", "true");
    expect(await pregunta.locator("svg").evaluate((s) => s.getAnimations().length)).toBe(0);

    await irA(page, "/agendar");
    const enviar = page.getByRole("button", { name: new RegExp(agendar.enviar) });
    // Soltar Espacio envía el formulario vacío: se queda en la validación
    // (errores en la página), no sale nada.
    await espacioApretado(page, enviar, enviar);
  });

  test("un bloque que todavía no apareció se muestra completo y quieto apenas recibe el foco", async ({ page }) => {
    await irA(page, "/consultoria");
    const estado = await page.evaluate(() => {
      const enlace = document.querySelector<HTMLElement>("[data-revelar]:not([data-visible]) a[href]");
      if (!enlace) return null;
      const bloque = enlace.closest("[data-revelar]") as HTMLElement;
      const antes = getComputedStyle(bloque).opacity;
      enlace.focus({ preventScroll: true });
      const cs = getComputedStyle(bloque);
      return { antes, opacidad: cs.opacity, transform: cs.transform, visible: bloque.hasAttribute("data-visible") };
    });
    expect(estado, "no hay enlaces en bloques sin aparecer").not.toBeNull();
    expect(estado).toEqual({ antes: "0", opacidad: "1", transform: "none", visible: false });
  });
});

test.describe("en celular", () => {
  test.skip(({ isMobile }) => !isMobile, "solo celulares");

  test("sin el recuadro gris al tocar", async ({ page }) => {
    await irA(page, "/");
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("-webkit-tap-highlight-color"))).toBe("rgba(0, 0, 0, 0)");
  });

  test("Escape cierra el menú en 100 ms o menos (con teclado no hay salida animada)", async ({ page }) => {
    await irA(page, "/");
    const boton = page.getByRole("navigation", { name: "Principal" }).getByRole("button", { name: /menú/ });
    await boton.tap();
    await expect(page.locator("#menu-movil")).toBeVisible();
    await page.evaluate(() => {
      const w = window as unknown as { __escape?: number; __cerrado?: number };
      addEventListener("keydown", (e) => e.key === "Escape" && (w.__escape = performance.now()), { capture: true, once: true });
      const paso = () => {
        if (w.__escape && !document.getElementById("menu-movil")) return void (w.__cerrado = performance.now());
        requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    });
    await page.keyboard.press("Escape");
    await expect(page.locator("#menu-movil")).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => (window as unknown as { __cerrado?: number }).__cerrado ?? null)).not.toBeNull();
    const ms = await page.evaluate(() => {
      const w = window as unknown as { __escape: number; __cerrado: number };
      return w.__cerrado - w.__escape;
    });
    expect(ms, `el menú tardó ${Math.round(ms)} ms en irse`).toBeLessThanOrEqual(100);
  });
});
