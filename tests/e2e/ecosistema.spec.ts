import { ecosistema } from "../../src/content/copy";
import { PASO_FINAL } from "../../src/lib/ecosistema";
import { expect, irA, test, type Page } from "./apoyo";

// La pieza del ecosistema del inicio (src/components/sections/ecosistema.tsx):
// un escenario fijo que pasa de "a mano" a "encendido" en cuatro pasos
// mientras se baja. Aquí se vigila el comportamiento, no las medidas:
// - los cuatro estados cambian con el scroll, en orden, y vuelven al subir;
// - lo que se mueve sin fin corre solo con el escenario a la vista;
// - con «reducir movimiento» o sin JavaScript queda el cuadro final, nada se
//   fija y los cuatro pasos están encendidos;
// - ningún rótulo del escenario baja de 13 px;
// - el contenido completo está en el HTML y el escenario es una imagen para
//   los lectores de pantalla.

const escenario = (page: Page) => page.locator("[data-escenario]");
const pasos = (page: Page) => page.locator("[data-paso-texto]");

// Lleva el paso `i` a la línea que lo activa: el centro de la pantalla en
// escritorio y más abajo en celular, donde el escenario va fijo arriba.
async function llevarPaso(page: Page, i: number, esCelular: boolean) {
  await pasos(page)
    .nth(i)
    .evaluate((el, f) => {
      const r = el.getBoundingClientRect();
      scrollTo({ top: scrollY + r.top + Math.min(r.height / 2, 120) - innerHeight * f, behavior: "instant" });
    }, esCelular ? 0.72 : 0.5);
}

// Animaciones sin fin del escenario que siguen corriendo.
const infinitas = (page: Page) =>
  escenario(page).evaluate((e) =>
    e
      .getAnimations({ subtree: true })
      .filter((a) => a.playState === "running" && a.effect?.getTiming().iterations === Infinity).length,
  );

test.describe("ecosistema del inicio", () => {
  test("el contenido completo está en el HTML: cuatro pasos con su título y el escenario como imagen", async ({ page }) => {
    await irA(page, "/");
    await expect(pasos(page)).toHaveCount(4);
    for (const [i, p] of ecosistema.pasos.entries()) {
      const paso = pasos(page).nth(i);
      await expect(paso.locator("h3")).toHaveText(p.titulo);
      await expect(paso).toContainText(p.rotulo);
      await expect(paso).toContainText(p.texto);
    }
    await expect(escenario(page)).toHaveAttribute("role", "img");
    await expect(escenario(page)).toHaveAttribute("aria-label", ecosistema.descripcion);
    // Lo de adentro no se anuncia ni recibe el foco, y va rotulado "Ejemplo".
    expect(await escenario(page).evaluate((e) => [...e.children].every((h) => h.getAttribute("aria-hidden") === "true"))).toBe(true);
    await expect(escenario(page).locator("a, button, [tabindex]")).toHaveCount(0);
    await expect(escenario(page).getByText(ecosistema.etiqueta, { exact: true })).toHaveCount(1);
  });

  test("los cuatro estados cambian con el scroll, en orden, y el paso que se lee es el único encendido", async ({ page, isMobile }) => {
    await irA(page, "/");
    await expect(page.locator(".eco")).toHaveAttribute("data-vivo", "");
    for (let i = 0; i < 4; i++) {
      await llevarPaso(page, i, isMobile);
      await expect(escenario(page)).toHaveAttribute("data-paso", String(i));
      await expect(pasos(page).nth(i)).toHaveAttribute("data-activo", "");
      await expect(page.locator("[data-paso-texto][data-activo]")).toHaveCount(1);
      await expect(pasos(page).nth(i)).toHaveCSS("opacity", "1");
    }
    // Y al subir, vuelve.
    await llevarPaso(page, 1, isMobile);
    await expect(escenario(page)).toHaveAttribute("data-paso", "1");
  });

  test("en 'Hoy' no hay agentes y nada se mueve; desde 'Lo montamos' el trabajo circula y Daxlo aparece", async ({ page, isMobile }) => {
    await irA(page, "/");
    await llevarPaso(page, 0, isMobile);
    await expect(escenario(page)).toHaveAttribute("data-paso", "0");
    const agente = escenario(page).locator(".eco-agente .eco-forma").first();
    const hueco = escenario(page).locator(".eco-hueco").first();
    await expect(agente).toHaveCSS("opacity", "0");
    await expect(hueco).toHaveCSS("opacity", "1");
    await expect(hueco).toHaveText(ecosistema.estados.aMano);
    await expect(escenario(page).locator(".eco-daxlo")).toHaveCSS("opacity", "0");
    expect(await infinitas(page)).toBe(0);

    await llevarPaso(page, 1, isMobile);
    await expect(agente).toHaveCSS("opacity", "1");
    await expect(hueco).toHaveCSS("opacity", "0");
    await expect(escenario(page).locator(".eco-daxlo")).toHaveCSS("opacity", "1");
    // Circula un papel por carril: nunca más de cuatro cosas sin fin a la vez
    // por carril visible (el papel y el brillo de su agente).
    await expect.poll(() => infinitas(page)).toBeGreaterThan(0);

    // Las personas se encienden en el paso 3 y el cuarto carril llega en el 4.
    const persona = escenario(page).locator(".eco-lleno").first();
    await expect(persona).toHaveCSS("opacity", "0");
    await llevarPaso(page, 2, isMobile);
    await expect(persona).toHaveCSS("opacity", "1");
    await expect(escenario(page).locator(".eco-siguiente")).toHaveCSS("opacity", "0");
    await llevarPaso(page, 3, isMobile);
    await expect(escenario(page).locator(".eco-siguiente")).toHaveCSS("opacity", "1");
  });

  test("lo que se mueve sin fin se pausa con el escenario fuera de la vista y sigue al volver", async ({ page, isMobile }) => {
    await irA(page, "/");
    // Arriba del todo el escenario no se ve: en pausa.
    await expect(escenario(page)).toHaveAttribute("data-pausa", "");
    expect(await infinitas(page)).toBe(0);
    await llevarPaso(page, 2, isMobile);
    await expect(escenario(page)).not.toHaveAttribute("data-pausa", "");
    await expect.poll(() => infinitas(page)).toBeGreaterThan(0);
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await expect(escenario(page)).toHaveAttribute("data-pausa", "");
    await expect.poll(() => infinitas(page)).toBe(0);
  });

  test("solo anima transform y opacity", async ({ page, isMobile }) => {
    await irA(page, "/");
    await llevarPaso(page, 3, isMobile);
    await page.waitForTimeout(800);
    const propiedades = await escenario(page).evaluate((e) => {
      const vistas = new Set<string>();
      for (const a of e.getAnimations({ subtree: true })) {
        const efecto = a.effect as KeyframeEffect | null;
        for (const k of efecto?.getKeyframes() ?? []) {
          for (const p of Object.keys(k)) if (!["offset", "easing", "composite", "computedOffset"].includes(p)) vistas.add(p);
        }
      }
      return [...vistas];
    });
    expect(propiedades.filter((p) => !["transform", "opacity"].includes(p))).toEqual([]);
  });

  test("ningún rótulo del escenario ni de la leyenda mide menos de 13 px, y nada se sale de la placa", async ({ page, isMobile }) => {
    await irA(page, "/");
    await llevarPaso(page, 3, isMobile);
    await page.waitForTimeout(600);
    const { chicos, fuera } = await page.evaluate(() => {
      const chicos: string[] = [];
      const fuera: string[] = [];
      const caja = document.querySelector("[data-escenario]")!.getBoundingClientRect();
      for (const raiz of document.querySelectorAll("[data-escenario], .eco-leyenda")) {
        const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
        while (w.nextNode()) {
          const el = w.currentNode.parentElement;
          const texto = (w.currentNode.textContent ?? "").trim();
          if (!el || !texto || el.getClientRects().length === 0) continue;
          const cs = getComputedStyle(el);
          const px = parseFloat(cs.fontSize);
          // Los papeles de celular no llevan letra a la vista (van recortados
          // y sin color), pero conservan su tamaño.
          if (cs.visibility === "hidden") continue;
          if (px < 13) chicos.push(`${texto} (${px}px)`);
          if (raiz.hasAttribute("data-escenario")) {
            const r = el.getBoundingClientRect();
            if (r.left < caja.left - 1 || r.right > caja.right + 1 || r.top < caja.top - 1 || r.bottom > caja.bottom + 1) fuera.push(texto);
          }
        }
      }
      return { chicos, fuera };
    });
    expect(chicos).toEqual([]);
    expect(fuera).toEqual([]);
  });

  test("el escenario se queda fijo mientras pasan los pasos y no mueve nada al cambiar de estado", async ({ page, isMobile, browserName }) => {
    await irA(page, "/");
    await llevarPaso(page, 1, isMobile);
    const arriba1 = await escenario(page).evaluate((e) => Math.round(e.getBoundingClientRect().top));
    const alto1 = await escenario(page).evaluate((e) => Math.round(e.getBoundingClientRect().height));
    await llevarPaso(page, 2, isMobile);
    const arriba2 = await escenario(page).evaluate((e) => Math.round(e.getBoundingClientRect().top));
    const alto2 = await escenario(page).evaluate((e) => Math.round(e.getBoundingClientRect().height));
    expect(arriba2).toBe(arriba1);
    expect(alto2).toBe(alto1);
    expect(await escenario(page).evaluate((e) => getComputedStyle(e.closest(".eco-caja")!).position)).toBe("sticky");
    if (browserName !== "chromium") return;
    // Recorrer los cuatro estados no corre nada de lugar. Se espera a que la
    // barra termine de compactarse (cambia de ancho una vez al dejar el tope
    // de la página; es la excepción documentada y no es de esta pieza).
    await page.waitForTimeout(800);
    await page.evaluate(() => {
      const w = window as unknown as { __cls: number };
      w.__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) if (!e.hadRecentInput) w.__cls += e.value;
      }).observe({ type: "layout-shift" });
    });
    for (const i of [3, 0, 2, 1]) {
      await llevarPaso(page, i, isMobile);
      await page.waitForTimeout(500);
    }
    expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBeLessThan(0.001);
  });
});

test.describe("ecosistema con 'reducir movimiento'", () => {
  test.use({ reducedMotion: "reduce" });

  test("queda el cuadro final, nada se fija, nada se mueve y los cuatro pasos están encendidos", async ({ page, isMobile }) => {
    await irA(page, "/");
    await expect(page.locator(".eco")).not.toHaveAttribute("data-vivo", "");
    await llevarPaso(page, 0, isMobile);
    await page.waitForTimeout(400);
    await expect(escenario(page)).toHaveAttribute("data-paso", String(PASO_FINAL));
    expect(await escenario(page).evaluate((e) => getComputedStyle(e.closest(".eco-caja")!).position)).not.toBe("sticky");
    for (let i = 0; i < 4; i++) {
      await expect(pasos(page).nth(i)).toHaveCSS("opacity", "1");
      await expect(pasos(page).nth(i)).not.toHaveAttribute("data-activo", "");
    }
    // El cuadro final: agentes, personas encendidas con "Aprueba", Daxlo al
    // lado y el carril de lo que sigue.
    for (const sel of [".eco-agente .eco-forma", ".eco-lleno", ".eco-aprueba", ".eco-daxlo", ".eco-daxlo-punteada", ".eco-siguiente"]) {
      await expect(escenario(page).locator(sel).first(), sel).toHaveCSS("opacity", "1");
    }
    await expect(escenario(page).locator(".eco-hueco").first()).toHaveCSS("opacity", "0");
    await expect(escenario(page).getByText(ecosistema.daxlo.acciones[1], { exact: true })).toHaveCSS("opacity", "1");
    expect(await escenario(page).evaluate((e) => e.getAnimations({ subtree: true }).filter((a) => a.playState === "running").length)).toBe(0);
  });
});

test.describe("ecosistema sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("se ve entero: el escenario en su cuadro final y los cuatro pasos, sin nada fijo", async ({ page }) => {
    await page.goto("/");
    await expect(escenario(page)).toHaveAttribute("data-paso", String(PASO_FINAL));
    await expect(pasos(page)).toHaveCount(4);
    for (let i = 0; i < 4; i++) await expect(pasos(page).nth(i)).toHaveCSS("opacity", "1");
    expect(await escenario(page).evaluate((e) => getComputedStyle(e.closest(".eco-caja")!).position)).not.toBe("sticky");
    await expect(escenario(page).locator(".eco-agente .eco-forma").first()).toHaveCSS("opacity", "1");
    await expect(page.getByRole("heading", { name: ecosistema.titulo })).toBeVisible();
  });
});
