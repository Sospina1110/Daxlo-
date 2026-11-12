import { agendar, calcom, cierre, coaching, consultoria, dosFormas, herramientas, nosotros, otraLinea, rutas } from "../../src/content/copy";
import { esperarArriba, expect, irA, quieto, tocar, test, type Page } from "./apoyo";

// El hilo conductor del sitio (landing-hilo-conductor, 2026-11-06): cada página
// dice qué es Daxlo y lleva a las dos líneas, y lo nuevo que se ve reusa los
// componentes que ya había. Las pruebas de /preguntas (orden y enlaces) están
// en preguntas.spec.ts y las de la búsqueda tachada del hero, en
// movimiento.spec.ts.

const hayAgenda = Object.values(calcom.enlaces).every((u) => u.startsWith("https://"));

// Posición en la página (no en la pantalla).
const arriba = (page: Page, selector: string) => page.locator(selector).first().evaluate((e) => e.getBoundingClientRect().top + scrollY);

test.describe("/herramientas lleva a las dos líneas", () => {
  test("después de las fichas y antes del cierre, las dos tarjetas de /nosotros: coaching y consultoría", async ({ page }) => {
    await irA(page, rutas.herramientas);
    await expect(page.locator("h1")).toHaveText(herramientas.titulo);
    await expect(page.locator("main").getByText(herramientas.sub, { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: herramientas.subtituloLista })).toBeVisible();
    // Las dos tarjetas, en el orden de /nosotros, con su regla y su enlace.
    const tarjetas = page.locator("main a.tarjeta-pulsable");
    await expect(tarjetas).toHaveCount(2);
    for (const [i, hacia] of (["coaching", "consultoria"] as const).entries()) {
      const t = tarjetas.nth(i);
      await expect(t).toHaveAttribute("href", rutas[hacia]);
      await expect(t).toContainText(dosFormas[hacia].regla);
      await expect(t).toContainText(otraLinea[hacia].enlace);
    }
    // Entre la lista de herramientas y el cierre.
    const lista = await page.getByRole("heading", { level: 2, name: herramientas.subtituloLista }).evaluate((e) => e.getBoundingClientRect().top + scrollY);
    const primera = await tarjetas.first().evaluate((e) => e.getBoundingClientRect().top + scrollY);
    const ultima = await tarjetas.last().evaluate((e) => e.getBoundingClientRect().top + scrollY);
    const final = await arriba(page, "#titulo-cierre");
    expect(primera).toBeGreaterThan(lista);
    expect(ultima).toBeGreaterThan(primera);
    expect(final).toBeGreaterThan(ultima);
  });

  test("cada tarjeta abre su línea, arriba", async ({ page, isMobile }) => {
    for (const hacia of ["coaching", "consultoria"] as const) {
      await irA(page, rutas.herramientas);
      const t = page.locator("main a.tarjeta-pulsable", { hasText: dosFormas[hacia].regla });
      await quieto(t);
      await tocar(t, isMobile);
      await expect(page).toHaveURL(rutas[hacia]);
      await esperarArriba(page);
    }
  });
});

test.describe("/coaching: el problema y la sesión se contestan", () => {
  test("el titular anuncia las razones y la escena del lunes vuelve en el paso 3", async ({ page }) => {
    await irA(page, rutas.coaching);
    const titular = page.getByRole("heading", { level: 2, name: coaching.problema.titulo });
    await expect(titular).toBeVisible();
    for (const e of coaching.problema.escenas) await expect(page.locator("main").getByText(e, { exact: true })).toHaveCount(1);
    expect(coaching.problema.escenas[2]).toMatch(/empiezas de cero/);
    expect(coaching.sesion.pasos[2].texto).toMatch(/no empiezas de cero/);
  });

  // La ficha llega al final de la conversación de la ventana (decorativa,
  // aria-hidden), crece como las burbujas y no mueve nada: el alto ya está
  // reservado.
  test("la ventana termina con la ficha de las instrucciones guardadas, después de la última burbuja", async ({ page }) => {
    await irA(page, rutas.coaching);
    const ficha = page.locator("#como-funciona .ficha-sesion");
    const ventana = ficha.locator("xpath=ancestor::div[@aria-hidden='true'][1]");
    await expect(ficha).toHaveCount(1);
    await expect(ficha).toHaveText(coaching.sesion.ventana.ficha);
    const burbujas = ventana.locator(".burbuja");
    await expect(burbujas).toHaveCount(coaching.sesion.ventana.mensajes.length + 1);
    // Es la última, con su retraso de conversación (0,75 s después de la
    // anterior) y la misma transición de las burbujas.
    const datos = await burbujas.evaluateAll((els) => els.map((e) => ({ ficha: e.classList.contains("ficha-sesion"), retraso: getComputedStyle(e).getPropertyValue("--retraso").trim() })));
    expect(datos.at(-1)).toEqual({ ficha: true, retraso: `${0.3 + coaching.sesion.ventana.mensajes.length * 0.75}s` });
    expect(datos.slice(0, -1).every((d) => !d.ficha)).toBe(true);
    // Antes de verse está recogida; al llegar, aparece entera.
    const altoAntes = await ventana.evaluate((v) => v.getBoundingClientRect().height);
    await ventana.scrollIntoViewIfNeeded();
    await expect(ficha).toHaveAttribute("data-visible", /.*/);
    await expect.poll(() => ficha.evaluate((f) => getComputedStyle(f).opacity)).toBe("1");
    await expect.poll(() => ficha.evaluate((f) => getComputedStyle(f).transform)).toBe("none");
    expect(await ventana.evaluate((v) => v.getBoundingClientRect().height)).toBe(altoAntes);
  });
});

test.describe("/coaching con 'reducir movimiento'", () => {
  test.use({ reducedMotion: "reduce" });
  test("la ficha solo funde: no crece ni se desplaza", async ({ page, vigilancia }) => {
    // La escritura de la ventana (TextoQueSeEscribe) y "reducir movimiento":
    // ver movimiento.spec.ts.
    vigilancia.tolerar(/Minified React error #418/);
    await irA(page, rutas.coaching);
    const ficha = page.locator("#como-funciona .ficha-sesion");
    expect(await ficha.evaluate((f) => getComputedStyle(f).transform)).toBe("none");
    expect(await ficha.evaluate((f) => getComputedStyle(f).transitionProperty)).toBe("opacity");
  });
});

test.describe("/consultoria: el paso 01 es la conversación del botón y el 04 dice quién lo opera", () => {
  test("los pasos del recorrido traen los textos nuevos y la escena 1 dice «se traba», como la portada", async ({ page }) => {
    await irA(page, rutas.consultoria);
    const pasos = page.locator("#como-trabajamos ol > li");
    await expect(pasos).toHaveCount(4);
    await expect(pasos.nth(0)).toContainText(consultoria.recorrido.pasos[0].texto);
    await expect(pasos.nth(3).locator("h3")).toHaveText("Tu equipo lo opera");
    await expect(pasos.nth(3)).toContainText(consultoria.recorrido.pasos[3].llevas);
    expect(consultoria.recorrido.pasos[0].texto).toMatch(/^En la primera conversación/);
    expect(consultoria.problema.escenas[0].titulo).toMatch(/se traba/);
    expect(consultoria.portada.sub).toMatch(/se traba/);
    await expect(page.locator("main").getByText(consultoria.paraQuien.cita, { exact: true })).toBeVisible();
  });
});

test.describe("/nosotros presenta las dos formas", () => {
  test("el titular nombra las dos líneas y el último párrafo dice la regla de cada una antes de las tarjetas", async ({ page }) => {
    await irA(page, rutas.nosotros);
    await expect(page.locator("h1")).toHaveText(nosotros.titulo);
    const parrafo = page.locator("main").getByText(nosotros.contraste.texto, { exact: true });
    await expect(parrafo).toBeVisible();
    // Las palabras de las puertas del inicio.
    expect(nosotros.contraste.texto).toContain(`Si ${dosFormas.coaching.regla.toLowerCase()}`);
    expect(nosotros.contraste.texto).toContain(`Si ${dosFormas.consultoria.regla.toLowerCase()}`);
    const p = await parrafo.evaluate((e) => e.getBoundingClientRect().top + scrollY);
    const t = await page.locator("main a.tarjeta-pulsable").first().evaluate((e) => e.getBoundingClientRect().top + scrollY);
    expect(t).toBeGreaterThan(p);
  });
});

test.describe("/agendar dice qué pasa después de enviar", () => {
  test("debajo del formulario, la línea de tres nodos: envías, eliges la hora y conversamos sin costo", async ({ page, isMobile }) => {
    await irA(page, rutas.agendar);
    const linea = page.getByRole("list", { name: agendar.pasos.titulo });
    await expect(linea).toHaveCount(1);
    const pasos = linea.locator(":scope > li");
    await expect(pasos).toHaveCount(3);
    await expect(pasos.nth(0)).toHaveText(agendar.pasos.enviar);
    await expect(pasos.nth(1)).toHaveText(hayAgenda ? cierre.meta.agenda : cierre.meta.whatsapp);
    await expect(pasos.nth(2)).toContainText(agendar.pasos.conversar);
    await expect(pasos.nth(2)).toContainText(agendar.pasos.duracion);
    // El formulario sigue arriba: la línea va después del botón de enviar.
    const boton = await page.getByRole("button", { name: agendar.enviar }).evaluate((b) => b.getBoundingClientRect().bottom + scrollY);
    const inicio = await linea.evaluate((l) => l.getBoundingClientRect().top + scrollY);
    expect(inicio).toBeGreaterThan(boton);
    // Nodos iguales, unidos por la línea de 1 px: en fila desde 640 px, uno
    // debajo del otro en celular.
    await linea.scrollIntoViewIfNeeded();
    const geo = await pasos.evaluateAll((els) =>
      els.map((li) => {
        const nodo = [...li.querySelectorAll<HTMLElement>("span[aria-hidden]")].find((s) => s.className.includes("rounded-full"))!.getBoundingClientRect();
        const tramo = [...li.querySelectorAll<HTMLElement>("span[aria-hidden]")].find((s) => !s.className.includes("rounded-full"))?.getBoundingClientRect();
        return { x: Math.round(nodo.left), y: Math.round(nodo.top + scrollY), lado: Math.round(nodo.width), tramo: tramo ? { ancho: Math.round(tramo.width), alto: Math.round(tramo.height) } : null };
      }),
    );
    expect(new Set(geo.map((g) => g.lado))).toEqual(new Set([12]));
    expect(geo.at(-1)!.tramo).toBeNull();
    if (isMobile) {
      expect(new Set(geo.map((g) => g.x)).size).toBe(1);
      expect(geo[1].y).toBeGreaterThan(geo[0].y);
      for (const g of geo.slice(0, -1)) expect(g.tramo!.ancho).toBe(1);
    } else {
      expect(new Set(geo.map((g) => g.y)).size).toBe(1);
      expect(geo[1].x).toBeGreaterThan(geo[0].x);
      for (const g of geo.slice(0, -1)) expect(g.tramo!.alto).toBe(1);
    }
    // No dice lo que no sabemos: ni la duración de la conversación de
    // consultoría ni con quién es.
    await expect(linea).not.toContainText(/consultoría|socios|fundador/);
  });
});
