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

// Consultoría va adelante de Coaching desde el 2026-11-12: el sitio le habla
// primero a la empresa.
export const nav = {
  links: [
    { label: "Consultoría", href: rutas.consultoria },
    { label: "Coaching", href: rutas.coaching },
    // La ruta sigue siendo /nosotros; la página es "Cómo trabajamos" (2026-11-11).
    { label: "Cómo trabajamos", href: rutas.nosotros },
    { label: "Herramientas", href: rutas.herramientas },
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
    // Desde el 2026-11-11 (Santiago) la página es "Cómo trabajamos": habla de
    // Daxlo y de su forma de trabajar, sin la parte de los socios. La URL no
    // cambia. Se pierde la búsqueda por el nombre de las personas ("Quiénes
    // somos: …"), que es lo que llevaba el título anterior.
    titulo: "Cómo trabajamos: te enseñamos o lo montamos contigo",
    descripcion:
      "Trabajamos de dos formas, según quién hace el trabajo: te enseñamos a resolverlo tú o lo montamos con tu equipo. Lo que queda funciona sin nosotros.",
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
// Desde el 2026-11-12 (inicio «Campo», sobre el armazón que eligió Santiago):
// el hero tiene una sola frase y una bajada corta, y esa frase dice qué pasa
// y a quién: montar y que la gente lo maneje. El eslogan («Implementamos la
// IA. Transferimos la capacidad.») sale del hero y queda como última línea
// del pie (footer.lema), en el título de la pestaña y en la imagen para
// compartir. La frase de referencia que vigila copy.test.ts pasa a ser "Le
// enseñamos a tu equipo a manejarlos".
// Ningún ejemplo del inicio, de la barra ni del pie habla de cotizaciones, de
// facturas ni del informe del viernes (pedido de Santiago, 2026-11-12).
export const hero = {
  aliado: "Tu aliado de IA",
  // Entre «la» e «IA» va un espacio de no separación (U+00A0), para que el
  // titular no se corte ahí en celular.
  titulo: ["Montamos la IA dentro de tu empresa.", "Tu gente la maneja."],
  sub: "Agentes y automatizaciones sobre las herramientas que ya usas. Le enseñamos a tu equipo a manejarlos y seguimos contigo cuando haya que revisar o mejorar.",
  cta: "Agendar una conversación",
  meta: "Primera conversación sin costo",
  // Rótulos en mono sobre la fotografía. Son anotaciones de ejemplo de quién
  // hace qué, no datos medidos: sin cifras, y con su etiqueta "Ejemplo".
  rotulos: {
    etiqueta: "Ejemplo",
    notas: [
      { clave: "Agente", valor: "Arma el borrador" },
      { clave: "Aprueba", valor: "Una persona" },
      { clave: "Lo maneja", valor: "Tu equipo" },
    ],
  },
};

// Las tres puertas del inicio: por dónde se entra, según quién hace el
// trabajo. Lo que cuenta cada línea vive en su página; aquí no se repite.
// La regla de cada puerta ("Lo haces tú solo" / "Lo hacen varias personas de
// tu equipo") es la misma con la que se decide en /preguntas#elegir y en el
// "No es para… si" de cada línea: si se cambia una, se cambian todas, para que
// nadie entre por la puerta equivocada (lo vigila copy.test.ts).
// Desde el 2026-11-03 (Santiago): ni la frase ni las puertas nombran
// herramientas.
// Desde el 2026-11-12 (inicio «Campo»): la frase de arriba se enciende
// palabra por palabra y las puertas son tres tarjetas con fotografía. La
// búsqueda ("coaching o consultoría de inteligencia artificial") va en el
// rótulo (`sub`). «Para tu gente» es el coaching para las personas de una
// empresa (la oferta la confirmó Santiago, sin precio ni forma de pago).
// «Seguimos contigo» no es puerta: la operación después de la entrega nunca
// es un llamado a la acción.
export const dosFormas = {
  sub: "Coaching o consultoría de inteligencia artificial",
  texto: "Entras por donde está el trabajo: si lo haces tú solo, te enseñamos; si lo hacen varios, lo montamos con ellos.",
  coaching: {
    etiqueta: "Para ti",
    regla: "Lo haces tú solo",
    titulo: servicios.coaching,
    linea: "Resuelves en la sesión el trabajo que hoy te quita horas. Escribes tú.",
    enlace: "Ver el coaching",
  },
  equipo: {
    etiqueta: "Para tu gente",
    regla: "Cada persona hace el suyo",
    titulo: "Coaching para tu equipo",
    linea: "Cada persona de tu empresa aprende sobre su propio trabajo.",
    enlace: "Ver el coaching para equipos",
  },
  consultoria: {
    etiqueta: "Para tu empresa",
    regla: "Lo hacen varias personas de tu equipo",
    titulo: servicios.consultoria,
    linea: "Montamos con ellas los agentes y las automatizaciones de ese proceso.",
    enlace: "Ver la consultoría",
  },
};

// ---------------------------------------------------------------- COACHING

// La página /coaching en el sistema «Campo» (2026-11-12): una idea por
// pantalla y poco texto. Contesta en orden: qué es (cabecera sobre la toma
// de las manos en el teclado), ¿me pasa a mí? (tres razones, una a la vez),
// ¿cómo es una sesión? (tres pasos junto a la ventana de ejemplo), ¿qué me
// llevo?, ¿es para mí? y, si son varios en la empresa, a dónde ir. Lo largo
// (sesiones, pago, herramientas) va en las preguntas, cerradas en el HTML.
export const coaching = {
  portada: {
    // El nombre del servicio es parte del h1 (va como rótulo, sobre el
    // titular): es lo que se busca.
    eyebrow: servicios.coaching,
    titulo: "Para ti.",
    // La primera frase es la de referencia de voz-daxlo.md, literal. La
    // segunda lleva "inteligencia artificial" una vez (SEO; copy.test.ts).
    sub: "Traes un trabajo tuyo que hoy te toma horas y lo dejas funcionando antes de colgar. Lo resuelves tú, con inteligencia artificial.",
    // Bajo el botón: duración, costo, formato y forma de pago. Sin medios de
    // pago: se hablan en la llamada (Santiago, 2026-11-03).
    nota: ["Llamada de 15 minutos sin costo", "Por videollamada", "Pagas por sesión, sin mensualidad"],
  },
  // Tres razones, y los pasos de la sesión las contestan con sus mismas
  // palabras: tu archivo, qué pediste mal y empezar de cero.
  problema: {
    rotulo: "Lo que pasa hoy",
    titulo: "Por qué ese trabajo te sigue tomando horas.",
    escenas: ["Tu archivo no se parece al del tutorial.", "Nadie te dice qué pediste mal.", "Cada lunes empiezas de cero."],
  },
  // El título conserva la búsqueda ("clases de IA 1 a 1") y dice el método
  // que nos distingue: escribes tú.
  sesion: {
    rotulo: "Cómo es una sesión",
    titulo: "Clases de IA 1 a 1 en las que escribes tú.",
    // Maqueta ilustrativa del método, rotulada como ejemplo. No es una
    // conversación real de un cliente. El trabajo es una lista de clientes
    // repartida en varias hojas, con repetidos: le pasa a quien vende, a
    // quien atiende y a quien administra.
    ventana: {
      etiqueta: "Ejemplo",
      titulo: "Tu lista de clientes",
      mensajes: [
        { de: "daxlo", texto: "Escribe tú la instrucción. Te digo dónde se traba." },
        { de: "tu", texto: "Junta estas tres hojas de cálculo en una sola lista de clientes." },
        { de: "daxlo", texto: "Bien. Ahora dile qué hacer cuando un cliente aparece dos veces." },
      ],
      avatar: "Tú",
      placeholder: "Tu siguiente instrucción…",
      ficha: "Instrucciones guardadas para la próxima vez",
    },
    // El límite del primero es regla de voz (copy.test.ts). Sin nombres de
    // herramientas: no son la propuesta de valor.
    pasos: [
      { numero: "01", titulo: "Elegimos el trabajo", texto: "En la llamada vemos con cuál empezar. Si la IA no te sirve, te lo decimos ahí mismo." },
      { numero: "02", titulo: "Escribes tú", texto: "Trabajas sobre tu archivo real y te corregimos en el momento." },
      { numero: "03", titulo: "Te lo llevas", texto: "Sales con el trabajo hecho y las instrucciones para repetirlo." },
    ],
    remate: "Si nadie toca el teclado de tu lado, la sesión no sirve.",
  },
  // Lo que queda después de cada sesión. El resumen de una página sale de la
  // guía interna (§4.2): es parte de lo que recibe quien toma coaching.
  llevas: {
    rotulo: "Lo que te llevas",
    titulo: "De cada sesión sales con algo hecho.",
    lista: [
      { titulo: "El trabajo hecho", linea: "Resuelto en la sesión, sobre tu archivo." },
      { titulo: "Las instrucciones", linea: "Guardadas, para repetirlo sin nosotros." },
      { titulo: "El resumen", linea: "Una página con lo que hiciste y lo que sigue." },
    ],
  },
  // Cuenta quién hace el trabajo. La última línea de "No es para ti si"
  // termina en el enlace a la consultoría (otraLinea.consultoria.enlace).
  paraTi: {
    rotulo: "Para quién",
    titulo: "¿Esto es para ti?",
    es: {
      titulo: "Es para ti si",
      items: ["El trabajo es tuyo y se repite.", "Nunca usaste IA, o la usas y sigues trabajando a mano.", "Quieres aprender a hacerlo tú."],
    },
    noEs: {
      titulo: "No es para ti si",
      items: ["Buscas un curso grabado.", "No vas a practicar entre sesiones.", "Lo hacen varias personas de tu equipo y buscas cambiarlo para todos."],
    },
  },
  // El coaching para las personas de una empresa (la puerta «Para tu gente»
  // del inicio llega aquí, a #equipos). Sin precio ni forma de pago.
  equipos: {
    rotulo: "Para tu gente",
    titulo: "¿Son varios en tu empresa?",
    texto: "Cada persona toma sus sesiones sobre su propio trabajo. Si el trabajo es el mismo para todos, es consultoría.",
  },
};

// ------------------------------------------------------------ HERRAMIENTAS

// La página /herramientas (sistema «Campo», 2026-11-12): con qué trabajamos
// y para qué sirve cada una, en filas; por qué no son de Daxlo (la afirmación
// que se enciende) y las dos puertas. `clase` es el rótulo de cada fila: qué
// tipo de herramienta es.
export const herramientas = {
  badge: "Herramientas",
  titulo: "Te enseñamos las que ya existen.",
  sub: "Como no son nuestras, lo que aprendes o construimos contigo sigue funcionando sin nosotros.",
  subtituloLista: "Para qué sirve cada una",
  lista: [
    { id: "claude", clase: "Modelo", nombre: "Claude", uso: "Leer documentos largos, redactar y pensar con tus propios datos." },
    { id: "chatgpt", clase: "Modelo", nombre: "ChatGPT", uso: "El asistente que ya tienes abierto, con instrucciones que puedes reusar." },
    { id: "claudecode", clase: "Agente", nombre: "Claude Code", uso: "Construir herramientas y automatizaciones pidiéndolas en español." },
    { id: "codex", clase: "Agente", nombre: "Codex", uso: "El agente de OpenAI que escribe y revisa código contigo." },
    { id: "n8n", clase: "Conexiones", nombre: "n8n", uso: "Conectar tus aplicaciones para que los datos se muevan solos." },
    { id: "obsidian", clase: "Conocimiento", nombre: "Obsidian", uso: "Tus notas conectadas, en archivos tuyos que la IA puede leer." },
    { id: "base44", clase: "Aplicaciones", nombre: "Base44", uso: "Crear una aplicación web describiéndola con palabras." },
  ],
  otra: { clase: "Otra", titulo: "¿Usas otra?", texto: "Si sirve para tu caso, también la trabajamos." },
  // Por qué no son de Daxlo: la afirmación que se enciende.
  porque: {
    rotulo: "Por qué no son nuestras",
    texto: "No vendemos una plataforma propia. Lo que aprendes o montamos contigo corre sobre herramientas que ya existen, y sigue funcionando sin nosotros.",
  },
  // Las dos puertas del final.
  puertas: "Dónde las usamos",
  aviso: "Claude y Claude Code son marcas de Anthropic; ChatGPT y Codex, de OpenAI; n8n, Obsidian y Base44, de sus respectivos dueños. Daxlo no está afiliada, patrocinada ni avalada por ninguna de estas empresas: las nombramos para indicar con qué herramientas trabajamos.",
} as const;

// ------------------------------------------------------------- CONSULTORÍA

// La página /consultoria en el sistema «Campo» (2026-11-12): cómo lo
// montamos. Contesta en orden: qué es (cabecera sobre la toma de la mesa),
// ¿me pasa a mí? (tres escenas, una a la vez), ¿cómo lo hacen? (los cuatro
// pasos del método, cada uno con su dibujo), por qué con tu gente (la
// afirmación que se enciende), ¿qué cambia? (hoy y después), ¿y después de la
// entrega?, ¿es para mi empresa? Lo largo (cómo elegimos el primer proceso,
// precio, plazos) va en las preguntas, cerradas en el HTML.
// Ningún ejemplo habla de cotizaciones, de facturas ni del informe del
// viernes (Santiago, 2026-11-12): los procesos de ejemplo son el cierre de
// mes, los pedidos, los reportes y las respuestas a clientes. Sin nombres de
// herramientas en la portada, las escenas, las filas ni los pasos
// (copy.test.ts). La frecuencia de trabajo con el equipo no se dice: falta
// que la confirme Santiago.
export const consultoria = {
  portada: {
    // El nombre del servicio es parte del h1 (va como rótulo, sobre el
    // titular): es lo que se busca.
    eyebrow: servicios.consultoria,
    titulo: "Para tu empresa.",
    // "Inteligencia artificial" va una vez. La última frase es la que aprobó
    // Santiago el 2026-11-03 (copy.test.ts).
    sub: "Encontramos dónde se traba el trabajo, como el cierre de mes o los pedidos. Montamos ahí los agentes y las automatizaciones de inteligencia artificial. Tu equipo lo opera y seguimos contigo con el siguiente proceso.",
    // Bajo el botón, datos. El diagnóstico no se cobra (Santiago, 2026-11-03).
    nota: ["Conversación y diagnóstico sin costo", "Precio cerrado antes de construir"],
  },
  // Tres escenas de organización, sin cifras: dolores de cualquier empresa
  // mediana, uno por cada movimiento del método. El titular es el primer
  // tiempo de la escena del inicio, literal (copy.test.ts).
  problema: {
    rotulo: "Lo que pasa hoy",
    titulo: "Tu gente ya usa IA. Tu empresa trabaja igual.",
    escenas: [
      { titulo: "No ves dónde se traba el trabajo", texto: "Algo se demora y no sabes en qué parte." },
      { titulo: "La información está regada", texto: "Cada área con sus hojas de cálculo. Cerrar el mes es juntarlas a mano." },
      { titulo: "La herramienta llegó y nadie la usa", texto: "Nadie adentro entendió cómo funciona." },
    ],
  },
  // El método, paso por paso, cada uno con lo que te llevas. El h2 lleva la
  // búsqueda ("implementar IA en la empresa"). El diagnóstico es sin costo y
  // el paso 02 empieza así (copy.test.ts). `etapa` es el nombre corto del
  // paso en el índice fijo de la izquierda. `dibujo` son los rótulos del
  // dibujo de cada paso: un mismo proceso genérico de punta a punta (los
  // pedidos), nunca la pantalla de un cliente, sin cifras, con el rótulo de
  // ejemplo a la vista.
  recorrido: {
    rotulo: "Cómo lo montamos",
    titulo: "Así implementamos la IA en tu empresa.",
    pasos: [
      { numero: "01", etapa: "Primera conversación", titulo: "Vemos qué te está costando", texto: "Nos cuentas qué se demora y buscamos lo que hay detrás.", rotulo: "Te llevas", llevas: "Un sí o un no, con la razón." },
      { numero: "02", etapa: "Diagnóstico", titulo: "Elegimos por dónde empezar", texto: "Sin costo. Una semana con quien dirige y con quien hace el trabajo.", rotulo: "Te llevas", llevas: "El primer proceso, quién lo opera y su precio cerrado." },
      { numero: "03", etapa: "Construcción", titulo: "Ordenamos antes de automatizar", texto: "Juntamos lo regado y construimos con tu gente, para que entienda cómo funciona.", rotulo: "Te llevas", llevas: "El proceso funcionando, probado con casos reales." },
      { numero: "04", etapa: "Entrega", titulo: "Tu equipo lo opera", texto: "Entrenamos a quien lo va a operar, primero con nosotros al lado.", rotulo: "Te llevas", llevas: "El proceso en manos de tu equipo. Si quieres, seguimos con el siguiente." },
    ],
    dibujo: {
      etiqueta: "Ejemplo",
      proceso: "Pedidos",
      causas: ["Un cliente que espera", "Un error que se repite"],
      otros: ["Cierre de mes", "Reportes", "Respuestas a clientes"],
      elegido: "Primero",
      regado: ["Correo", "Hojas", "Documentos"],
      reglas: "Reglas escritas",
      borrador: "Borrador",
      equipo: "Tu equipo",
      siguiente: "Siguiente proceso",
    },
  },
  // Por qué construimos con tu gente aunque tome más. Nadie en la competencia
  // admite ese costo.
  afirmacion: {
    rotulo: "Por qué con tu gente",
    texto: "Solos sería más fácil. Pero nadie adentro entendería cómo funciona.",
  },
  // Qué cambia en la empresa, en filas hoy y después, en el orden del método:
  // ordenar, automatizar (el agente deja el borrador y una persona lo
  // aprueba) y acompañar. La sección conserva el ancla #que-automatizamos
  // (redirección #automatizamos, enlaces viejos y pruebas); el pie la enlaza
  // como "Qué cambia en tu empresa".
  cambios: {
    rotulo: "Qué cambia",
    titulo: "Lo que cambia en tu empresa.",
    hoy: "Hoy",
    despues: "Después",
    filas: [
      { hoy: "Las reglas viven en la cabeza de alguien", despues: "Las reglas quedan escritas y la IA las usa" },
      { hoy: "Alguien pasa cada pedido a mano", despues: "El agente deja el borrador y tu equipo lo aprueba" },
      { hoy: "Si algo cambia, esperas al proveedor", despues: "Alguien de tu equipo lo ajusta" },
    ],
  },
  // Después de la entrega (palabras de Santiago del 11-nov: lo montado
  // funciona sin nosotros y seguimos porque el cliente quiere). Sin
  // frecuencia, sin precio y sin llamado a la acción: no es una puerta.
  despues: {
    rotulo: "Después de la entrega",
    titulo: "Después de la entrega, seguimos ahí.",
    lista: [
      { titulo: "Revisión", linea: "Algo cambió en tu operación o en una herramienta, y lo ajustamos contigo." },
      { titulo: "Mejora", linea: "Sale algo que te sirve más, te lo proponemos y tú decides." },
      { titulo: "La forma de trabajar", linea: "Si el equipo volvió a hacerlo a mano, trabajamos con las personas." },
    ],
    nota: "Tú decides si seguimos y con qué.",
  },
  // ¿Es para mi empresa y con quién hablo? La pregunta que filtra (quién lo
  // opera) y a quién no le servimos. La última línea de "No es para tu
  // empresa si" termina en el enlace al coaching (otraLinea.coaching.enlace).
  paraQuien: {
    rotulo: "Para quién",
    titulo: "¿Esto es para tu empresa?",
    cita: "Si el proceso queda funcionando, ¿quién de tu equipo lo va a operar sin nosotros al lado?",
    respuesta: "Necesitamos el nombre de una persona. Si la respuesta es «ustedes lo manejan», ahí te decimos que no.",
    noEs: {
      titulo: "No es para tu empresa si",
      items: ["Quieres recibirlo armado, sin que tu equipo participe.", "Solo buscas un bot que conteste mensajes.", "Lo hace de principio a fin una sola persona."],
    },
  },
};

// ------------------------------------------------------- CÓMO TRABAJAMOS

// La página /nosotros, que desde el 2026-11-11 (Santiago) es "Cómo
// trabajamos": habla de Daxlo y de su forma de trabajar. Con nombre aparece
// solo el fundador, en una línea. En el sistema «Campo» (2026-11-12):
// - El h1 nombra las dos líneas con las palabras del sitio ("te enseñamos"
//   es coaching; "lo montamos contigo", consultoría).
// - `contraste` es la afirmación que se enciende: lo que se ve en el mercado
//   y lo que hacemos nosotros.
// - `frase` es el límite, sobre una toma a sangre.
// - `reglas`: seis reglas de trabajo, cada una con su icono de línea. Salen
//   de la guía interna (§6.5) y del propio sitio.
// - `montado`: lo que queda en la empresa, dibujado como capas apiladas (los
//   rótulos son los de inicio.sistema.capas).
export const nosotros = {
  etiqueta: "Cómo trabajamos",
  titulo: "Te enseñamos o lo montamos contigo.",
  sub: "Daxlo es una consultoría de inteligencia artificial en Colombia. Trabajamos dentro de tu empresa, sobre tu trabajo real: tu archivo, tu proceso, tu gente.",
  contraste: {
    rotulo: "Por qué así",
    texto: "Hay quien te monta un sistema y desaparece. Hay cursos que explican y no cambian nada. Nosotros construimos contigo y te dejamos manejándolo.",
  },
  frase: "Si no te servimos, te lo decimos.",
  reglas: {
    rotulo: "Reglas de trabajo",
    titulo: "Así trabajamos adentro.",
    lista: [
      { titulo: "Reglas por escrito", linea: "Una regla dicha de palabra no se monta." },
      { titulo: "Casos reales", linea: "Probamos con varios casos tuyos antes de automatizar." },
      { titulo: "Borradores", linea: "El sistema deja borradores. Una persona revisa y envía." },
      { titulo: "Una persona a cargo", linea: "Antes de construir, el nombre de quien lo va a operar." },
      { titulo: "Tus datos", linea: "Ningún dato de tu empresa sale sin tu autorización." },
      { titulo: "Decimos que no", linea: "Si el proceso cambia cada mes o solo buscas un bot." },
    ],
  },
  montado: {
    rotulo: "Lo que queda montado",
    titulo: "Un sistema que tu equipo entiende y maneja.",
    enlace: "Ver capa por capa",
  },
  detras: "Quién está detrás",
  fundador: "Daxlo lo fundó Santiago Ospina, en Colombia.",
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
  elegir: { rotulo: string; titulo: string };
  ayuda: string;
  ayudaTexto: string;
  ayudaCta: string;
  grupos: { nombre: string; ancla: string; enlace?: { t: string; h: string }; preguntas: PreguntaFaq[] }[];
} = {
  badge: "Preguntas",
  titulo: "Preguntas frecuentes",
  sub: "Coaching de IA 1 a 1, si el trabajo lo haces tú solo. Consultoría, si lo hacen varias personas de tu equipo.",
  // Antes de las preguntas, cómo elegir: las dos puertas con su regla
  // (dosFormas.*.regla).
  elegir: { rotulo: "Cómo elegir", titulo: "¿Quién hace el trabajo?" },
  ayuda: "¿Te quedó una duda que no está acá?",
  ayudaTexto: "Escríbenos por WhatsApp y te respondemos nosotros.",
  ayudaCta: "Escribir por WhatsApp",
  grupos: [
    {
      // La regla de las dos puertas del inicio (dosFormas.*.regla), con las
      // mismas palabras.
      nombre: "Coaching o consultoría",
      ancla: "elegir",
      preguntas: [
        { p: "¿Te sirve el coaching o la consultoría de IA?", r: "Depende de quién hace el trabajo. Si lo haces tú solo, aunque los documentos te lleguen de otros, es coaching: aprendes a resolverlo tú y pagas por sesión. Si lo hacen varias personas de tu equipo, es consultoría: después de una semana de diagnóstico sin costo, lo construimos con ellos a precio cerrado. Si no lo tienes claro, te lo decimos en la primera conversación." },
      ],
    },
    {
      nombre: servicios.coaching,
      ancla: "coaching",
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
      enlace: { t: dosFormas.consultoria.enlace, h: rutas.consultoria },
      preguntas: [
        // La primera responde la búsqueda y dice quiénes somos, para
        // fragmentos destacados y respuestas de IA. "En Colombia", sin ciudad
        // (Santiago, 2026-11-03). Desde el 2026-11-03 cuenta el mismo método
        // que la página, y es el único lugar donde van el tablero y la
        // información en un solo lugar: como EJEMPLOS de lo que se construye,
        // sin precio ni resultado. El tablero es de ese proceso, no de toda la
        // empresa: un proceso a la vez.
        { p: "¿Qué hace una consultoría de inteligencia artificial?", r: "Te ayuda a decidir en qué proceso de tu empresa la inteligencia artificial cambia el trabajo, y lo deja funcionando con alguien de tu equipo a cargo. En Daxlo primero buscamos dónde se traba el trabajo y elegimos por dónde empezar. Ordenamos la información antes de automatizar y construimos con tu equipo, para que entienda cómo funciona. Lo que construimos depende del caso: por ejemplo, la información de un proceso en un solo lugar conectado a la IA, o un tablero con ese proceso al día. Avanzamos por fases, un proceso a la vez. Daxlo es una consultoría de inteligencia artificial en Colombia, con dos líneas: coaching de IA 1 a 1 para personas y consultoría de implementación para empresas." },
        // "Transformar una empresa con IA" es postura de Daxlo, no un dato. Los
        // procesos son ejemplos genéricos, no de ningún cliente. Ordenar antes
        // de automatizar es el paso 03 (2026-11-03).
        { p: "¿Por dónde empieza una empresa a implementar inteligencia artificial?", r: "Por un solo proceso: uno estable, que se repite igual cada semana y pasa por varias personas. Por ejemplo, el cierre de mes, los pedidos que llegan por correo, los reportes o las respuestas a clientes. Antes de automatizarlo ordenamos su información, que suele estar regada en hojas de cálculo y documentos. Cuando tu equipo ya lo opera, seguimos con otro. Transformar una empresa con IA es eso: cambiar cómo se hace un trabajo concreto y quién lo sostiene, uno a la vez." },
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
        { p: "¿Cómo identifican qué proceso cambiar primero?", r: "Empieza en la primera conversación y se cierra en el diagnóstico de una semana. Detrás de la tarea que se demora miramos lo que de verdad le cuesta a la empresa, como un cliente que espera o un error que se repite. Buscamos hechos, no estimaciones: quién hace el trabajo, cuántas personas lo tocan, dónde vive la información y qué pasa cuando sale mal. Hablamos con quien dirige y con quien hace el trabajo, y comparamos lo que se cuenta en las reuniones con los correos, los PDF y las pantallas reales. Ahí aparecen las excepciones que nadie tiene escritas, como duplicados, datos que faltan o documentos en otra moneda. Va primero el proceso que se repite igual cada semana, tiene reglas que se pueden escribir, pasa por varias personas y le quita tiempo a gente que sabe hacer más." },
        // [DATO FALTANTE: rango de precio aprobado por Santiago, si se quiere
        // publicar uno.] El diagnóstico no se cobra y los medios de pago van
        // en la propuesta (Santiago, 2026-11-03). La propuesta por fases y "si
        // una fase no te cuadra" esperan el OK de Santiago como oferta
        // estándar.
        { p: "¿Cuánto cuesta una consultoría de IA?", r: "Depende del proceso. Antes de construir hay un diagnóstico de una semana, sin costo: dibujamos el proceso, medimos cómo está hoy y cerramos el alcance. De ahí sale una propuesta por fases, cada una con sus semanas, su precio cerrado y la forma de pago. El precio de cada fase solo cambia si cambias su alcance. Si una fase no te cuadra, empezamos por otro lado. Cobramos por lo entregado, no por horas." },
        // Sin frecuencia de reuniones: falta que la confirme Santiago.
        // Las semanas de cada fase van "estimadas": dependen del equipo.
        // Desde el 2026-11-04 dice qué pasa en cada reunión (revisar el avance
        // y pedir la información que falta), que casi nadie cuenta, y por eso
        // se entiende que la velocidad dependa del equipo. No fija una
        // frecuencia nueva.
        { p: "¿Cuánto se demora un proyecto?", r: "El diagnóstico toma una semana. La construcción depende de la velocidad de tu equipo, porque la hacemos con ellos. En cada reunión revisamos cómo vamos hacia la meta y pedimos la información que hace falta. Cada fase trae sus semanas estimadas en la propuesta. Primero entregamos un proceso funcionando y después vamos por el siguiente." },
        { p: "¿Qué pasa cuando ustedes se van?", r: "El proceso lo opera la persona de tu equipo que acordamos contigo antes de construir. No necesita saber programar, solo conocer el proceso. Primero lo opera con nosotros al lado y aprende a hacer los ajustes. Cuando lo maneja sola, ese proceso ya no depende de nosotros. Si quieres, seguimos contigo con el siguiente." },
        { p: "¿El sistema toma decisiones solo?", r: "Únicamente donde lo apruebes. Lo demás queda en borrador para que lo revise alguien de tu equipo. Antes de automatizar una regla la probamos con varios casos reales, porque un error automatizado se repite muchas veces antes de que alguien lo note." },
        // Las 40 horas son una referencia, no un filtro. Es la frase de límite
        // que antes estaba en "¿Esto es para tu empresa?" (copy.test.ts).
        { p: "¿Y si mi proceso no da para un proyecto?", r: "Te lo decimos en la primera conversación y no te proponemos un proyecto. Una referencia: que ese trabajo sume más de 40 horas a la semana entre todas las personas que lo tocan; si nunca lo has medido, un cálculo a ojo sirve. Tampoco lo proponemos si el proceso cambia cada mes o si el problema real es que sobra o falta gente. A veces basta el coaching 1 a 1 para quien hace el trabajo, y a veces se arregla con una fórmula o un filtro de correo." },
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
    interesEjemplo: "Por ejemplo: armo a mano un reporte con datos de tres hojas de cálculo distintas.",
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
      "Responsable: Daxlo (Santiago Ospina). Usamos tus datos solo para lo que autorizas. Se guardan en servicios de Google, Cloudflare y Cal.com y en nuestro sistema interno, con servidores fuera de Colombia. Puedes conocerlos, corregirlos, pedir que los borremos o revocar la autorización cuando quieras; la política explica cómo.",
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

// El pie (2026-11-12): cuatro columnas y, como última línea del sitio, el
// eslogan en letra gigante. La primera columna lleva a las capas del panel
// del inicio (los id `capa-…` de inicio.sistema.capas).
export const footer = {
  lema: "Implementamos la IA. Transferimos la capacidad.",
  columnas: [
    {
      titulo: "El sistema",
      enlaces: [
        { t: "Tus herramientas", h: `${rutas.inicio}#capa-herramientas` },
        { t: "Conexiones", h: `${rutas.inicio}#capa-conexiones` },
        { t: "Conocimiento", h: `${rutas.inicio}#capa-conocimiento` },
        { t: "Agentes", h: `${rutas.inicio}#capa-agentes` },
        { t: "Control y permisos", h: `${rutas.inicio}#capa-control` },
      ],
    },
    {
      titulo: "Consultoría",
      enlaces: [
        { t: "Consultoría de implementación", h: rutas.consultoria },
        // "Cómo trabajamos" es ahora la página /nosotros (columna Daxlo): el
        // ancla del recorrido se nombra por lo que muestra.
        { t: "Los cuatro pasos", h: `${rutas.consultoria}#como-trabajamos` },
        // El texto sigue el tema de la sección (qué cambia en la empresa); el
        // ancla no cambia.
        { t: "Qué cambia en tu empresa", h: `${rutas.consultoria}#que-automatizamos` },
      ],
    },
    {
      titulo: "Coaching",
      enlaces: [
        { t: "Coaching 1 a 1", h: rutas.coaching },
        { t: "Cómo es una sesión", h: `${rutas.coaching}#como-funciona` },
        { t: "Herramientas", h: rutas.herramientas },
      ],
    },
    {
      titulo: "Daxlo",
      enlaces: [
        { t: "Cómo trabajamos", h: rutas.nosotros },
        { t: "Preguntas frecuentes", h: rutas.preguntas },
        { t: "Agendar una conversación", h: rutas.agendar },
      ],
    },
  ],
  contacto: "Contacto",
  derechos: "© 2026 Daxlo. Todos los derechos reservados.",
  privacidad: "Política de tratamiento de datos",
};

// ------------------------------------------------------ ENTRE PÁGINAS

// Puente hacia la otra línea, por si el visitante entró por la puerta
// equivocada: el enlace al final de "No es para… si" en /coaching y
// /consultoria, y bajo la franja para equipos.
export const otraLinea = {
  consultoria: { enlace: "Ver la consultoría para empresas" },
  coaching: { enlace: "Ver el coaching 1 a 1" },
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
  // politica-2026-10-26); 2026-10-26-2 = commit 53fe275. Al publicar, la
  // vigencia es el día de publicación.
  // 2026-11-11: cambia quién responde por los datos (una sola persona detrás
  // del nombre comercial). Lo tiene que confirmar Santiago antes de publicar.
  version: "2026-11-11",
  vigencia: "11 de noviembre de 2026",
  responsable: {
    nombre: "Daxlo, nombre comercial con el que trabaja Santiago Ospina",
    domicilio: "Colombia",
    whatsapp: "+57 320 384 8586",
    atiende: "Daxlo atiende las consultas y reclamos sobre datos personales.",
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
        "Tomamos medidas razonables para proteger tus datos: el sitio funciona solo por conexión cifrada (HTTPS), el acceso a la hoja de cálculo y al sistema interno está limitado al equipo de Daxlo, con verificación en dos pasos, y el formulario no guarda nada en tu navegador.",
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

// ------------------------------------------------------------- INICIO

// El inicio «Campo» (2026-11-12): poco texto y se ve lo que se hace. Sigue,
// sección por sección, el armazón que eligió Santiago: hero sobre fotografía,
// carrusel de áreas, una escena fijada en tres tiempos, una frase sobre foto,
// tres principios, foto con lista, una afirmación que se enciende, el panel
// del sistema, las puertas (dosFormas) y el cierre. El contenido y sus
// fuentes están en data/landing-contenido-armazon-2026-11-12.md del repo de
// marketing.
// - `areas`: una tarjeta por área de la empresa. Son ejemplos de lo que se
//   monta, no casos: van bajo el rótulo fijo "Ejemplos" y ninguna señala a un
//   cliente.
// - `escena`: el primer tiempo es el titular de /consultoria, literal. El
//   segundo explica "agente" una sola vez en el inicio.
// - `frase`: frase de la casa.
// - `principios`: "nativa" va una sola vez en todo el sitio, aquí.
// - `equipo`: las tres formas de estar adentro, sin frecuencia (falta que la
//   confirme Santiago).
// - `sistema`: las seis capas. "Ecosistema" va una sola vez en todo el
//   sitio, como nombre del panel. El panel no nombra marcas: los nombres de
//   herramientas viven en /herramientas. Los `id` son las anclas del pie.
export const inicio = {
  areas: {
    titulo: "Dónde entra la IA en tu empresa.",
    etiqueta: "Ejemplos",
    tarjetas: [
      { area: "Dirección", monta: "Tablero", linea: "El proceso al día y lo que espera tu decisión, en una pantalla." },
      { area: "Comercial", monta: "Agente", linea: "Califica cada contacto nuevo y deja el mensaje en borrador." },
      { area: "Operación", monta: "Automatización", linea: "El pedido que llega por correo queda registrado sin que nadie lo copie." },
      { area: "Administración", monta: "Agente", linea: "Ordena los documentos que llegan y deja listo lo que hay que revisar." },
      { area: "Atención", monta: "Agente", linea: "Deja la respuesta lista. La envía una persona de tu equipo." },
      { area: "Mercadeo", monta: "Agente", linea: "Investiga, escribe el borrador y prepara la pieza. Publica una persona." },
      { area: "Tu gente", monta: "Coaching", linea: "Cada persona aprende sobre su propio trabajo, no con ejemplos de tutorial." },
    ],
    controles: {
      region: "Ejemplos por área de la empresa",
      anterior: "Ejemplo anterior",
      siguiente: "Ejemplo siguiente",
      ir: "Ir al ejemplo",
    },
  },
  escena: {
    rotulo: "Lo que pasa hoy",
    tiempos: [
      "Tu gente ya usa IA. Tu empresa trabaja igual.",
      "Un agente hace la tarea completa. Una persona la aprueba.",
      "Queda un sistema que tu equipo entiende y maneja.",
    ],
    cierre: "Lo montamos contigo. Y seguimos ahí.",
  },
  frase: "Si no puedes operarlo sin nosotros, no terminamos.",
  principios: {
    titulo: "Tres reglas que no negociamos en ningún proyecto.",
    lista: [
      "Tu gente, nativa en IA y al mando.",
      "Los agentes hacen la tarea. Tú decides qué sale.",
      "Lo revisamos y lo mejoramos contigo, cuando lo pidas.",
    ],
  },
  equipo: {
    titulo: "En tu empresa, con tu equipo.",
    filas: [
      { titulo: "El diagnóstico", linea: "Hablamos con quien dirige y con quien hace el trabajo, y lo cruzamos con los documentos." },
      { titulo: "Construimos contigo", linea: "Con tu gente, sobre sus archivos reales. Entiende cada regla porque ayudó a escribirla." },
      { titulo: "Coaching por persona", linea: "Quien lo va a operar practica sobre su propio trabajo hasta manejarlo sin nosotros." },
    ],
    boton: "Cómo trabajamos",
  },
  montado: {
    rotulo: "Lo que queda montado",
    texto: "Dejamos montado un sistema: tus herramientas conectadas, las reglas escritas, agentes que hacen el trabajo repetido y un equipo que sabe manejarlo.",
  },
  sistema: {
    nombre: "Tu ecosistema de IA",
    titulo: "Lo que queda funcionando en tu empresa, capa por capa.",
    capas: [
      { id: "herramientas", rotulo: "Tus herramientas", titulo: "Lo que ya usas, se queda", linea: "Correo, hojas de cálculo, sistema contable. Partimos de ahí, tal como están." },
      { id: "conexiones", rotulo: "Conexiones", titulo: "Los datos se mueven solos", linea: "Automatizaciones que llevan cada dato de una herramienta a otra, sin copiar y pegar." },
      { id: "conocimiento", rotulo: "Conocimiento", titulo: "Las reglas, por fin escritas", linea: "Lo que alguien sabe de memoria queda en un lugar que la IA lee." },
      { id: "agentes", rotulo: "Agentes", titulo: "Hacen la tarea completa", linea: "Leen, arman el borrador y marcan lo que hay que revisar." },
      { id: "modelos", rotulo: "Modelos", titulo: "El modelo que cada tarea pide", linea: "El que mejor resuelva cada tarea. Donde basta una regla fija, no va IA." },
      { id: "control", rotulo: "Control y permisos", titulo: "Tú decides qué sale", linea: "Cada agente con su permiso: leer, dejar borrador o actuar. Aprueba una persona." },
    ],
  },
} as const;
