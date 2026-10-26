import { agendar } from "../../src/content/copy";
import { enlaceDeAgenda, hayAgenda } from "../../src/lib/agenda";
import { expect, interceptarAppsScript, irA, test } from "./apoyo";

// Con la agenda de Cal.com configurada (calcom.enlaces en copy.ts), enviar el
// formulario lleva sola a la persona a elegir la hora, con su nombre, su correo
// y su línea ya escritos. Cal.com no se toca de verdad: se responde en local
// con una página vacía. Mientras no haya enlaces, estas pruebas se saltan y el
// formulario sigue como antes (conversion.spec.ts).
test.skip(!hayAgenda(), "sin agenda de Cal.com configurada todavía");

const CAL = /^https:\/\/(app\.)?cal\.com\//;

for (const linea of ["coaching", "consultoria", "no_se"] as const) {
  test(`${linea}: al enviar pasa sola a Cal.com con nombre, correo y línea, y sin el WhatsApp`, async ({ page, vigilancia }) => {
    vigilancia.tolerar(/^petición externa inesperada: https:\/\/(app\.)?cal\.com\//);
    await page.route(CAL, (r) => r.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>Agenda</title><p>Cal.com</p>" }));
    await irA(page, `/agendar?linea=${linea}`);
    const envios = await interceptarAppsScript(page);

    await page.locator("#nombre").fill("Prueba Agenda");
    await page.locator("#whatsapp").fill("+57 300 123 4567");
    await page.locator("#email").fill("prueba@example.com");
    await page.getByRole("checkbox", { name: new RegExp(agendar.campos.autorizacion.slice(0, 20)) }).check();
    await expect(page.getByText(agendar.metaAgenda)).toBeVisible();
    await page.getByRole("button", { name: agendar.enviar }).click();

    // Primero queda registrado en la hoja, después pasa a la agenda.
    await expect(page.getByText(agendar.exito.agenda.titulo)).toBeVisible();
    expect(envios).toHaveLength(1);
    await page.waitForURL(CAL, { timeout: 10_000 });

    const url = new URL(page.url());
    const esperado = new URL(enlaceDeAgenda(linea, "Prueba Agenda", "prueba@example.com") as string);
    expect(url.origin + url.pathname).toBe(esperado.origin + esperado.pathname);
    expect(Object.fromEntries(url.searchParams)).toEqual(Object.fromEntries(esperado.searchParams));
    expect(url.searchParams.get("name")).toBe("Prueba Agenda");
    expect(url.searchParams.get("email")).toBe("prueba@example.com");
    expect(url.search).not.toContain("300");
  });
}

test("si el registro falla, no se va a la agenda", async ({ page, vigilancia }) => {
  vigilancia.tolerar(/^console\.error: Failed to load resource/);
  await irA(page, "/agendar?linea=coaching");
  await interceptarAppsScript(page, () => ({ abortar: true }));
  await page.locator("#nombre").fill("Prueba Agenda");
  await page.locator("#whatsapp").fill("+57 300 123 4567");
  await page.locator("#email").fill("prueba@example.com");
  await page.getByRole("checkbox", { name: new RegExp(agendar.campos.autorizacion.slice(0, 20)) }).check();
  await page.getByRole("button", { name: agendar.enviar }).click();
  await expect(page.getByText(agendar.errores.general)).toBeVisible();
  await page.waitForTimeout(2500);
  expect(page.url()).not.toMatch(CAL);
});
