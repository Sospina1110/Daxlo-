import fs from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// Pruebas de punta a punta sobre el sitio compilado (out/), servido igual que
// en Cloudflare Pages: /coaching sirve coaching.html y lo que no existe
// devuelve 404.html con estado 404. Hace falta un `npm run build` antes.
//
// Puerto propio (4391) para no chocar con otros servidores de la máquina
// (4173, 4810 y 8899 suelen estar ocupados). Se cambia con PUERTO_E2E.
const PUERTO = Number(process.env.PUERTO_E2E ?? 4391);
const BASE = `http://127.0.0.1:${PUERTO}`;

if (!fs.existsSync("out/index.html")) {
  throw new Error("Falta out/index.html. Corre `npm run build` antes de `npm run test:e2e`.");
}

// WebGL para la cinta de luz del hero. Chromium sin ventana no lo da por su
// cuenta: en Windows se usa la tarjeta gráfica de verdad (D3D11); en otros
// sistemas (una máquina de CI sin GPU), SwiftShader, que dibuja en el
// procesador. Ahí la calidad adaptativa suele dejar un cuadro quieto y las
// pruebas del bucle de tests/e2e/cinta.spec.ts se saltan solas.
const WEBGL =
  process.platform === "win32"
    ? ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"]
    : ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"];

// Sobre la red de la máquina. En la máquina donde se escribió la suite
// (Windows con antivirus que filtra la red local), mientras corren los
// navegadores algunas conexiones nuevas a 127.0.0.1 quedan retenidas 10, 20 o
// 30 s: son los reintentos de TCP (3 s + 6 s, + 12 s...) de una conexión
// descartada. Pasa también con un cliente de Node sin navegador y con un
// servidor http pelado, así que no es del sitio ni de `serve`; va y viene.
// Chromium lo sobrelleva mejor que WebKit. (Se probó reutilizar el contexto
// entre pruebas, reuseContext, para abrir menos conexiones: en WebKit las
// navegaciones se colgaban 45 s. Se descartó.) Por eso:
// - dos procesos en total y un solo WebKit por proyecto (WebKit en Windows se
//   atasca con más de dos navegadores a la vez),
// - esperas que alcanzan a cubrir un atasco de 30 s. Una prueba sana no las
//   usa: cada expect termina apenas se cumple,
// - hasta dos reintentos para los atascos más largos. Una prueba que pasa al
//   reintentar sale como "flaky" en el reporte, así que no queda escondida.
//   Un bug de verdad falla en los tres intentos.
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: 2,
  timeout: 180_000,
  expect: { timeout: 35_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE,
    navigationTimeout: 60_000,
    actionTimeout: 40_000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    // 320 px: el celular más angosto que todavía circula.
    { name: "iphone-se", use: { ...devices["iPhone SE"] }, workers: 1 },
    { name: "iphone-13", use: { ...devices["iPhone 13"] }, workers: 1 },
    { name: "pixel-7", use: { ...devices["Pixel 7"], launchOptions: { args: WEBGL } } },
    { name: "escritorio", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, launchOptions: { args: WEBGL } } },
  ],
  webServer: {
    command: `npx serve out -l tcp://127.0.0.1:${PUERTO} --no-clipboard`,
    url: BASE,
    // Nunca probar contra un servidor ajeno que ya esté en el puerto.
    reuseExistingServer: false,
    timeout: 60_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
