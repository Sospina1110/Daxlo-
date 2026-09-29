import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MotionGlobalConfig } from "motion/react";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { nav, rutas } from "@/content/copy";
import { MotionProvider } from "@/components/motion-provider";
import { Nav } from "@/components/sections/nav";

// La ruta actual la decide la prueba: usePathname devuelve lo que diga aquí.
const navegacion = vi.hoisted(() => ({ ruta: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navegacion.ruta }));
vi.mock("next/link", () => import("../apoyo/link-simulado"));

// Las animaciones de entrada y salida del menú terminan al instante.
beforeAll(() => {
  MotionGlobalConfig.skipAnimations = true;
});
afterAll(() => {
  MotionGlobalConfig.skipAnimations = false;
});
beforeEach(() => {
  navegacion.ruta = "/";
});

// Igual que en el sitio: dentro de MotionProvider (LazyMotion estricto, que
// falla si alguien usa <motion.x> en vez de <m.x>).
const conProveedor = () => (
  <MotionProvider>
    <Nav />
  </MotionProvider>
);

function montar(ruta = "/") {
  navegacion.ruta = ruta;
  const utils = render(conProveedor());
  return { ...utils, user: userEvent.setup({ delay: null }) };
}

const barra = () => screen.getByRole("navigation", { name: "Principal" });
const listaEscritorio = () => barra().querySelector("ul") as HTMLUListElement;
const hamburguesa = () => within(barra()).getByRole("button", { name: /menú/ });
const menu = () => document.getElementById("menu-movil");

async function abrir(user: ReturnType<typeof userEvent.setup>) {
  await user.click(hamburguesa());
  await waitFor(() => expect(menu()).not.toBeNull());
  return menu() as HTMLElement;
}

async function esperarCerrado() {
  await waitFor(() => expect(menu()).toBeNull());
  expect(hamburguesa().getAttribute("aria-expanded")).toBe("false");
}

describe("Nav: enlaces", () => {
  it("la barra lleva los cinco enlaces de nav.links, en orden, a sus rutas", () => {
    montar();
    const enlaces = within(listaEscritorio()).getAllByRole("link");
    expect(enlaces.map((a) => [a.textContent, a.getAttribute("href")])).toEqual(nav.links.map((l) => [l.label, l.href]));
  });

  it("el logo vuelve al inicio y tiene nombre accesible", () => {
    montar("/coaching");
    const logo = within(barra()).getByRole("link", { name: "Daxlo, ir al inicio" });
    expect(logo.getAttribute("href")).toBe("/");
    expect(within(logo).getByRole("img").getAttribute("alt")).toBe("Daxlo");
  });

  it("el botón Agendar va a /agendar", () => {
    montar();
    const cta = within(barra()).getByRole("link", { name: nav.cta.label });
    expect(cta.getAttribute("href")).toBe(rutas.agendar);
  });

  it("en el inicio ningún enlace queda marcado como página actual", () => {
    montar("/");
    expect(barra().querySelectorAll("[aria-current]")).toHaveLength(0);
  });

  it.each(nav.links.map((l) => [l.href, l.label]))("en %s solo '%s' queda con aria-current=page", (href, label) => {
    montar(href);
    const actuales = within(listaEscritorio()).getAllByRole("link").filter((a) => a.getAttribute("aria-current") === "page");
    expect(actuales.map((a) => a.textContent)).toEqual([label]);
  });

  it("también marca la página actual con barra final (/coaching/)", () => {
    montar("/coaching/");
    const actual = within(listaEscritorio()).getByRole("link", { current: "page" });
    expect(actual.textContent).toBe("Coaching");
  });

  it("una ruta que solo empieza igual no se marca (/coachingx)", () => {
    montar("/coachingx");
    expect(barra().querySelectorAll("[aria-current]")).toHaveLength(0);
  });
});

describe("Nav: menú de celular", () => {
  it("arranca cerrado y el botón dice qué hace y qué controla", () => {
    montar();
    const b = hamburguesa();
    expect(b.getAttribute("aria-expanded")).toBe("false");
    expect(b.getAttribute("aria-controls")).toBe("menu-movil");
    expect(b.getAttribute("aria-label")).toBe("Abrir menú");
    expect(menu()).toBeNull();
  });

  it("el botón abre el menú con los cinco enlaces y el llamado a agendar, y lo vuelve a cerrar", async () => {
    const { user } = montar("/herramientas");
    const m = await abrir(user);
    const b = hamburguesa();
    expect(b.getAttribute("aria-expanded")).toBe("true");
    expect(b.getAttribute("aria-label")).toBe("Cerrar menú");
    // aria-controls apunta a un elemento que existe mientras está abierto.
    expect(document.getElementById(b.getAttribute("aria-controls") as string)).toBe(m);

    const enlaces = within(m).getAllByRole("link");
    const deRutas = enlaces.slice(0, 5);
    expect(deRutas.map((a) => [a.textContent, a.getAttribute("href")])).toEqual(nav.links.map((l) => [l.label, l.href]));
    const agendar = within(m).getByRole("link", { name: "Agendar una conversación" });
    expect(agendar.getAttribute("href")).toBe(rutas.agendar);

    // La página actual también se marca dentro del menú.
    const actuales = deRutas.filter((a) => a.getAttribute("aria-current") === "page");
    expect(actuales.map((a) => a.textContent)).toEqual(["Herramientas"]);

    await user.click(b);
    await esperarCerrado();
    expect(hamburguesa().getAttribute("aria-label")).toBe("Abrir menú");
  });

  it("Escape cierra el menú", async () => {
    const { user } = montar();
    await abrir(user);
    await user.keyboard("{Escape}");
    await esperarCerrado();
  });

  it("otras teclas no lo cierran", async () => {
    const { user } = montar();
    await abrir(user);
    // Sin Enter ni Espacio: el foco está en el botón y esas sí lo activan.
    await user.keyboard("a{ArrowDown}{Tab}{Shift}");
    expect(menu()).not.toBeNull();
    expect(hamburguesa().getAttribute("aria-expanded")).toBe("true");
  });

  it("Escape con el menú cerrado no hace nada raro", async () => {
    const { user } = montar();
    await user.keyboard("{Escape}");
    expect(menu()).toBeNull();
    expect(hamburguesa().getAttribute("aria-expanded")).toBe("false");
  });

  it("se cierra al cambiar de ruta (también con atrás y adelante)", async () => {
    const { user, rerender } = montar("/coaching");
    await abrir(user);
    navegacion.ruta = "/consultoria";
    rerender(conProveedor());
    await esperarCerrado();
    const actual = within(listaEscritorio()).getByRole("link", { current: "page" });
    expect(actual.textContent).toBe("Consultoría");
  });

  it.each(nav.links.map((l) => l.label))("tocar '%s' en el menú lo cierra", async (label) => {
    const { user } = montar();
    const m = await abrir(user);
    await user.click(within(m).getByRole("link", { name: label }));
    await esperarCerrado();
  });

  it("tocar 'Agendar una conversación' en el menú también lo cierra", async () => {
    const { user } = montar();
    const m = await abrir(user);
    await user.click(within(m).getByRole("link", { name: "Agendar una conversación" }));
    await esperarCerrado();
  });
});

describe("Nav: fondo y bloqueo de la página con el menú abierto", () => {
  // El fondo oscuro no tiene rol ni texto (es decorativo, aria-hidden): es el
  // hermano que va justo antes del panel dentro del <header>.
  const fondo = () => menu()?.previousElementSibling as HTMLElement | null;

  it("con el menú abierto hay un fondo decorativo que cubre la pantalla", async () => {
    const { user } = montar();
    await abrir(user);
    const f = fondo();
    expect(f).not.toBeNull();
    expect(f?.getAttribute("aria-hidden")).toBe("true");
    expect(f?.className).toMatch(/\bfixed\b/);
    expect(f?.className).toMatch(/\binset-0\b/);
  });

  it("tocar el fondo cierra el menú", async () => {
    const { user } = montar();
    await abrir(user);
    await user.click(fondo() as HTMLElement);
    await esperarCerrado();
  });

  it("tocar dentro del panel (fuera de un enlace) no lo cierra", async () => {
    const { user } = montar();
    const m = await abrir(user);
    await user.click(m.querySelector("ul") as HTMLElement);
    expect(menu()).not.toBeNull();
  });

  it("mientras está abierto la página no se desplaza (overflow hidden en <html>) y al cerrar vuelve como estaba", async () => {
    document.documentElement.style.overflow = "";
    const { user } = montar();
    await abrir(user);
    expect(document.documentElement.style.overflow).toBe("hidden");
    await user.keyboard("{Escape}");
    await esperarCerrado();
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("respeta un overflow que la página ya tuviera", async () => {
    document.documentElement.style.overflow = "auto";
    const { user } = montar();
    await abrir(user);
    expect(document.documentElement.style.overflow).toBe("hidden");
    await user.click(hamburguesa());
    await esperarCerrado();
    expect(document.documentElement.style.overflow).toBe("auto");
    document.documentElement.style.overflow = "";
  });

  it("al desmontar con el menú abierto no deja la página bloqueada", async () => {
    document.documentElement.style.overflow = "";
    const { user, unmount } = montar();
    await abrir(user);
    unmount();
    expect(document.documentElement.style.overflow).toBe("");
  });
});
