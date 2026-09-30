import { test as base, expect, type ConsoleMessage, type Locator, type Page, type Request, type Response } from "@playwright/test";
import { agendar, coaching, consultoria, faq, hero, herramientas, nosotros, paginas, rutas } from "../../src/content/copy";

// Base común de las pruebas de punta a punta.
//
// `vigilancia` corre sola en cada prueba (auto):
// 1. Junta errores de la página: excepciones, console.error y respuestas del
//    propio sitio con estado >= 400. Al terminar la prueba, si hubo alguno que
//    la prueba no declaró como esperado, la prueba falla.
// 2. Cualquier petición a otro host cuenta como error: el sitio no carga nada
//    de afuera (las fuentes y las imágenes son propias).
// 3. Guardia para el Apps Script del formulario: dentro de la página, un envío
//    a script.google.com (por fetch o por el <form> sin JavaScript) se bloquea
//    y se reporta, salvo que la prueba lo haya interceptado antes con
//    interceptarAppsScript(), que lo responde en local. Así ninguna prueba
//    puede mandar un lead de mentira a la hoja real.
//
// Por qué la guardia es en la página y no con page.route para todo: en WebKit,
// tener cualquier ruta interceptada rompe la carga diferida de imágenes
// (loading="lazy" nunca termina) y a veces cuelga el evento load. Solo las
// pruebas del formulario interceptan, y lo hacen después de cargar la página.

export const APPS_SCRIPT = /^https:\/\/script\.google\.com\//;

export type Vigilancia = {
  errores: string[];
  tolerar: (patron: RegExp) => void;
};

function guardiaAppsScript() {
  const w = window as unknown as { __appsScriptInterceptado?: boolean };
  const esAppsScript = (u: string) => /^https:\/\/script\.google\.com\//.test(u);
  const original = window.fetch;
  window.fetch = function (entrada: RequestInfo | URL, opciones?: RequestInit) {
    const url = typeof entrada === "string" ? entrada : entrada instanceof URL ? entrada.href : entrada.url;
    if (esAppsScript(url) && !w.__appsScriptInterceptado) {
      console.error(`[pruebas] envío bloqueado: fetch a ${url} sin interceptar`);
      return Promise.reject(new TypeError("bloqueado por las pruebas"));
    }
    return original.call(window, entrada, opciones);
  } as typeof window.fetch;
  // En window y en burbuja: corre después del onSubmit de React (que escucha en
  // document), así que solo actúa si nadie frenó el envío nativo.
  window.addEventListener("submit", (e) => {
    const form = e.target as HTMLFormElement;
    if (!e.defaultPrevented && esAppsScript(form.action) && !w.__appsScriptInterceptado) {
      e.preventDefault();
      console.error(`[pruebas] envío bloqueado: <form> a ${form.action} sin JavaScript`);
    }
  });
}

export const test = base.extend<{ vigilancia: Vigilancia }>({
  vigilancia: [
    async ({ page, baseURL }, use) => {
      const origen = new URL(baseURL as string).origin;
      const errores: string[] = [];
      const tolerados: RegExp[] = [];

      const alExcepcion = (e: Error) => errores.push(`pageerror: ${e.message}`);
      const alConsola = (m: ConsoleMessage) => {
        if (m.type() === "error") errores.push(`console.error: ${m.text()}`);
      };
      const alResponder = (r: Response) => {
        if (r.url().startsWith(origen) && r.status() >= 400) errores.push(`HTTP ${r.status()}: ${r.url()}`);
      };
      const alPedir = (r: Request) => {
        const url = r.url();
        if (url.startsWith(origen) || url.startsWith("data:") || url.startsWith("blob:") || url === "about:blank") return;
        // Al Apps Script solo se llega si la prueba lo interceptó (y entonces no sale).
        if (APPS_SCRIPT.test(url) && interceptadas.has(page)) return;
        errores.push(`petición externa inesperada: ${url}`);
      };
      page.on("pageerror", alExcepcion);
      page.on("console", alConsola);
      page.on("response", alResponder);
      page.on("request", alPedir);
      await page.addInitScript(guardiaAppsScript);

      // WebKit reporta como "access control checks" las precargas de Next que
      // quedan cortadas cuando la prueba sale de la página con page.goto. Una
      // petición al mismo origen no puede fallar por CORS, así que esto es
      // ruido de la prueba y no del sitio. (Un archivo de precarga que falte
      // igual se ve como "HTTP 404".)
      const origenEscapado = origen.replace(/^https?:\/\//, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      tolerados.push(new RegExp(`^pageerror: .*${origenEscapado}/[^ ]*__next[^ ]*\\.txt\\?_rsc=[^ ]* due to access control checks\\.$`));

      await use({ errores, tolerar: (p) => tolerados.push(p) });

      // Se sueltan los oyentes y la marca de interceptación: nada de esta
      // prueba queda colgado de la página cuando Playwright la cierre.
      page.off("pageerror", alExcepcion);
      page.off("console", alConsola);
      page.off("response", alResponder);
      page.off("request", alPedir);
      interceptadas.delete(page);

      const sinExplicar = errores.filter((e) => !tolerados.some((p) => p.test(e)));
      expect(sinExplicar, "errores en la página durante la prueba").toEqual([]);
    },
    { auto: true },
  ],
});

const interceptadas = new WeakSet<Page>();

export type EnvioCapturado = { url: string; metodo: string; campos: [string, string][] };
type Respuesta = { status?: number; cuerpo?: unknown; abortar?: boolean };

// Responde en local lo que el formulario manda al Apps Script y guarda cada
// envío con sus campos (multipart/form-data ya separado). Llamarla después de
// page.goto: en WebKit, interceptar durante la carga la puede colgar.
export async function interceptarAppsScript(page: Page, responder: (n: number) => Respuesta = () => ({ cuerpo: { status: "ok" } })) {
  const envios: EnvioCapturado[] = [];
  interceptadas.add(page);
  await page.route(APPS_SCRIPT, async (route) => {
    const req = route.request();
    envios.push({ url: req.url(), metodo: req.method(), campos: camposMultipart(req) });
    const r = responder(envios.length);
    if (r.abortar) return route.abort("failed");
    await route.fulfill({
      status: r.status ?? 200,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: typeof r.cuerpo === "string" ? r.cuerpo : JSON.stringify(r.cuerpo),
    });
  });
  const marcar = () => ((window as unknown as { __appsScriptInterceptado: boolean }).__appsScriptInterceptado = true);
  await page.addInitScript(marcar);
  await page.evaluate(marcar);
  return envios;
}

function camposMultipart(req: Request): [string, string][] {
  const tipo = req.headers()["content-type"] ?? "";
  const limite = tipo.match(/boundary=(?:"([^"]+)"|([^;]+))/);
  const cuerpo = req.postDataBuffer();
  if (!limite || !cuerpo) return [];
  const separador = `--${limite[1] ?? limite[2]}`;
  return cuerpo
    .toString("utf8")
    .split(separador)
    .slice(1, -1)
    .map((parte) => {
      const [cabeceras, ...resto] = parte.replace(/^\r\n/, "").split("\r\n\r\n");
      const nombre = cabeceras.match(/name="([^"]*)"/)?.[1] ?? "";
      return [nombre, resto.join("\r\n\r\n").replace(/\r\n$/, "")] as [string, string];
    });
}

export { expect };
export type { Locator, Page };

// ------------------------------------------------------------------ Datos

export const RUTAS = Object.values(rutas) as string[];
export const RUTAS_INTERNAS = RUTAS.filter((r) => r !== "/");

// Un pedazo del h1 de cada página, sacado de copy.ts.
export const H1: Record<string, string> = {
  "/": hero.titulo[1],
  "/coaching": coaching.portada.eyebrow,
  "/consultoria": consultoria.portada.eyebrow,
  "/herramientas": herramientas.titulo,
  "/nosotros": nosotros.titulo,
  "/preguntas": faq.titulo,
  "/agendar": agendar.titulo,
  "/privacidad": paginas.privacidad.titulo,
};

// ------------------------------------------------------------------ Carga

// React ya tomó la página: MotionProvider marca <html data-hidratado="1">.
// Antes de eso un toque en un enlace recarga la página entera.
export async function esperarHidratacion(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("data-hidratado", "1", { timeout: 15_000 });
}

export async function irA(page: Page, ruta: string) {
  const res = await page.goto(ruta);
  await esperarHidratacion(page);
  return res;
}

// Marca el documento actual para comprobar después que una navegación fue
// del lado del cliente (sin recargar).
export async function marcarDocumento(page: Page) {
  const marca = `doc-${Math.random().toString(36).slice(2)}`;
  await page.evaluate((m) => ((window as unknown as { __marca: string }).__marca = m), marca);
  return async () => page.evaluate(() => (window as unknown as { __marca?: string }).__marca ?? null);
}

// Espera a que el elemento deje de moverse: que ningún ancestro siga en su
// aparición ([data-revelar] sin data-visible, transición en curso) ni en la
// animación de entrada (.entrada, .subir). Un toque a mitad de esa subida cae
// unos píxeles más abajo que el elemento, igual que el dedo de una persona.
export async function quieto(elemento: Locator) {
  await elemento.scrollIntoViewIfNeeded();
  await expect
    .poll(
      () =>
        elemento.evaluate((el) => {
          for (let a: Element | null = el; a; a = a.parentElement) {
            if (a.hasAttribute("data-revelar") && !a.hasAttribute("data-visible")) return false;
            for (const an of a.getAnimations()) {
              if (an.playState === "running" && an.effect?.getTiming().iterations !== Infinity) return false;
            }
          }
          return true;
        }),
      { message: "el elemento sigue en movimiento (aparición o entrada)" },
    )
    .toBe(true);
}

// Toque en celular, clic en escritorio, con el elemento ya quieto. Graba el
// scroll desde el toque por si lleva a otra página (ver esperarArriba).
export async function tocar(elemento: Locator, esCelular: boolean) {
  await quieto(elemento);
  await vigilarScroll(elemento.page());
  if (esCelular) await elemento.tap();
  else await elemento.click();
}

// ------------------------------------------------------------------ Desplazamiento

// Baja por la página de a 80 % de pantalla, esperando dos cuadros en cada
// paso para que el IntersectionObserver alcance a ver cada bloque. Sin scroll
// suave: el sitio tiene scroll-behavior: smooth y aquí se quiere el salto.
export async function recorrer(page: Page) {
  await page.evaluate(async () => {
    const cuadros = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    window.scrollTo({ top: 0, behavior: "instant" });
    await cuadros();
    for (let i = 0; i < 400; i++) {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (scrollY >= max - 1) break;
      window.scrollTo({ top: Math.min(scrollY + innerHeight * 0.8, max), behavior: "instant" });
      await cuadros();
      await new Promise((r) => setTimeout(r, 30));
    }
  });
}

export async function irAlFinal(page: Page) {
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
}

export async function irArriba(page: Page) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
}

export async function posicion(page: Page) {
  return page.evaluate(() => Math.round(window.scrollY));
}

type VentanaConScroll = { __scroll?: [string, number][]; __scrollId?: number };

// Graba [ruta, scrollY] en cada cuadro durante 4 s. Se arranca justo antes de
// tocar un enlace; como la navegación es del lado del cliente, sigue grabando
// en la página nueva.
export async function vigilarScroll(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as VentanaConScroll;
    const id = (w.__scrollId = (w.__scrollId ?? 0) + 1);
    w.__scroll = [];
    const t0 = performance.now();
    const tomar = () => {
      if (w.__scrollId !== id) return;
      w.__scroll?.push([location.pathname, Math.round(scrollY)]);
      if (performance.now() - t0 < 4_000) requestAnimationFrame(tomar);
    };
    requestAnimationFrame(tomar);
  });
}

// Después de navegar, la página nueva abre arriba del todo. No alcanza con
// que termine arriba: antes del arreglo (commit 148d9cf) la página nueva
// aparecía en la posición de la anterior y subía deslizándose. Si se grabó el
// scroll (vigilarScroll, que tocar() arranca solo), ningún cuadro de la
// página nueva puede verse desplazado.
export async function esperarArriba(page: Page) {
  await expect.poll(() => posicion(page), { message: "la página nueva no abrió arriba" }).toBe(0);
  const ruta = new URL(page.url()).pathname;
  const muestras = await page.evaluate(() => (window as unknown as VentanaConScroll).__scroll ?? null);
  if (!muestras) return;
  const enLaNueva = muestras.filter(([p]) => p === ruta).map(([, y]) => y);
  const desplazados = enLaNueva.filter((y) => y !== 0);
  expect(desplazados, `la página nueva se vio desplazada antes de quedar arriba (cuadros: ${enLaNueva.slice(0, 12).join(", ")})`).toEqual([]);
}

// Con #ancla, la página nueva abre en la sección, que queda arriba con su
// titular debajo de la barra (scroll-padding-top).
export async function esperarEnAncla(page: Page, id: string) {
  const seccion = page.locator(`#${id}`);
  await expect(seccion).toHaveCount(1);
  await expect.poll(() => seccion.evaluate((s) => Math.round(s.getBoundingClientRect().top)), { message: `#${id} no quedó arriba` }).toBeGreaterThanOrEqual(-2);
  await expect.poll(() => seccion.evaluate((s) => Math.round(s.getBoundingClientRect().top)), { message: `#${id} no quedó arriba` }).toBeLessThanOrEqual(160);
  expect(await posicion(page)).toBeGreaterThan(0);
}

// ------------------------------------------------------------------ Mediciones

export async function desborde(page: Page) {
  return page.evaluate(() => ({ contenido: document.documentElement.scrollWidth, ventana: window.innerWidth }));
}

// Bloques [data-revelar] que el script todavía no marcó como visibles.
export async function sinRevelar(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("[data-revelar]:not([data-visible])")].map((el) => (el.textContent ?? "").trim().slice(0, 50) || el.outerHTML.slice(0, 80)),
  );
}

// Textos que se pintan pero quedaron con opacidad efectiva (la suya por la de
// sus ancestros) casi cero. Se excluyen las respuestas de preguntas cerradas y
// las frases fantasma de TextoQueSeEscribe (visibility: hidden). `excluir`
// deja fuera otra zona (un selector).
export async function textosInvisibles(page: Page, excluir?: string) {
  return page.evaluate((otra) => {
    const salida: string[] = [];
    const vistos = new Set<Element>();
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const nodo = w.currentNode;
      const texto = (nodo.textContent ?? "").trim();
      const el = nodo.parentElement;
      if (!texto || !el || vistos.has(el)) continue;
      vistos.add(el);
      if (el.closest("script, style, noscript, template, [role=region][inert]")) continue;
      if (otra && el.closest(otra)) continue;
      if (el.getClientRects().length === 0) continue;
      if (getComputedStyle(el).visibility === "hidden") continue;
      let opacidad = 1;
      for (let e: Element | null = el; e; e = e.parentElement) opacidad *= parseFloat(getComputedStyle(e).opacity);
      if (opacidad < 0.1) salida.push(texto.slice(0, 60));
    }
    return salida;
  }, excluir ?? null);
}

// Textos visibles cuya caja se sale por los lados de la pantalla (cortados).
// Las marquesinas se salen a propósito: van con máscara y se excluyen.
export async function textosCortados(page: Page) {
  return page.evaluate(() => {
    const salida: string[] = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const rango = document.createRange();
    while (w.nextNode()) {
      const nodo = w.currentNode;
      const texto = (nodo.textContent ?? "").trim();
      const el = nodo.parentElement;
      if (!texto || !el) continue;
      if (el.closest("script, style, noscript, template, .mask-x, .sr-only, [role=region][inert]")) continue;
      if (getComputedStyle(el).visibility === "hidden") continue;
      // Oculto a propósito dentro de una caja de 1 px que recorta (la trampa
      // para bots del formulario, el patrón sr-only).
      let recortado = false;
      for (let e: Element | null = el; e && !recortado; e = e.parentElement) {
        const cs = getComputedStyle(e);
        const r = e.getBoundingClientRect();
        recortado = (cs.overflow === "hidden" || cs.overflow === "clip") && (r.width <= 1 || r.height <= 1);
      }
      if (recortado) continue;
      rango.selectNodeContents(nodo);
      for (const caja of rango.getClientRects()) {
        if (caja.width === 0) continue;
        if (caja.left < -1 || caja.right > innerWidth + 1) {
          salida.push(`${texto.slice(0, 40)} [${Math.round(caja.left)}, ${Math.round(caja.right)}]`);
          break;
        }
      }
    }
    return salida;
  });
}

export async function imagenesSinCargar(page: Page) {
  return page.evaluate(() =>
    [...document.images].filter((i) => i.getClientRects().length > 0 && !(i.complete && i.naturalWidth > 0)).map((i) => i.currentSrc || i.src),
  );
}

export async function caja(elemento: Locator) {
  const b = await elemento.boundingBox();
  expect(b, "el elemento no tiene caja (no se pinta)").not.toBeNull();
  return b as { x: number; y: number; width: number; height: number };
}

// Borde inferior de la barra fija, en px desde arriba de la pantalla.
export async function bordeBarra(page: Page) {
  return page.getByRole("navigation", { name: "Principal" }).evaluate((n) => n.getBoundingClientRect().bottom);
}
