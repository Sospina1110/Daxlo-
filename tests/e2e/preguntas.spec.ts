import { faq, preguntasLinea } from "../../src/content/copy";
import { expect, irA, quieto, test, type Page } from "./apoyo";

// Preguntas frecuentes: un toque abre la respuesta (se ve, tiene alto y deja
// de ser inerte) y otro la cierra. Se prueba en /preguntas (todas) y en
// /coaching (las de la línea).

type Estado = { expandida: string | null; inerte: boolean; alto: number; opacidad: number };

// Estado real del panel que controla el botón.
async function estado(page: Page, pregunta: string): Promise<Estado> {
  const boton = page.getByRole("button", { name: pregunta, exact: true });
  return boton.evaluate((b) => {
    const panel = document.getElementById(b.getAttribute("aria-controls") ?? "") as HTMLElement;
    return {
      expandida: b.getAttribute("aria-expanded"),
      inerte: panel.hasAttribute("inert"),
      alto: panel.getBoundingClientRect().height,
      opacidad: parseFloat(getComputedStyle(panel).opacity),
    };
  });
}

async function abrirYCerrar(page: Page, pregunta: string, respuesta: string, esCelular: boolean) {
  const boton = page.getByRole("button", { name: pregunta, exact: true });
  await quieto(boton);

  const antes = await estado(page, pregunta);
  expect(antes.expandida).toBe("false");
  expect(antes.inerte).toBe(true);
  expect(antes.alto).toBeLessThan(2);

  if (esCelular) await boton.tap();
  else await boton.click();
  await expect(boton).toHaveAttribute("aria-expanded", "true");
  // La transición dura 300 ms: se espera a que termine de abrir.
  await expect.poll(() => estado(page, pregunta)).toMatchObject({ expandida: "true", inerte: false, opacidad: 1 });
  expect((await estado(page, pregunta)).alto).toBeGreaterThan(20);
  const region = page.getByRole("region", { name: pregunta });
  await expect(region).toBeVisible();
  await expect(region).toHaveText(respuesta);
  await expect(region).toBeInViewport();

  if (esCelular) await boton.tap();
  else await boton.click();
  await expect(boton).toHaveAttribute("aria-expanded", "false");
  await expect.poll(async () => (await estado(page, pregunta)).alto).toBeLessThan(2);
  // Cerrada vuelve a ser inerte: no recibe foco ni se anuncia (el efecto sobre
  // el Tab se prueba abajo, con teclado).
  expect((await estado(page, pregunta)).inerte).toBe(true);
}

test("en /preguntas cada pregunta abre con un toque y cierra con otro", async ({ page, isMobile }) => {
  test.slow();
  await irA(page, "/preguntas");
  for (const g of faq.grupos) {
    for (const q of g.preguntas) await abrirYCerrar(page, q.p, q.r, isMobile);
  }
});

test("en /preguntas abrir una no cierra las otras (cada una es independiente)", async ({ page, isMobile }) => {
  await irA(page, "/preguntas");
  const [a, b] = faq.grupos[1].preguntas;
  for (const q of [a, b]) {
    const boton = page.getByRole("button", { name: q.p, exact: true });
    await quieto(boton);
    if (isMobile) await boton.tap();
    else await boton.click();
  }
  await expect(page.getByRole("button", { name: a.p, exact: true })).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("button", { name: b.p, exact: true })).toHaveAttribute("aria-expanded", "true");
});

test("en /coaching las preguntas de la línea abren y cierran", async ({ page, isMobile }) => {
  await irA(page, "/coaching");
  const grupo = faq.grupos[preguntasLinea.coaching.grupo];
  await expect(page.getByRole("heading", { name: preguntasLinea.coaching.titulo })).toHaveCount(1);
  for (const q of [grupo.preguntas[0], grupo.preguntas.at(-1)!]) await abrirYCerrar(page, q.p, q.r, isMobile);
});

test("la ayuda por WhatsApp va después de las preguntas en celular, y en la columna izquierda en escritorio", async ({ page, isMobile }) => {
  await irA(page, "/preguntas");
  const ultima = faq.grupos.at(-1)!.preguntas.at(-1)!.p;
  const primera = faq.grupos[0].preguntas[0].p;
  // Posiciones en la página (no en la pantalla), para compararlas sin importar el scroll.
  const donde = async (l: ReturnType<Page["locator"]>) => l.evaluate((e) => ({ y: e.getBoundingClientRect().top + scrollY, x: e.getBoundingClientRect().left }));
  const ayuda = await donde(page.locator("main").getByText(faq.ayuda, { exact: true }));
  const h1 = await donde(page.locator("h1"));
  const pPrimera = await donde(page.getByRole("button", { name: primera, exact: true }));
  const pUltima = await donde(page.getByRole("button", { name: ultima, exact: true }));
  const boton = page.locator("main").getByRole("link", { name: /Escribir por WhatsApp/ });
  await expect(boton).toBeVisible();

  if (isMobile) {
    // Una sola columna: titular, preguntas y al final la ayuda.
    expect(h1.y, "el titular sigue primero").toBeLessThan(pPrimera.y);
    expect(ayuda.y, "en celular la ayuda queda debajo de la última pregunta").toBeGreaterThan(pUltima.y);
  } else {
    // Dos columnas: el titular y la ayuda a la izquierda, las preguntas a la derecha.
    expect(h1.x).toBeLessThan(pPrimera.x);
    expect(ayuda.y, "en escritorio la ayuda queda arriba, junto al titular").toBeLessThan(pUltima.y);
    expect(ayuda.x, "en escritorio la ayuda va en la columna izquierda").toBeLessThan(pPrimera.x);
  }
});

test("con teclado: Tab llega a la pregunta, Enter abre y Espacio cierra; cerrada, Tab salta la respuesta", async ({ page, isMobile }) => {
  test.skip(isMobile, "prueba de teclado físico, en escritorio");
  await irA(page, "/preguntas");
  const [q1, q2] = faq.grupos[0].preguntas;
  const b1 = page.getByRole("button", { name: q1.p, exact: true });
  const b2 = page.getByRole("button", { name: q2.p, exact: true });
  await quieto(b1);
  await b1.focus();
  await page.keyboard.press("Enter");
  await expect(b1).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press(" ");
  await expect(b1).toHaveAttribute("aria-expanded", "false");
  // Con la respuesta cerrada (inert), el siguiente Tab va directo a la siguiente pregunta.
  await page.keyboard.press("Tab");
  await expect(b2).toBeFocused();
});
