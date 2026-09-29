import path from "node:path";
import { fileURLToPath } from "node:url";

// Carpetas del proyecto, sin depender de desde dónde se corran las pruebas.
export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const PUBLIC = path.join(RAIZ, "public");
export const OUT = path.join(RAIZ, "out");
