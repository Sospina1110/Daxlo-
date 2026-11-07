import { consultoria } from "../../src/content/copy";
import { DURACION_PASO } from "../../src/lib/recorrido";
import { expect, irA, test, tocar, type Page } from "./apoyo";

// El recorrido de /consultoria como un video corto (2026-11-06): una escena
// animada por paso que avanza sola, la barra de capítulos con un nodo por
// paso, pausa y "Volver a ver". Lo que se revisa aquí:
// - arranca al verse y avanza solo, con el ritmo de DURACION_PASO;
// - el botón pausa escena y barra juntas, y fuera de pantalla o con la
//   pestaña oculta también se pausa;
// - cada nodo salta a su paso;
// - al terminar se queda en el 04 y ofrece volver a ver;
// - con "reducir movimiento" nada avanza solo y las escenas quedan quietas;
// - los cuatro pasos están completos en el DOM y para lectores de pantalla,
//   y sin JavaScript se ven los cuatro, como antes;
// - nada se mueve de lugar (CLS) mientras corre o se salta de paso.

const r = consultoria.recorrido;
const a = r.animacion;
const PASOS = r.pasos.length;

const seccion = (page: Page) => page.locator("#como-trabajamos");
const reproductor = (page: Page) => seccion(page).locator(".recorrido");
const controles = (page: Page) => seccion(page).getByRole("group", { name: a.grupo });
const capitulo = (page: Page, i: number) => controles(page).getByRole("button", { name: `${a.verPaso} ${r.pasos[i].numero}: ${r.pasos[i].titulo}` });
const boton = (page: Page) => seccion(page).locator(".recorrido-boton");
const pasos = (page: Page) => seccion(page).locator("ol > li");

const estado = (page: Page) => reproductor(page).getAttribute("data-estado");
const pasoActual = (page: Page) => reproductor(page).getAttribute("data-paso").then(Number);

// Cuánto lleva lleno cada tramo de la barra (0 a 1).
const llenado = (page: Page) =>
  seccion(page)
    .locator(".recorrido-relleno")
    .evaluateAll((els) =>
      els.map((e) => {
        const m = getComputedStyle(e).transform;
        return m === "none" ? 1 : Math.round(new DOMMatrixReadOnly(m).a * 1000) / 1000;
      }),
    );

// Animaciones de CSS (no transiciones) que están corriendo en el reproductor.
const animacionesCorriendo = (page: Page) =>
  reproductor(page).evaluate((el) => el.getAnimations({ subtree: true }).filter((x) => x instanceof CSSAnimation && x.playState === "running").length);

// El escenario, centrado en la pantalla (así se ve entero: arranca).
async function verEscenario(page: Page) {
  await seccion(page)
    .locator(".recorrido-escenario")
    .evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" }));
}

// Acelera el reloj de las animaciones (CDP, solo Chromium): la secuencia
// completa dura 21,5 s.
async function acelerar(page: Page, factor: number) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Animation.enable");
  await cdp.send("Animation.setPlaybackRate", { playbackRate: factor });
}

async function esperarQueCorra(page: Page) {
  await expect.poll(() => estado(page), { message: "el recorrido no arrancó al verse" }).toBe("reproduciendo");
}

test.describe("recorrido animado de /consultoria", () => {
  test("no arranca hasta verse; a la vista avanza solo del 01 al 02, al ritmo del paso", async ({ page }) => {
    await irA(page, "/consultoria");
    // Lejos de la pantalla: en el primer cuadro, quieto.
    expect(await estado(page)).toBe("espera");
    await page.waitForTimeout(1_000);
    expect(await estado(page)).toBe("espera");
    expect((await llenado(page))[0]).toBe(0);
    expect(await pasoActual(page)).toBe(1);

    // Cuándo arranca y cuándo cambia de paso, medido en la página.
    await reproductor(page).evaluate((el) => {
      const w = window as unknown as { __marcas: Record<string, number> };
      w.__marcas = {};
      new MutationObserver(() => {
        const t = performance.now();
        if (el.getAttribute("data-estado") === "reproduciendo") w.__marcas.arranque ??= t;
        if (el.getAttribute("data-paso") === "2") w.__marcas.paso2 ??= t;
      }).observe(el, { attributes: true });
    });
    await verEscenario(page);
    await esperarQueCorra(page);
    await expect(capitulo(page, 0)).toHaveAttribute("aria-current", "step");
    await expect(pasos(page).nth(0)).toHaveAttribute("data-activo", "");

    await expect.poll(() => pasoActual(page), { timeout: DURACION_PASO[0] * 1000 + 5_000 }).toBe(2);
    await expect(capitulo(page, 1)).toHaveAttribute("aria-current", "step");
    await expect(capitulo(page, 0)).not.toHaveAttribute("aria-current", "step");
    await expect(pasos(page).nth(1)).toHaveAttribute("data-activo", "");
    await expect(pasos(page).nth(0)).not.toHaveAttribute("data-activo", "");
    await expect(seccion(page).locator(".escena")).toHaveAttribute("data-escena", "2");
    // El 01 quedó lleno y el 02 empieza a llenarse.
    const [uno, dos] = await llenado(page);
    expect(uno).toBe(1);
    expect(dos).toBeLessThan(1);

    const { arranque, paso2 } = await page.evaluate(() => (window as unknown as { __marcas: Record<string, number> }).__marcas);
    const duracion = (paso2 - arranque) / 1000;
    expect(duracion, `el paso 01 duró ${duracion.toFixed(2)} s`).toBeGreaterThan(DURACION_PASO[0] - 0.3);
    expect(duracion, `el paso 01 duró ${duracion.toFixed(2)} s`).toBeLessThan(DURACION_PASO[0] + 1.5);
  });

  test("el botón pausa escena y barra en el mismo cuadro, y al seguir continúa desde ahí", async ({ page, isMobile }) => {
    await irA(page, "/consultoria");
    await verEscenario(page);
    await esperarQueCorra(page);
    await expect(boton(page)).toHaveAttribute("aria-label", a.pausar);
    await page.waitForTimeout(1_200);

    await tocar(boton(page), isMobile);
    await expect.poll(() => estado(page)).toBe("pausa");
    await expect(boton(page)).toHaveAttribute("aria-label", a.seguir);
    const antes = (await llenado(page))[0];
    expect(antes).toBeGreaterThan(0);
    expect(antes).toBeLessThan(1);
    expect(await animacionesCorriendo(page)).toBe(0);
    // Pasa el tiempo y nada se mueve: ni la barra ni el paso.
    await page.waitForTimeout(2_000);
    expect((await llenado(page))[0]).toBe(antes);
    expect(await pasoActual(page)).toBe(1);

    await tocar(boton(page), isMobile);
    await esperarQueCorra(page);
    await expect(boton(page)).toHaveAttribute("aria-label", a.pausar);
    await expect.poll(async () => (await llenado(page))[0]).toBeGreaterThan(antes);
    expect(await animacionesCorriendo(page)).toBeGreaterThan(0);
  });

  test("fuera de pantalla y con la pestaña oculta se pausa; al volver sigue", async ({ page }) => {
    await irA(page, "/consultoria");
    await verEscenario(page);
    await esperarQueCorra(page);
    await page.waitForTimeout(600);

    // Arriba del todo: el escenario ya no se ve.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect.poll(() => estado(page)).toBe("pausa");
    const quieto = (await llenado(page))[0];
    await page.waitForTimeout(1_200);
    expect((await llenado(page))[0]).toBe(quieto);
    expect(await animacionesCorriendo(page)).toBe(0);
    // El botón sigue diciendo "Pausar": no lo pausó la persona.
    await expect(boton(page)).toHaveAttribute("aria-label", a.pausar);

    await verEscenario(page);
    await esperarQueCorra(page);

    // Pestaña oculta (se simula: Playwright no oculta la pestaña).
    const pestana = (oculta: boolean) =>
      page.evaluate((o) => {
        Object.defineProperty(document, "hidden", { configurable: true, get: () => o });
        document.dispatchEvent(new Event("visibilitychange"));
      }, oculta);
    await pestana(true);
    await expect.poll(() => estado(page)).toBe("pausa");
    expect(await animacionesCorriendo(page)).toBe(0);
    await pestana(false);
    await esperarQueCorra(page);
  });

  test("cada nodo salta a su paso: corriendo sigue desde ahí; en pausa muestra el paso completo y quieto", async ({ page, isMobile }) => {
    await irA(page, "/consultoria");
    await verEscenario(page);
    await esperarQueCorra(page);

    await tocar(capitulo(page, 2), isMobile);
    await expect.poll(() => pasoActual(page)).toBe(3);
    await expect(capitulo(page, 2)).toHaveAttribute("aria-current", "step");
    await expect(pasos(page).nth(2)).toHaveAttribute("data-activo", "");
    await expect(seccion(page).locator(".escena")).toHaveAttribute("data-escena", "3");
    await esperarQueCorra(page);
    const [uno, dos, tres, cuatro] = await llenado(page);
    expect([uno, dos]).toEqual([1, 1]);
    expect(tres).toBeLessThan(1);
    expect(cuatro).toBe(0);

    // En pausa, el nodo muestra su paso con la escena en su cuadro final.
    await tocar(boton(page), isMobile);
    await expect.poll(() => estado(page)).toBe("pausa");
    await tocar(capitulo(page, 1), isMobile);
    await expect.poll(() => pasoActual(page)).toBe(2);
    await expect(reproductor(page)).toHaveAttribute("data-cuadro", "final");
    await expect(pasos(page).nth(1)).toHaveAttribute("data-activo", "");
    expect(await animacionesCorriendo(page)).toBe(0);
    await page.waitForTimeout(1_500);
    expect(await pasoActual(page)).toBe(2);
    expect(await estado(page)).toBe("pausa");

    // Al seguir, ese paso corre desde el principio.
    await tocar(boton(page), isMobile);
    await esperarQueCorra(page);
    await expect(reproductor(page)).toHaveAttribute("data-cuadro", "animado");
    expect(await pasoActual(page)).toBe(2);
  });

  test("corre los cuatro pasos en orden, se queda en el 04 y ofrece volver a ver", async ({ page, browserName, isMobile }) => {
    test.skip(browserName !== "chromium", "acelera el reloj de las animaciones con CDP");
    await irA(page, "/consultoria");
    // Cada paso que se muestra, en orden.
    await reproductor(page).evaluate((el) => {
      const w = window as unknown as { __vistos: string[] };
      w.__vistos = [el.getAttribute("data-paso") ?? ""];
      new MutationObserver(() => {
        const p = el.getAttribute("data-paso") ?? "";
        if (w.__vistos.at(-1) !== p) w.__vistos.push(p);
      }).observe(el, { attributes: true, attributeFilter: ["data-paso"] });
    });
    await acelerar(page, 8);
    await verEscenario(page);
    await expect.poll(() => estado(page), { timeout: 20_000 }).toBe("fin");
    expect(await page.evaluate(() => (window as unknown as { __vistos: string[] }).__vistos)).toEqual(["1", "2", "3", "4"]);
    expect(await pasoActual(page)).toBe(PASOS);
    await expect(capitulo(page, PASOS - 1)).toHaveAttribute("aria-current", "step");
    await expect(boton(page)).toHaveAttribute("aria-label", a.volver);
    expect(await llenado(page)).toEqual(Array(PASOS).fill(1));
    // Se queda ahí.
    await page.waitForTimeout(1_000);
    expect(await estado(page)).toBe("fin");
    expect(await pasoActual(page)).toBe(PASOS);

    await tocar(boton(page), isMobile);
    await esperarQueCorra(page);
    expect(await pasoActual(page)).toBe(1);
    await expect(boton(page)).toHaveAttribute("aria-label", a.pausar);
    expect((await llenado(page)).slice(1)).toEqual([0, 0, 0]);
  });

  test("los cuatro pasos están completos en el DOM y para lectores de pantalla, aunque se vea uno", async ({ page }) => {
    await irA(page, "/consultoria");
    await verEscenario(page);
    await esperarQueCorra(page);
    await expect(pasos(page)).toHaveCount(PASOS);
    for (const [i, p] of r.pasos.entries()) {
      const li = pasos(page).nth(i);
      await expect(li.getByRole("heading", { level: 3, name: p.titulo, exact: true })).toHaveCount(1);
      await expect(li).toContainText(p.numero);
      await expect(li).toContainText(p.texto);
      await expect(li).toContainText(`${p.rotulo}${p.llevas}`);
      // Cada nodo nombra su paso.
      await expect(capitulo(page, i)).toHaveCount(1);
    }
    // En el árbol de accesibilidad están los cuatro, con todo su texto. El
    // escenario es decorativo: no aparece.
    const arbol = await seccion(page).ariaSnapshot();
    for (const p of r.pasos) {
      expect(arbol).toContain(p.titulo);
      expect(arbol).toContain(p.texto);
      expect(arbol).toContain(p.llevas);
    }
    expect(arbol).not.toContain(a.escenas.siguiente);
    // Uno a la vista; los otros tres, apilados en la misma celda (mismo lugar
    // en el layout: offsetTop no cuenta los 6 px del transform de los que
    // esperan).
    const cajas = await pasos(page).evaluateAll((els) => els.map((e) => ({ op: getComputedStyle(e).opacity, top: (e as HTMLElement).offsetTop, left: (e as HTMLElement).offsetLeft })));
    expect(cajas.filter((c) => c.op === "1")).toHaveLength(1);
    expect(new Set(cajas.map((c) => `${c.top},${c.left}`)).size, JSON.stringify(cajas)).toBe(1);
  });

  test("nada se corre de lugar mientras corre la secuencia y se salta entre pasos (CLS 0)", async ({ page, browserName, isMobile }) => {
    test.skip(browserName !== "chromium", "solo Chromium expone layout-shift y acelera con CDP");
    await irA(page, "/consultoria");
    await verEscenario(page);
    await esperarQueCorra(page);
    // Desde aquí, todo layout-shift del contenido cuenta, aunque venga de un
    // toque. La barra de navegación queda fuera: se compacta con el salto de
    // scroll de arriba (su propio CLS lo mide estabilidad.spec.ts) y en una
    // máquina cargada puede terminar de hacerlo ya empezada la medición.
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      const w = window as unknown as { __saltos: { valor: number; nodos: string[] }[] };
      w.__saltos = [];
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as (PerformanceEntry & { value: number; sources?: { node?: Node }[] })[]) {
          const nodos = (e.sources ?? [])
            .map((s) => (s.node?.nodeType === 1 ? (s.node as Element) : (s.node?.parentElement ?? null)))
            .filter((n): n is Element => !!n?.closest("main"));
          if (nodos.length) w.__saltos.push({ valor: e.value, nodos: nodos.map((n) => n.className.toString().slice(0, 60)) });
        }
      }).observe({ type: "layout-shift" });
    });
    // Alto del reproductor y lugar de la sección siguiente, en cada paso.
    const medir = () =>
      page.evaluate(() => ({
        alto: Math.round(document.querySelector("#como-trabajamos .recorrido")!.getBoundingClientRect().height),
        siguiente: Math.round(document.querySelector("#para-tu-empresa")!.getBoundingClientRect().top + scrollY),
      }));
    const medidas = [await medir()];
    await acelerar(page, 6);
    for (let p = 2; p <= PASOS; p++) {
      await expect.poll(() => pasoActual(page), { timeout: 15_000 }).toBe(p);
      await page.waitForTimeout(150);
      medidas.push(await medir());
    }
    await expect.poll(() => estado(page), { timeout: 15_000 }).toBe("fin");
    for (const i of [1, 2, 0]) {
      await tocar(capitulo(page, i), isMobile);
      await expect.poll(() => pasoActual(page)).toBe(i + 1);
      await page.waitForTimeout(400);
      medidas.push(await medir());
    }
    expect(new Set(medidas.map((m) => m.alto)).size, JSON.stringify(medidas)).toBe(1);
    expect(new Set(medidas.map((m) => m.siguiente)).size, JSON.stringify(medidas)).toBe(1);
    const saltos = await page.evaluate(() => (window as unknown as { __saltos: { valor: number; nodos: string[] }[] }).__saltos);
    expect(saltos, JSON.stringify(saltos.slice(0, 6))).toEqual([]);
  });
});

test.describe("recorrido de /consultoria con 'reducir movimiento'", () => {
  test.use({ reducedMotion: "reduce" });

  test("nada avanza solo, no hay botón de pausa y cada escena queda quieta en su cuadro final", async ({ page, isMobile }) => {
    await irA(page, "/consultoria");
    await verEscenario(page);
    await expect.poll(() => estado(page)).toBe("quieto");
    await expect(reproductor(page)).toHaveAttribute("data-cuadro", "final");
    await expect(boton(page)).toBeHidden();
    expect(await animacionesCorriendo(page)).toBe(0);
    await page.waitForTimeout(DURACION_PASO[0] * 1000 + 500);
    expect(await pasoActual(page)).toBe(1);
    expect(await animacionesCorriendo(page)).toBe(0);

    // Se navega a mano con los nodos; la escena llega completa, sin moverse.
    for (const i of [3, 1]) {
      await tocar(capitulo(page, i), isMobile);
      await expect.poll(() => pasoActual(page)).toBe(i + 1);
      await expect(pasos(page).nth(i)).toHaveAttribute("data-activo", "");
      await expect.poll(() => pasos(page).nth(i).evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
      expect(await pasos(page).nth(i).evaluate((e) => getComputedStyle(e).transform)).toBe("none");
      expect(await animacionesCorriendo(page)).toBe(0);
      // Todo lo que tiene texto en la escena se ve entero (cuadro final).
      const textos = await seccion(page)
        .locator(".escena")
        .evaluate((esc) =>
          [...esc.querySelectorAll("*")]
            .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim()))
            .map((el) => {
              let o = 1;
              for (let e: Element | null = el; e && e !== esc; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity);
              return { texto: el.textContent?.trim(), opacidad: o, transform: getComputedStyle(el).transform };
            }),
        );
      expect(textos.length).toBeGreaterThan(0);
      for (const t of textos) expect(t.opacidad, t.texto).toBeGreaterThan(0.39);
    }
    // La barra marca hasta el paso elegido, sin animarse.
    expect(await llenado(page)).toEqual([1, 1, 0, 0]);
  });
});

test.describe("recorrido de /consultoria sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("se ven los cuatro pasos, como la línea de tiempo de antes, sin escenario ni controles", async ({ page }) => {
    const res = await page.goto("/consultoria");
    expect(res?.status()).toBe(200);
    await expect(seccion(page).locator(".recorrido-escenario")).toBeHidden();
    await expect(seccion(page).locator(".recorrido-controles")).toBeHidden();
    await expect(pasos(page)).toHaveCount(PASOS);
    for (const [i, p] of r.pasos.entries()) {
      const li = pasos(page).nth(i);
      await expect(li.getByRole("heading", { level: 3, name: p.titulo })).toBeVisible();
      await expect(li.getByText(p.llevas)).toBeVisible();
      expect(await li.evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
    }
    // Los nodos y la línea que los une, a la vista.
    await expect(seccion(page).locator(".recorrido-estatico:visible")).toHaveCount(PASOS * 2 - 1);
    // Desde 1024 px, cuatro columnas; por debajo, uno debajo del otro.
    const tops = await pasos(page).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
    if ((page.viewportSize()?.width ?? 0) >= 1024) expect(new Set(tops).size).toBe(1);
    else expect(tops).toEqual([...tops].sort((x, y) => x - y));
  });
});
