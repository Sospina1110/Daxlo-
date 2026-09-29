import { hero } from "../../src/content/copy";
import { expect, irA, irAlFinal, RUTAS, test, textosInvisibles, type Page } from "./apoyo";

// Movimiento y consumo: las animaciones infinitas se pausan fuera de pantalla,
// en celular no corren las dos más caras, el texto que se escribe no mueve la
// página, y con "reducir movimiento" todo se ve sin animaciones.

// La misma lista que pausa el script del layout.
const INFINITAS = ".animate-flow,.animate-breathe,.animate-float,.animate-marquee,.animate-marquee-reverse,.animate-ping,.animate-paseo,.animate-caret";

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

for (const ruta of RUTAS) {
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
  // Arriba: los haces del hero (animate-breathe) cubren la primera pantalla en
  // cualquier tamaño. Abajo: el orbe del cierre (animate-float), antes del pie.
  const haces = page.locator("#top .animate-breathe");
  const orbeCierre = page.locator('section[aria-labelledby="titulo-cierre"] .animate-float');
  await expect(haces).not.toHaveAttribute("data-pausa", "");
  await expect(orbeCierre).toHaveAttribute("data-pausa", "");

  // Se baja hasta el orbe (al fondo del todo no: en celular el pie es alto y
  // el orbe queda arriba, fuera de pantalla, con razón en pausa).
  await orbeCierre.evaluate((o) => o.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect(orbeCierre).not.toHaveAttribute("data-pausa", "");
  await expect(haces).toHaveAttribute("data-pausa", "");
  await expect.poll(() => orbeCierre.evaluate((e) => e.getAnimations().filter((a) => a.playState === "running").length)).toBeGreaterThan(0);
  // (En celular los haces no animan nunca; en escritorio quedan detenidos.)
  expect(await haces.evaluate((e) => e.getAnimations().every((a) => a.playState !== "running"))).toBe(true);
});

test.describe("animaciones caras en celular", () => {
  // Las líneas punteadas (animate-flow) y el respirar de los haces del hero
  // (animate-breathe) se apagan por CSS debajo de 768 px.
  async function flujoYRespirar(page: Page) {
    return page.evaluate(() =>
      [...document.querySelectorAll(".animate-flow, .animate-breathe")].map((el) => ({
        clase: el.classList.contains("animate-flow") ? "animate-flow" : "animate-breathe",
        corriendo: el.getAnimations().filter((a) => a.playState === "running").length,
      })),
    );
  }

  async function llevarALaVista(page: Page, selector: string) {
    await page.locator(selector).first().evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  }

  test("debajo de 768 px no corre ninguna animación de líneas punteadas ni de respirar, aunque estén a la vista", async ({ page }) => {
    const ancho = page.viewportSize()?.width ?? 0;
    test.skip(ancho >= 768, "solo pantallas de celular");
    await irA(page, "/");
    let estados = await flujoYRespirar(page);
    expect(estados.length).toBeGreaterThan(0);
    expect(estados.filter((e) => e.corriendo > 0)).toEqual([]);
    // Las líneas del visual de consultoría, ya en pantalla.
    await llevarALaVista(page, ".animate-flow");
    await page.waitForTimeout(300);
    estados = await flujoYRespirar(page);
    expect(estados.filter((e) => e.corriendo > 0)).toEqual([]);
  });

  test("control en escritorio: las mismas animaciones sí corren a la vista (la prueba de arriba no pasa por no ver nada)", async ({ page }) => {
    const ancho = page.viewportSize()?.width ?? 0;
    test.skip(ancho < 768, "solo pantallas anchas");
    await irA(page, "/");
    await expect.poll(async () => (await flujoYRespirar(page)).filter((e) => e.clase === "animate-breathe" && e.corriendo > 0).length).toBeGreaterThan(0);
    await llevarALaVista(page, ".animate-flow");
    await expect.poll(async () => (await flujoYRespirar(page)).filter((e) => e.clase === "animate-flow" && e.corriendo > 0).length).toBeGreaterThan(0);
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
      // Lo que anima Motion al entrar en pantalla ([data-motion-oculto], el
      // lienzo de /consultoria en escritorio) aparece cuando se lo mira: se
      // revisa aparte, llevándolo a la vista.
      await expect.poll(() => textosInvisibles(page, "[data-motion-oculto]")).toEqual([]);
      for (const zona of await page.locator("[data-motion-oculto]:visible").all()) {
        await zona.evaluate((z) => z.scrollIntoView({ block: "center", behavior: "instant" }));
      }
      await expect.poll(() => textosInvisibles(page)).toEqual([]);
      expect(await infinitasCorriendo(page)).toEqual([]);
    });
  }

  test("el hero muestra la primera tarea completa y quieta", async ({ page, vigilancia }) => {
    vigilancia.tolerar(ERROR_HIDRATACION);
    await irA(page, "/");
    const visible = page.locator("#top span.grid").first().locator(":scope > span").last();
    await expect(visible).toHaveText(hero.tareas[0]);
    await page.waitForTimeout(1_000);
    await expect(visible).toHaveText(hero.tareas[0]);
  });

  // BUG DEL SITIO (src/components/ui/escritura.tsx): con "reducir movimiento",
  // TextoQueSeEscribe pinta en el servidor el texto vacío (allá no se sabe la
  // preferencia) y en el navegador, desde el primer render, frases[0], porque
  // useReducedMotion() de Motion lee matchMedia de inmediato. El texto no
  // coincide, React lanza el error #418 (hidratación) y vuelve a pintar la
  // página en el cliente: se pierde el HTML del servidor, hay más trabajo al
  // cargar y el error queda en la consola de cada visita con esa preferencia.
  // Pasa en / (hero) y en /coaching (la maqueta de la sesión). Se arregla
  // mostrando frases[0] recién después de montar (un useEffect que active la
  // preferencia) o dejando que la frase quieta la ponga el CSS.
  for (const ruta of CON_ESCRITURA) {
    test(`${ruta}: la página hidrata sin errores con 'reducir movimiento'`, async ({ page, vigilancia }) => {
      test.fail(true, "Bug conocido: error de hidratación #418 de TextoQueSeEscribe con reducir movimiento");
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
