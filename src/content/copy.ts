// Todo el texto de la landing vive acá. Para cambiar una frase no hace falta
// tocar ningún componente.
//
// Reglas de voz (docs/03_tono_voz_copy.md y la skill daxlo-contenido):
// tuteo, "nosotros", frases cortas, sin guiones largos, sin cifras sin
// fuente, sin nombres de clientes. Si una frase podría estar en la web de
// cualquier consultora, se reescribe.

export const contacto = {
  whatsapp: "https://wa.me/573203848586",
  correo: "hola@daxlo.co",
  instagram: "https://www.instagram.com/daxlo.co/",
};

// Rutas del sitio. Cada línea de servicio y cada tema tiene su propia página:
// así cada una puede posicionarse sola en buscadores y el visitante va directo
// a lo que le interesa.
export const rutas = {
  inicio: "/",
  coaching: "/coaching",
  consultoria: "/consultoria",
  herramientas: "/herramientas",
  nosotros: "/nosotros",
  preguntas: "/preguntas",
  agendar: "/agendar",
  privacidad: "/privacidad",
} as const;

// Enlace a agendar con la línea ya elegida en el formulario.
export const agendarCon = (linea: "coaching" | "consultoria") => `${rutas.agendar}?linea=${linea}`;

export const nav = {
  links: [
    { label: "Coaching", href: rutas.coaching },
    { label: "Consultoría", href: rutas.consultoria },
    { label: "Herramientas", href: rutas.herramientas },
    { label: "Nosotros", href: rutas.nosotros },
    { label: "Preguntas", href: rutas.preguntas },
  ],
  cta: { label: "Agendar", href: rutas.agendar },
};

// Nombre de cada línea de servicio tal como se busca: lo usan la portada de
// su página (es parte del h1), las migas y los datos estructurados. No es el
// valor que se manda a Cal.com: ese vive en `calcom.lineas` y no cambia.
export const servicios = {
  coaching: "Coaching de IA 1 a 1",
  consultoria: "Consultoría de implementación de IA",
} as const;

// Título y descripción de cada página para buscadores y para cuando se
// comparte el enlace. Todos terminan en " · Daxlo": las páginas internas lo
// reciben de la plantilla del layout y el inicio ya lo trae escrito.
// Largo: título completo hasta 60 caracteres y descripción hasta 155, para
// que Google no los corte (lo vigila tests/unit/copy.test.ts).
export const paginas = {
  inicio: {
    titulo: "Consultoría y coaching de IA en Colombia · Daxlo",
    descripcion:
      "Consultoría de inteligencia artificial y coaching de IA 1 a 1 en Colombia. Cambiamos con tu equipo cómo se trabaja, o te enseñamos a usar IA en lo tuyo.",
  },
  coaching: {
    titulo: "Coaching de IA 1 a 1: clases de ChatGPT y Claude",
    // También es la descripción del servicio en los datos estructurados: por
    // eso es una afirmación y no una pregunta. Desde el 2026-11-04 dice cómo es
    // la clase ("Escribes tú y te corregimos", como la primera pregunta de
    // coaching), que la competencia no dice; "en tu propio trabajo, no solo
    // para correos" lo decía cualquiera y era resto del titular rechazado.
    // Conserva "aprendes a usar ChatGPT y Claude", que es lo que se busca.
    descripcion:
      "Clases de inteligencia artificial 1 a 1 por videollamada: aprendes a usar ChatGPT y Claude en tu trabajo. Escribes tú y te corregimos. Pagas por sesión.",
  },
  consultoria: {
    titulo: "Consultoría de IA para empresas en Colombia",
    // Repetía "elegimos un proceso, lo construimos con IA", la frase que
    // Santiago rechazó el 2026-11-03. Ahora dice el paso que nos distingue
    // (ordenar la información de un proceso) y qué hacemos con él, sin decir
    // qué va "primero" (la portada empieza por encontrar dónde se traba), con
    // margen bajo los 155 caracteres.
    descripcion:
      "Consultoría de inteligencia artificial para empresas en Colombia: ordenamos la información de un proceso y lo cambiamos con tu equipo.",
  },
  herramientas: {
    titulo: "Herramientas de IA: Claude, ChatGPT, n8n",
    descripcion:
      "Claude, ChatGPT, Claude Code, Codex, n8n, Obsidian y Base44. Qué hacemos con cada una en el coaching 1 a 1 y en los proyectos de consultoría.",
  },
  nosotros: {
    titulo: "Quiénes somos: Martín Zárate y Santiago Ospina",
    descripcion:
      "Martín Zárate y Santiago Ospina, socios de Daxlo. Construimos sistemas de IA en tu empresa y no cerramos un proyecto hasta que tu equipo lo sostenga.",
  },
  preguntas: {
    titulo: "Preguntas sobre coaching y consultoría de IA",
    descripcion:
      "Cómo son las clases de IA 1 a 1, por dónde empieza una empresa a implementar la IA, cuánto cuesta una consultoría y qué pasa cuando terminamos.",
  },
  agendar: {
    titulo: "Agendar una conversación sin costo",
    descripcion:
      "Cuéntanos qué te está consumiendo horas. En la primera conversación, sin costo, te decimos si te sirve el coaching, la consultoría o ninguna de las dos.",
  },
  privacidad: {
    titulo: "Política de tratamiento de datos",
    descripcion:
      "Qué datos recoge Daxlo en su sitio, para qué los usa, dónde los guarda y cómo puedes consultarlos, corregirlos o pedir que los borremos (Ley 1581 de 2012).",
  },
};

// Posicionamiento (Santiago, 2026-11-03): Daxlo es el aliado de IA de la
// empresa, no un proveedor más. La IA queda dentro de cómo trabaja la empresa
// y no hay que contratar a alguien nuevo cada vez que la tecnología cambia.
// "Ir al ritmo" sí; "quedarse atrás" no (lista de miedo de voz-daxlo.md).
export const hero = {
  aliado: "Tu aliado de IA",
  titulo: ["Implementamos la IA.", "Transferimos la capacidad."],
  sub: "Te enseñamos a resolver tu propio trabajo con IA, o construimos el sistema que lo resuelve dentro de tu empresa. Seguimos contigo al ritmo de la IA, sin que contrates un proveedor nuevo cada vez.",
  cta: "Agendar una conversación",
  meta: "Primera conversación sin costo",
  // Lo primero que escribe el recuadro del hero es una búsqueda: se tacha con
  // la raya del "Hoy" de /consultoria y da paso a las tareas (2026-11-06, I4
  // de landing-hilo-conductor). Así el titular de abajo ("Usas la IA como un
  // buscador. El trabajo sigue a mano.") nombra lo que se acaba de ver. Con
  // "reducir movimiento" no aparece: queda la primera tarea, quieta.
  busqueda: "¿Cómo se registra una factura electrónica?",
  // Después de la búsqueda, el recuadro escribe estas tareas solo, una tras
  // otra (y vuelve a la búsqueda).
  tareas: [
    "Lee las facturas que llegaron hoy y pásalas a la hoja de costos",
    "Arma el borrador de la cotización con los datos de este correo",
    "Resume las reuniones de la semana y dime qué quedó pendiente",
    "Revisa la base de clientes y marca los que están duplicados",
  ],
  historial: [
    "Informe del viernes",
    "Cotización pendiente",
    "Facturas de proveedores",
    "Notas de la reunión",
    "Base de clientes",
  ],
};

// El inicio, debajo del hero, solo reparte: el dolor en una línea (titular) y
// dos puertas según quién hace el trabajo. Lo que cuenta cada línea vive en su
// página; aquí no se repite.
// La regla de cada puerta ("Lo haces tú solo" / "Lo hacen varias personas de
// tu equipo") es la misma con la que se decide en /preguntas#elegir y en el
// "No es para… si" de cada línea: si se cambia una, se cambian todas, para que
// nadie entre por la puerta equivocada (lo vigila copy.test.ts).
// Las cabeceras de sección no llevan etiqueta encima (DESIGN.md): la búsqueda
// la llevan dosFormas.sub ("coaching o consultoría de inteligencia
// artificial", el primer párrafo bajo el hero) y los títulos de las puertas.
// Las puertas no llevan píldora de audiencia: la dicen el pictograma y la regla.
// Desde el 2026-11-03 (Santiago): ni el titular ni las puertas nombran
// herramientas. "Clases… con ChatGPT y Claude" y "Elegimos un proceso, lo
// construimos con IA" no decían nada. El titular es el punto de partida más
// común (la IA usada como buscador) y cada puerta cuenta cómo trabajamos, en
// el mismo orden que su página: coaching, resuelves tú y sales sabiendo
// repetirlo; consultoría, ver dónde se traba el trabajo y qué te cuesta,
// ordenar, cambiarlo con el equipo cada semana y, cuando el equipo ya lo
// opera, seguir con el siguiente (2026-11-06: "Después te traemos el siguiente
// paso" no decía de qué; ahora usa las palabras de la portada de /consultoria).
// "Construir" sin objeto no dice qué cambia: se dice "lo cambiamos", como en
// otraLinea. Frecuencia ("cada semana") pendiente de Santiago.
export const dosFormas = {
  titulo: "Usas la IA como un buscador. El trabajo sigue a mano.",
  sub: "Eso lo cambias de dos formas: coaching o consultoría de inteligencia artificial, según quién hace el trabajo.",
  coaching: {
    regla: "Lo haces tú solo",
    titulo: servicios.coaching,
    linea: "Resuelves en la sesión el trabajo que hoy te quita horas. Escribes tú, te corregimos en el momento y sales sabiendo repetirlo.",
    enlace: "Ver el coaching",
  },
  consultoria: {
    regla: "Lo hacen varias personas de tu equipo",
    titulo: servicios.consultoria,
    linea: "Vemos dónde se traba el trabajo y qué te está costando. Ordenamos la información y trabajamos cada semana con tu equipo hasta cambiar ese proceso. Cuando tu equipo ya lo opera, seguimos con el siguiente.",
    enlace: "Ver la consultoría",
  },
};

// ---------------------------------------------------------------- COACHING

// La página contesta en orden las preguntas de quien lee: qué es y qué pasa si
// toco el botón (portada), ¿me pasa a mí? (escenas), ¿cómo es una clase y qué
// me llevo? (la sesión) y ¿es para mí? (dos columnas). Lo largo (sesiones,
// pago, herramientas) va en las preguntas, cerradas en el HTML.
export const coaching = {
  portada: {
    eyebrow: servicios.coaching,
    gigante: ["Para", "ti."],
    // La primera frase es la de referencia de voz-daxlo.md, literal. La
    // segunda lleva "inteligencia artificial" una vez (SEO; copy.test.ts). La
    // tercera, desde el 2026-11-03 (Santiago), dice lo que cambia para la
    // persona: se empieza por un trabajo y se van sumando, sin cifras ni la
    // promesa absoluta de "no vuelves a hacerlo a mano". Tres frases cortas:
    // con dos comas y una "y" era una sola (regla 2 de voz-daxlo.md).
    sub: "Traes un trabajo tuyo que hoy te toma horas y lo dejas funcionando antes de colgar. Lo resuelves tú, con inteligencia artificial. Sesión a sesión sumas trabajos que ya no haces a mano.",
    accion: { enlace: "Ver cómo es una sesión", ancla: "como-funciona" },
    // Bajo el botón: duración, costo, formato y forma de pago, en una línea.
    // Sin medios de pago: se hablan en la llamada y en la propuesta, no en la
    // web (Santiago, 2026-11-03).
    nota: ["Llamada de 15 minutos sin costo", "Por videollamada", "Pagas por sesión, sin mensualidad"],
  },
  // Desde el 2026-11-06 (Santiago, C1 y C2 de landing-hilo-conductor) el
  // titular anuncia que lo de abajo son razones y sigue el hilo de la portada:
  // "ese trabajo" es "un trabajo tuyo que hoy te toma horas". "Con la misma
  // IA, hay quien ya entrega antes que tú" hablaba de otra persona y no se
  // entendía qué tenían que ver las escenas; además suponía que ya usas IA.
  // Las tres escenas son causas (la del lunes era la consecuencia), y los
  // pasos de la sesión las contestan con sus mismas palabras: tu archivo
  // (paso 2), qué pediste mal (paso 2) y empezar de cero (paso 3). Ninguna es
  // de contabilidad ni repite el informe de la maqueta: quien no lleva
  // facturas también tiene que verse ahí. Sin bajada: el titular la hace.
  problema: {
    titulo: "Por qué ese trabajo te sigue tomando horas.",
    escenas: [
      "El tutorial usa un ejemplo limpio y tu archivo no se parece en nada.",
      "La respuesta sale regular y nadie te dice qué pediste mal.",
      "Un lunes la presentación te sale bien. Al siguiente, empiezas de cero.",
    ],
  },
  // El título conserva la búsqueda ("clases de IA 1 a 1") y dice el método que
  // nos distingue (2026-11-03): "sobre tu propio trabajo" era descripción, no
  // método. Lo remata `remate` ("Si nadie toca el teclado de tu lado…").
  sesion: {
    titulo: "Clases de IA 1 a 1 en las que escribes tú.",
    // Maqueta ilustrativa del método, rotulada como ejemplo. No es una
    // conversación real de un cliente. El caso es el del ejemplo del
    // formulario de /agendar (un informe con datos de tres hojas de cálculo):
    // le sirve a quien hace informes de ventas, de campaña o de operación.
    ventana: {
      etiqueta: "Ejemplo",
      titulo: "Tu informe de cada semana",
      mensajes: [
        { de: "daxlo", texto: "Escribe tú la instrucción. Te digo dónde se traba." },
        { de: "tu", texto: "Junta estas tres hojas de cálculo y arma el informe de la semana." },
        { de: "daxlo", texto: "Bien. Ahora dile qué hacer cuando una hoja trae las columnas en otro orden." },
      ],
      avatar: "Tú",
      placeholder: "Tu siguiente instrucción…",
      // Al final de la conversación llega lo que te llevas para repetirlo
      // (paso 3: "El lunes siguiente no empiezas de cero"). Así la maqueta
      // muestra las tres respuestas en orden: tu archivo, la corrección y las
      // instrucciones guardadas (2026-11-06).
      ficha: "Instrucciones guardadas para el próximo lunes",
    },
    // Es el método de la consultoría llevado a una persona (2026-11-03):
    // elegir por dónde empezar, trabajar sobre lo real entendiendo el porqué y
    // salir con algo que se repite. Los pasos contestan las escenas con sus
    // palabras: el tutorial con ejemplo limpio (tu archivo real), nadie te
    // dice qué pediste mal (qué pediste mal y por qué) y empezar de cero cada
    // lunes (el lunes siguiente no empiezas de cero). El límite del
    // primero es regla de voz. Sin nombres de herramientas: no son la
    // propuesta de valor (Santiago, 2026-11-03; lo vigila copy.test.ts).
    // Siguen en el título de la página, en la maqueta, en las preguntas y en
    // /herramientas. Sin "por videollamada", que ya va en la nota de la portada.
    pasos: [
      { numero: "1", texto: "En la llamada vemos tu nivel y elegimos con qué trabajo empezar. Si la IA no te sirve, te lo decimos ahí mismo." },
      { numero: "2", texto: "Trabajas sobre tu archivo real y te decimos en el momento qué pediste mal y por qué." },
      { numero: "3", texto: "Sales con el trabajo hecho y las instrucciones para repetirlo. El lunes siguiente no empiezas de cero." },
    ],
    remate: "Si nadie toca el teclado de tu lado, la sesión no sirve.",
  },
  // Cuenta quién hace el trabajo, no de dónde llegan los documentos: un
  // contador que recibe facturas de sus clientes trabaja solo. La última
  // línea de "No es para ti si" termina en el enlace a la consultoría
  // (otraLinea.consultoria.enlace) y dice para qué es la consultoría (cambiarlo
  // para todos): quien hace el mismo informe que sus compañeros y quiere
  // aprender a hacerlo él sigue siendo coaching.
  // Desde el 2026-11-03: "Es para ti si" repite el titular del inicio (el
  // trabajo sigue a mano) y deja entrar a todos los niveles, como "¿Cuántas
  // sesiones necesito?": desde no haber usado nunca la IA. "No es para ti si"
  // no repite al revés lo de la otra columna ("Quieres aprender a hacerlo tú"
  // ya dice que no lo hacemos por ti): filtra a quien busca un curso grabado y
  // a quien no va a practicar. Sin "la herramienta": aquí no se nombra ninguna.
  paraTi: {
    titulo: "¿Esto es para ti?",
    es: {
      titulo: "Es para ti si",
      items: ["El trabajo es tuyo y se repite.", "Nunca usaste IA, o la usas y sigues trabajando a mano.", "Quieres aprender a hacerlo tú."],
    },
    noEs: {
      titulo: "No es para ti si",
      items: ["Buscas un curso grabado.", "No vas a practicar entre sesiones.", "Lo hacen varias personas de tu equipo y buscas cambiarlo para todos."],
    },
    // Quién está detrás: "en Colombia", sin ciudad (Santiago, 2026-11-03).
    socios: {
      texto: "Martín Zárate y Santiago Ospina, en Colombia. En todo lo que sale de Daxlo estamos los dos.",
    },
  },
};

// ------------------------------------------------------------ HERRAMIENTAS

// Desde el 2026-11-06 (H1 a H3 de landing-hilo-conductor): el sub dice por qué
// estas ("Así" se apoyaba en una razón que no se decía), el título de la lista
// dice lo que de verdad dicen las fichas (para qué sirve cada herramienta; la
// pregunta del coaching ya enlaza aquí con esas palabras) y la página termina
// con las dos tarjetas de otraLinea, como /nosotros: era la única sin camino a
// las dos líneas.
export const herramientas = {
  badge: "Herramientas",
  titulo: "Te enseñamos las que ya existen.",
  sub: "Como no son nuestras, lo que aprendes o construimos contigo sigue funcionando sin nosotros.",
  subtituloLista: "Para qué sirve cada una",
  lista: [
    { id: "claude", nombre: "Claude", uso: "Leer documentos largos, redactar y pensar con tus propios datos." },
    { id: "chatgpt", nombre: "ChatGPT", uso: "El asistente que ya tienes abierto, con instrucciones que puedes reusar." },
    { id: "claudecode", nombre: "Claude Code", uso: "Construir herramientas y automatizaciones pidiéndolas en español." },
    { id: "codex", nombre: "Codex", uso: "El agente de OpenAI que escribe y revisa código contigo." },
    { id: "n8n", nombre: "n8n", uso: "Conectar tus aplicaciones para que los datos se muevan solos." },
    { id: "obsidian", nombre: "Obsidian", uso: "Tus notas conectadas, en archivos tuyos que la IA puede leer." },
    { id: "base44", nombre: "Base44", uso: "Crear una aplicación web describiéndola con palabras." },
  ],
  otra: { titulo: "¿Usas otra?", texto: "Si sirve para tu caso, también la trabajamos." },
  aviso: "Claude y Claude Code son marcas de Anthropic; ChatGPT y Codex, de OpenAI; n8n, Obsidian y Base44, de sus respectivos dueños. Daxlo no está afiliada, patrocinada ni avalada por ninguna de estas empresas: las nombramos para indicar con qué herramientas trabajamos.",
} as const;

// ------------------------------------------------------------- CONSULTORÍA

// La página contesta en orden: qué es y qué pasa si toco el botón (portada),
// ¿me pasa a mí? (escenas), ¿qué cambia en mi empresa? (hoy → después), ¿cómo
// lo hacen? (recorrido) y ¿es para mi empresa y con quién hablo? (para quién).
// Lo largo (cómo elegimos el primer proceso, precio, plazos) va en las
// preguntas, cerradas en el HTML.
// Desde el 2026-11-03 (Santiago: "elegimos un proceso, lo construimos con IA"
// no decía nada) la página cuenta cómo trabajamos: vemos qué le cuesta a la
// empresa lo que se demora, elegimos por dónde empezar, ordenamos la
// información antes de automatizar, construimos con el equipo cada semana para
// que entienda lo que se hace y, cuando tu equipo lo opera, seguimos con el
// siguiente proceso. El hilo se lee de punta a punta: no ves dónde se traba el
// trabajo, la información está regada y la herramienta que llegó nadie la
// entendió (escenas) → las reglas quedan escritas, la IA deja el borrador y tu
// equipo ajusta lo que construimos (hoy → después) → los cuatro pasos del
// método, desde la primera conversación (la del botón) → ¿quién lo va a operar
// sin nosotros al lado?
// Cada promesa se dice una vez en el cuerpo: "tu equipo lo opera" va en la
// portada, en el paso 04 y en la pregunta que filtra, y en ningún otro lado.
// Aliado (hero, Santiago 2026-11-03): cada proceso queda en manos de tu
// equipo, sin depender de nosotros, y Daxlo sigue contigo con el siguiente.
// Lo que se deja es el proceso, no la empresa: por eso ya no dice "salimos".
// Ningún nombre de herramienta en la portada, los títulos, las escenas, las
// filas ni los pasos: no son la propuesta de valor (lo vigila copy.test.ts).
// Las escenas son de cualquier empresa mediana. Los tableros y la información
// en un solo lugar solo van como ejemplos, en "¿Qué hace una consultoría de
// inteligencia artificial?", nunca como resultado prometido.
export const consultoria = {
  portada: {
    eyebrow: servicios.consultoria,
    gigante: ["Para tu", "empresa."],
    // El método en tres frases, con dos procesos de ejemplo (los de la
    // pregunta "¿Por dónde empieza…?") para que se entienda en diez segundos.
    // No repite la puerta del inicio: aquí van los ejemplos y hasta dónde
    // llega el acompañamiento (que tu equipo sepa hacerlo). "Cada semana":
    // frecuencia pendiente de Santiago. La última frase es la que aprobó
    // Santiago el 2026-11-03 (lo vigila copy.test.ts).
    sub: "Encontramos dónde se traba el trabajo, como las cotizaciones o las facturas. Ordenamos su información y cada semana tu gente aprende a hacerlo con inteligencia artificial. Tu equipo lo opera y seguimos contigo con el siguiente proceso.",
    accion: { enlace: "Ver cómo trabajamos", ancla: "como-trabajamos" },
    // Bajo el botón, datos en tramos, como en coaching. El límite completo
    // ("Si no te servimos, te lo decimos") va una sola vez, en el cierre; arriba
    // lo dice el paso 01 ("Un sí o un no, con la razón"). El diagnóstico no se
    // cobra (Santiago, 2026-11-03): se dice aquí, en el paso 02 y en "¿Cuánto
    // cuesta una consultoría de IA?".
    nota: ["Conversación y diagnóstico sin costo", "Precio cerrado antes de construir"],
  },
  // Tres escenas de organización, sin cifras y sin decir miedo. Son escenas
  // para quien lee, no casos de clientes: dolores de cualquier empresa
  // mediana, uno por cada movimiento del método.
  // No sabes en qué parte se demora → paso 01 (nos cuentas qué se demora y
  // buscamos lo que hay detrás); la información regada → primera fila de
  // "hoy → después" y paso 03 (ordenamos); la herramienta que nadie entendió →
  // paso 03 (cada semana con tu gente, para que entienda cómo funciona) y la
  // última fila.
  // La segunda, desde el 2026-11-04, es el cierre de mes: varias personas
  // encerradas juntando hojas de cálculo. "Los indicadores, en la cabeza de
  // unos pocos" era la imagen de otras consultoras y repetía la primera fila
  // de "Lo que cambia". Dice "varias personas" a propósito: "Todo depende de
  // una sola persona" chocaba con "si lo hace una sola persona, no es para tu
  // empresa" (dos lectores se confundieron). El cierre de mes es un proceso
  // genérico de la lista de "¿Por dónde empieza…?", no de un cliente.
  // El titular queda literal (lo vigila tests/integracion/en-lineas.test.tsx).
  // La primera dice "se traba", el verbo de la portada (2026-11-06): antes
  // decía "se atasca" y eran dos palabras para lo mismo.
  problema: {
    titulo: "Tu gente ya usa IA. Tu empresa trabaja igual.",
    escenas: [
      { titulo: "No ves dónde se traba el trabajo", texto: "Algo se demora y no sabes en qué parte." },
      { titulo: "La información está regada", texto: "Cada área con sus hojas de cálculo. Cerrar el mes es juntarlas a mano." },
      { titulo: "La herramienta llegó y nadie la usa", texto: "Te la entregaron con capacitación, pero nadie adentro entendió cómo funciona." },
    ],
  },
  // Qué cambia en la empresa, en filas hoy → después, en el orden del método:
  // ordenar (las reglas salen de la cabeza de alguien, quedan escritas y la IA
  // las usa; es un cambio en cómo trabaja el equipo, no una función de la
  // herramienta), automatizar (la cotización: la IA deja el borrador y una
  // persona lo aprueba, como dice "¿El sistema toma decisiones solo?") y
  // acompañar (cuando algo cambia, alguien de tu equipo sabe ajustarlo: la
  // respuesta a la escena de la herramienta que nadie entendió).
  // Desde el 2026-11-04 el "hoy" de la última fila nombra la herida concreta
  // (esperar al proveedor que no responde) en vez de "nadie sabe ajustarlo".
  // Dice sin eslogan lo de no depender de nadie de afuera, y el "después" la
  // contesta igual. Mismo largo (36 caracteres).
  // Cada "hoy" cabe en una línea desde 1024 px (tachado). La sección
  // conserva el ancla #que-automatizamos (redirección #automatizamos, enlaces
  // viejos y pruebas); el pie la enlaza como "Qué cambia en tu empresa".
  cambios: {
    titulo: "Lo que cambia en tu empresa.",
    hoy: "Hoy",
    despues: "Después",
    filas: [
      { hoy: "Las reglas viven en la cabeza de alguien", despues: "Las reglas quedan escritas y la IA las usa" },
      { hoy: "Alguien arma cada cotización a mano", despues: "La IA deja el borrador y tu equipo lo aprueba" },
      { hoy: "Si algo cambia, esperas al proveedor", despues: "Alguien de tu equipo lo ajusta" },
    ],
  },
  // El método, paso por paso, cada uno con lo que te llevas (2026-11-03). Ya
  // no es el "conversación, diagnóstico, construcción, entrega" que dice toda
  // la competencia: cada título es un movimiento de cómo trabajamos, dicho
  // como lo diría quien dirige la empresa ("qué te está costando", no "el
  // dolor"). El h2 lleva la búsqueda ("implementar IA en la empresa"). El
  // diagnóstico es sin costo (Santiago, 2026-11-03) y el paso 02 empieza así
  // (copy.test.ts). Cómo identificamos el problema va en una cláusula del paso
  // 02 (cruzar lo que se dice con los documentos); el detalle, en "¿Cómo
  // identifican qué proceso cambiar primero?". El paso 02 dice "su precio
  // cerrado", sin "fase": las fases solo se explican en las preguntas y como
  // oferta estándar están pendientes de Santiago. El paso 03 nombra qué se
  // ordena (hojas de cálculo y documentos), no repite el título. "Cada semana"
  // (paso 03): frecuencia pendiente de Santiago. Desde el 2026-11-04 el paso
  // 03 dice por qué construimos con tu gente aunque tome más: solos sería más
  // fácil, pero nadie adentro entendería cómo funciona. Nadie en la
  // competencia admite ese costo, y cierra con las palabras de la escena 3
  // ("nadie adentro entendió cómo funciona").
  // Desde el 2026-11-06 (K1 a K3 de landing-hilo-conductor, Santiago): el 01
  // dice que es la primera conversación (la del botón: "Conversación y
  // diagnóstico sin costo"), así el sí o el no tiene a qué contestar. El 04 ya
  // no se llama "Te traemos el siguiente paso" (un paso llamado "siguiente
  // paso" dentro de una lista de pasos): su título es lo que promete la
  // portada, "Tu equipo lo opera", y el siguiente proceso va en lo que te
  // llevas, con las palabras de la portada y de "¿Qué pasa cuando ustedes se
  // van?" (tú decides si seguimos). "El siguiente" y no "el siguiente
  // proceso": con la palabra de más la página pasaba el tope de 560 palabras
  // (561); "El proceso" ya está en la misma frase. El texto del 04 dice lo
  // otro que traemos (una herramienta nueva que te sirva), pendiente de
  // Santiago como oferta estándar. La animación lee estos mismos textos.
  recorrido: {
    titulo: "Así implementamos la IA en tu empresa.",
    pasos: [
      { numero: "01", titulo: "Vemos qué te está costando", texto: "En la primera conversación nos cuentas qué se demora y buscamos lo que hay detrás: un cliente que espera, un error que se repite.", rotulo: "Te llevas", llevas: "Un sí o un no, con la razón." },
      { numero: "02", titulo: "Elegimos por dónde empezar", texto: "Sin costo. Una semana de diagnóstico: hablamos con quien dirige y con quien hace el trabajo, y lo cruzamos con los documentos.", rotulo: "Te llevas", llevas: "El primer proceso, quién lo opera y su precio cerrado." },
      { numero: "03", titulo: "Ordenamos antes de automatizar", texto: "Juntamos en un solo lugar las hojas de cálculo y los documentos regados. Construimos cada semana con tu gente. Solos sería más fácil, pero nadie adentro entendería cómo funciona.", rotulo: "Te llevas", llevas: "El proceso funcionando, probado con casos reales." },
      { numero: "04", titulo: "Tu equipo lo opera", texto: "Entrenamos a quien lo va a operar. Si sale una herramienta que te sirva, te la proponemos.", rotulo: "Te llevas", llevas: "El proceso en manos de tu equipo. Si quieres, seguimos con el siguiente." },
    ],
    // La secuencia animada que cuenta los cuatro pasos como un video corto
    // (2026-11-06; Santiago: "más como una animación, un video animado, algo
    // así, en vez de puro texto"). Los textos de los pasos no cambian: estas
    // son solo las palabras nuevas, los controles y los rótulos de las escenas.
    // Las escenas son ilustrativas: un mismo proceso genérico de punta a punta
    // (las cotizaciones, de la lista de "¿Por dónde empieza…?"), nunca la
    // pantalla de un cliente, sin cifras ni resultados, y con el rótulo de
    // ejemplo a la vista, como la ventana de /coaching. Las dos causas de la
    // escena 01 repiten las del texto del paso 01.
    animacion: {
      etiqueta: "Ejemplo",
      grupo: "Animación de los cuatro pasos",
      pausar: "Pausar la animación",
      seguir: "Seguir la animación",
      volver: "Volver a ver",
      verPaso: "Ver el paso",
      escenas: {
        proceso: "Cotizaciones",
        causas: ["Un cliente que espera", "Un error que se repite"],
        otros: ["Facturas", "Pedidos", "Cierre de mes"],
        elegido: "Primero",
        equipo: "Tu equipo",
        siguiente: "Siguiente proceso",
      },
    },
  },
  // ¿Es para mi empresa y con quién hablo? La pregunta que filtra (quién lo
  // opera), a quién no le servimos y los dos socios, antes del final. La
  // última línea de "No es para tu empresa si" termina en el enlace al
  // coaching (otraLinea.coaching.enlace). Las 40 horas quedan como referencia
  // en las preguntas ("¿Y si mi proceso no da para un proyecto?").
  // "Quieres recibirlo armado…" es el límite que define el método (2026-11-03):
  // acompañamos, no entregamos armado. "Se arregla con una fórmula o un filtro
  // de correo" sigue en "¿Y si mi proceso no da para un proyecto?".
  // "Solo buscas un bot…": un bot que conteste es lo que no hacemos; el
  // proceso que hay detrás (por ejemplo, los pedidos) sí puede serlo.
  paraQuien: {
    titulo: "¿Esto es para tu empresa?",
    // "El proceso", como en los pasos: "el sistema" sin definir confundía.
    // "Sin nosotros al lado" y no "cuando nos vayamos" (Santiago, 2026-11-06,
    // K5): dos secciones antes la portada dice que seguimos contigo con el
    // siguiente proceso.
    cita: "Si el proceso queda funcionando, ¿quién de tu equipo lo va a operar sin nosotros al lado?",
    respuesta: "Necesitamos el nombre de una persona. Si la respuesta es «ustedes lo manejan», ahí te decimos que no.",
    noEs: {
      titulo: "No es para tu empresa si",
      items: ["Quieres recibirlo armado, sin que tu equipo participe.", "Solo buscas un bot que conteste mensajes.", "Lo hace de principio a fin una sola persona."],
    },
    // "En Colombia", nunca una ciudad (Santiago, 2026-11-03).
    socios: {
      texto: "Martín Zárate y Santiago Ospina, en Colombia. En todo lo que sale de Daxlo estamos los dos. No vendemos dependencia.",
    },
  },
};

// ---------------------------------------------------------------- CIERRE

// Desde el 2026-11-06 (I2 y N2 de landing-hilo-conductor): el titular (h1 de
// /nosotros y h2 del inicio) nombra las dos líneas, y el tercer párrafo dice
// las dos formas de trabajar con la regla de las puertas del inicio
// (dosFormas.*.regla), así presenta las dos tarjetas que siguen. Quien llega
// desde /coaching ya no lee una página que solo habla de empresas. Si la regla
// cambia, cambia aquí también.
export const nosotros = {
  badge: "Quiénes somos",
  titulo: "Dos socios que enseñan y construyen.",
  parrafos: [
    "Somos Martín Zárate y Santiago Ospina, egresados de Administración del CESA. Usamos IA todos los días para leer datos, automatizar procesos y armar sistemas que hacen solos lo que antes tomaba horas.",
    "Fundamos Daxlo por algo que vimos repetido: las empresas compran IA y quedan con un sistema que no entienden, o con un equipo que entendió la teoría y no cambió nada.",
    "Hay quien te vende un programa y desaparece. Nosotros trabajamos de dos formas, según quién hace el trabajo. Si lo haces tú solo, te enseñamos a resolverlo tú en sesiones 1 a 1. Si lo hacen varias personas de tu equipo, lo construimos con ellas dentro de tu empresa, en Colombia. No cerramos el proyecto hasta que alguien de adentro pueda sostenerlo sin nosotros.",
  ],
  firma: "En todo lo que sale de Daxlo estamos los dos.",
};

// Una pregunta frecuente. `enlace` es opcional y se pinta al final de la
// respuesta, fuera del texto que va a los datos estructurados (FAQPage).
export type PreguntaFaq = { p: string; r: string; enlace?: { t: string; h: string } };

// Lo largo de /coaching y /consultoria vive aquí: en acordeón, con la
// respuesta en el HTML del servidor (los buscadores la leen) pero cerrada, así
// no alarga la lectura. La primera oración de cada respuesta contesta la
// búsqueda literal. /preguntas muestra los tres grupos; cada línea, el suyo
// (preguntasLinea). El grupo "Coaching o consultoría" va solo en /preguntas.
// Desde el 2026-11-06 (Q1 a Q3 de landing-hilo-conductor): bajo el h1 de
// /preguntas, qué es Daxlo y la regla de las dos líneas (quien llega por una
// pregunta desde Google no lo sabía: estaba al final de una respuesta
// cerrada); la pregunta que decide entre las dos va primero, no después de
// catorce; y cada grupo de una línea lleva a su página, con el texto de las
// puertas del inicio. `ancla` es el id del grupo en /preguntas (#elegir,
// #coaching, #consultoria): las páginas de cada línea enlazan al suyo.
export const faq: {
  badge: string;
  titulo: string;
  sub: string;
  ayuda: string;
  ayudaTexto: string;
  ayudaCta: string;
  grupos: { nombre: string; ancla: string; tono: "cyan" | "blue" | "dual"; enlace?: { t: string; h: string }; preguntas: PreguntaFaq[] }[];
} = {
  badge: "Preguntas",
  titulo: "Preguntas frecuentes",
  sub: "Daxlo tiene dos líneas: coaching de IA 1 a 1, si el trabajo lo haces tú solo, y consultoría, si lo hacen varias personas de tu equipo. Estas son las dudas de cada una.",
  ayuda: "¿Te quedó una duda que no está acá?",
  ayudaTexto: "Escríbenos por WhatsApp y te respondemos nosotros.",
  ayudaCta: "Escribir por WhatsApp",
  grupos: [
    {
      // La regla de las dos puertas del inicio (dosFormas.*.regla), con las
      // mismas palabras.
      nombre: "Coaching o consultoría",
      ancla: "elegir",
      tono: "dual",
      preguntas: [
        { p: "¿Te sirve el coaching o la consultoría de IA?", r: "Depende de quién hace el trabajo. Si lo haces tú solo, aunque los documentos te lleguen de otros, es coaching: aprendes a resolverlo tú y pagas por sesión. Si lo hacen varias personas de tu equipo, es consultoría: después de una semana de diagnóstico sin costo, lo construimos con ellos a precio cerrado. Si no lo tienes claro, te lo decimos en la primera conversación." },
      ],
    },
    {
      nombre: servicios.coaching,
      ancla: "coaching",
      tono: "cyan",
      enlace: { t: dosFormas.coaching.enlace, h: rutas.coaching },
      preguntas: [
        // Una sola pregunta para "qué es" y "clases por videollamada": eran dos
        // casi iguales y alargaban la lista. La búsqueda ("clases de
        // inteligencia artificial por videollamada") va en la primera oración.
        { p: "¿Qué es el coaching de IA 1 a 1?", r: "Son clases de inteligencia artificial 1 a 1 por videollamada, con tu pantalla compartida, sobre un trabajo tuyo y con tus propios archivos. Escribes tú en ChatGPT, Claude u otra herramienta, te corregimos en el momento y sales de cada sesión con algo hecho, más las instrucciones para repetirlo sin nosotros. No es un curso grabado." },
        { p: "¿Necesito saber programar?", r: "No. Si sabes escribir un correo, sabes darle instrucciones a ChatGPT o a Claude. Arrancamos desde tu nivel." },
        // Formatos del documento de precios, sin cifras de precio. Desde el
        // 2026-11-04 cierra con cuándo dejar de venir (un límite, regla 4 de
        // voz-daxlo.md): repites el trabajo sin nosotros, como promete "¿Qué
        // es el coaching de IA 1 a 1?". Ningún coach de la competencia lo dice.
        { p: "¿Cuántas sesiones necesito?", r: "Depende del trabajo y de tu nivel. A veces basta una sesión suelta y a veces conviene un plan de 4 o de 8 sesiones. Cada sesión dura 45 minutos, 1 hora o 1 hora y media. Arrancas desde donde estés: desde no haber usado nunca la IA hasta armar tus propios agentes. Lo definimos en la llamada de 15 minutos, sin costo. Con cada trabajo terminas cuando ya lo repites sin nosotros, con las instrucciones que te llevaste." },
        // Los medios de pago no van en la web: se hablan en la propuesta
        // (Santiago, 2026-11-03).
        { p: "¿Cómo se paga?", r: "Por sesión, sin matrícula ni mensualidad. El precio depende de tu nivel y de cuánto dura la sesión. Te lo decimos en la llamada de 15 minutos, junto con la forma de pago, antes de empezar." },
        {
          p: "¿Qué herramientas aprendo a usar?",
          r: "ChatGPT y Claude, y según tu caso otras como Claude Code, Codex, n8n, Obsidian o Base44. No necesitas conocerlas para empezar.",
          enlace: { t: "Para qué sirve cada una", h: rutas.herramientas },
        },
      ],
    },
    {
      nombre: servicios.consultoria,
      ancla: "consultoria",
      tono: "blue",
      enlace: { t: dosFormas.consultoria.enlace, h: rutas.consultoria },
      preguntas: [
        // La primera responde la búsqueda y dice quiénes somos, para
        // fragmentos destacados y respuestas de IA. "En Colombia", sin ciudad
        // (Santiago, 2026-11-03). Desde el 2026-11-03 cuenta el mismo método
        // que la página, y es el único lugar donde van el tablero y la
        // información en un solo lugar: como EJEMPLOS de lo que se construye,
        // sin precio ni resultado. El tablero es de ese proceso, no de toda la
        // empresa: un proceso a la vez.
        { p: "¿Qué hace una consultoría de inteligencia artificial?", r: "Te ayuda a decidir en qué proceso de tu empresa la inteligencia artificial cambia el trabajo, y lo deja funcionando con alguien de tu equipo a cargo. En Daxlo primero buscamos dónde se traba el trabajo y elegimos por dónde empezar. Ordenamos la información antes de automatizar y construimos con tu equipo cada semana, para que entienda cómo funciona. Lo que construimos depende del caso: por ejemplo, la información de un proceso en un solo lugar conectado a la IA, o un tablero con ese proceso al día. Avanzamos por fases, un proceso a la vez. Daxlo es una consultoría de inteligencia artificial en Colombia, de Martín Zárate y Santiago Ospina, con dos líneas: coaching de IA 1 a 1 para personas y consultoría de implementación para empresas." },
        // "Transformar una empresa con IA" es postura de Daxlo, no un dato. Los
        // procesos son ejemplos genéricos, no de ningún cliente. Ordenar antes
        // de automatizar es el paso 03 (2026-11-03).
        { p: "¿Por dónde empieza una empresa a implementar inteligencia artificial?", r: "Por un solo proceso: uno estable, que se repite igual cada semana y pasa por varias personas. Por ejemplo, las cotizaciones, el cierre de mes, los informes de cada semana, los pedidos o las facturas de proveedores que llegan por correo. Antes de automatizarlo ordenamos su información, que suele estar regada en hojas de cálculo y documentos. Cuando tu equipo ya lo opera, seguimos con otro. Transformar una empresa con IA es eso: cambiar cómo se hace un trabajo concreto y quién lo sostiene, uno a la vez." },
        // "Ordenamos antes de automatizar" (paso 03) se podía leer como un
        // requisito: "primero ordénense ustedes" (2026-11-04). Esta la
        // contesta: ordenar es parte del trabajo. Describe el paso 03, no
        // promete un resultado (el tablero y la información conectada a la IA
        // siguen solo como ejemplos en "¿Qué hace una consultoría…?"). Dice "el
        // proceso que elegimos" porque la respuesta se lee sola en el FAQPage.
        // Va en el índice 2: las dos primeras no se mueven (preguntas.spec.ts).
        { p: "¿Tengo que tener la información ordenada antes de empezar?", r: "No. Ordenarla es parte del trabajo y lo hacemos con tu equipo. Juntamos en un solo lugar las hojas de cálculo, los correos y los documentos del proceso que elegimos. Las reglas que hoy alguien sabe de memoria quedan por escrito. Así la IA trabaja con esa información y nadie tiene que explicársela cada vez." },
        // La segunda oración es el paso 01 (lo que de verdad cuesta), con las
        // mismas escenas genéricas.
        { p: "¿Cómo identifican qué proceso cambiar primero?", r: "Empieza en la primera conversación y se cierra en el diagnóstico de una semana. Detrás de la tarea que se demora miramos lo que de verdad le cuesta a la empresa, como un cliente que espera o un error que se repite. Buscamos hechos, no estimaciones: quién hace el trabajo, cuántas personas lo tocan, dónde vive la información y qué pasa cuando sale mal. Hablamos con quien dirige y con quien hace el trabajo, y comparamos lo que se cuenta en las reuniones con los correos, los PDF y las pantallas reales. Ahí aparecen las excepciones que nadie tiene escritas, como duplicados, notas crédito o documentos en otra moneda. Va primero el proceso que se repite igual cada semana, tiene reglas que se pueden escribir, pasa por varias personas y le quita tiempo a gente que sabe hacer más." },
        // [DATO FALTANTE: rango de precio aprobado por Santiago, si se quiere
        // publicar uno.] El diagnóstico no se cobra y los medios de pago van
        // en la propuesta (Santiago, 2026-11-03). La propuesta por fases y "si
        // una fase no te cuadra" esperan el OK de Santiago como oferta
        // estándar.
        { p: "¿Cuánto cuesta una consultoría de IA?", r: "Depende del proceso. Antes de construir hay un diagnóstico de una semana, sin costo: dibujamos el proceso, medimos cómo está hoy y cerramos el alcance. De ahí sale una propuesta por fases, cada una con sus semanas, su precio cerrado y la forma de pago. El precio de cada fase solo cambia si cambias su alcance. Si una fase no te cuadra, empezamos por otro lado. Cobramos por lo entregado, no por horas." },
        // "Cada semana", como el paso 03: frecuencia pendiente de Santiago.
        // Las semanas de cada fase van "estimadas": dependen del equipo.
        // Desde el 2026-11-04 dice qué pasa en cada reunión (revisar el avance
        // y pedir la información que falta), que casi nadie cuenta, y por eso
        // se entiende que la velocidad dependa del equipo. No fija una
        // frecuencia nueva.
        { p: "¿Cuánto se demora un proyecto?", r: "El diagnóstico toma una semana. La construcción depende de la velocidad de tu equipo, porque la hacemos con ellos. Nos reunimos cada semana, revisamos cómo vamos hacia la meta y pedimos la información que hace falta. Cada fase trae sus semanas estimadas en la propuesta. Primero entregamos un proceso funcionando y después vamos por el siguiente." },
        { p: "¿Qué pasa cuando ustedes se van?", r: "El proceso lo opera la persona de tu equipo que acordamos contigo antes de construir. No necesita saber programar, solo conocer el proceso. Primero lo opera con nosotros al lado y aprende a hacer los ajustes. Cuando lo maneja sola, ese proceso ya no depende de nosotros. Si quieres, seguimos contigo con el siguiente." },
        { p: "¿El sistema toma decisiones solo?", r: "Únicamente donde lo apruebes. Lo demás queda en borrador para que lo revise alguien de tu equipo. Antes de automatizar una regla la probamos con varios casos reales, porque un error automatizado se repite muchas veces antes de que alguien lo note." },
        // Las 40 horas son una referencia, no un filtro. Es la frase de límite
        // que antes estaba en "¿Esto es para tu empresa?" (copy.test.ts).
        { p: "¿Y si mi proceso no da para un proyecto?", r: "Te lo decimos en la primera conversación y no te cotizamos nada. Una referencia: que ese trabajo sume más de 40 horas a la semana entre todas las personas que lo tocan; si nunca lo has medido, un cálculo a ojo sirve. Tampoco te vendemos un proyecto si el proceso cambia cada mes o si el problema real es que sobra o falta gente. A veces basta el coaching 1 a 1 para quien hace el trabajo, y a veces se arregla con una fórmula o un filtro de correo." },
        // No define el servicio (eso lo hace la página): dice qué le pasa al
        // trabajo de los auxiliares y quién revisa (cambios.filas[1] y "¿El
        // sistema toma decisiones solo?").
        // Desde el 2026-11-04 dice también qué hacemos con quien lleva años en
        // ese trabajo y desconfía de la IA: lo construimos con esa persona.
        // Nombra la desconfianza, no el miedo a perder el puesto (lista de
        // miedo de voz-daxlo.md). Es la tarea del dueño (darle certeza a la
        // gente) y la competencia solo contesta si reemplaza o no.
        { p: "¿Esto reemplaza a mis auxiliares?", r: "Eso lo decides tú. El sistema les quita la parte de copiar y pegar, como pasar los datos de un correo o de un PDF a la hoja de cálculo o al sistema contable, y deja borradores que revisa y aprueba alguien de tu equipo. Quien lleva años haciendo ese trabajo a veces desconfía de la IA. Por eso lo construimos con esa persona: entiende cada regla porque ayudó a escribirla." },
      ],
    },
  ],
};

export const agendar = {
  badge: "Agendar",
  titulo: "Cuéntanos qué te está consumiendo horas.",
  sub: "Primera conversación sin costo. Te decimos si te sirve el coaching, la consultoría o ninguna.",
  campos: {
    linea: "¿Qué te interesa?",
    lineaOpciones: [
      { valor: "coaching", texto: "Coaching 1 a 1 para mí" },
      { valor: "consultoria", texto: "Consultoría para mi empresa" },
      { valor: "no_se", texto: "Todavía no sé cuál me sirve" },
    ],
    nombre: "Nombre completo",
    whatsapp: "WhatsApp",
    correo: "Correo electrónico",
    empresa: "Empresa",
    interes: "¿Qué proceso o tema tienes en mente?",
    interesEjemplo: "Por ejemplo: cada semana armo a mano un informe con datos de tres hojas de cálculo distintas.",
    // Autorización previa, expresa e informada (Ley 1581 de 2012, art. 9). La
    // casilla arranca sin marcar y es obligatoria.
    autorizacion: "Autorizo a Daxlo a tratar mis datos para contactarme por WhatsApp y correo sobre esta solicitud, según la",
    autorizacionEnlace: "política de tratamiento de datos",
    // Casilla aparte y opcional: los mensajes comerciales necesitan su propia
    // autorización (Ley 1581, art. 9; Ley 2300 de 2023 para horarios).
    marketing: "Quiero recibir invitaciones a talleres y contenido de Daxlo por correo o WhatsApp. Me puedo dar de baja cuando quiera.",
    // Aviso de privacidad corto (Decreto 1377 de 2013, art. 15). Sin el correo
    // en texto: la ofuscación de Cloudflare lo reescribiría en el HTML.
    aviso:
      "Responsable: Daxlo (Martín Zárate y Santiago Ospina). Usamos tus datos solo para lo que autorizas. Se guardan en servicios de Google, Cloudflare y Cal.com y en nuestro sistema interno, con servidores fuera de Colombia. Puedes conocerlos, corregirlos, pedir que los borremos o revocar la autorización cuando quieras; la política explica cómo.",
  },
  // Qué pasa después de enviar, debajo del formulario, en la línea de nodos
  // del recorrido de /consultoria (2026-11-06; reemplaza el párrafo de B-4).
  // El paso del medio es el de cierre.meta: depende de si hay agenda de
  // Cal.com (hayAgenda). La duración es la de la portada de /coaching. Faltan
  // la duración de la conversación de consultoría y quién la atiende: no se
  // dicen hasta tener el dato.
  pasos: {
    titulo: "Qué pasa después de enviar",
    enviar: "Envías tus datos",
    conversar: "Conversamos sin costo",
    duracion: "15 minutos en coaching",
  },
  enviar: "Agendar la conversación",
  enviando: "Enviando…",
  meta: "Sin costo · Te contactamos por WhatsApp",
  metaAgenda: "Sin costo · Al enviar te llevamos a la agenda para elegir el día y la hora",
  exito: {
    titulo: "Listo. Nos pondremos en contacto.",
    texto: "Te escribimos por WhatsApp para coordinar la conversación.",
    duplicado: "Ya recibimos tus datos. Te escribimos por WhatsApp pronto.",
    whatsapp: "Escríbenos directo por WhatsApp",
    // Cuando hay agenda de Cal.com configurada (ver `calcom`). La persona pasa
    // sola a Cal.com; este panel lo ve si la agenda no abre o si vuelve con
    // Atrás sin haber agendado.
    agenda: {
      titulo: "Listo. Falta elegir el día y la hora.",
      texto: "Si la agenda no se abrió, entra desde aquí. Cuando agendes, la confirmación te llega por correo.",
      boton: "Elegir día y hora",
    },
  },
  errores: {
    linea: "Dinos qué te interesa.",
    nombre: "Cuéntanos tu nombre.",
    whatsapp: "Necesitamos tu WhatsApp para contactarte.",
    whatsappFormato: "Revisa el número de WhatsApp.",
    correo: "Necesitamos tu correo.",
    correoFormato: "Revisa el formato del correo.",
    autorizacion: "Necesitamos tu autorización para contactarte.",
    general: "Algo no funcionó. Intenta de nuevo en un momento, o escríbenos directo por WhatsApp.",
  },
};

export const footer = {
  lema: "Implementamos la IA. Transferimos la capacidad.",
  columnas: [
    {
      titulo: "Coaching",
      enlaces: [
        { t: "Coaching 1 a 1", h: rutas.coaching },
        { t: "Cómo funciona", h: `${rutas.coaching}#como-funciona` },
        { t: "Herramientas", h: rutas.herramientas },
      ],
    },
    {
      titulo: "Consultoría",
      enlaces: [
        { t: "Consultoría de implementación", h: rutas.consultoria },
        { t: "Cómo trabajamos", h: `${rutas.consultoria}#como-trabajamos` },
        // El texto sigue el tema de la sección (qué cambia en la empresa); el
        // ancla no cambia.
        { t: "Qué cambia en tu empresa", h: `${rutas.consultoria}#que-automatizamos` },
      ],
    },
    {
      titulo: "Daxlo",
      enlaces: [
        { t: "Quiénes somos", h: rutas.nosotros },
        { t: "Preguntas frecuentes", h: rutas.preguntas },
        { t: "Agendar una conversación", h: rutas.agendar },
      ],
    },
  ],
  derechos: "© 2026 Daxlo. Todos los derechos reservados.",
  privacidad: "Política de tratamiento de datos",
};

// ------------------------------------------------------ ENTRE PÁGINAS

// Puente hacia cada línea, por si el visitante entró por la puerta
// equivocada. /nosotros lo muestra como tarjeta; en /coaching y /consultoria
// solo va el enlace (`enlace`), al final de "No es para… si".
// Desde el 2026-11-03 dicen el método de cada línea, como las puertas del
// inicio, y sin nombres de herramientas.
export const otraLinea = {
  consultoria: {
    etiqueta: "Para tu empresa",
    titulo: "¿El trabajo lo hacen varias personas?",
    texto: "Entonces es consultoría: encontramos dónde se traba ese trabajo, ordenamos su información y lo cambiamos con tu equipo, que después lo opera.",
    enlace: "Ver la consultoría para empresas",
  },
  coaching: {
    etiqueta: "Para ti",
    titulo: "¿Es un trabajo que haces tú solo?",
    texto: "Aprendes a resolverlo tú con IA, sobre tu propio archivo, en sesiones 1 a 1. Pagas por sesión.",
    enlace: "Ver el coaching 1 a 1",
  },
};

// `grupo` es el índice en faq.grupos: desde el 2026-11-06 el 0 es "Coaching o
// consultoría" (Q2).
export const preguntasLinea = {
  coaching: { titulo: "Preguntas sobre el coaching de IA", grupo: 1 },
  consultoria: { titulo: "Preguntas sobre la consultoría de IA", grupo: 2 },
  todas: "Ver todas las preguntas",
};

// Cierre de cada página: la invitación a agendar.
export const cierre = {
  titulo: "Cuéntanos qué te está consumiendo horas.",
  sub: "Primera conversación sin costo. Si no te servimos, te lo decimos.",
  cta: "Agendar una conversación",
  // Qué pasa después de tocar el botón, dicho bajo el botón. Depende de si
  // hay agenda de Cal.com configurada (hayAgenda, src/lib/agenda.ts).
  meta: {
    agenda: "Eliges el día y la hora en la agenda",
    whatsapp: "Te escribimos por WhatsApp para coordinar",
  },
  // Enlace de texto bajo el botón (contacto.whatsapp), nunca un botón flotante.
  // Solo en el cierre del inicio, /coaching y /consultoria (CtaFinal
  // whatsapp); /preguntas ya tiene su botón de WhatsApp en la ayuda.
  whatsapp: "O escríbenos por WhatsApp",
};

// Quiénes somos, en corto, en el inicio. La página /nosotros tiene el texto
// completo (nosotros.parrafos). Sin "partimos de cómo trabajas hoy": lo dice
// cualquier consultora. Desde el 2026-11-04 tampoco "no vendemos
// dependencia": el eslogan lo dicen muchas consultoras y es la forma más
// débil. Dice el mecanismo, con las palabras de herramientas.sub. No choca con
// "Tu aliado de IA": lo hecho funciona sin nosotros y seguimos si quieres.
export const inicioNosotros = {
  linea: "Martín Zárate y Santiago Ospina, en Colombia. Te enseñamos o construimos contigo, y lo que hacemos sigue funcionando sin nosotros.",
  enlace: "Conoce a Martín y Santiago",
};

// ------------------------------------------------------------- AGENDA

// La agenda de Cal.com (cuenta de Team Daxlo, usuario «daxlo»). Al enviar el
// formulario, la persona pasa a elegir el día y la hora con su nombre, su
// correo y la línea ya escritos; la cita entra sola al OS de Daxlo por su
// webhook (backend/app/rutas/agenda.py).
// En los dos tipos de evento tiene que seguir así:
//   · la pregunta del correo con «Disable input if the URL identifier is
//     prefilled»: si la persona lo cambiara allá, el OS abriría dos fichas;
//   · la pregunta «linea» (identificador exacto, sin tilde) con las opciones
//     de `lineas` tal cual: el prellenado y el OS dependen de ese texto.
// Si se vacían los enlaces, el formulario vuelve al mensaje de WhatsApp.
export const calcom = {
  enlaces: {
    coaching: "https://cal.com/daxlo/diagnostico-gratuito",
    consultoria: "https://cal.com/daxlo/conversacion-de-alcance",
    no_se: "https://cal.com/daxlo/conversacion-de-alcance",
  } as Record<string, string>,
  // Los valores exactos de la pregunta «linea» de Cal.com que entiende el OS.
  lineas: { coaching: "Coaching 1 a 1", consultoria: "Consultoría de implementación", no_se: "Todavía no sé" } as Record<string, string>,
};

// ------------------------------------------------------------- PRIVACIDAD

// Política de tratamiento de datos personales (Ley 1581 de 2012 y Decreto
// 1377 de 2013, hoy compilado en el Decreto 1074 de 2015). Recomendado: que
// la revise un abogado antes de darla por definitiva.
//
// PENDIENTE: Daxlo todavía no está constituida. La ley pide nombre o razón
// social, domicilio, dirección, correo y teléfono del responsable (Decreto
// 1377, art. 13). Falta la ciudad y la dirección de notificación; cuando se
// constituya, reemplazar `responsable` con la razón social, el NIT y la
// dirección. El correo de contacto NO va en estos textos: se muestra con
// CorreoContacto, porque la ofuscación de Cloudflare reescribe cualquier
// correo del HTML y eso rompe la hidratación.
export const privacidad = {
  // La versión viaja con cada envío como prueba de qué texto aceptó la
  // persona: si cambia el texto, cambia la versión (la prueba de copy.test.ts
  // lo exige). Versiones anteriores: 2026-10-26 = commit de6dfd4 (tag
  // politica-2026-10-26). Al publicar, la vigencia es el día de publicación.
  version: "2026-10-26-2",
  vigencia: "26 de octubre de 2026",
  responsable: {
    nombre: "Daxlo, nombre comercial con el que trabajan Martín Zárate y Santiago Ospina",
    domicilio: "Colombia",
    whatsapp: "+57 320 384 8586",
    atiende: "Los dos socios atienden las consultas y reclamos sobre datos personales.",
  },
  intro:
    "Esta política explica qué datos personales recogemos en daxlo.co, para qué los usamos, dónde los guardamos y cómo puedes consultarlos, corregirlos o pedir que los borremos.",
  secciones: [
    {
      titulo: "Qué datos recogemos",
      parrafos: [
        "Cuando llenas el formulario de agendar: tu nombre, tu WhatsApp, tu correo, la línea que te interesa y, si los escribes, el nombre de tu empresa y el tema que tienes en mente.",
        "Cuando agendas la conversación en Cal.com: el día y la hora que eliges y lo que respondas allí.",
        "Cuando nos escribes por WhatsApp o por correo: los datos que tú mismo nos compartas en esa conversación.",
        "No pedimos datos sensibles (salud, origen étnico, orientación política o religiosa, datos biométricos) ni datos de menores de edad. Nuestros servicios están dirigidos a adultos.",
      ],
    },
    {
      titulo: "Para qué los usamos",
      lista: [
        "Contactarte para coordinar la conversación que pediste.",
        "Agendar esa conversación y enviarte por correo la confirmación y los recordatorios de la cita.",
        "Entender tu caso y responderte si el coaching, la consultoría o ninguno de los dos te sirve.",
        "Enviarte la propuesta o la información de servicios que nos pediste.",
        "Llevar el registro de las solicitudes que recibimos.",
      ],
      parrafos: [
        "No vendemos tus datos ni los compartimos con terceros para publicidad. No te enviaremos información comercial distinta a la que pediste sin una autorización adicional.",
      ],
    },
    {
      titulo: "Dónde se guardan",
      parrafos: [
        "Los datos del formulario se guardan en una hoja de cálculo de Google, que actúa como encargado del tratamiento.",
        "Las solicitudes y las citas pasan también a nuestro sistema interno de seguimiento comercial, alojado en Supabase y Vercel.",
        "La agenda funciona con Cal.com: al enviar el formulario te llevamos a su página con tu nombre y tu correo ya escritos, y desde ahí te llegan la confirmación y los recordatorios de la cita.",
        "El sitio está alojado en Cloudflare. Para medir visitas usamos Cloudflare Web Analytics, que cuenta páginas vistas de forma agregada, sin cookies y sin identificar a las personas.",
        "Cuando te escribimos por WhatsApp, la conversación pasa por los servicios de Meta.",
        "Estos proveedores tienen servidores fuera de Colombia, incluidos los Estados Unidos. Solo les confiamos los datos para prestar el servicio y bajo sus propias medidas de seguridad.",
      ],
    },
    {
      titulo: "Cookies",
      parrafos: [
        "No usamos cookies de analítica ni de publicidad, y el sitio no guarda información en tu navegador. La estadística de visitas de Cloudflare no usa cookies. Cloudflare puede poner cookies técnicas de seguridad si detecta tráfico sospechoso, solo para proteger el sitio.",
      ],
    },
    {
      titulo: "Tu autorización",
      parrafos: [
        "Antes de enviar el formulario te pedimos que autorices el tratamiento de tus datos marcando una casilla. Guardamos la prueba de esa autorización junto con tu solicitud: la fecha y la versión de esta política que aceptaste.",
        "Los mensajes sobre talleres y contenido son aparte: solo te los enviamos si marcas esa casilla, que es opcional. Puedes darte de baja cuando quieras respondiendo SALIR o desde el enlace del correo.",
        "Puedes revocar la autorización en cualquier momento escribiéndonos, siempre que no exista un deber legal o contractual de conservar los datos.",
      ],
    },
    {
      titulo: "Cuánto tiempo los guardamos",
      parrafos: [
        "Mientras exista una relación contigo (una conversación en curso, un plan de sesiones o un proyecto). Si no llegas a ser cliente, los borramos a los 12 meses del último contacto, o antes si nos lo pides.",
      ],
    },
    {
      titulo: "Tus derechos",
      lista: [
        "Conocer, actualizar y rectificar tus datos.",
        "Pedir prueba de la autorización que nos diste.",
        "Saber qué uso le hemos dado a tus datos.",
        "Revocar la autorización o pedir que borremos tus datos.",
        "Consultar gratis tus datos.",
        "Presentar quejas ante la Superintendencia de Industria y Comercio (SIC), después de haber hecho tu consulta o reclamo ante nosotros.",
      ],
      parrafos: ["Estos derechos están en el artículo 8 de la Ley 1581 de 2012."],
    },
    {
      titulo: "Cómo ejercerlos",
      parrafos: [
        "Escríbenos al correo o al WhatsApp que aparecen arriba, con tu nombre, lo que necesitas y un dato de contacto para responderte.",
        "Consultas: te respondemos en un máximo de 10 días hábiles. Si no alcanzamos, te avisamos el motivo y te respondemos en máximo 5 días hábiles más.",
        "Reclamos (corregir, actualizar, borrar o revocar): incluye tu identificación, la descripción de los hechos, tu dirección y los documentos que quieras hacer valer. Si falta algo, te pedimos completarlo dentro de los 5 días siguientes; si pasan dos meses sin respuesta, entendemos que desististe. Resolvemos en un máximo de 15 días hábiles, prorrogables 8 días más con aviso.",
        "Estos plazos son los de los artículos 14 y 15 de la Ley 1581 de 2012.",
      ],
    },
    {
      titulo: "Seguridad",
      parrafos: [
        "Tomamos medidas razonables para proteger tus datos: el sitio funciona solo por conexión cifrada (HTTPS), el acceso a la hoja de cálculo y al sistema interno está limitado a los dos socios, con verificación en dos pasos, y el formulario no guarda nada en tu navegador.",
      ],
    },
    {
      titulo: "Cambios a esta política",
      parrafos: [
        "Si cambiamos algo importante de esta política, publicaremos la versión nueva en esta página con su fecha y, cuando la ley lo exija, te pediremos una nueva autorización.",
      ],
    },
  ],
};
