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
      "Consultoría de inteligencia artificial y coaching de IA 1 a 1 en Colombia. Automatizamos lo que tu equipo hace a mano o te enseñamos a usar IA en lo tuyo.",
  },
  coaching: {
    titulo: "Coaching de IA 1 a 1: clases de ChatGPT y Claude",
    // También es la descripción del servicio en los datos estructurados: por
    // eso es una afirmación y no una pregunta.
    descripcion:
      "Clases de inteligencia artificial 1 a 1 por videollamada: aprendes a usar ChatGPT y Claude en tu propio trabajo, no solo para correos. Pagas por sesión.",
  },
  consultoria: {
    titulo: "Consultoría de IA para empresas en Colombia",
    descripcion:
      "Consultoría de inteligencia artificial para empresas: automatizamos facturas, cotizaciones y datos de PDF que hoy se pasan a mano. Lo opera tu equipo.",
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
      "Cómo son las clases de IA 1 a 1, cuánto cuesta una consultoría de IA, por qué se paga el estudio del proceso y qué pasa cuando terminamos.",
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

export const hero = {
  badge: "Coaching 1 a 1 · Consultoría de implementación",
  // En celular la etiqueta completa ocupaba dos líneas.
  badgeCorto: "Coaching 1 a 1 · Consultoría",
  titulo: ["Implementamos la IA.", "Transferimos la capacidad."],
  sub: "Te enseñamos a resolver tu propio trabajo con IA, o construimos el sistema que lo resuelve dentro de tu empresa. En los dos casos quedas sabiendo cómo funciona.",
  cta: "Agendar una conversación",
  meta: "Primera conversación sin costo",
  // El recuadro del hero escribe estas tareas solo, una tras otra.
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

// Quien no conoce Claude Code ni n8n creía que el sitio era para
// programadores: la segunda frase lo aclara antes de que se vaya.
export const franjaHerramientas = "Con estas herramientas enseñamos y construimos. No necesitas conocerlas para empezar.";

// El hilo del inicio: el dolor (título y sub), las dos formas de salir de ahí
// (tarjetas), cómo elegir (comparación), quiénes somos y el cierre.
// Cada promesa se dice una vez por página: en las tarjetas va lo que no está
// en la tabla de abajo, y al revés.
export const dosFormas = {
  badge: "Coaching y consultoría de IA",
  titulo: "ChatGPT te escribe el correo. Lo demás, a mano.",
  sub: "La inteligencia artificial ya lee facturas en PDF y arma cotizaciones. Si en tu trabajo eso se sigue haciendo a mano, la cotización sale tarde y el cierre de mes se va en días. Hay dos formas de cambiarlo.",
  coaching: {
    etiqueta: "Para ti",
    titulo: servicios.coaching,
    linea: "Clases para usar ChatGPT y Claude en tu propio trabajo.",
    puntos: [
      "Por videollamada, con tus propios archivos",
      "Te corregimos mientras lo haces",
      "Sales de cada sesión con algo resuelto",
      "No es para quien no practica entre sesiones",
    ],
    enlace: "Ver cómo funciona",
  },
  consultoria: {
    etiqueta: "Para tu empresa",
    titulo: servicios.consultoria,
    linea: "Automatizamos lo que tu equipo hace a mano.",
    puntos: [
      "Facturas, cotizaciones y datos de PDF",
      "Lo construimos con quien lo va a usar",
      "Lo que no cuadra lo revisa tu equipo",
      "No es para un trabajo que haces tú solo",
    ],
    enlace: "Ver cómo trabajamos",
  },
};

// La regla del sub decide en segundos; la tabla responde en el orden en que
// pregunta quien compra. Los dos botones de abajo repiten la regla con las
// mismas palabras ("Lo hago… / Lo hacen…"): si se cambia una, se cambian las
// dos, para que nadie entre por la puerta equivocada.
export const comparacion = {
  badge: "Cuál de las dos",
  titulo: "¿Te sirve el coaching o la consultoría de IA?",
  sub: "Si el trabajo lo haces tú solo, es coaching. Si lo hacen varias personas, suma sus horas de la semana. Más de 40, lo que trabaja una persona de tiempo completo, es consultoría. Menos, coaching.",
  filas: [
    { criterio: "Quién lo resuelve", coaching: "Tú, con nosotros en la llamada", consultoria: "Nosotros, con tu equipo al lado" },
    { criterio: "Qué necesitas saber", coaching: "Nada técnico: arrancas desde tu nivel", consultoria: "Nada técnico: entrenamos a tu equipo" },
    { criterio: "Qué te llevas", coaching: "Tu trabajo hecho y tú sabiendo repetirlo", consultoria: "Datos que entran sin que nadie digite" },
    { criterio: "Cuánto toma", coaching: "Puede bastar una sesión", consultoria: "Semanas, un proceso a la vez" },
    { criterio: "Cómo se paga", coaching: "Por sesión, sin matrícula ni mensualidad", consultoria: "Pagas el estudio y, si sigues, precio cerrado" },
    { criterio: "Cuándo tiene sentido", coaching: "Lo repites tú, cada semana o cada mes", consultoria: "Lo repiten varias personas, cada semana" },
  ],
  botones: { coaching: "Lo hago yo solo", consultoria: "Lo hacen varias personas" },
};

// ---------------------------------------------------------------- COACHING

export const coaching = {
  portada: {
    eyebrow: servicios.coaching,
    gigante: ["Para", "ti."],
    sub: "Traes un trabajo tuyo que hoy te toma horas y lo dejas funcionando antes de colgar. Es una clase de inteligencia artificial por videollamada: tú escribes, nosotros corregimos en el momento.",
  },
  // El correo sale una sola vez en la página, aquí en el sub: el título del
  // inicio ya lo usa y repetirlo le quitaba fuerza.
  problema: {
    titulo: "Con el mismo ChatGPT, hay quien ya entrega antes que tú.",
    sub: "No sabe más que tú: aprendió a usarlo con su propio trabajo. Tú lo abres para un correo y lo demás lo sigues haciendo a mano.",
    // Mismo orden que los iconos: claqueta, X, calendario con reloj.
    tarjetas: [
      { titulo: "El tutorial usa un ejemplo limpio", texto: "Tu archivo trae facturas sin NIT y nombres mal escritos. Ahí el video se acaba y vuelves a hacerlo a mano." },
      { titulo: "Nadie te dice qué hiciste mal", texto: "La respuesta sale regular, la arreglas tú y te quedas pensando que la IA no sirve para tu trabajo." },
      { titulo: "Y el cierre de mes vuelve igual", texto: "Copiar del PDF al Excel y armar el informe del mes te sigue tomando las mismas horas que antes." },
    ],
  },
  sesion: {
    titulo: "Clases de IA 1 a 1 sobre tu propio trabajo.",
    texto: "Tú le escribes a ChatGPT o a Claude, otro asistente de IA, en español y sin programar. Nosotros vemos tu pantalla y te corregimos.",
    remate: "Si nadie toca el teclado de tu lado, la sesión no sirve.",
    // Maqueta ilustrativa del método. No es una conversación real de un cliente.
    ventana: "Sesión 2 · Tus facturas",
    plan: [
      { sesion: "Sesión 1", tema: "Cómo pedirle a la IA", estado: "hecha" },
      { sesion: "Sesión 2", tema: "Tus facturas en PDF", estado: "ahora" },
      { sesion: "Sesión 3", tema: "Repetirlo sin nosotros", estado: "sigue" },
    ],
    mensajes: [
      { de: "tu", texto: "Me llegan cuarenta facturas en PDF al mes. Las paso a Excel una por una." },
      { de: "daxlo", texto: "Escribe tú la instrucción. Te digo dónde se traba." },
      { de: "tu", texto: "Lee estas facturas y arma una tabla con NIT, fecha, subtotal e IVA." },
      { de: "daxlo", texto: "Bien. Ahora dile qué hacer cuando una factura no trae el NIT." },
    ],
    placeholder: "Escribe tú la siguiente instrucción…",
  },
  pasos: {
    badge: "Cómo funciona",
    titulo: "Quince minutos, un plan, y a construir.",
    sub: "Pagas por sesión, sin matrícula ni mensualidad.",
    items: [
      { titulo: "Llamada de quince minutos", texto: "Sin costo. Nos cuentas qué se te come las horas y miramos si la IA lo resuelve hoy. Si no, te lo decimos ahí mismo y no te vendemos nada." },
      { titulo: "Definimos con qué arrancas", texto: "Si nunca has usado IA, empiezas por lo básico: cómo pedirle lo que necesitas. Si ya la usas, vamos directo a tu caso. En los dos casos, te decimos cuántas sesiones necesitas." },
      { titulo: "Sales con tu trabajo hecho", texto: "Por ejemplo, la tabla de facturas del mes, armada sin copiar a mano. Y las instrucciones para repetirla tú solo." },
    ],
  },
  paraTi: {
    titulo: "¿Esto es para ti?",
    sub: "Sirve si el trabajo es tuyo y se repite. Practicas con ese mismo trabajo, no con ejercicios aparte. Pero si entre sesiones no abres la herramienta, no avanzas. Preferimos decirlo antes de cobrarte.",
    // Cuenta quién hace el trabajo, no de dónde llegan los documentos: un
    // contador que recibe facturas de sus clientes trabaja solo.
    pregunta: "Piensa en lo que más tiempo te quitó esta semana. ¿Lo haces tú solo o lo hacen varias personas de tu equipo?",
    respuesta: [
      "Si lo haces tú solo, aunque los documentos te lleguen de otros, arrancas con una sesión y decides si sigues.",
      "Si lo hacen varias personas y entre todas suman más de 40 horas semanales, es un proyecto de consultoría. Te lo decimos en la misma llamada.",
    ],
    cta: "Cuéntanos tu caso",
  },
};

// ------------------------------------------------------------ HERRAMIENTAS

export const herramientas = {
  badge: "Herramientas",
  titulo: "Te enseñamos las que ya existen.",
  sub: "Así, lo que aprendes o construimos contigo sigue funcionando sin nosotros.",
  subtituloLista: "Qué hacemos con cada una",
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

export const consultoria = {
  portada: {
    eyebrow: servicios.consultoria,
    gigante: ["Para tu", "empresa."],
    // El criterio de 40 horas va desde la primera frase: es el mismo de
    // "¿Esto es para tu empresa?" más abajo (lo vigila copy.test.ts).
    sub: "Si tu equipo suma más de 40 horas a la semana copiando facturas y datos de PDF a Excel, lo automatizamos con inteligencia artificial. Cuando nos vamos, ellos lo operan.",
  },
  problema: {
    titulo: "Copiar a mano te cuesta más que horas.",
    sub: "La IA ya puede leer una factura y sacar el NIT, la fecha y el valor. En tu empresa, todavía lo hace una persona, una por una.",
    // Mismo orden que los iconos: salida, libro, reloj.
    tarjetas: [
      { titulo: "Todo depende de una sola persona", texto: "Solo ella conoce las excepciones. Si se incapacita o renuncia, las facturas se represan." },
      { titulo: "Licencias pagadas, trabajo a mano", texto: "Compraron ChatGPT para el equipo, o un programa que prometía hacerlo solo. Las facturas y los pedidos se siguen digitando." },
      { titulo: "Son las diez y sigue copiando", texto: "Empezó a las siete a pasar datos del correo a Excel. La cotización que el cliente pidió temprano todavía no sale, y él ya le pidió precio a otro." },
    ],
  },
  fases: {
    badge: "Cómo trabajamos",
    titulo: "Así automatizamos ese trabajo, en tres fases.",
    sub: "Construimos con tu equipo al lado y no nos vamos hasta que ellos lo manejen solos. Salir es parte del contrato.",
    items: [
      {
        numero: "01",
        titulo: "Estudio del proceso",
        texto: "Vemos cómo funciona el proceso de verdad, no como dice el manual. Sin esto no construimos nada.",
        puntos: ["Nos sentamos con quien hace el trabajo", "Buscamos los casos que no cuadran", "Sabes qué se construye y cuánto cuesta"],
      },
      {
        numero: "02",
        titulo: "Construcción",
        // "El sistema" sin explicar sonaba a otro programa más: aquí se dice
        // con qué se arma, igual que en /herramientas.
        texto: "El sistema se arma con herramientas que ya existen, conectadas a lo que tu equipo ya usa, como el correo y las hojas de cálculo. Tu equipo prueba cada parte mientras la armamos.",
        puntos: ["Cobramos por lo entregado, no por horas", "Hecho con tus documentos reales", "Pensado para quedar listo en semanas"],
      },
      {
        numero: "03",
        titulo: "Entrega a tu equipo",
        texto: "Entrenamos a quien lo va a operar. No necesita saber programar, solo conocer el proceso.",
        puntos: ["Primero lo opera con nosotros al lado", "Aprende a hacer los ajustes", "Salimos cuando lo maneja sin nosotros"],
      },
    ],
  },
  automatizamos: {
    badge: "Qué automatizamos",
    titulo: "Facturas, cotizaciones y datos de PDF.",
    sub: "Si alguien de tu equipo pasa datos de un documento a otro cada semana, hay algo que automatizar.",
    // Ejemplo ilustrativo: los campos no son de ningún cliente.
    lienzo: "Ejemplo: una factura por correo",
    nodos: [
      { id: "correo", titulo: "Llega un correo", detalle: "Con la factura adjunta" },
      { id: "leer", titulo: "Lee el adjunto", detalle: "PDF, Excel o foto" },
      { id: "extraer", titulo: "Extrae los datos", detalle: "NIT, fecha, valor, pedido" },
      { id: "validar", titulo: "Revisa que cuadre", detalle: "Con el pedido y tus reglas" },
      { id: "hoja", titulo: "Lo pasa a tu hoja", detalle: "Si todo cuadra" },
      { id: "borrador", titulo: "Lo deja en borrador", detalle: "Si algo no cuadra" },
    ],
    nota: "Aquí nadie copia: lo que cuadra pasa solo a la hoja, y lo que no queda en borrador para que alguien de tu equipo lo revise.",
    procesos: [
      "Facturas de proveedor que llegan por correo",
      "Cotizaciones que se arman a mano",
      "Pedidos que alguien pasa del correo a Excel",
      "Extracción de datos de PDF",
      "Conciliación de facturas contra pedidos",
      "Reportes que alguien arma cada semana",
      "Datos que se copian a mano de portales",
      "Revisión de documentos contra tus reglas",
    ],
  },
  califica: {
    titulo: "¿Esto es para tu empresa?",
    sub: "Un proyecto de automatización se justifica cuando un solo proceso ocupa, entre todos, a una persona de tiempo completo. Si es menos, te sirve más el coaching, y te lo decimos.",
    pregunta: "Piensa en un solo proceso. Sumando a todos, del que lo recibe al que lo revisa, ¿cuántas horas a la semana se lleva?",
    respuesta: [
      "Si pasa de 40 horas semanales, hay un proyecto. Si nunca lo has medido, un cálculo a ojo sirve para empezar.",
      "Si no llega, te lo decimos en la primera conversación y no te cotizamos nada. Para ese caso está el coaching: clases 1 a 1 para la persona que hace el trabajo.",
    ],
    cta: "Cuéntanos tu proceso",
  },
  porQue: {
    titulo: "¿Por qué dos socios y no una agencia?",
    admision: "Somos dos personas y no somos los más baratos. Lo que entregamos queda funcionando.",
    items: [
      { titulo: "Tu equipo queda a cargo", texto: "Si algo cambia, tu gente sabe ajustar el sistema. No vendemos dependencia." },
      { titulo: "Cobramos el estudio", texto: "Así no tenemos que venderte un proyecto para cobrar. Si no se justifica, te lo decimos." },
      { titulo: "Precio cerrado por el sistema", texto: "Sabes cuánto cuesta antes de arrancar. Si lo que se construye no cambia, el precio tampoco." },
      { titulo: "Los dos socios, en cada proyecto", texto: "Martín Zárate y Santiago Ospina, aquí en Colombia. Ningún practicante aprende con tu operación." },
    ],
  },
};

// ---------------------------------------------------------------- CIERRE

export const nosotros = {
  badge: "Quiénes somos",
  titulo: "Dos socios que construyen.",
  parrafos: [
    "Somos Martín Zárate y Santiago Ospina, egresados de Administración del CESA. Usamos IA todos los días para leer datos, automatizar procesos y armar sistemas que hacen solos lo que antes tomaba horas.",
    "Fundamos Daxlo por algo que vimos repetido: las empresas compran IA y quedan con un sistema que no entienden, o con un equipo que entendió la teoría y no cambió nada.",
    // El inicio muestra solo este párrafo: tiene que entenderse sin los dos
    // de arriba.
    "Hay quien te vende un programa y desaparece. Nosotros construimos dentro de tu empresa, aquí en Colombia, con tu gente al lado, y no cerramos un proyecto hasta que alguien de tu equipo pueda sostenerlo sin nosotros.",
  ],
  firma: "En todo lo que sale de Daxlo estamos los dos.",
};

export const faq = {
  badge: "Preguntas",
  titulo: "Preguntas frecuentes",
  ayuda: "¿Te quedó una duda que no está acá?",
  ayudaTexto: "Escríbenos por WhatsApp y te respondemos nosotros.",
  ayudaCta: "Escribir por WhatsApp",
  grupos: [
    {
      nombre: servicios.coaching,
      tono: "cyan",
      preguntas: [
        { p: "¿Necesito saber programar?", r: "No. Si sabes escribir un correo, sabes darle instrucciones a ChatGPT o a Claude. Arrancamos desde tu nivel." },
        { p: "¿Cómo son las clases de IA 1 a 1?", r: "Por videollamada, uno a uno, compartiendo tu pantalla. Trabajas sobre algo tuyo y sales con eso avanzado." },
        { p: "¿Cuántas sesiones necesito?", r: "Depende del trabajo: a veces basta una, a veces es un plan de varias semanas. Lo definimos en la llamada de quince minutos." },
        { p: "¿Qué herramientas aprendo a usar?", r: "ChatGPT, Claude y las que te sirvan para automatizar tareas, analizar datos, hacer contenido o páginas web. Si ya usas otra, también." },
        { p: "¿Cómo se paga?", r: "Por sesión, sin matrícula. Con Nequi, Daviplata, transferencia o tarjeta." },
      ],
    },
    {
      nombre: servicios.consultoria,
      tono: "blue",
      preguntas: [
        // [DATO FALTANTE: rango de precio aprobado por Santiago, si se quiere publicar uno.]
        { p: "¿Cuánto cuesta una consultoría de IA?", r: "Depende del proceso. El precio sale del estudio y queda cerrado antes de construir. Solo cambia si cambias el encargo." },
        { p: "¿Por qué se paga el estudio del proceso?", r: "Porque es trabajo: de ahí salen qué se construye y cuánto cuesta. La primera conversación, antes del estudio, es sin costo." },
        { p: "¿Cuánto se demora un proyecto?", r: "Semanas. Entregamos primero un proceso funcionando y después ampliamos." },
        { p: "¿Qué pasa cuando ustedes se van?", r: "Tu equipo opera el sistema. Lo construimos con ellos al lado para que sepan ajustarlo, y acompañamos mientras haga falta." },
        { p: "¿El sistema toma decisiones solo?", r: "Únicamente donde lo apruebes. Lo que no cuadra queda en borrador, y contigo definimos qué más revisa una persona antes de que salga." },
        { p: "¿Y si mi proceso no da para un proyecto?", r: "Te lo decimos en la primera conversación y no te cotizamos nada. En ese caso el coaching 1 a 1 suele resolver más por menos." },
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
        { t: "Qué automatizamos", h: `${rutas.consultoria}#que-automatizamos` },
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

// Al final de cada línea, un puente hacia la otra por si el visitante entró
// por la puerta equivocada.
export const otraLinea = {
  consultoria: {
    etiqueta: "Para tu empresa",
    titulo: "¿El trabajo lo hacen varias personas?",
    texto: "Si entre todas suman más de 40 horas semanales, es un proyecto de consultoría: lo construimos con tu equipo.",
    enlace: "Ver la consultoría de implementación",
  },
  coaching: {
    etiqueta: "Para ti",
    titulo: "¿Es un trabajo que haces tú solo?",
    texto: "Aprendes a resolverlo tú con ChatGPT o Claude, en sesiones 1 a 1. Pagas por sesión.",
    enlace: "Ver el coaching 1 a 1",
  },
};

export const preguntasLinea = {
  coaching: { titulo: "Preguntas sobre el coaching", grupo: 0 },
  consultoria: { titulo: "Preguntas sobre la consultoría", grupo: 1 },
  todas: "Ver todas las preguntas",
};

// Cierre de cada página: la invitación a agendar.
export const cierre = {
  titulo: "Cuéntanos qué te está consumiendo horas.",
  sub: "Primera conversación sin costo. Si no te servimos, te lo decimos.",
  cta: "Agendar una conversación",
};

export const inicioNosotros = {
  enlace: "Conoce a Martín y Santiago",
};

export const franjaEnlace = "Para qué sirve cada una";

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
