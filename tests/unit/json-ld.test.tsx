import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { JsonLd } from "@/components/ui/json-ld";
import { ldMigas, ldOrganizacion } from "@/lib/sitio";

// Contenido de cada <script type="application/ld+json"> tal como lo leería un
// buscador en el HTML.
function bloques(html: string) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
}

describe("JsonLd", () => {
  it("pinta un solo <script type=application/ld+json> con los datos tal cual", () => {
    const html = renderToStaticMarkup(<JsonLd datos={ldOrganizacion} />);
    const b = bloques(html);
    expect(b).toHaveLength(1);
    expect(JSON.parse(b[0])).toEqual(ldOrganizacion);
  });

  it("con una lista, el script lleva el arreglo completo", () => {
    const datos = [ldOrganizacion, ldMigas("coaching", "Coaching 1 a 1")];
    const b = bloques(renderToStaticMarkup(<JsonLd datos={datos} />));
    expect(b).toHaveLength(1);
    expect(JSON.parse(b[0])).toEqual(datos);
  });

  it("conserva tildes y eñes (el JSON se lee como UTF-8)", () => {
    const b = bloques(renderToStaticMarkup(<JsonLd datos={{ name: "Martín Zárate, ¿qué pasó con la señal?" }} />));
    expect(JSON.parse(b[0]).name).toBe("Martín Zárate, ¿qué pasó con la señal?");
  });

  // Antes el reemplazo usaba "\u003c", que en JavaScript ya es "<", y no
  // escapaba nada: un texto con "</script>" cerraba la etiqueta.
  it("un texto con </script> no puede cerrar la etiqueta antes de tiempo", () => {
    const peligroso = { name: "Cierre </script><script>window.__inyectado = true</script>" };
    const html = renderToStaticMarkup(<JsonLd datos={peligroso} />);
    // Solo debe haber un cierre: el propio.
    expect(html.match(/<\/script>/g)).toHaveLength(1);
    expect(JSON.parse(bloques(html)[0])).toEqual(peligroso);
  });
});
