// Un titular de dos frases va en dos renglones, una frase por renglón
// (campo.css, .cm-frase-linea). El texto que leen los lectores de pantalla y
// los buscadores queda idéntico al de copy.ts. Con una sola frase devuelve el
// texto tal cual.
export function enFrases(texto: string): React.ReactNode {
  const frases = texto.split(/(?<=[.?!])\s+/);
  if (frases.length < 2) return texto;
  return frases.map((frase, i) => (
    <span key={frase} className="cm-frase-linea">
      {frase}
      {i < frases.length - 1 ? " " : ""}
    </span>
  ));
}
