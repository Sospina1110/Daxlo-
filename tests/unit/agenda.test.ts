import { describe, expect, it } from "vitest";
import { calcom } from "@/content/copy";
import { enlaceDeAgenda, hayAgenda } from "@/lib/agenda";

// El enlace a Cal.com lleva lo que la persona ya escribió, para que no lo
// repita, y la línea con el texto exacto que entiende el OS. Nunca el celular.

const CONF = {
  enlaces: { coaching: "https://cal.com/daxlo/coaching", consultoria: "", no_se: "https://cal.com/daxlo/conversacion?layout=month_view" },
  lineas: { coaching: "Coaching 1 a 1", consultoria: "Consultoría de implementación" },
};
const params = (url: string | null) => Object.fromEntries(new URL(url as string).searchParams);

describe("enlaceDeAgenda", () => {
  it("sin enlaces configurados no hay agenda: el formulario sigue como antes", () => {
    const vacia = { enlaces: { coaching: "", consultoria: "", no_se: "" }, lineas: CONF.lineas };
    expect(enlaceDeAgenda("coaching", "Ana", "ana@correo.com", vacia)).toBeNull();
    expect(hayAgenda(vacia)).toBe(false);
  });

  it("coaching: su evento, con nombre, correo y la línea exacta del OS", () => {
    const url = enlaceDeAgenda("coaching", "Ana María Pérez", "ana+daxlo@correo.com", CONF);
    expect(url?.startsWith("https://cal.com/daxlo/coaching?")).toBe(true);
    expect(params(url)).toEqual({ name: "Ana María Pérez", email: "ana+daxlo@correo.com", linea: "Coaching 1 a 1" });
  });

  it("una línea sin evento propio usa el general y conserva sus parámetros", () => {
    const url = enlaceDeAgenda("consultoria", "Luis", "luis@empresa.co", CONF);
    expect(url?.startsWith("https://cal.com/daxlo/conversacion?")).toBe(true);
    expect(params(url)).toEqual({ layout: "month_view", name: "Luis", email: "luis@empresa.co", linea: "Consultoría de implementación" });
  });

  it("'todavía no sé' no manda línea: la persona la elige en la agenda", () => {
    expect(params(enlaceDeAgenda("no_se", "Eva", "eva@correo.com", CONF))).not.toHaveProperty("linea");
  });

  it("nunca pone el WhatsApp ni otros datos en la URL", () => {
    const url = enlaceDeAgenda("coaching", "Ana", "ana@correo.com", CONF) as string;
    expect(Object.keys(params(url)).sort()).toEqual(["email", "linea", "name"]);
  });

  it("solo acepta enlaces https: ni http ni javascript:", () => {
    for (const malo of ["http://cal.com/daxlo/x", "javascript:alert(1)", "cal.com/daxlo/x"]) {
      const conf = { enlaces: { coaching: malo, consultoria: "", no_se: "" }, lineas: CONF.lineas };
      expect(enlaceDeAgenda("coaching", "Ana", "ana@correo.com", conf), malo).toBeNull();
      expect(hayAgenda(conf), malo).toBe(false);
    }
  });
});

describe("la configuración publicada de Cal.com", () => {
  it("cada enlace está vacío o es una página https de Cal.com", () => {
    for (const [linea, enlace] of Object.entries(calcom.enlaces)) {
      if (enlace) expect(enlace, linea).toMatch(/^https:\/\/(app\.)?cal\.com\/[\w.-]+\/[\w.-]+/);
    }
  });

  it("las líneas llevan los textos exactos que lee el OS (rutas/agenda.py)", () => {
    expect(calcom.lineas).toEqual({ coaching: "Coaching 1 a 1", consultoria: "Consultoría de implementación" });
  });
});
