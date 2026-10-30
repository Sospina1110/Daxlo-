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
      "Coaching 1 a 1 para resolver tu trabajo con inteligencia artificial y consultoría para automatizar un proceso de tu empresa. Quedas sabiendo cómo funciona.",
  },
  coaching: {
    titulo: "Coaching de IA 1 a 1 con ChatGPT y Claude",
    descripcion:
      "Sesiones por videollamada sobre tu propio trabajo. Construyes tú con Claude, ChatGPT y otras herramientas, y corregimos en el momento. Pagas por sesión.",
  },
  consultoria: {
    titulo: "Consultoría de IA para empresas en Colombia",
    descripcion:
      "Automatizamos procesos que tu equipo hace a mano: facturas que llegan por correo, cotizaciones, datos de PDF. Precio cerrado y tu equipo queda operándolos.",
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
      "Cómo son las sesiones de coaching de IA, cuánto cuesta un proyecto de consultoría, por qué el discovery se paga y qué pasa cuando terminamos.",
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

export const franjaHerramientas = "Enseñamos y construimos con";

// Cada promesa se dice una vez por página: en las tarjetas va lo que no está
// en la tabla de abajo, y al revés.
export const dosFormas = {
  badge: "Coaching y consultoría de IA",
  titulo: "Para ti o para tu empresa.",
  sub: "Tu propio trabajo y un proceso de varias personas piden cosas distintas. Hacemos las dos.",
  coaching: {
    etiqueta: "Para ti",
    titulo: servicios.coaching,
    linea: "Construyes tú, con nosotros en la llamada.",
    puntos: [
      "Sobre tu propio archivo",
      "Sales de cada sesión con algo hecho",
      "Desde cero o desde donde ya estés",
      "No es para quien no practica entre sesiones",
    ],
    enlace: "Ver cómo funciona",
  },
  consultoria: {
    etiqueta: "Para tu empresa",
    titulo: servicios.consultoria,
    linea: "Construimos el sistema con tu equipo al lado.",
    puntos: [
      "Facturas, cotizaciones y datos de PDF",
      "Discovery pagado antes de escribir código",
      "Tu equipo queda operándolo",
      "No es para un trabajo que haces tú solo",
    ],
    enlace: "Ver cómo trabajamos",
  },
};

export const comparacion = {
  badge: "Cuál de las dos",
  titulo: "Quién construye y sobre qué.",
  sub: "La diferencia está en quién construye y sobre qué trabaja.",
  filas: [
    { criterio: "Quién construye", coaching: "Tú, con nosotros en la llamada", consultoria: "Nosotros, con tu equipo al lado" },
    { criterio: "Sobre qué se trabaja", coaching: "Un trabajo que hoy haces tú solo", consultoria: "Un proceso que repiten varias personas" },
    { criterio: "Qué queda al final", coaching: "Tu trabajo hecho y tú sabiendo repetirlo", consultoria: "Un sistema corriendo dentro de tu empresa" },
    { criterio: "Quién paga y cómo", coaching: "Tú, por sesión, sin matrícula", consultoria: "La empresa, con precio cerrado" },
    { criterio: "Cuánto toma", coaching: "Puede bastar una sesión", consultoria: "Semanas, en tres fases" },
    { criterio: "Cuándo tiene sentido", coaching: "El trabajo lo haces y lo cambias tú", consultoria: "El proceso suma más de 40 horas semanales" },
  ],
};

// ---------------------------------------------------------------- COACHING

export const coaching = {
  portada: {
    eyebrow: servicios.coaching,
    gigante: ["Para", "ti."],
    sub: "Traes un trabajo tuyo que hoy te toma horas y lo dejas funcionando antes de colgar. Tú escribes, nosotros corregimos en el momento.",
  },
  problema: {
    titulo: "Abriste ChatGPT, te funcionó una vez y ahí quedó.",
    sub: "Información sobra. Está toda en internet, y gratis.",
    tarjetas: [
      { titulo: "El tutorial se rompe en tu excepción", texto: "El video resuelve un ejemplo limpio. Tu archivo tiene excepciones y ahí se acaba." },
      { titulo: "Nadie te corrige mientras lo haces", texto: "Sale algo aceptable y lo dejas ahí, sin saber por qué sirvió." },
      { titulo: "Y el viernes vuelve", texto: "Redactas correos más rápido. El informe del viernes lo sigues escribiendo desde cero." },
    ],
  },
  sesion: {
    titulo: "Construyes tú. Nosotros estamos en la llamada.",
    texto: "Sobre lo tuyo: el informe del viernes, la propuesta pendiente, el archivo que no cuadra.",
    remate: "Si nadie toca el teclado de tu lado, la sesión no sirve.",
    // Maqueta ilustrativa del método. No es una conversación real de un cliente.
    ventana: "Sesión 2 · Tu caso",
    plan: [
      { sesion: "Sesión 1", tema: "Fundamentos", estado: "hecha" },
      { sesion: "Sesión 2", tema: "El informe del viernes", estado: "ahora" },
      { sesion: "Sesión 3", tema: "Dejarlo automático", estado: "sigue" },
    ],
    mensajes: [
      { de: "tu", texto: "Tengo treinta PDF de ventas. Quiero la tabla del viernes sin copiar nada a mano." },
      { de: "daxlo", texto: "Escribe tú la instrucción. Te digo dónde se traba." },
      { de: "tu", texto: "Lee los treinta archivos y arma una tabla por vendedor y por semana." },
      { de: "daxlo", texto: "Bien. Ahora dile qué hacer con las filas que no traen fecha." },
    ],
    placeholder: "Escribe tú la siguiente instrucción…",
  },
  pasos: {
    badge: "Cómo funciona",
    titulo: "Quince minutos, un plan, y a construir.",
    sub: "Pagas por sesión, sin matrícula ni mensualidad.",
    items: [
      { titulo: "Llamada de quince minutos", texto: "Nos cuentas en qué se te va la semana. Miramos si eso se resuelve con IA hoy y con qué herramienta. Si no se resuelve, te lo decimos ahí mismo y no te vendemos nada." },
      { titulo: "Definimos con qué arrancas", texto: "Si nunca has usado IA, empiezas por fundamentos. Si ya la usas, vamos directo a tu caso." },
      { titulo: "Sesiones donde construyes", texto: "Sales con una parte funcionando y las instrucciones para repetirlo el lunes." },
    ],
  },
  paraTi: {
    titulo: "¿Esto es para ti?",
    sub: "El coaching sirve cuando el trabajo lo haces tú y lo vas a repetir. Si entre sesión y sesión no vuelves a abrir la herramienta, no avanzas. Preferimos decirlo antes de cobrarte.",
    pregunta: "Piensa en lo que más tiempo te quitó esta semana. ¿Lo haces tú solo o pasa por otras personas?",
    respuesta: [
      "Si lo haces tú solo, arrancas con una sesión y decides si sigues.",
      "Si pasa por varias manos y entre todas se van más de 40 horas semanales, eso es un proyecto de consultoría. Te lo decimos en la misma llamada.",
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
    sub: "Un proceso que repiten varias personas y se lleva más de cuarenta horas a la semana. Lo construimos con tu equipo al lado y ellos quedan operándolo.",
  },
  problema: {
    titulo: "Agencia o curso, el proceso sigue igual.",
    sub: "Hay dos formas de comprar IA hoy. Las dos terminan así.",
    tarjetas: [
      { titulo: "Las agencias construyen y se van", texto: "Cuando algo cambia, nadie adentro sabe tocar el sistema y dependes del proveedor." },
      { titulo: "Los cursos explican y desaparecen", texto: "Tu equipo entiende el concepto, pero nunca construyó nada con tus datos." },
      { titulo: "Y el proceso sigue ahí", texto: "Alguien se sienta a las siete a pasar datos del correo a la hoja de cálculo. Termina a las diez. Mañana, lo mismo." },
    ],
  },
  fases: {
    badge: "Cómo trabajamos",
    titulo: "Construimos al lado de tu equipo. Y les transferimos la operación antes de salir.",
    sub: "Salir es parte del contrato.",
    items: [
      {
        numero: "01",
        titulo: "Discovery pagado",
        texto: "Vemos el proceso como funciona de verdad, no como dice el manual. Sin esto no escribimos código.",
        puntos: ["Levantamos el proceso con quien lo hace", "Contrastamos las reglas contra tus datos", "Sale con alcance y precio cerrado"],
      },
      {
        numero: "02",
        titulo: "Construcción",
        texto: "Tu equipo participa. Cuando el sistema está listo, ya lo conoce.",
        puntos: ["Cobramos por lo entregado, no por horas", "Alcance diseñado para caber en semanas", "Lo construimos con tus datos reales"],
      },
      {
        numero: "03",
        titulo: "Traspaso y operación",
        texto: "Tu equipo opera el sistema. Acompañamos mientras haga falta.",
        puntos: ["Entrenamos a quien lo va a operar", "Ajustamos lo que el uso real pida", "Salimos cuando tu equipo lo sostiene solo"],
      },
    ],
  },
  automatizamos: {
    badge: "Qué automatizamos",
    titulo: "Facturas, cotizaciones y datos de PDF.",
    sub: "Si alguien los copia a mano cada semana, hay algo que automatizar.",
    lienzo: "Flujo de ejemplo",
    nodos: [
      { id: "correo", titulo: "Correo nuevo", detalle: "Llega un adjunto" },
      { id: "leer", titulo: "Leer adjunto", detalle: "PDF, Excel o imagen" },
      { id: "extraer", titulo: "Extraer datos", detalle: "Campos que definimos juntos" },
      { id: "validar", titulo: "Validar reglas", detalle: "Las reglas de tu negocio" },
      { id: "hoja", titulo: "Escribir en la hoja", detalle: "Si todo cuadra" },
      { id: "borrador", titulo: "Borrador para revisar", detalle: "Si algo no cuadra" },
    ],
    nota: "El sistema deja borradores. Una persona los revisa antes de que algo salga.",
    procesos: [
      "Facturas de proveedor que llegan por correo",
      "Cotizaciones que se arman a mano",
      "Copiar datos del correo a una hoja",
      "Extracción de datos de PDF",
      "Conciliación de documentos",
      "Reportes que alguien arma cada semana",
      "Consulta de portales y captura de datos",
      "Validación de reglas de negocio",
    ],
  },
  califica: {
    titulo: "¿Esto es para tu empresa?",
    sub: "Un proyecto de implementación se justifica cuando el proceso consume cerca de una persona de tiempo completo. Por debajo de eso te sirve más el coaching, y te lo decimos.",
    pregunta: "Entre todos los que lo tocan, ¿cuántas horas a la semana se lleva el proceso?",
    respuesta: [
      "Si la respuesta pasa de 40 horas semanales, hay un proyecto.",
      "Si no llegas, te lo decimos en la primera conversación y no te cotizamos nada.",
    ],
    cta: "Cuéntanos tu proceso",
  },
  porQue: {
    titulo: "¿Por qué dos socios y no una agencia?",
    admision: "Somos dos personas y no somos los más baratos. Lo que entregamos queda funcionando.",
    items: [
      { titulo: "Te transferimos la operación", texto: "Tu equipo queda capaz de mantener y ajustar el sistema. No vendemos dependencia." },
      { titulo: "Discovery pagado, no diagnóstico gratis", texto: "Cobramos desde la primera hora porque el levantamiento es el trabajo, no la venta. Si el proyecto no se justifica, te lo decimos." },
      { titulo: "Precio cerrado por el sistema", texto: "Sabes cuánto cuesta antes de arrancar. Si el alcance no cambia, el precio tampoco." },
      { titulo: "Los dos socios, en cada proyecto", texto: "Martín y Santiago, juntos en cada proyecto. Ningún junior aprende con tu operación." },
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
    "Por eso trabajamos al revés. Construimos adentro, con tu gente al lado, y no cerramos un proyecto hasta que alguien de tu equipo pueda sostenerlo sin nosotros.",
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
        { p: "¿Necesito saber de tecnología?", r: "No. Arrancamos desde tu nivel y con tus propios casos." },
        { p: "¿Cómo son las sesiones?", r: "Por videollamada, uno a uno. Trabajas sobre algo tuyo y sales con eso avanzado." },
        { p: "¿Cuántas sesiones necesito?", r: "Una sola o un plan de varias semanas. Lo definimos en la primera conversación." },
        { p: "¿Puedo elegir cualquier tema?", r: "Sí. Claude, ChatGPT, automatizaciones, análisis de datos, contenido o páginas web. Si tu tema no está en la lista, también." },
        { p: "¿Cómo se paga?", r: "Nequi, Daviplata, transferencia o tarjeta." },
      ],
    },
    {
      nombre: servicios.consultoria,
      tono: "blue",
      preguntas: [
        // [DATO FALTANTE: rango de precio aprobado por Santiago, si se quiere publicar uno.]
        { p: "¿Cuánto cuesta un proyecto?", r: "Depende del proceso. Cerramos el precio en el discovery y no se mueve mientras el alcance siga igual. Si cambia, lo cotizamos antes." },
        { p: "¿Por qué el discovery se paga?", r: "Porque es trabajo. Encontramos dónde el manual no coincide con tus datos. De ahí salen el alcance y el precio." },
        { p: "¿Cuánto se demora un proyecto?", r: "Semanas. Entregamos un proceso funcionando y después ampliamos." },
        { p: "¿Qué pasa cuando ustedes se van?", r: "Tu equipo opera el sistema. Para eso lo construimos con ellos al lado, y acompañamos mientras haga falta." },
        { p: "¿El sistema toma decisiones solo?", r: "Solo si tiene sentido. Contigo definimos qué revisa una persona antes de que algo salga." },
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
    titulo: "¿El trabajo pasa por varias personas?",
    texto: "Si entre todos se van más de 40 horas semanales, es un proyecto de consultoría.",
    enlace: "Ver la consultoría de implementación",
  },
  coaching: {
    etiqueta: "Para ti",
    titulo: "¿Es un trabajo que haces tú solo?",
    texto: "Construyes tú, con nosotros en la llamada, y pagas por sesión.",
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
  enlace: "Conoce a los dos socios",
};

export const franjaEnlace = "Qué hacemos con cada una";

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
