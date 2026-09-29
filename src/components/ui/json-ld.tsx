// Datos estructurados para buscadores (schema.org en JSON-LD). El reemplazo de
// "<" evita que un texto con "</script>" cierre la etiqueta antes de tiempo.
export function JsonLd({ datos }: { datos: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, "\u003c") }} />;
}
