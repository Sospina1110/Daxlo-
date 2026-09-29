import { agendar, coaching, consultoria, dosFormas, hero, otraLinea, preguntasLinea } from "../../src/content/copy";
import { APPS_SCRIPT, esperarArriba, esperarEnAncla, expect, H1, interceptarAppsScript, irA, marcarDocumento, tocar, test, type Page } from "./apoyo";

// Los caminos que terminan en una conversación agendada: cada llamado a la
// acción lleva a /agendar (con la línea ya elegida cuando corresponde) y el
// formulario manda al Apps Script exactamente lo que espera. El Apps Script
// nunca se toca de verdad: interceptarAppsScript() lo responde en local.

const CONTRATO = ["linea", "nombre", "whatsapp", "correo", "empresa", "interes", "website", "tiempo_llenado_segundos", "origen"];
const campoLinea = (page: Page) => page.getByLabel(agendar.campos.linea);
const cierre = (page: Page) => page.locator('section[aria-labelledby="titulo-cierre"]');

// Llegó a /agendar, con la línea que corresponde, y la página abrió arriba
// (los llamados están a media página o al final: si /agendar abriera donde
// quedó el scroll, el titular y el formulario quedarían fuera de la vista).
async function llegarAAgendar(page: Page, lineaEsperada: string) {
  await expect(page).toHaveURL(lineaEsperada ? `/agendar?linea=${lineaEsperada}` : "/agendar");
  await expect(page.locator("h1")).toContainText(H1["/agendar"]);
  await expect(campoLinea(page)).toHaveValue(lineaEsperada);
  await esperarArriba(page);
}

test.describe("llamados a la acción", () => {
  test("el botón del hero lleva a /agendar sin recargar", async ({ page, isMobile }) => {
    await irA(page, "/");
    const mismoDocumento = await marcarDocumento(page);
    const marca = await mismoDocumento();
    await tocar(page.locator("#top").getByRole("link", { name: hero.cta }), isMobile);
    await llegarAAgendar(page, "");
    expect(await mismoDocumento()).toBe(marca);
  });

  test("en /coaching, 'Agendar mi llamada' lleva a /agendar con coaching elegido", async ({ page, isMobile }) => {
    await irA(page, "/coaching");
    await tocar(page.getByRole("link", { name: coaching.paraTi.cta }), isMobile);
    await llegarAAgendar(page, "coaching");
  });

  test("en /consultoria, 'Cuéntanos tu proceso' lleva a /agendar con consultoría elegida", async ({ page, isMobile }) => {
    await irA(page, "/consultoria");
    await tocar(page.getByRole("link", { name: consultoria.califica.cta }), isMobile);
    await llegarAAgendar(page, "consultoria");
  });

  for (const linea of ["coaching", "consultoria"] as const) {
    test(`el cierre de /${linea} también llega con ${linea} elegido`, async ({ page, isMobile }) => {
      await irA(page, `/${linea}`);
      await tocar(cierre(page).getByRole("link", { name: /Agendar una conversación/ }), isMobile);
      await llegarAAgendar(page, linea);
    });
  }

  test("el cierre de una página general llega a /agendar sin línea elegida", async ({ page, isMobile }) => {
    await irA(page, "/nosotros");
    await tocar(cierre(page).getByRole("link", { name: /Agendar una conversación/ }), isMobile);
    await llegarAAgendar(page, "");
  });

  test("las tarjetas del inicio llevan a /coaching y a /consultoria", async ({ page, isMobile }) => {
    await irA(page, "/");
    // El nombre accesible lleva la línea en texto solo para lectores (sr-only);
    // Chromium mete un espacio antes de los dos puntos.
    const tarjeta = (d: { enlace: string; titulo: string }) => page.getByRole("link", { name: new RegExp(`^${d.enlace}\\s*:\\s*${d.titulo}$`) });
    await tocar(tarjeta(dosFormas.coaching), isMobile);
    await expect(page).toHaveURL("/coaching");
    await expect(page.locator("h1")).toContainText(H1["/coaching"]);
    await esperarArriba(page);

    await irA(page, "/");
    await tocar(tarjeta(dosFormas.consultoria), isMobile);
    await expect(page).toHaveURL("/consultoria");
    await expect(page.locator("h1")).toContainText(H1["/consultoria"]);
    await esperarArriba(page);
  });

  test("los botones bajo la comparación separan a quien aprende de quien tiene un proceso", async ({ page, isMobile }) => {
    await irA(page, "/");
    await tocar(page.getByRole("link", { name: "Lo mío es aprender" }), isMobile);
    await expect(page).toHaveURL("/coaching");
    await esperarArriba(page);
    await irA(page, "/");
    await tocar(page.getByRole("link", { name: "Lo mío es un proceso" }), isMobile);
    await expect(page).toHaveURL("/consultoria");
    await esperarArriba(page);
  });

  test("el puente de cada línea, al final de la página, lleva a la otra y la abre arriba", async ({ page, isMobile }) => {
    await irA(page, "/coaching");
    await tocar(page.getByRole("link", { name: new RegExp(otraLinea.consultoria.enlace) }), isMobile);
    await expect(page).toHaveURL("/consultoria");
    await expect(page.locator("h1")).toContainText(H1["/consultoria"]);
    await esperarArriba(page);
    await tocar(page.getByRole("link", { name: new RegExp(otraLinea.coaching.enlace) }), isMobile);
    await expect(page).toHaveURL("/coaching");
    await expect(page.locator("h1")).toContainText(H1["/coaching"]);
    await esperarArriba(page);
  });

  test("'Ver todas las preguntas' en /coaching lleva al grupo de coaching en /preguntas", async ({ page, isMobile }) => {
    await irA(page, "/coaching");
    await tocar(page.getByRole("link", { name: preguntasLinea.todas }), isMobile);
    await expect(page).toHaveURL("/preguntas#coaching");
    await esperarEnAncla(page, "coaching");
  });
});

test.describe("formulario de /agendar", () => {
  const c = agendar.campos;

  async function llenar(page: Page) {
    await campoLinea(page).selectOption("consultoria");
    await page.getByLabel(c.nombre).fill("Martina Gómez Peña");
    await page.getByLabel(c.whatsapp).fill("+57 300 123 4567");
    await page.getByLabel(c.correo).fill("martina@ferreteria.co");
    await page.getByLabel(c.empresa).fill("Ferretería El Tornillo & Cía");
    await page.getByLabel(c.interes).fill("Cada viernes concilio facturas de tres proveedores.\nMe toma la mañana.");
  }

  const enviar = (page: Page) => page.getByRole("button", { name: new RegExp(agendar.enviar) });

  test("vacío: muestra los errores, pone el foco en '¿Qué te interesa?' y no envía nada", async ({ page, isMobile }) => {
    await irA(page, "/agendar");
    const envios = await interceptarAppsScript(page);
    await tocar(enviar(page), isMobile);
    for (const t of [agendar.errores.linea, agendar.errores.nombre, agendar.errores.whatsapp, agendar.errores.correo]) {
      await expect(page.getByText(t)).toBeVisible();
    }
    await expect(campoLinea(page)).toBeFocused();
    await expect(campoLinea(page)).toHaveAttribute("aria-invalid", "true");
    expect(envios).toHaveLength(0);
  });

  test("correo mal escrito: pide revisarlo y el foco va al correo", async ({ page, isMobile }) => {
    await irA(page, "/agendar");
    const envios = await interceptarAppsScript(page);
    await llenar(page);
    await page.getByLabel(c.correo).fill("martina@ferreteria");
    await tocar(enviar(page), isMobile);
    await expect(page.getByText(agendar.errores.correoFormato)).toBeVisible();
    await expect(page.getByLabel(c.correo)).toBeFocused();
    expect(envios).toHaveLength(0);
  });

  test("envío completo: panel de éxito y el Apps Script recibe exactamente los campos del contrato", async ({ page, isMobile }) => {
    await irA(page, "/agendar");
    const envios = await interceptarAppsScript(page);
    const accion = await page.locator("form").getAttribute("action");
    expect(accion).toMatch(APPS_SCRIPT);
    await llenar(page);
    await tocar(enviar(page), isMobile);

    const panel = page.getByRole("status").filter({ hasText: agendar.exito.titulo });
    await expect(panel).toBeVisible();
    await expect(panel).toContainText(agendar.exito.texto);
    await expect(page.locator("form")).toHaveCount(0);

    expect(envios).toHaveLength(1);
    const [envio] = envios;
    expect(envio.metodo).toBe("POST");
    expect(envio.url).toBe(accion);
    expect(envio.campos.map(([k]) => k)).toEqual(CONTRATO);
    const datos = Object.fromEntries(envio.campos);
    expect(datos).toMatchObject({
      linea: "consultoria",
      nombre: "Martina Gómez Peña",
      whatsapp: "+57 300 123 4567",
      correo: "martina@ferreteria.co",
      empresa: "Ferretería El Tornillo & Cía",
      website: "",
      origen: new URL(page.url()).origin,
    });
    // En multipart/form-data el navegador manda los saltos de línea como CRLF.
    expect(datos.interes.replace(/\r\n/g, "\n")).toBe("Cada viernes concilio facturas de tres proveedores.\nMe toma la mañana.");
    expect(datos.tiempo_llenado_segundos).toMatch(/^\d+$/);
  });

  test("con ?linea=no_se la opción llega elegida y es la que se envía", async ({ page, isMobile }) => {
    await irA(page, "/agendar?linea=no_se");
    await expect(campoLinea(page)).toHaveValue("no_se");
    const envios = await interceptarAppsScript(page);
    await page.getByLabel(c.nombre).fill("Ana");
    await page.getByLabel(c.whatsapp).fill("3001234567");
    await page.getByLabel(c.correo).fill("ana@correo.com");
    await tocar(enviar(page), isMobile);
    await expect(page.getByText(agendar.exito.titulo)).toBeVisible();
    expect(Object.fromEntries(envios[0].campos).linea).toBe("no_se");
  });

  test("con ?linea= de un valor que no existe, el campo queda en 'Selecciona una opción'", async ({ page }) => {
    await irA(page, "/agendar?linea=gerencia");
    await expect(campoLinea(page)).toHaveValue("");
    expect(await campoLinea(page).evaluate((s: HTMLSelectElement) => [s.selectedIndex, s.selectedOptions[0]?.textContent])).toEqual([0, "Selecciona una opción"]);
  });

  test("envío duplicado: también muestra éxito, con el texto de 'ya recibimos tus datos'", async ({ page, isMobile }) => {
    await irA(page, "/agendar");
    await interceptarAppsScript(page, () => ({ cuerpo: { status: "error", codigo: "envio_duplicado" } }));
    await llenar(page);
    await tocar(enviar(page), isMobile);
    const panel = page.getByRole("status").filter({ hasText: agendar.exito.titulo });
    await expect(panel).toContainText(agendar.exito.duplicado);
    await expect(panel).not.toContainText(agendar.exito.texto);
  });

  test("error del Apps Script: avisa, deja lo escrito y se puede reintentar", async ({ page, isMobile }) => {
    await irA(page, "/agendar");
    const envios = await interceptarAppsScript(page, (n) => (n === 1 ? { cuerpo: { status: "error", codigo: "otro" } } : { cuerpo: { status: "ok" } }));
    await llenar(page);
    await tocar(enviar(page), isMobile);
    await expect(page.getByText(agendar.errores.general)).toBeVisible();
    await expect(page.getByLabel(c.nombre)).toHaveValue("Martina Gómez Peña");
    await expect(enviar(page)).toBeEnabled();
    await tocar(enviar(page), isMobile);
    await expect(page.getByText(agendar.exito.titulo)).toBeVisible();
    expect(envios).toHaveLength(2);
  });

  test("sin red: avisa con el error general", async ({ page, isMobile, vigilancia }) => {
    // El navegador anota en consola la petición cortada: es justo lo que se prueba.
    vigilancia.tolerar(/Failed to load resource|script\.google\.com/);
    await irA(page, "/agendar");
    await interceptarAppsScript(page, () => ({ abortar: true }));
    await llenar(page);
    await tocar(enviar(page), isMobile);
    await expect(page.getByText(agendar.errores.general)).toBeVisible();
    await expect(page.getByText(agendar.exito.titulo)).toHaveCount(0);
  });

  test("guardia de las pruebas: sin interceptar, un envío al Apps Script se bloquea en la página y nada sale", async ({ page, isMobile, vigilancia }) => {
    // Prueba de la propia red de seguridad (apoyo.ts): si una prueba olvidara
    // interceptar, el lead de mentira no puede llegar a la hoja real.
    vigilancia.tolerar(/\[pruebas\] envío bloqueado/);
    const salientes: string[] = [];
    page.on("request", (r) => {
      if (APPS_SCRIPT.test(r.url())) salientes.push(r.url());
    });
    await irA(page, "/agendar");
    await llenar(page);
    await tocar(enviar(page), isMobile);
    // El fetch bloqueado se ve en la página como una falla de red.
    await expect(page.getByText(agendar.errores.general)).toBeVisible();
    expect(salientes).toEqual([]);
    expect(vigilancia.errores.some((e) => /\[pruebas\] envío bloqueado: fetch/.test(e))).toBe(true);
  });

  test("respuesta que no es JSON (una página de error de Google): avisa con el error general", async ({ page, isMobile, vigilancia }) => {
    // El navegador anota en consola el 500 del Apps Script simulado.
    vigilancia.tolerar(/Failed to load resource: .*500/);
    await irA(page, "/agendar");
    await interceptarAppsScript(page, () => ({ status: 500, cuerpo: "<html><body>Error</body></html>" }));
    await llenar(page);
    await tocar(enviar(page), isMobile);
    await expect(page.getByText(agendar.errores.general)).toBeVisible();
  });
});
