import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { agendar, contacto } from "@/content/copy";
import { FormularioContacto } from "@/components/sections/formulario";

vi.mock("next/link", () => import("../apoyo/link-simulado"));

// El Apps Script guarda cada lead en una hoja leyendo estos nombres exactos.
// Si uno cambia, el lead deja de guardarse sin que nadie se entere.
const CONTRATO = ["linea", "nombre", "whatsapp", "correo", "empresa", "interes", "website", "tiempo_llenado_segundos", "origen"];
const APPS_SCRIPT = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/;
const c = agendar.campos;

// Respuesta mínima: el formulario solo llama a res.json().
const responde = (cuerpo: unknown) => Promise.resolve({ json: () => Promise.resolve(cuerpo) } as unknown as Response);

let fetchSimulado: ReturnType<typeof vi.fn>;

beforeEach(() => {
  // Solo Date es falso: sirve para fijar tiempo_llenado_segundos sin tocar los
  // setTimeout que usa user-event.
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-29T15:00:00Z"));
  fetchSimulado = vi.fn(() => responde({ status: "ok" }));
  vi.stubGlobal("fetch", fetchSimulado);
});

afterEach(() => {
  vi.useRealTimers();
});

function montar() {
  const utils = render(<FormularioContacto />);
  const form = utils.container.querySelector("form") as HTMLFormElement;
  // delay: null escribe sin pausas entre teclas (con pausas, cada prueba tarda segundos).
  return { ...utils, form, user: userEvent.setup({ delay: null }) };
}

const campo = {
  linea: () => screen.getByLabelText(c.linea, { exact: false }) as HTMLSelectElement,
  nombre: () => screen.getByLabelText(c.nombre, { exact: false }) as HTMLInputElement,
  whatsapp: () => screen.getByLabelText(c.whatsapp, { exact: false }) as HTMLInputElement,
  correo: () => screen.getByLabelText(c.correo, { exact: false }) as HTMLInputElement,
  empresa: () => screen.getByLabelText(c.empresa, { exact: false }) as HTMLInputElement,
  interes: () => screen.getByLabelText(c.interes, { exact: false }) as HTMLTextAreaElement,
  enviar: () => screen.getByRole("button", { name: new RegExp(`^(${agendar.enviar}|${agendar.enviando})`) }) as HTMLButtonElement,
};

async function llenarTodo(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(campo.linea(), "consultoria");
  await user.type(campo.nombre(), "  Martina Gómez  ");
  await user.type(campo.whatsapp(), "+57 300 123 4567");
  await user.type(campo.correo(), "martina@ferreteria.co");
  await user.type(campo.empresa(), "Ferretería El Tornillo");
  await user.type(campo.interes(), "Conciliar facturas de proveedores cada viernes");
}

// Lo que salió en el último fetch, como pares [campo, valor].
function enviado() {
  expect(fetchSimulado).toHaveBeenCalled();
  const [, opciones] = fetchSimulado.mock.calls.at(-1) as [string, RequestInit];
  return [...(opciones.body as FormData).entries()].map(([k, v]) => [k, String(v)]);
}

describe("formulario: respaldo sin JavaScript", () => {
  it("el <form> envía por POST directo al Apps Script", () => {
    const { form } = montar();
    expect(form.getAttribute("method")).toBe("post");
    expect(form.getAttribute("action")).toMatch(APPS_SCRIPT);
  });

  it("cada campo del contrato que escribe la persona tiene su name, en orden", () => {
    const { form } = montar();
    const nombres = [...form.elements].map((e) => (e as HTMLInputElement).name).filter(Boolean);
    expect(nombres).toEqual(["linea", "nombre", "whatsapp", "correo", "empresa", "interes", "website"]);
    const correo = campo.correo();
    expect(correo.name).toBe("correo");
    expect(correo.type).toBe("email");
    expect(campo.whatsapp().type).toBe("tel");
  });

  it("la trampa para bots (website) no se ve, no recibe foco y no se autocompleta", () => {
    const { form } = montar();
    const trampa = form.elements.namedItem("website") as HTMLInputElement;
    expect(trampa.tabIndex).toBe(-1);
    expect(trampa.getAttribute("autocomplete")).toBe("off");
    expect(trampa.closest("[aria-hidden]")).not.toBeNull();
    expect(trampa.value).toBe("");
  });

  it("la validación del navegador está apagada: los mensajes son los del sitio", () => {
    const { form } = montar();
    expect(form.noValidate).toBe(true);
  });
});

describe("formulario: contrato con el Apps Script", () => {
  it("manda por fetch un FormData con exactamente los campos del contrato y lo que escribió la persona", async () => {
    const { user, form } = montar();
    await llenarTodo(user);
    vi.setSystemTime(new Date("2026-09-29T15:00:12Z"));
    await user.click(campo.enviar());

    expect(fetchSimulado).toHaveBeenCalledTimes(1);
    const [url, opciones] = fetchSimulado.mock.calls[0] as [string, RequestInit];
    expect(url).toMatch(APPS_SCRIPT);
    expect(url).toBe(form.getAttribute("action"));
    expect(opciones.method).toBe("POST");
    expect(opciones.body).toBeInstanceOf(FormData);
    // Sin cabeceras propias: la petición queda "simple" y el Apps Script, que no
    // responde a OPTIONS, la acepta.
    expect(opciones.headers).toBeUndefined();

    const pares = enviado();
    expect(pares.map(([k]) => k)).toEqual(CONTRATO);
    expect(Object.fromEntries(pares)).toEqual({
      linea: "consultoria",
      nombre: "Martina Gómez",
      whatsapp: "+57 300 123 4567",
      correo: "martina@ferreteria.co",
      empresa: "Ferretería El Tornillo",
      interes: "Conciliar facturas de proveedores cada viernes",
      website: "",
      tiempo_llenado_segundos: "12",
      origen: window.location.origin,
    });
  });

  it("los opcionales vacíos viajan como cadena vacía, no se omiten", async () => {
    const { user } = montar();
    await user.selectOptions(campo.linea(), "coaching");
    await user.type(campo.nombre(), "Ana");
    await user.type(campo.whatsapp(), "3001234567");
    await user.type(campo.correo(), "ana@correo.com");
    await user.click(campo.enviar());
    const datos = Object.fromEntries(enviado());
    expect(datos).toMatchObject({ linea: "coaching", empresa: "", interes: "", website: "" });
    expect(Object.keys(datos)).toEqual(CONTRATO);
  });

  it("lo que un bot escriba en la trampa se manda tal cual, para que el Apps Script lo descarte", async () => {
    const { user, form } = montar();
    await llenarTodo(user);
    fireEvent.change(form.elements.namedItem("website") as HTMLInputElement, { target: { value: "https://spam.example" } });
    await user.click(campo.enviar());
    expect(Object.fromEntries(enviado()).website).toBe("https://spam.example");
  });

  it("{status: 'ok'} cambia el formulario por el panel de éxito", async () => {
    const { user, container } = montar();
    await llenarTodo(user);
    await user.click(campo.enviar());
    const panel = await screen.findByRole("status");
    expect(within(panel).getByRole("heading", { name: agendar.exito.titulo })).toBeTruthy();
    expect(panel.textContent).toContain(agendar.exito.texto);
    expect(panel.textContent).not.toContain(agendar.exito.duplicado);
    expect(within(panel).getByRole("link", { name: agendar.exito.whatsapp }).getAttribute("href")).toBe(contacto.whatsapp);
    expect(container.querySelector("form")).toBeNull();
  });

  it("{status: 'error', codigo: 'envio_duplicado'} también es éxito, con el texto de duplicado", async () => {
    fetchSimulado.mockImplementation(() => responde({ status: "error", codigo: "envio_duplicado" }));
    const { user, container } = montar();
    await llenarTodo(user);
    await user.click(campo.enviar());
    const panel = await screen.findByRole("heading", { name: agendar.exito.titulo });
    const caja = panel.closest("[role=status]") as HTMLElement;
    expect(caja.textContent).toContain(agendar.exito.duplicado);
    expect(caja.textContent).not.toContain(agendar.exito.texto);
    expect(container.querySelector("form")).toBeNull();
  });

  it.each([
    ["error sin código", { status: "error" }],
    ["error con otro código", { status: "error", codigo: "hoja_llena" }],
    ["objeto vacío", {}],
    ["status en mayúsculas", { status: "OK" }],
    ["null", null],
  ])("respuesta %s: muestra el error general y deja el formulario como estaba", async (_n, cuerpo) => {
    fetchSimulado.mockImplementation(() => responde(cuerpo));
    const { user, container } = montar();
    await llenarTodo(user);
    await user.click(campo.enviar());
    await screen.findByText(agendar.errores.general);
    expect(container.querySelector("form")).not.toBeNull();
    expect(campo.nombre().value).toBe("  Martina Gómez  ");
    expect(campo.enviar().disabled).toBe(false);
    expect(screen.queryByText(agendar.exito.titulo)).toBeNull();
  });

  it("si la respuesta no es JSON, muestra el error general", async () => {
    fetchSimulado.mockImplementation(() => Promise.resolve({ json: () => Promise.reject(new SyntaxError("no es JSON")) } as unknown as Response));
    const { user } = montar();
    await llenarTodo(user);
    await user.click(campo.enviar());
    expect(await screen.findByText(agendar.errores.general)).toBeTruthy();
    expect(screen.queryByText(agendar.exito.titulo)).toBeNull();
  });

  it("si la red falla, muestra el error general y se puede reintentar con éxito", async () => {
    fetchSimulado.mockImplementationOnce(() => Promise.reject(new TypeError("Failed to fetch")));
    const { user } = montar();
    await llenarTodo(user);
    await user.click(campo.enviar());
    expect(await screen.findByText(agendar.errores.general)).toBeTruthy();
    await user.click(campo.enviar());
    expect(await screen.findByText(agendar.exito.titulo)).toBeTruthy();
    expect(fetchSimulado).toHaveBeenCalledTimes(2);
  });

  it("mientras envía, el botón queda deshabilitado, dice 'Enviando…' y no manda dos veces", async () => {
    let soltar!: (r: Response) => void;
    fetchSimulado.mockImplementation(() => new Promise<Response>((r) => (soltar = r)));
    const { user } = montar();
    await llenarTodo(user);
    await user.click(campo.enviar());

    const boton = campo.enviar();
    expect(boton.disabled).toBe(true);
    expect(boton.textContent).toBe(agendar.enviando);
    await user.click(boton);
    expect(fetchSimulado).toHaveBeenCalledTimes(1);

    await act(async () => soltar({ json: () => Promise.resolve({ status: "ok" }) } as unknown as Response));
    expect(await screen.findByText(agendar.exito.titulo)).toBeTruthy();
  });

  it("antes de enviar, el aviso bajo el botón es el texto de ayuda y no un error", () => {
    montar();
    const aviso = screen.getByText(agendar.meta);
    expect(aviso.getAttribute("role")).toBe("status");
    expect(aviso.getAttribute("aria-live")).toBe("polite");
  });
});

describe("formulario: validación en el navegador", () => {
  it("vacío: muestra los cuatro errores, marca los campos y lleva el foco a '¿Qué te interesa?'", async () => {
    const { user } = montar();
    await user.click(campo.enviar());

    expect(fetchSimulado).not.toHaveBeenCalled();
    const pares: [HTMLElement, string, string][] = [
      [campo.linea(), agendar.errores.linea, "error-linea"],
      [campo.nombre(), agendar.errores.nombre, "error-nombre"],
      [campo.whatsapp(), agendar.errores.whatsapp, "error-whatsapp"],
      [campo.correo(), agendar.errores.correo, "error-email"],
    ];
    for (const [el, texto, id] of pares) {
      expect(el.getAttribute("aria-invalid")).toBe("true");
      expect(el.getAttribute("aria-describedby")).toBe(id);
      expect(document.getElementById(id)?.textContent).toBe(texto);
    }
    expect(document.activeElement).toBe(campo.linea());
    // Los opcionales no se marcan.
    expect(campo.empresa().getAttribute("aria-invalid")).toBeNull();
    expect(campo.interes().getAttribute("aria-invalid")).toBeNull();
  });

  it("el foco va al primer campo inválido en el orden del formulario", async () => {
    const { user } = montar();
    await user.selectOptions(campo.linea(), "coaching");
    await user.type(campo.nombre(), "Ana");
    await user.click(campo.enviar());
    expect(document.activeElement).toBe(campo.whatsapp());
    expect(screen.queryByText(agendar.errores.linea)).toBeNull();
    expect(screen.queryByText(agendar.errores.nombre)).toBeNull();

    await user.type(campo.whatsapp(), "3001234567");
    await user.click(campo.enviar());
    expect(document.activeElement).toBe(campo.correo());
    expect(screen.getByText(agendar.errores.correo)).toBeTruthy();
    expect(fetchSimulado).not.toHaveBeenCalled();
  });

  it("solo espacios cuenta como vacío", async () => {
    const { user } = montar();
    await user.selectOptions(campo.linea(), "coaching");
    await user.type(campo.nombre(), "   ");
    await user.type(campo.whatsapp(), "3001234567");
    await user.type(campo.correo(), "ana@correo.com");
    await user.click(campo.enviar());
    expect(screen.getByText(agendar.errores.nombre)).toBeTruthy();
    expect(document.activeElement).toBe(campo.nombre());
    expect(fetchSimulado).not.toHaveBeenCalled();
  });

  it.each(["martina@ferreteria", "martina.ferreteria.co", "martina @ferreteria.co", "@ferreteria.co", "martina@", "martina@@ferreteria.co"])(
    "correo con formato inválido (%s): pide revisarlo y lleva el foco al correo",
    async (correo) => {
      const { user } = montar();
      await user.selectOptions(campo.linea(), "coaching");
      await user.type(campo.nombre(), "Ana");
      await user.type(campo.whatsapp(), "3001234567");
      await user.type(campo.correo(), correo);
      await user.click(campo.enviar());
      expect(screen.getByText(agendar.errores.correoFormato)).toBeTruthy();
      expect(screen.queryByText(agendar.errores.correo)).toBeNull();
      expect(campo.correo().getAttribute("aria-invalid")).toBe("true");
      expect(document.activeElement).toBe(campo.correo());
      expect(fetchSimulado).not.toHaveBeenCalled();
    },
  );

  it.each(["a@b.co", "martina.gomez+daxlo@ferreteria.com.co"])("acepta un correo válido (%s)", async (correo) => {
    const { user } = montar();
    await user.selectOptions(campo.linea(), "no_se");
    await user.type(campo.nombre(), "Ana");
    await user.type(campo.whatsapp(), "3001234567");
    await user.type(campo.correo(), correo);
    await user.click(campo.enviar());
    expect(Object.fromEntries(enviado()).correo).toBe(correo);
  });

  it("al corregir y reenviar, los errores desaparecen y se envía", async () => {
    const { user } = montar();
    await user.click(campo.enviar());
    expect(screen.getByText(agendar.errores.nombre)).toBeTruthy();
    await llenarTodo(user);
    await user.click(campo.enviar());
    for (const t of [agendar.errores.linea, agendar.errores.nombre, agendar.errores.whatsapp, agendar.errores.correo]) {
      expect(screen.queryByText(t)).toBeNull();
    }
    expect(fetchSimulado).toHaveBeenCalledTimes(1);
  });
});

describe("formulario: línea elegida desde otra página (?linea=)", () => {
  it.each(["coaching", "consultoria", "no_se"])("?linea=%s deja esa opción elegida y es la que se envía", async (linea) => {
    window.history.replaceState(null, "", `/agendar?linea=${linea}`);
    const { user } = montar();
    await waitFor(() => expect(campo.linea().value).toBe(linea));
    await user.type(campo.nombre(), "Ana");
    await user.type(campo.whatsapp(), "3001234567");
    await user.type(campo.correo(), "ana@correo.com");
    await user.click(campo.enviar());
    expect(Object.fromEntries(enviado()).linea).toBe(linea);
  });

  it.each(["otra", "COACHING", "coaching%20", "", "no se"])("?linea=%s no es una opción: el campo queda en 'Selecciona una opción'", async (linea) => {
    window.history.replaceState(null, "", `/agendar?linea=${linea}`);
    montar();
    await act(async () => {});
    const select = campo.linea();
    expect(select.value).toBe("");
    // Sigue mostrando el texto de ayuda. (Si se asignara el valor sin validar,
    // el select quedaría sin ninguna opción elegida: una caja en blanco.)
    expect(select.selectedIndex).toBe(0);
    expect(select.selectedOptions[0]?.textContent).toBe("Selecciona una opción");
  });

  it("sin ?linea el campo arranca en 'Selecciona una opción', que no se puede elegir", () => {
    montar();
    const select = campo.linea();
    expect(select.value).toBe("");
    const vacia = select.querySelector('option[value=""]') as HTMLOptionElement;
    expect(vacia.disabled).toBe(true);
    expect([...select.options].map((o) => o.value)).toEqual(["", ...c.lineaOpciones.map((o) => o.valor)]);
  });
});
