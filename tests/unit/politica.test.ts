import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { agendar, privacidad } from "@/content/copy";

// La versión de la política viaja con cada envío del formulario y el OS la
// guarda como prueba de qué texto aceptó cada persona (Ley 1581 y Decreto 1377,
// art. 8). Si cambia el texto y no la versión, dos textos distintos quedan con
// la misma prueba. Esta huella lo impide: al cambiar el texto, esta prueba
// falla hasta que se sube privacidad.version y se anota su huella aquí. El
// texto de cada versión anterior queda en git (tag politica-<versión>).
const HUELLAS: Record<string, string> = {
  "2026-10-26-2": "e20fdba3a1b5e2c6",
};

function huella() {
  const c = agendar.campos;
  const texto = JSON.stringify({
    responsable: privacidad.responsable,
    intro: privacidad.intro,
    secciones: privacidad.secciones,
    aviso: c.aviso,
    autorizacion: [c.autorizacion, c.autorizacionEnlace],
    marketing: c.marketing,
  });
  return createHash("sha256").update(texto).digest("hex").slice(0, 16);
}

describe("versión de la política de datos", () => {
  it("el texto vigente corresponde a su versión (si cambias el texto, sube la versión)", () => {
    expect(HUELLAS[privacidad.version], `huella de ${privacidad.version}`).toBe(huella());
  });

  it("la versión es corta y sin espacios: el OS la guarda recortada a 20 caracteres", () => {
    expect(privacidad.version).toMatch(/^\d{4}-\d{2}-\d{2}(-\d+)?$/);
    expect(privacidad.version.length).toBeLessThanOrEqual(20);
  });
});
