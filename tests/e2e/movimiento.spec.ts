import { consultoria, dosFormas, faq, hero, nav, preguntasLinea, rutas } from "../../src/content/copy";
import { caja, expect, irA, irAlFinal, quieto, RUTAS, test, textosInvisibles, type Locator, type Page } from "./apoyo";

// Movimiento y consumo: las animaciones infinitas se pausan fuera de pantalla,
// en celular no corren las dos más caras, el texto que se escribe no mueve la
// página, y con "reducir movimiento" todo se ve sin animaciones.

// La misma lista que pausa el script del layout. (El halo que respiraba en el
// botón del hero salió en noviembre de 2026.)
const INFINITAS = ".animate-flow,.animate-deriva,.animate-float,.animate-marquee,.animate-marquee-reverse,.animate-ping,.animate-paseo,.animate-caret";

type Animada = { clase: string; fuera: boolean; dentro: boolean; pausa: boolean; corriendo: number };

// Estado de cada animación infinita: si está lejos de la pantalla (más de los
// 100 px de margen del observador), si está claramente dentro, si tiene
// data-pausa y cuántas de sus animaciones siguen corriendo.
async function animadas(page: Page): Promise<Animada[]> {
  return page.evaluate((sel) => {
    return [...document.querySelectorAll(sel)].map((el) => {
      const r = el.getBoundingClientRect();
      const sinCaja = el.getClientRects().length === 0;
      const fuera = sinCaja || r.bottom < -110 || r.top > innerHeight + 110 || r.right < -110 || r.left > innerWidth + 110;
      const dentro = !sinCaja && r.bottom > 10 && r.top < innerHeight - 10 && r.right > 10 && r.left < innerWidth - 10;
      return {
        clase: [...el.classList].find((c) => c.startsWith("animate-")) ?? "",
        fuera,
        dentro,
        pausa: el.hasAttribute("data-pausa"),
        corriendo: el.getAnimations().filter((a) => a.playState === "running").length,
      };
    });
  }, INFINITAS);
}

// La política de datos es texto de lectura: no tiene animaciones.
for (const ruta of RUTAS.filter((r) => r !== rutas.privacidad)) {
  test(`${ruta}: quieta arriba, las animaciones infinitas fuera de pantalla quedan en pausa (y detenidas de verdad)`, async ({ page }) => {
    await irA(page, ruta);
    // Dos segundos sin tocar nada, como quien lee el comienzo.
    await page.waitForTimeout(2_000);
    const todas = await animadas(page);
    expect(todas.length, "la página no tiene animaciones infinitas que revisar").toBeGreaterThan(0);
    const fuera = todas.filter((a) => a.fuera);
    for (const a of fuera) {
      expect.soft(a.pausa, `${a.clase} fuera de pantalla sin data-pausa`).toBe(true);
      expect.soft(a.corriendo, `${a.clase} fuera de pantalla sigue corriendo`).toBe(0);
    }
    // Las que se ven no se pausan.
    for (const a of todas.filter((x) => x.dentro)) expect.soft(a.pausa, `${a.clase} visible con data-pausa`).toBe(false);
  });
}

test("al bajar al cierre se pausan las de arriba y arrancan las de abajo", async ({ page }) => {
  await irA(page, "/");
  // Arriba: el cursor del texto que se escribe solo en la maqueta del hero
  // (animate-caret). Antes la referencia era el halo que respiraba en el botón
  // del hero, que salió en noviembre de 2026 (un brillo que late solo delata
  // una plantilla). Abajo: el orbe del cierre (animate-float), antes del pie.
  // (La cinta de luz del fondo tiene su propia prueba: cinta.spec.ts.)
  const cursor = page.locator("#top .animate-caret");
  const orbeCierre = page.locator('section[aria-labelledby="titulo-cierre"] .animate-float');
  await expect(cursor).toHaveCount(1);
  // En celulares bajos la maqueta queda debajo del pliegue: primero se trae a
  // la vista.
  await cursor.evaluate((c) => c.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect(cursor).toBeVisible();
  await expect(cursor).not.toHaveAttribute("data-pausa", "");
  await expect(orbeCierre).toHaveAttribute("data-pausa", "");

  // Se baja hasta el orbe (al fondo del todo no: en celular el pie es alto y
  // el orbe queda arriba, fuera de pantalla, con razón en pausa).
  await orbeCierre.evaluate((o) => o.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect(orbeCierre).not.toHaveAttribute("data-pausa", "");
  await expect(cursor).toHaveAttribute("data-pausa", "");
  await expect.poll(() => orbeCierre.evaluate((e) => e.getAnimations().filter((a) => a.playState === "running").length)).toBeGreaterThan(0);
  expect(await cursor.evaluate((e) => e.getAnimations().every((a) => a.playState !== "running"))).toBe(true);
});

test.describe("animaciones caras en celular", () => {
  // Las líneas punteadas (animate-flow) y la deriva lenta de los resplandores
  // de fondo (animate-deriva) se apagan por CSS debajo de 768 px.
  async function flujoYRespirar(page: Page) {
    return page.evaluate(() =>
      [...document.querySelectorAll(".animate-flow, .animate-deriva")].map((el) => ({
        clase: el.classList.contains("animate-flow") ? "animate-flow" : "animate-deriva",
        corriendo: el.getAnimations().filter((a) => a.playState === "running").length,
      })),
    );
  }

  async function llevarALaVista(page: Page, selector: string) {
    await page.locator(selector).first().evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  }

  // Desde noviembre de 2026 ninguna página usa líneas punteadas (el diagrama
  // de consultoría del inicio salió): la regla de CSS sigue, por si vuelven, y
  // aquí se revisan las que haya. La deriva sí está: el resplandor de la zona
  // de cada línea y los del cierre.
  for (const ruta of ["/", "/consultoria"]) {
    test(`${ruta}: debajo de 768 px no corre ninguna animación de líneas punteadas ni de deriva, aunque estén a la vista`, async ({ page }) => {
      const ancho = page.viewportSize()?.width ?? 0;
      test.skip(ancho >= 768, "solo pantallas de celular");
      await irA(page, ruta);
      let estados = await flujoYRespirar(page);
      expect(estados.length).toBeGreaterThan(0);
      expect(estados.filter((e) => e.corriendo > 0)).toEqual([]);
      // Cada una, ya en pantalla.
      for (const clase of [".animate-flow", ".animate-deriva"]) {
        if ((await page.locator(clase).count()) === 0) continue;
        await llevarALaVista(page, clase);
        await page.waitForTimeout(300);
        estados = await flujoYRespirar(page);
        expect(estados.filter((e) => e.corriendo > 0)).toEqual([]);
      }
    });
  }

  test("control en escritorio: la deriva sí corre a la vista (la prueba de arriba no pasa por no ver nada)", async ({ page }) => {
    const ancho = page.viewportSize()?.width ?? 0;
    test.skip(ancho < 768, "solo pantallas anchas");
    await irA(page, "/");
    await llevarALaVista(page, ".animate-deriva");
    await expect.poll(async () => (await flujoYRespirar(page)).filter((e) => e.clase === "animate-deriva" && e.corriendo > 0).length).toBeGreaterThan(0);
  });
});

// Lo que salió por pesado o por envejecer el sitio (noviembre de 2026): la
// marquesina de logos del inicio y de /coaching, y el pulso de la maqueta de la
// sesión (se leía como una sesión real en vivo).
test("el inicio y /coaching no tienen marquesina, y la sesión de ejemplo no late", async ({ page }) => {
  for (const ruta of ["/", "/coaching"]) {
    await irA(page, ruta);
    await expect(page.locator("main .animate-marquee, main .animate-marquee-reverse")).toHaveCount(0);
  }
  await expect(page.locator("#como-funciona .animate-ping")).toHaveCount(0);
});

// El momento de autor de /consultoria: desde 1024 px, cada "Hoy" se tacha al
// entrar en pantalla (la raya crece con transform); antes, sin tachar.
test.describe("tachado del 'Hoy' en /consultoria", () => {
  const rayas = (page: Page) => page.locator("#que-automatizamos .tachado-linea");
  const FILAS = consultoria.cambios.filas.length;
  const escala = (page: Page) =>
    rayas(page).evaluateAll((els) =>
      els.map((e) => {
        const m = getComputedStyle(e).transform;
        return m === "none" ? 1 : new DOMMatrixReadOnly(m).a;
      }),
    );

  test("desde 1024 px: sin tachar fuera de pantalla, tachado al llegar", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) < 1024, "la raya animada es solo desde 1024 px");
    await irA(page, "/consultoria");
    await expect(rayas(page)).toHaveCount(FILAS);
    expect(await escala(page)).toEqual(Array(FILAS).fill(0));
    await rayas(page).last().evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" }));
    await expect.poll(() => escala(page), { timeout: 5_000 }).toEqual(Array(FILAS).fill(1));
  });

  test("desde 1024 px: la flecha llega con el tachado, desde 8 px a la izquierda", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) < 1024, "la flecha entre columnas es solo desde 1024 px");
    await irA(page, "/consultoria");
    const flechas = page.locator("#que-automatizamos .flecha-cambio");
    await expect(flechas).toHaveCount(FILAS);
    const estado = () =>
      flechas.evaluateAll((els) =>
        els.map((e) => {
          const m = getComputedStyle(e).transform;
          return { opacidad: getComputedStyle(e).opacity, x: m === "none" ? 0 : new DOMMatrixReadOnly(m).e };
        }),
      );
    expect(await estado()).toEqual(Array(FILAS).fill({ opacidad: "0", x: -8 }));
    // Arranca 0,2 s después de la raya (0,55 s después de su fila).
    const retraso = await flechas.first().evaluate((e) => getComputedStyle(e).transitionDelay);
    expect(retraso).toBe("0.55s, 0.55s");
    await flechas.last().evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" }));
    await expect.poll(estado, { timeout: 5_000 }).toEqual(Array(FILAS).fill({ opacidad: "1", x: 0 }));
  });

  test("por debajo de 1024 px el tachado es fijo, con line-through", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) >= 1024, "solo pantallas angostas");
    await irA(page, "/consultoria");
    const hoy = page.locator("#que-automatizamos li span.line-through");
    await expect(hoy).toHaveCount(FILAS);
    for (const d of await hoy.evaluateAll((els) => els.map((e) => getComputedStyle(e).textDecorationLine))) expect(d).toContain("line-through");
    await expect(rayas(page).first()).toBeHidden();
  });
});

test.describe("texto que se escribe solo (hero)", () => {
  const caja = (page: Page) => page.locator("#top span.grid").first();

  test("fuera de pantalla no escribe; a la vista, escribe", async ({ page }) => {
    await irA(page, "/");
    const visible = caja(page).locator(":scope > span").last();
    // Cuántos textos distintos muestra en un segundo.
    const distintos = () =>
      visible.evaluate(async (v) => {
        const vistos = new Set<string>();
        for (let i = 0; i < 10; i++) {
          vistos.add(v.textContent ?? "");
          await new Promise((r) => setTimeout(r, 100));
        }
        return vistos.size;
      });
    // Con la maqueta lejos, arriba de la pantalla, no gasta procesador escribiendo.
    await irAlFinal(page);
    await page.waitForTimeout(300);
    expect(await distintos()).toBe(1);
    // A la vista, escribe.
    await caja(page).evaluate((c) => c.scrollIntoView({ block: "center", behavior: "instant" }));
    await expect.poll(distintos).toBeGreaterThan(1);
  });

  test("la caja mantiene su alto mientras escribe y borra (la página de abajo no salta)", async ({ page }) => {
    await irA(page, "/");
    // Solo escribe mientras está en pantalla: en celulares bajos la maqueta
    // queda debajo del pliegue.
    await caja(page).evaluate((c) => c.scrollIntoView({ block: "center", behavior: "instant" }));
    await expect(caja(page)).toBeVisible();
    const muestras = await caja(page).evaluate(async (c) => {
      const visible = c.lastElementChild as HTMLElement;
      const salida: { alto: number; texto: string; abajo: number }[] = [];
      const siguiente = c.closest("section")?.nextElementSibling as HTMLElement;
      for (let i = 0; i < 45; i++) {
        salida.push({ alto: c.getBoundingClientRect().height, texto: visible.textContent ?? "", abajo: siguiente.getBoundingClientRect().top + scrollY });
        await new Promise((r) => setTimeout(r, 80));
      }
      return salida;
    });
    const textos = new Set(muestras.map((m) => m.texto));
    expect(textos.size, "el texto no cambió: no se está escribiendo").toBeGreaterThan(5);
    expect(new Set(muestras.map((m) => Math.round(m.alto))).size, `altos vistos: ${[...new Set(muestras.map((m) => m.alto))].join(", ")}`).toBe(1);
    // Lo que sigue al hero no se movió.
    expect(new Set(muestras.map((m) => Math.round(m.abajo))).size).toBe(1);
    // El alto reservado alcanza para la frase más larga.
    for (const t of muestras.map((m) => m.texto)) expect(hero.tareas.some((f) => f.startsWith(t))).toBe(true);
  });
});

test.describe("con 'reducir movimiento'", () => {
  test.use({ reducedMotion: "reduce" });

  async function infinitasCorriendo(page: Page) {
    return page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running" && a.effect?.getTiming().iterations === Infinity)
        .map((a) => {
          const t = (a.effect as KeyframeEffect | null)?.target as Element | null;
          return t ? `${t.tagName.toLowerCase()}.${[...t.classList].join(".")}` : "?";
        }),
    );
  }

  // Páginas con TextoQueSeEscribe: ahí la hidratación falla con "reducir
  // movimiento" (ver la prueba marcada como bug más abajo). En las pruebas
  // generales se tolera ese error para poder revisar todo lo demás.
  const CON_ESCRITURA = ["/", "/coaching"];
  const ERROR_HIDRATACION = /Minified React error #418/;

  for (const ruta of RUTAS) {
    test(`${ruta}: todo se ve sin animaciones y sin desplazamientos`, async ({ page, vigilancia }) => {
      if (CON_ESCRITURA.includes(ruta)) vigilancia.tolerar(ERROR_HIDRATACION);
      await irA(page, ruta);
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
      // Nada infinito corriendo, ni siquiera lo que está a la vista.
      expect(await infinitasCorriendo(page)).toEqual([]);

      // Las entradas del principio (.entrada, .subir) ya están en su lugar, sin esperar.
      const entradas = await page.evaluate(() =>
        [...document.querySelectorAll(".entrada, .subir")].map((e) => ({ opacidad: getComputedStyle(e).opacity, transform: getComputedStyle(e).transform, animaciones: e.getAnimations().length })),
      );
      expect(entradas.length).toBeGreaterThan(0);
      for (const e of entradas) expect(e).toEqual({ opacidad: "1", transform: "none", animaciones: 0 });

      // Ningún bloque que aparece con el scroll se desplaza: solo cambia su opacidad.
      const desplazados = await page.evaluate(() =>
        [...document.querySelectorAll("[data-revelar]")].filter((e) => !e.classList.contains("crecer") && getComputedStyle(e).transform !== "none").length,
      );
      expect(desplazados).toBe(0);

      // Lo que está en la primera pantalla se ve completo sin mover nada.
      await expect
        .poll(() =>
          page.evaluate(() =>
            [...document.querySelectorAll("[data-revelar]")]
              .filter((e) => {
                const r = e.getBoundingClientRect();
                return r.height > 0 && r.top < innerHeight * 0.9 && r.bottom > 0;
              })
              .filter((e) => !e.hasAttribute("data-visible") || getComputedStyle(e).opacity !== "1").length,
          ),
        )
        .toBe(0);

      // Un solo salto al final (sin recorrer de a poco) deja todo a la vista:
      // el respaldo del script revela lo que quedó arriba.
      await irAlFinal(page);
      await expect.poll(() => page.evaluate(() => document.querySelectorAll("[data-revelar]:not([data-visible])").length)).toBe(0);
      // Lo que Motion deja oculto al arrancar se marca con [data-motion-oculto]
      // y se revisa aparte, llevándolo a la vista. Hoy ninguna sección lo usa;
      // la revisión queda por si vuelve uno.
      await expect.poll(() => textosInvisibles(page, "[data-motion-oculto]")).toEqual([]);
      for (const zona of await page.locator("[data-motion-oculto]:visible").all()) {
        await zona.evaluate((z) => z.scrollIntoView({ block: "center", behavior: "instant" }));
      }
      await expect.poll(() => textosInvisibles(page)).toEqual([]);
      expect(await infinitasCorriendo(page)).toEqual([]);
    });
  }

  // Presiona con el mouse, mide mientras sigue abajo y suelta sobre el mismo
  // elemento. El clic se frena en la página (captura en window: ni React ni el
  // navegador lo ven), así no se navega; soltar fuera arrastraría el enlace.
  async function presionarYMedir(page: Page, apretar: Locator, medir: Locator) {
    await quieto(apretar);
    const b = await caja(apretar);
    await page.mouse.move(b.x + b.width / 2, b.y + Math.min(b.height / 2, 30));
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
    try {
      await expect
        .poll(() => medir.evaluate((el) => ({ escala: getComputedStyle(el).scale, opacidad: Math.round(parseFloat(getComputedStyle(el).opacity) * 100) / 100 })))
        .toEqual({ escala: "none", opacidad: 0.85 });
    } finally {
      await page.mouse.up();
    }
  }

  test("al presionar no se escala nada: el botón principal, un botón de luz y una puerta solo se atenúan", async ({ page, isMobile }) => {
    test.skip(isMobile, "con mouse");
    await irA(page, "/");
    const principal = page.locator("#top").getByRole("link", { name: hero.cta });
    await presionarYMedir(page, principal, principal);
    const luz = page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: nav.cta.label, exact: true });
    await presionarYMedir(page, luz, luz);
    const puerta = page.locator("article").filter({ hasText: dosFormas.coaching.regla });
    await presionarYMedir(page, puerta.getByText(dosFormas.coaching.regla, { exact: true }), puerta);
  });

  for (const ruta of ["/", "/coaching", "/consultoria"]) {
    test(`${ruta}: el botón magnético no se mueve`, async ({ page, isMobile }) => {
      test.skip(isMobile, "con mouse");
      await irA(page, ruta);
      const cta = page.locator("main").getByRole("link", { name: hero.cta }).first();
      await quieto(cta);
      const b = await caja(cta);
      await page.mouse.move(b.x + b.width - 2, b.y + b.height - 2, { steps: 4 });
      await page.waitForTimeout(500);
      const iman = cta.locator("xpath=ancestor::*[contains(@class,'iman-movil')][1]");
      expect(await iman.evaluate((e) => getComputedStyle(e).transform)).toBe("none");
    });
  }

  test("el menú de celular abre y cierra sin desplazarse (solo opacidad)", async ({ page, isMobile }) => {
    test.skip(!isMobile, "el menú es de celular");
    await irA(page, "/");
    const boton = page.getByRole("navigation", { name: "Principal" }).getByRole("button", { name: /menú/ });
    // Muestrea el transform del panel en cada cuadro durante 300 ms.
    const muestrear = () =>
      page.evaluate(
        () =>
          new Promise<string[]>((listo) => {
            const salida: string[] = [];
            const t0 = performance.now();
            const paso = () => {
              const m = document.getElementById("menu-movil");
              if (m) salida.push(getComputedStyle(m).transform);
              if (performance.now() - t0 < 300) requestAnimationFrame(paso);
              else listo(salida);
            };
            requestAnimationFrame(paso);
          }),
      );
    let muestras = muestrear();
    await boton.tap();
    const alAbrir = await muestras;
    expect(alAbrir.length, "el panel no apareció").toBeGreaterThan(0);
    expect(new Set(alAbrir)).toEqual(new Set(["none"]));
    muestras = muestrear();
    await boton.tap();
    for (const t of await muestras) expect(t).toBe("none");
    await expect(page.locator("#menu-movil")).toHaveCount(0);
  });

  test("la barra cambia de ancho sin transición", async ({ page }) => {
    await irA(page, "/");
    expect(await page.getByRole("navigation", { name: "Principal" }).evaluate((n) => getComputedStyle(n).transitionDuration)).toBe("0s");
  });

  test("el '+' de una pregunta no se anima al abrirla", async ({ page, isMobile }) => {
    await irA(page, "/coaching");
    const q = faq.grupos[preguntasLinea.coaching.grupo].preguntas[0];
    const boton = page.getByRole("button", { name: q.p, exact: true });
    await quieto(boton);
    if (isMobile) await boton.tap();
    else await boton.click();
    await expect(boton).toHaveAttribute("aria-expanded", "true");
    expect(await boton.locator("svg").evaluate((s) => s.getAnimations().length)).toBe(0);
  });

  test("/consultoria: el 'Hoy' ya está tachado y quieto, también antes de llegar a él", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await irA(page, "/consultoria");
    const rayas = page.locator("#que-automatizamos .tachado-linea");
    await expect(rayas).toHaveCount(consultoria.cambios.filas.length);
    const estado = () =>
      rayas.evaluateAll((els) => els.map((e) => ({ transform: getComputedStyle(e).transform, transicion: getComputedStyle(e).transitionDuration })));
    // Fuera de pantalla todavía (sus filas no han aparecido): ya tachado.
    for (const e of await estado()) expect(e).toEqual({ transform: "none", transicion: "0s" });
    await rayas.last().evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" }));
    await page.waitForTimeout(400);
    for (const e of await estado()) expect(e).toEqual({ transform: "none", transicion: "0s" });
  });

  test("/consultoria: la flecha del hoy → después y las líneas del recorrido ya están en su lugar", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await irA(page, "/consultoria");
    const piezas = page.locator("#que-automatizamos .flecha-cambio, #como-trabajamos .linea-recorrido");
    await expect(piezas).toHaveCount(consultoria.cambios.filas.length + 3);
    // Fuera de pantalla todavía (sus filas no han aparecido): enteras y quietas.
    const estado = () =>
      piezas.evaluateAll((els) =>
        els.map((e) => ({ transform: getComputedStyle(e).transform, opacidad: getComputedStyle(e).opacity, transicion: getComputedStyle(e).transitionDuration })),
      );
    for (const e of await estado()) expect(e).toEqual({ transform: "none", opacidad: "1", transicion: "0s" });
  });

  test("el hero muestra la primera tarea completa y quieta", async ({ page, vigilancia }) => {
    vigilancia.tolerar(ERROR_HIDRATACION);
    await irA(page, "/");
    const visible = page.locator("#top span.grid").first().locator(":scope > span").last();
    await expect(visible).toHaveText(hero.tareas[0]);
    await page.waitForTimeout(1_000);
    await expect(visible).toHaveText(hero.tareas[0]);
  });

  // Con "reducir movimiento", TextoQueSeEscribe pintaba frases[0] desde el
  // primer render del navegador y el servidor había pintado el texto vacío:
  // React lanzaba el error #418 y volvía a pintar la página. Ahora la frase
  // quieta aparece después de montar.
  for (const ruta of CON_ESCRITURA) {
    test(`${ruta}: la página hidrata sin errores con 'reducir movimiento'`, async ({ page, vigilancia }) => {
      // El error se revisa aquí mismo, no en la vigilancia, para que la prueba
      // falle solo por esto.
      vigilancia.tolerar(ERROR_HIDRATACION);
      const errores: string[] = [];
      page.on("pageerror", (e) => errores.push(e.message));
      await irA(page, ruta);
      await expect(page.locator("h1")).toBeVisible();
      // Si la hidratación falla, React lo reporta apenas termina de hidratar.
      await page.waitForTimeout(500);
      expect(errores.filter((e) => ERROR_HIDRATACION.test(e))).toEqual([]);
    });
  }

  test("control: sin 'reducir movimiento' la misma página hidrata sin errores", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await irA(page, "/");
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForTimeout(500);
    // Los errores (incluido un #418) los revisa la vigilancia al terminar.
  });
});

// Lo que estaba mal antes de la pasada de movimiento de noviembre de 2026 y no
// debe volver.
test.describe("regresiones de movimiento", () => {
  test("el '+' de una pregunta gira con una transición de la propiedad rotate", async ({ page, isMobile }) => {
    // Con transition-[transform], rotate-45 (que en Tailwind 4 es la propiedad
    // rotate) giraba de golpe.
    await irA(page, "/coaching");
    const q = faq.grupos[preguntasLinea.coaching.grupo].preguntas[0];
    const boton = page.getByRole("button", { name: q.p, exact: true });
    await quieto(boton);
    if (isMobile) await boton.tap();
    else await boton.click();
    const propiedades = await boton
      .locator("svg")
      .evaluate((s) => s.getAnimations().map((a) => (a as CSSTransition).transitionProperty ?? ""));
    expect(propiedades).toContain("rotate");
  });

  test("la puerta del inicio funde su borde (la aparición ya no le pisa la transición)", async ({ page }) => {
    await irA(page, "/");
    const puerta = page.locator("article").filter({ hasText: dosFormas.coaching.regla });
    const propiedades = await puerta.evaluate((a) => getComputedStyle(a).transitionProperty);
    expect(propiedades.split(",").map((p) => p.trim())).toContain("border-color");
    // La aparición va en el envoltorio, no en el article.
    expect(await puerta.evaluate((a) => a.hasAttribute("data-revelar"))).toBe(false);
  });

  test("/consultoria: el recorrido entra en ola (cada intervalo más corto, nunca más de 0,32 s)", async ({ page }) => {
    await irA(page, "/consultoria");
    const pasos = page.locator("#como-trabajamos ol > li[data-revelar]");
    await expect(pasos).toHaveCount(4);
    // En celular los pasos van uno debajo del otro: se trae cada uno a la vista.
    for (let i = 0; i < 4; i++) await pasos.nth(i).evaluate((p) => p.scrollIntoView({ block: "center", behavior: "instant" }));
    await expect.poll(() => pasos.evaluateAll((ps) => ps.every((p) => p.hasAttribute("data-visible")))).toBe(true);
    const retrasos = await pasos.evaluateAll((ps) => ps.map((p) => (p as HTMLElement).style.getPropertyValue("--retraso")));
    expect(retrasos).toEqual(["0s", "0.08s", "0.148s", "0.206s"]);
    const s = retrasos.map(parseFloat);
    const pasosEntre = s.slice(1).map((v, i) => v - s[i]);
    for (let i = 1; i < pasosEntre.length; i++) expect(pasosEntre[i]).toBeLessThan(pasosEntre[i - 1]);
    for (const v of s) expect(v).toBeLessThanOrEqual(0.32);
  });

  test("/consultoria: la línea del recorrido se traza desde cada nodo al aparecer su paso", async ({ page }) => {
    await irA(page, "/consultoria");
    const lineas = page.locator("#como-trabajamos .linea-recorrido");
    await expect(lineas).toHaveCount(3);
    const ancho = page.viewportSize()?.width ?? 0;
    // A lo ancho desde 1024 px (cuatro columnas); hacia abajo por debajo.
    const escala = () =>
      lineas.evaluateAll(
        (els, horizontal) =>
          els.map((e) => {
            const m = getComputedStyle(e).transform;
            if (m === "none") return 1;
            const d = new DOMMatrixReadOnly(m);
            return horizontal ? d.a : d.d;
          }),
        ancho >= 1024,
      );
    expect(await escala()).toEqual([0, 0, 0]);
    // Crece desde su nodo: el origen está en el borde izquierdo (o el de arriba).
    const origen = await lineas.first().evaluate((e) => getComputedStyle(e).transformOrigin.split(" ").map(parseFloat));
    expect(origen[ancho >= 1024 ? 0 : 1]).toBe(0);
    if (ancho >= 1024) {
      // Un solo trazo de 01 a 04: cada tramo empieza cuando el anterior ya casi llegó.
      const retrasos = await lineas.evaluateAll((els) => els.map((e) => getComputedStyle(e).transitionDelay));
      expect(retrasos).toEqual(["0.2s", "0.42s", "0.64s"]);
    }
    const pasos = page.locator("#como-trabajamos ol > li");
    for (let i = 0; i < 4; i++) await pasos.nth(i).evaluate((p) => p.scrollIntoView({ block: "center", behavior: "instant" }));
    await expect.poll(escala, { timeout: 5_000 }).toEqual([1, 1, 1]);
  });

  test("hero: la fila del botón termina de entrar antes de 1 s y la maqueta antes de 1,25 s", async ({ page }) => {
    await irA(page, "/");
    const fila = page.locator("#top .entrada").filter({ has: page.getByRole("link", { name: hero.cta }) });
    await expect(fila).toHaveCount(1);
    // Fin de la animación = retraso + duración, en ms desde que arranca.
    const fin = await fila.evaluate((f) => f.getAnimations()[0]?.effect?.getComputedTiming().endTime ?? null);
    expect(fin).not.toBeNull();
    expect(Number(fin)).toBeLessThanOrEqual(1000);
    await expect.poll(() => fila.evaluate((f) => ({ opacidad: getComputedStyle(f).opacity, estado: f.getAnimations()[0]?.playState ?? "sin animación" }))).toEqual({
      opacidad: "1",
      estado: "finished",
    });
    const finHero = await page.evaluate(() =>
      Math.max(...[...document.querySelectorAll("#top .entrada, #top .subir")].map((e) => Number(e.getAnimations()[0]?.effect?.getComputedTiming().endTime ?? 0))),
    );
    expect(finHero).toBeLessThanOrEqual(1250);
  });
});
