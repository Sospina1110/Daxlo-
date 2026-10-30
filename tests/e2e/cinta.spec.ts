import { hero } from "../../src/content/copy";
import { MAX_ZONAS } from "../../src/lib/cinta/shader";
import { expect, irA, irAlFinal, irArriba, test, type Page } from "./apoyo";

// La cinta de luz del hero: un lienzo WebGL decorativo que ondula solo, se
// inclina hacia el mouse, se detiene fuera de vista, queda quieto con
// "reducir movimiento" y nunca deja el texto sin contraste.
//
// Solo Chromium: es el que trae WebGL sin ventana con las banderas de
// playwright.config.ts. Si el equipo no da WebGL (o lo da tan lento que la
// calidad adaptativa deja un cuadro quieto), las pruebas del bucle se saltan
// y queda revisado el respaldo.

test.skip(({ browserName }) => browserName !== "chromium", "WebGL sin ventana: solo Chromium");

const capa = (page: Page) => page.locator("#top .cinta");

// Cuenta cuadros dibujados (drawArrays) para saber si el bucle corre.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __dibujos: number };
    w.__dibujos = 0;
    const original = WebGLRenderingContext.prototype.drawArrays;
    WebGLRenderingContext.prototype.drawArrays = function (...a: Parameters<typeof original>) {
      w.__dibujos++;
      return original.apply(this, a);
    };
  });
});

const dibujos = (page: Page) => page.evaluate(() => (window as unknown as { __dibujos: number }).__dibujos);

// Espera a que el motor arranque y devuelve en qué quedó.
async function estadoFinal(page: Page) {
  await expect.poll(() => capa(page).getAttribute("data-cinta"), { message: "el motor de la cinta no arrancó" }).not.toBe("carga");
  return (await capa(page).getAttribute("data-cinta")) ?? "";
}

test("el fondo es un lienzo decorativo que arranca después del texto y no mueve nada", async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __cls: number };
    w.__cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean; sources?: { node?: Node }[] })[]) {
        // Solo los saltos de cajas del hero.
        const enHero = e.sources?.some((s) => s.node instanceof Element && s.node.closest("#top"));
        if (!e.hadRecentInput && enHero) w.__cls += e.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  await irA(page, "/");
  // El titular ya está en el HTML: no espera al motor.
  await expect(page.locator("h1")).toContainText(hero.titulo[0]);
  const estado = await estadoFinal(page);
  expect(["lista", "quieta", "respaldo"]).toContain(estado);
  const lienzo = capa(page).locator("canvas");
  expect(await lienzo.evaluate((c) => ({ eventos: getComputedStyle(c).pointerEvents, posicion: getComputedStyle(c).position, oculto: !!c.closest("[aria-hidden='true']") }))).toEqual({
    eventos: "none",
    posicion: "absolute",
    oculto: true,
  });
  await page.waitForTimeout(1_500);
  expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBeLessThan(0.001);
});

test("con el mouse sobre el hero la cinta reacciona; al irse, vuelve a su reposo", async ({ page, isMobile }) => {
  test.skip(isMobile, "solo con mouse");
  await irA(page, "/");
  const estado = await estadoFinal(page);
  test.skip(estado !== "lista", `sin bucle en este equipo (${estado})`);
  await expect(capa(page)).toHaveAttribute("data-modo", "fino");
  await expect(capa(page)).toHaveAttribute("data-puntero", "reposo");
  // Sobre el titular, no solo en los costados: se tiene que sentir apenas se mueve.
  await page.mouse.move(300, 300);
  await page.mouse.move(560, 340, { steps: 10 });
  await expect(capa(page)).toHaveAttribute("data-puntero", "activo");
  // Con el hero todavía a la vista pero el puntero ya debajo de él, se suelta.
  await page.evaluate(() => scrollTo({ top: (document.querySelector("#top") as HTMLElement).offsetHeight * 0.6, behavior: "instant" }));
  await page.mouse.move(700, (page.viewportSize()?.height ?? 900) - 10, { steps: 4 });
  await expect(capa(page)).toHaveAttribute("data-puntero", "reposo");
});

test("fuera de vista deja de dibujar y al volver sigue", async ({ page }) => {
  await irA(page, "/");
  const estado = await estadoFinal(page);
  test.skip(estado !== "lista", `sin bucle en este equipo (${estado})`);
  const antes = await dibujos(page);
  await page.waitForTimeout(500);
  expect(await dibujos(page)).toBeGreaterThan(antes);

  await irAlFinal(page);
  await expect(capa(page)).toHaveAttribute("data-cinta", "pausa");
  const quieto = await dibujos(page);
  await page.waitForTimeout(800);
  expect(await dibujos(page), "siguió dibujando fuera de vista").toBe(quieto);

  await irArriba(page);
  await expect(capa(page)).toHaveAttribute("data-cinta", "lista");
  await expect.poll(() => dibujos(page)).toBeGreaterThan(quieto);
});

// Un navegador que limita requestAnimationFrame a 30 Hz (ahorro de energía)
// no es un equipo lento: la cinta baja a 30 cuadros y sigue a resolución
// completa, en bucle y con el mouse. Antes, en unos 10 s quedaba quieta.
test("con requestAnimationFrame a 30 Hz sigue en bucle, con el mouse y a resolución completa", async ({ page, isMobile }) => {
  test.skip(isMobile, "solo con mouse (en celular ya va a 30 cuadros)");
  test.setTimeout(120_000);
  // Cada callback espera un cuadro de más: un cuadro de cada dos.
  await page.addInitScript(() => {
    const pedir = window.requestAnimationFrame.bind(window);
    const cancelar = window.cancelAnimationFrame.bind(window);
    const reales = new Map<number, number>();
    let n = 0;
    window.requestAnimationFrame = (cb: FrameRequestCallback) => {
      const id = ++n;
      reales.set(
        id,
        pedir(() =>
          reales.set(
            id,
            pedir((t) => {
              reales.delete(id);
              cb(t);
            }),
          ),
        ),
      );
      return id;
    };
    window.cancelAnimationFrame = (id: number) => {
      const real = reales.get(id);
      if (real !== undefined) cancelar(real);
      reales.delete(id);
    };
  });
  await irA(page, "/");
  const estado = await estadoFinal(page);
  test.skip(estado === "respaldo", "sin WebGL en este equipo");
  await page.waitForTimeout(15_000);
  await expect(capa(page)).toHaveAttribute("data-cinta", "lista");
  await expect(capa(page)).toHaveAttribute("data-modo", "fino");
  const tam = await page.evaluate(() => {
    const c = document.querySelector("#top .cinta canvas") as HTMLCanvasElement;
    const r = (document.querySelector("#top") as HTMLElement).getBoundingClientRect();
    return { w: c.width, h: c.height, W: Math.round(r.width), H: Math.round(r.height) };
  });
  // Sin pasar de 1,6 megapíxeles, el búfer va a 1 px por px CSS.
  const tope = Math.min(1, Math.sqrt(1.6e6 / (tam.W * tam.H)));
  expect(Math.abs(tam.w - Math.round(tam.W * tope)), JSON.stringify(tam)).toBeLessThanOrEqual(1);
  expect(Math.abs(tam.h - Math.round(tam.H * tope)), JSON.stringify(tam)).toBeLessThanOrEqual(1);
  const antes = await dibujos(page);
  await page.waitForTimeout(600);
  expect(await dibujos(page)).toBeGreaterThan(antes);
  await page.mouse.move(300, 300);
  await page.mouse.move(560, 340, { steps: 10 });
  await expect(capa(page)).toHaveAttribute("data-puntero", "activo");
});

test("en pantalla táctil no depende del hover: el bucle solo y un pulso al tocar", async ({ page, isMobile }) => {
  test.skip(!isMobile, "solo celular");
  await irA(page, "/");
  const estado = await estadoFinal(page);
  test.skip(estado !== "lista", `sin bucle en este equipo (${estado})`);
  await expect(capa(page)).toHaveAttribute("data-modo", "toque");
  expect(await capa(page).getAttribute("data-puntero")).toBeNull();
  // Un toque en el fondo no hace nada raro: la página no se mueve.
  const y = await page.evaluate(() => scrollY);
  const caja = await page.locator("#top").boundingBox();
  await page.touchscreen.tap((caja?.width ?? 300) - 12, 100);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => scrollY)).toBe(y);
});

test.describe("con 'reducir movimiento'", () => {
  test.use({ reducedMotion: "reduce" });

  test("un solo cuadro quieto, sin bucle ni reacción al mouse", async ({ page, isMobile, vigilancia }) => {
    // El texto que se escribe del hero (ver movimiento.spec.ts).
    vigilancia.tolerar(/Minified React error #418/);
    await irA(page, "/");
    const estado = await estadoFinal(page);
    expect(["quieta", "respaldo"]).toContain(estado);
    test.skip(estado === "respaldo", "sin WebGL en este equipo");
    await expect(capa(page)).toHaveAttribute("data-modo", "quieto");
    const n = await dibujos(page);
    if (!isMobile) await page.mouse.move(700, 400, { steps: 8 });
    await page.waitForTimeout(800);
    expect(await dibujos(page)).toBe(n);
    expect(await capa(page).getAttribute("data-puntero")).toBeNull();
  });
});

// ------------------------------------------------------------------ Zonas de lectura

// En pantallas angostas el texto del hero se parte en más líneas que zonas
// tiene el shader. Antes se descartaban las últimas y el botón de menú quedaba
// sin protección: la cinta pasaba brillante detrás de su ícono blanco. Se
// revisa lo que el motor sube al shader (uniform4fv de MAX_ZONAS * 4 números),
// así que no depende de la tarjeta gráfica.
for (const ancho of [280, 320]) {
  test.describe(`a ${ancho} px`, () => {
    test.use({ viewport: { width: ancho, height: ancho === 280 ? 653 : 568 }, isMobile: true, hasTouch: true });

    test("el logo y el botón de menú siempre están entre las zonas de lectura", async ({ page }) => {
      await page.addInitScript((n: number) => {
        const w = window as unknown as { __zonas?: number[]; __topes?: number[] };
        // El motor sube Float32Array: con length y recorrible.
        const copiar = (v: unknown, largo: number) => {
          const datos = v as ArrayLike<number>;
          return datos && datos.length === largo ? Array.from(datos) : undefined;
        };
        const v4 = WebGLRenderingContext.prototype.uniform4fv;
        WebGLRenderingContext.prototype.uniform4fv = function (this: WebGLRenderingContext, ...a: Parameters<typeof v4>) {
          w.__zonas = copiar(a[1], n * 4) ?? w.__zonas;
          return v4.apply(this, a);
        };
        const v1 = WebGLRenderingContext.prototype.uniform1fv;
        WebGLRenderingContext.prototype.uniform1fv = function (this: WebGLRenderingContext, ...a: Parameters<typeof v1>) {
          w.__topes = copiar(a[1], n) ?? w.__topes;
          return v1.apply(this, a);
        };
      }, MAX_ZONAS);
      await irA(page, "/");
      const estado = await estadoFinal(page);
      test.skip(estado === "respaldo", "sin WebGL en este equipo");
      // Entradas del titular terminadas y fuentes cargadas: el motor vuelve a medir.
      await page.waitForTimeout(2_500);
      await expect
        .poll(() =>
          page.evaluate(() => {
            const w = window as unknown as { __zonas?: number[]; __topes?: number[] };
            const zonas = w.__zonas ?? [];
            const topes = w.__topes ?? [];
            const r = (document.querySelector("#top") as HTMLElement).getBoundingClientRect();
            const nav = document.querySelector('nav[aria-label="Principal"]') as HTMLElement;
            const piezas = [nav.querySelector("a > img"), nav.querySelector("button[aria-controls]")].filter((e): e is Element => !!e && e.getClientRects().length > 0);
            const faltan: string[] = [];
            for (const e of piezas) {
              const c = e.getBoundingClientRect();
              const q = [c.left - r.left, c.top - r.top, c.right - r.left, c.bottom - r.top];
              let ok = false;
              for (let k = 0; k * 4 < zonas.length; k++) {
                const [x0, y0, x1, y1] = zonas.slice(k * 4, k * 4 + 4);
                if (x0 <= q[0] + 1 && y0 <= q[1] + 1 && x1 >= q[2] - 1 && y1 >= q[3] - 1 && topes[k] > 0 && topes[k] <= 0.16) ok = true;
              }
              if (!ok) faltan.push(e.tagName.toLowerCase());
            }
            return { piezas: piezas.length, faltan };
          }),
        )
        .toEqual({ piezas: 2, faltan: [] });
    });
  });
}

// ------------------------------------------------------------------ Contraste

// Rectángulos de cada línea de texto marcada (y los enlaces de la barra, el
// logo y el ícono del menú), con su tope. Para el titular en degradado, la
// caja del degradado.
async function lineas(page: Page) {
  return page.evaluate(() => {
    const filasDe = (el: Element) => {
      const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const rg = document.createRange();
      const filas: { left: number; right: number; top: number; bottom: number }[] = [];
      for (let n = tw.nextNode(); n; n = tw.nextNode()) {
        if (!n.textContent?.trim()) continue;
        rg.selectNodeContents(n);
        for (const q of rg.getClientRects()) {
          if (q.width <= 2 || q.height <= 2) continue;
          const f = filas.find((f) => Math.abs(f.top - q.top) < q.height / 2);
          if (f) {
            f.left = Math.min(f.left, q.left);
            f.right = Math.max(f.right, q.right);
            f.bottom = Math.max(f.bottom, q.bottom);
          } else filas.push({ left: q.left, right: q.right, top: q.top, bottom: q.bottom });
        }
      }
      return filas;
    };
    const salida: { nombre: string; tope: number | null; left: number; right: number; top: number; bottom: number }[] = [];
    let grad = { x: 0, y: 0, w: 1, h: 1 };
    for (const el of document.querySelectorAll<HTMLElement>("#top [data-cinta-tope]")) {
      const t = el.dataset.cintaTope ?? "";
      if (t === "degradado") {
        const c = el.getBoundingClientRect();
        grad = { x: c.left, y: c.top, w: c.width, h: c.height };
      }
      for (const f of filasDe(el)) salida.push({ nombre: (el.textContent ?? "").trim().slice(0, 24), tope: t === "degradado" ? null : Number(t), ...f });
    }
    const ul = document.querySelector('nav[aria-label="Principal"] ul');
    if (ul && ul.getClientRects().length) for (const f of filasDe(ul)) salida.push({ nombre: "barra", tope: 0.06, ...f });
    // El logo y el ícono del menú: 3:1 (tope 0,16), como el titular.
    for (const e of document.querySelectorAll('nav[aria-label="Principal"] a > img, nav[aria-label="Principal"] button[aria-controls] svg')) {
      if (!e.getClientRects().length) continue;
      const c = e.getBoundingClientRect();
      salida.push({ nombre: e.tagName === "IMG" ? "logo" : "menú", tope: 0.16, left: c.left, right: c.right, top: c.top, bottom: c.bottom });
    }
    return { salida, grad };
  });
}

type Exceso = Record<string, number>;

// Oculta el texto, captura y busca el peor punto del fondo detrás de cada
// línea: la luminancia no puede pasar del tope (en el degradado, el límite
// de 3:1 contra el color del degradado en ese punto).
async function medir(page: Page, peor: Exceso) {
  const { salida, grad } = await lineas(page);
  const estilo = await page.addStyleTag({
    content:
      "#top [data-cinta-tope], #top [data-cinta-tope] *, nav[aria-label='Principal'] ul, nav[aria-label='Principal'] a > img, nav[aria-label='Principal'] button[aria-controls] svg { visibility: hidden !important; }",
  });
  await page.waitForTimeout(50);
  const png = (await page.screenshot({ scale: "css" })).toString("base64");
  await estilo.evaluate((e) => (e as Element).remove());
  // Se decodifica en una página en blanco (sin la CSP del sitio).
  const blanco = await page.context().newPage();
  const resultado = await blanco.evaluate(
    async ({ png, salida, grad }) => {
      const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${png}`)).blob());
      const lienzo = new OffscreenCanvas(bmp.width, bmp.height);
      const cx = lienzo.getContext("2d") as OffscreenCanvasRenderingContext2D;
      cx.drawImage(bmp, 0, 0);
      const datos = cx.getImageData(0, 0, bmp.width, bmp.height).data;
      const lin = (v: number) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const lum = (r: number, g: number, b: number) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      const mezcla = (a: number[], b: number[], t: number) => a.map((x, i) => x + (b[i] - x) * t);
      const topeDegradado = (x: number, y: number) => {
        const largo = grad.w * 0.98481 + grad.h * 0.17365;
        const t = Math.min(1, Math.max(0, ((x - grad.x - grad.w / 2) * 0.98481 + (y - grad.y - grad.h / 2) * 0.17365) / largo + 0.5));
        const col = t < 0.35 ? mezcla([41, 196, 245], [122, 215, 255], t / 0.35) : mezcla([122, 215, 255], [61, 90, 255], (t - 0.35) / 0.65);
        return (lum(col[0], col[1], col[2]) + 0.05) / 3 - 0.05;
      };
      const exceso: Record<string, number> = {};
      for (const l of salida) {
        let peor = -1;
        for (let y = Math.max(0, Math.floor(l.top)); y < Math.min(bmp.height, Math.ceil(l.bottom)); y++) {
          for (let x = Math.max(0, Math.floor(l.left)); x < Math.min(bmp.width, Math.ceil(l.right)); x++) {
            const i = (y * bmp.width + x) * 4;
            const L = lum(datos[i], datos[i + 1], datos[i + 2]);
            peor = Math.max(peor, L - (l.tope ?? topeDegradado(x + 0.5, y + 0.5)));
          }
        }
        exceso[l.nombre] = Math.max(exceso[l.nombre] ?? -1, peor);
      }
      return exceso;
    },
    { png, salida, grad },
  );
  await blanco.close();
  for (const [k, v] of Object.entries(resultado)) peor[k] = Math.max(peor[k] ?? -1, v);
}

test("el texto del hero no pierde contraste con el fondo en movimiento (peor caso de varios cuadros)", async ({ page, isMobile }) => {
  test.setTimeout(240_000);
  await irA(page, "/");
  await estadoFinal(page);
  await page.waitForTimeout(1_500);
  const peor: Exceso = {};
  const puntos = [
    [520, 330],
    [700, 470],
    [980, 360],
    [500, 600],
  ];
  for (let i = 0; i < 6; i++) {
    if (!isMobile) await page.mouse.move(puntos[i % puntos.length][0], puntos[i % puntos.length][1], { steps: 6 });
    await page.waitForTimeout(1_100);
    await medir(page, peor);
  }
  // 0,004 de margen: el borde de las letras y el reescalado de la captura.
  for (const [linea, exceso] of Object.entries(peor)) expect.soft(exceso, `fondo demasiado claro detrás de "${linea}"`).toBeLessThanOrEqual(0.004);
});

// ------------------------------------------------------------------ Botón principal

test("el botón del hero destaca y cumple AA: relleno de marca, texto blanco a 4,5:1 o más, foco visible", async ({ page, isMobile }) => {
  await irA(page, "/");
  const boton = page.locator("#top").getByRole("link", { name: hero.cta });
  await expect(boton).toHaveAttribute("href", "/agendar");
  const datos = await boton.evaluate((b) => {
    const cs = getComputedStyle(b);
    const encima = getComputedStyle(b, "::before");
    const colores = (s: string) => [...s.split(/\),\s*linear-gradient/)[0].matchAll(/rgba?\(([^)]+)\)/g)].map((m) => m[1].split(",").map((v) => parseFloat(v)));
    return { fuente: cs.fontSize, peso: cs.fontWeight, alto: b.getBoundingClientRect().height, relleno: colores(cs.backgroundImage), alPasar: colores(encima.backgroundImage), texto: cs.color };
  });
  const ancho = page.viewportSize()?.width ?? 0;
  expect(datos.fuente).toBe(ancho < 360 ? "16px" : "17px");
  expect(datos.peso).toBe("500");
  expect(datos.alto).toBeGreaterThanOrEqual(ancho < 360 ? 44 : 60);
  expect(datos.texto).toBe("rgb(255, 255, 255)");
  const lin = (v: number) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const contraste = ([r, g, b]: number[]) => 1.05 / (0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) + 0.05);
  expect(datos.relleno.length).toBeGreaterThanOrEqual(2);
  for (const c of [...datos.relleno, ...datos.alPasar]) expect(contraste(c), `blanco sobre rgb(${c.join(",")})`).toBeGreaterThanOrEqual(4.5);

  if (!isMobile) {
    // Con el teclado: anillo blanco (entre bandas casi negras) y las esquinas
    // del botón intactas.
    await page.mouse.move(5, 5);
    for (let i = 0; i < 20 && !(await boton.evaluate((b) => b === document.activeElement)); i++) await page.keyboard.press("Tab");
    // El color del anillo entra con la transición de 300 ms del botón.
    await expect
      .poll(() => boton.evaluate((b) => ({ foco: b.matches(":focus-visible"), anillo: getComputedStyle(b).outlineColor, esquinas: getComputedStyle(b).borderRadius })))
      .toEqual({ foco: true, anillo: "rgb(255, 255, 255)", esquinas: "12px" });
  }
});

// El anillo cian de antes quedaba encima del halo cian del propio botón y de
// la cinta: con el teclado casi no se distinguía. Se mide lo que cambia al
// enfocar, con el fondo quieto: en la banda de 8 px alrededor del botón, los
// píxeles cuya luminancia cambia 3:1 o más tienen que sumar al menos un anillo
// de 2 px por todo el perímetro, y cada lado tiene que cambiar.
test("con el teclado, el foco del botón principal se distingue de su halo y de la cinta (3:1)", async ({ page, isMobile }) => {
  test.skip(isMobile, "con teclado");
  await page.clock.install();
  await irA(page, "/");
  await estadoFinal(page);
  await page.waitForTimeout(2_000);
  // Fondo quieto: el reloj de la página se detiene (el lienzo deja de
  // dibujar) y las animaciones CSS del hero se pausan. Las transiciones del
  // botón siguen corriendo.
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1_000));
  await page.addStyleTag({ content: "#top *, #top *::before, #top *::after { animation-play-state: paused !important; }" });
  const boton = page.locator("#top").getByRole("link", { name: hero.cta });
  await page.mouse.move(5, 5);
  await page.waitForTimeout(500);
  const sinFoco = await boton.boundingBox();
  expect(sinFoco).not.toBeNull();
  const M = 14;
  const clip = { x: Math.floor(sinFoco!.x - M), y: Math.floor(sinFoco!.y - M), width: Math.ceil(sinFoco!.width + 2 * M), height: Math.ceil(sinFoco!.height + 2 * M) };
  const antes = (await page.screenshot({ clip, scale: "css" })).toString("base64");
  for (let i = 0; i < 20 && !(await boton.evaluate((b) => b === document.activeElement)); i++) await page.keyboard.press("Tab");
  await expect.poll(() => boton.evaluate((b) => b.matches(":focus-visible") && getComputedStyle(b).outlineColor)).toBe("rgb(255, 255, 255)");
  // La transición del botón es de 300 ms (sube 2 px y se abre el halo).
  await page.waitForTimeout(700);
  const conFoco = await boton.boundingBox();
  const despues = (await page.screenshot({ clip, scale: "css" })).toString("base64");
  const caja = { left: conFoco!.x - clip.x, top: conFoco!.y - clip.y, right: conFoco!.x + conFoco!.width - clip.x, bottom: conFoco!.y + conFoco!.height - clip.y };

  // Se decodifica en una página en blanco (sin la CSP del sitio).
  const blanco = await page.context().newPage();
  const r = await blanco.evaluate(
    async ({ antes, despues, caja }) => {
      const leer = async (png: string) => {
        const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${png}`)).blob());
        const lienzo = new OffscreenCanvas(bmp.width, bmp.height);
        const cx = lienzo.getContext("2d") as OffscreenCanvasRenderingContext2D;
        cx.drawImage(bmp, 0, 0);
        return { w: bmp.width, h: bmp.height, d: cx.getImageData(0, 0, bmp.width, bmp.height).data };
      };
      const a = await leer(antes);
      const b = await leer(despues);
      const lin = (v: number) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const lum = (d: Uint8ClampedArray, i: number) => 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
      const lados = { arriba: [0, 0], abajo: [0, 0], izquierda: [0, 0], derecha: [0, 0] } as Record<string, [number, number]>;
      let cambian = 0;
      for (let y = 0; y < Math.min(a.h, b.h); y++) {
        for (let x = 0; x < Math.min(a.w, b.w); x++) {
          const px = x + 0.5;
          const py = y + 0.5;
          const dx = px < caja.left ? caja.left - px : px > caja.right ? px - caja.right : 0;
          const dy = py < caja.top ? caja.top - py : py > caja.bottom ? py - caja.bottom : 0;
          const d = Math.max(dx, dy);
          if (d <= 0 || d > 8) continue;
          const lado = dy >= dx ? (py < caja.top ? "arriba" : "abajo") : px < caja.left ? "izquierda" : "derecha";
          const i = (y * a.w + x) * 4;
          const j = (y * b.w + x) * 4;
          const l1 = lum(a.d, i);
          const l2 = lum(b.d, j);
          const razon = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          lados[lado][1]++;
          if (razon >= 3) {
            lados[lado][0]++;
            cambian++;
          }
        }
      }
      const perimetro = 2 * (caja.right - caja.left + (caja.bottom - caja.top));
      return { veces: cambian / (perimetro * 2), lados: Object.fromEntries(Object.entries(lados).map(([k, [c, t]]) => [k, t ? c / t : 0])) };
    },
    { antes, despues, caja },
  );
  await blanco.close();
  expect(r.veces, `cambio en la banda: ${JSON.stringify(r)}`).toBeGreaterThanOrEqual(1);
  for (const [lado, parte] of Object.entries(r.lados)) expect.soft(parte, `lado ${lado}: ${JSON.stringify(r)}`).toBeGreaterThanOrEqual(0.2);
});
