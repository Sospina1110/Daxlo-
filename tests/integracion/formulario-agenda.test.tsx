import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { agendar } from "@/content/copy";
import { FormularioContacto } from "@/components/sections/formulario";
import { irA } from "@/lib/agenda";

vi.mock("next/link", () => import("../apoyo/link-simulado"));

// Con la agenda de Cal.com configurada: al enviar el formulario la persona pasa
// sola a elegir la hora, con nombre, correo y línea ya escritos. La URL real se
// pone en copy.ts (calcom.enlaces); aquí se prueba con una de ejemplo.
vi.mock("@/lib/agenda", async (original) => {
  const real = await original<typeof import("@/lib/agenda")>();
  const conf = {
    enlaces: { coaching: "https://cal.com/daxlo/coaching", consultoria: "https://cal.com/daxlo/consultoria", no_se: "https://cal.com/daxlo/conversacion" },
    lineas: { coaching: "Coaching 1 a 1", consultoria: "Consultoría de implementación" },
  };
  return {
    enlaceDeAgenda: (linea: string, nombre: string, correo: string) => real.enlaceDeAgenda(linea, nombre, correo, conf),
    hayAgenda: () => true,
    irA: vi.fn(),
  };
});

const c = agendar.campos;
const responde = (cuerpo: unknown) => Promise.resolve({ json: () => Promise.resolve(cuerpo) } as unknown as Response);
let fetchSimulado: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.mocked(irA).mockClear();
  fetchSimulado = vi.fn(() => responde({ status: "ok" }));
  vi.stubGlobal("fetch", fetchSimulado);
});

async function llenarYEnviar(linea = "consultoria") {
  render(<FormularioContacto />);
  const user = userEvent.setup({ delay: null });
  await user.selectOptions(screen.getByLabelText(c.linea, { exact: false }), linea);
  await user.type(screen.getByLabelText(c.nombre, { exact: false }), "Martina Gómez");
  await user.type(screen.getByLabelText(new RegExp(`^${c.whatsapp}`)), "+57 300 123 4567");
  await user.type(screen.getByLabelText(new RegExp(`^${c.correo}`)), "martina@ferreteria.co");
  await user.click(screen.getByRole("checkbox", { name: new RegExp(c.autorizacion.slice(0, 20)) }));
  await user.click(screen.getByRole("button", { name: new RegExp(`^${agendar.enviar}`) }));
}

const boton = () => screen.getByRole("link", { name: new RegExp(agendar.exito.agenda.boton) }) as HTMLAnchorElement;

describe("formulario con agenda de Cal.com", () => {
  it("antes de enviar, avisa que al enviar se elige el día y la hora", () => {
    render(<FormularioContacto />);
    expect(screen.getByText(agendar.metaAgenda)).toBeTruthy();
  });

  it("enviado: muestra el paso a la agenda con un botón de respaldo hacia el evento de su línea", async () => {
    await llenarYEnviar("consultoria");
    expect(await screen.findByText(agendar.exito.agenda.titulo)).toBeTruthy();
    const url = new URL(boton().href);
    expect(url.origin + url.pathname).toBe("https://cal.com/daxlo/consultoria");
    expect(Object.fromEntries(url.searchParams)).toEqual({ name: "Martina Gómez", email: "martina@ferreteria.co", linea: "Consultoría de implementación" });
    // Ni el WhatsApp ni el mensaje de "te escribimos" de siempre.
    expect(boton().href).not.toContain("300");
    expect(screen.queryByText(agendar.exito.texto)).toBeNull();
  });

  it("pasa sola a la agenda un momento después, a la misma dirección del botón", async () => {
    await llenarYEnviar("coaching");
    await screen.findByText(agendar.exito.agenda.titulo);
    expect(irA).not.toHaveBeenCalled();
    await waitFor(() => expect(irA).toHaveBeenCalledTimes(1), { timeout: 3000 });
    expect(irA).toHaveBeenCalledWith(boton().href);
  });

  it("si ya estaba en la hoja (envío repetido), también pasa a la agenda", async () => {
    fetchSimulado.mockImplementation(() => responde({ status: "error", codigo: "envio_duplicado" }));
    await llenarYEnviar();
    expect(await screen.findByText(agendar.exito.agenda.titulo)).toBeTruthy();
    await waitFor(() => expect(irA).toHaveBeenCalledTimes(1), { timeout: 3000 });
  });

  it("si el envío falla, no lleva a ningún lado: la persona no agenda sin quedar registrada", async () => {
    fetchSimulado.mockImplementation(() => Promise.reject(new Error("sin red")));
    await llenarYEnviar();
    expect(await screen.findByText(agendar.errores.general)).toBeTruthy();
    await new Promise((r) => setTimeout(r, 1800));
    expect(irA).not.toHaveBeenCalled();
  });
});
