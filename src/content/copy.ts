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

// Título y descripción de cada página para buscadores y para cuando se
// comparte el enlace. El título de cada página lleva " · Daxlo" al final.
export const paginas = {
  inicio: {
    titulo: "Daxlo · Coaching de IA 1 a 1 y consultoría de implementación",
    descripcion:
      "Coaching 1 a 1 para resolver tu propio trabajo con IA y consultoría para automatizar un proceso de tu empresa. En los dos casos quedas sabiendo cómo funciona.",
  },
  coaching: {
    titulo: "Coaching de IA 1 a 1",
    descripcion:
      "Sesiones por videollamada sobre tu propio trabajo. Construyes tú con Claude, ChatGPT y otras herramientas, y corregimos en el momento. Pagas por sesión.",
  },
  consultoria: {
    titulo: "Consultoría de implementación de IA",
    descripcion:
      "Automatizamos procesos documentales de alto volumen con tu equipo al lado. Discovery pagado, precio cerrado por el sistema y la operación queda en manos de tu equipo.",
  },
  herramientas: {
    titulo: "Herramientas de IA que enseñamos",
    descripcion:
      "Claude, ChatGPT, Claude Code, Codex, n8n, Obsidian y Base44. Qué hacemos con cada una en el coaching y en los proyectos de consultoría.",
  },
  nosotros: {
    titulo: "Quiénes somos",
    descripcion:
      "Martín Zárate y Santiago Ospina, socios de Daxlo. Construimos sistemas de IA adentro de las empresas y no cerramos un proyecto hasta que tu equipo pueda sostenerlo.",
  },
  preguntas: {
    titulo: "Preguntas frecuentes",
    descripcion:
      "Cómo son las sesiones de coaching, cuánto cuesta un proyecto de consultoría, por qué el discovery se paga y qué pasa cuando terminamos.",
  },
  agendar: {
    titulo: "Agendar una conversación",
    descripcion:
      "Cuéntanos qué te está consumiendo horas. La primera conversación no tiene costo y en ella te decimos si te sirve el coaching, la consultoría o ninguna de las dos.",
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

export const dosFormas = {
  badge: "Dos formas de trabajar",
  titulo: "Empieza por donde estás.",
  sub: "Una persona que quiere resolver su propio trabajo necesita algo distinto de una empresa con un proceso que consume horas. Hacemos las dos, y no son la misma conversación.",
  coaching: {
    etiqueta: "Para ti",
    titulo: "Coaching 1 a 1",
    linea: "Construyes tú, con nosotros en la llamada. Sales con el trabajo hecho.",
    puntos: [
      "Trabajas sobre tu propio archivo, no un ejemplo",
      "Sales de cada sesión con algo hecho",
      "Pagas por sesión, sin matrícula",
      "Desde cero o desde donde ya estés",
    ],
    enlace: "Ver cómo funciona",
  },
  consultoria: {
    etiqueta: "Para tu empresa",
    titulo: "Consultoría de implementación",
    linea: "Construimos el sistema con tu equipo al lado. Ellos quedan operándolo.",
    puntos: [
      "Procesos que repiten varias personas",
      "Discovery pagado antes de escribir código",
      "Precio cerrado por el sistema, no por horas",
      "Tu equipo queda operándolo",
    ],
    enlace: "Ver cómo trabajamos",
  },
};

export const comparacion = {
  badge: "Cuál de las dos",
  titulo: "Quién construye y sobre qué.",
  sub: "Desde afuera las dos suenan parecido. Se separan por quién construye y sobre qué trabaja. El resto sale de ahí.",
  filas: [
    { criterio: "Quién construye", coaching: "Tú, con nosotros en la llamada", consultoria: "Nosotros, con tu equipo al lado" },
    { criterio: "Sobre qué se trabaja", coaching: "Un trabajo que hoy haces tú solo", consultoria: "Un proceso de tu empresa que repiten varias personas" },
    { criterio: "Qué queda al final", coaching: "Tu trabajo hecho y tú sabiendo repetirlo", consultoria: "Un sistema corriendo y tu equipo operándolo" },
    { criterio: "Quién paga y cómo", coaching: "Tú, por sesión, sin matrícula ni mensualidad", consultoria: "La empresa: discovery pagado y precio cerrado por el sistema" },
    { criterio: "Cuánto toma", coaching: "Una sesión puede bastar. Si el objetivo pide más, seguimos", consultoria: "Semanas, repartidas en tres fases" },
    { criterio: "Cuándo tiene sentido", coaching: "El trabajo cabe en tu semana y lo puedes cambiar tú", consultoria: "Entre todos los que lo tocan se van más de 40 horas semanales" },
  ],
};

// ---------------------------------------------------------------- COACHING

export const coaching = {
  portada: {
    eyebrow: "Coaching 1 a 1",
    gigante: ["Para", "ti."],
    sub: "Traes un trabajo tuyo que hoy te toma horas y lo dejas funcionando antes de colgar. Tú escribes, nosotros corregimos en el momento.",
  },
  problema: {
    titulo: "Abriste ChatGPT, te funcionó una vez y ahí quedó.",
    sub: "Lo que te falta no es información. Está toda en internet, y gratis.",
    tarjetas: [
      { titulo: "El tutorial se rompe en tu excepción", texto: "Miras a alguien resolver un ejemplo limpio en diez minutos. Tu archivo real tiene excepciones, y ahí el video se acaba." },
      { titulo: "Nadie te corrige mientras lo haces", texto: "Escribes una instrucción, sale algo aceptable y lo dejas ahí. Dos horas después tienes un resultado y ninguna explicación de por qué sirvió." },
      { titulo: "Y el viernes vuelve", texto: "Usas la herramienta para redactar correos más rápido. El informe que te ocupa el viernes lo sigues escribiendo desde cero." },
    ],
  },
  sesion: {
    titulo: "Aquí construyes tú. Nosotros estamos en la llamada mientras lo haces.",
    texto: "Traes un trabajo tuyo que hoy te toma horas. El informe del viernes, la propuesta que no has escrito, el archivo que no cuadra. Lo dejas funcionando antes de colgar.",
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
    sub: "Pagas por sesión. No hay matrícula ni mensualidad.",
    items: [
      { titulo: "Llamada de quince minutos", texto: "Nos cuentas en qué se te va la semana. Miramos si eso se resuelve con IA hoy y con qué herramienta. Si no se resuelve, te lo decimos ahí mismo y no te vendemos nada." },
      { titulo: "Definimos con qué arrancas", texto: "Acordamos el caso y el orden de las sesiones. Si nunca has usado IA, la primera es de fundamentos. Si ya la usas todos los días, arrancamos directo en tu caso." },
      { titulo: "Sesiones donde construyes", texto: "Pantalla compartida, sobre tu propio archivo. Escribes tú y corregimos en el momento. Sales con una parte funcionando y con las instrucciones para repetirlo el lunes." },
    ],
  },
  paraTi: {
    titulo: "¿Esto es para ti?",
    sub: "El coaching sirve cuando el trabajo lo haces tú y lo vas a repetir. Si entre sesión y sesión no vuelves a abrir la herramienta, no avanzas. Preferimos decirlo antes de cobrarte.",
    pregunta: "Piensa en el trabajo que más tiempo te quitó esta semana. ¿Lo haces tú de principio a fin, o pasa por otras personas antes de quedar listo?",
    respuesta: [
      "Si lo haces tú de principio a fin, arrancas con una sesión y decides después si sigues.",
      "Si pasa por varias manos y entre todas se van más de 40 horas semanales, eso es un proyecto de consultoría. Te lo decimos en la misma llamada.",
    ],
    cta: "Agendar mi llamada",
  },
};

// ------------------------------------------------------------ HERRAMIENTAS

export const herramientas = {
  badge: "Herramientas",
  titulo: "Te enseñamos las que ya existen.",
  sub: "Trabajamos con herramientas que ya están en el mercado. Así, lo que aprendes o lo que construimos contigo sigue funcionando sin nosotros.",
  subtituloLista: "Qué hacemos con cada una",
  lista: [
    { id: "claude", nombre: "Claude", uso: "Leer documentos largos, redactar y pensar con tus propios datos." },
    { id: "chatgpt", nombre: "ChatGPT", uso: "El asistente que ya tienes abierto, usado con método y no a la suerte." },
    { id: "claudecode", nombre: "Claude Code", uso: "Construir herramientas y automatizaciones pidiéndolas en español." },
    { id: "codex", nombre: "Codex", uso: "El agente de OpenAI que escribe y revisa código contigo." },
    { id: "n8n", nombre: "n8n", uso: "Conectar tus aplicaciones para que los datos se muevan solos." },
    { id: "obsidian", nombre: "Obsidian", uso: "Tus notas conectadas, en archivos tuyos que la IA puede leer." },
    { id: "base44", nombre: "Base44", uso: "Crear una aplicación web describiéndola con palabras." },
  ],
  otra: { titulo: "¿Usas otra?", texto: "También la trabajamos. Lo que importa es tu caso, no la marca." },
  aviso: "Los nombres y logos de las herramientas pertenecen a sus dueños.",
} as const;

// ------------------------------------------------------------- CONSULTORÍA

export const consultoria = {
  portada: {
    eyebrow: "Consultoría de implementación",
    gigante: ["Para tu", "empresa."],
    sub: "Un proceso que repiten varias personas y se lleva más de cuarenta horas a la semana. Lo construimos con tu equipo al lado y ellos quedan operándolo.",
  },
  problema: {
    titulo: "El mercado te deja a mitad de camino.",
    sub: "Hay dos formas de comprar IA hoy, y las dos terminan igual.",
    tarjetas: [
      { titulo: "Las agencias construyen y se van", texto: "El sistema funciona hasta que algo cambia. Entonces nadie adentro sabe tocarlo y quedas dependiendo del proveedor para siempre." },
      { titulo: "Los cursos explican y desaparecen", texto: "Tu equipo entiende el concepto pero nunca construyó nada con tus datos, tus procesos y tus casos raros. El lunes siguiente todo sigue igual." },
      { titulo: "Y el proceso sigue ahí", texto: "Alguien se sienta a las siete a pasar datos del correo a la hoja de cálculo. Termina a las diez. Mañana, lo mismo." },
    ],
  },
  fases: {
    badge: "Cómo trabajamos",
    titulo: "Construimos al lado de tu equipo. Y les transferimos la operación antes de salir.",
    sub: "Salir es parte del contrato, no un accidente. Cobramos por lo entregado, no por horas trabajadas.",
    items: [
      {
        numero: "01",
        titulo: "Discovery pagado",
        texto: "Levantamos el proceso como funciona de verdad, no como está en el manual. Contrastamos las reglas que nos cuentan contra tus datos reales. Sin esto no escribimos una línea de código.",
        puntos: ["Levantamos el proceso con quien lo hace", "Contrastamos las reglas contra tus datos", "Sale con alcance y precio cerrado"],
      },
      {
        numero: "02",
        titulo: "Construcción",
        texto: "Precio cerrado, definido en el discovery. El alcance se diseña para entregar en semanas. Tu equipo participa: cuando el sistema esté listo, ya lo conocen.",
        puntos: ["Precio cerrado, sin reloj corriendo", "Alcance diseñado para caber en semanas", "Tu equipo participa en la construcción"],
      },
      {
        numero: "03",
        titulo: "Traspaso y operación",
        texto: "Tu equipo opera el sistema. Acompañamos mientras haga falta y ajustamos lo que el uso real vaya pidiendo. El objetivo es que no nos necesites.",
        puntos: ["Entrenamos a quien lo va a operar", "Ajustamos lo que el uso real pida", "El objetivo es que no nos necesites"],
      },
    ],
  },
  automatizamos: {
    badge: "Qué automatizamos",
    titulo: "Procesos documentales de alto volumen.",
    sub: "Datos que viajan por correo y alguien copia a mano. Si tu proceso se parece a esto, hay algo que automatizar.",
    lienzo: "Flujo de ejemplo",
    nodos: [
      { id: "correo", titulo: "Correo nuevo", detalle: "Llega un adjunto" },
      { id: "leer", titulo: "Leer adjunto", detalle: "PDF, Excel o imagen" },
      { id: "extraer", titulo: "Extraer datos", detalle: "Campos que definimos juntos" },
      { id: "validar", titulo: "Validar reglas", detalle: "Las reglas de tu negocio" },
      { id: "hoja", titulo: "Escribir en la hoja", detalle: "Si todo cuadra" },
      { id: "borrador", titulo: "Borrador para revisar", detalle: "Si algo no cuadra" },
    ],
    nota: "El sistema produce borradores que una persona revisa. Si un flujo no debe salir solo, lo diseñamos para que no salga solo.",
    procesos: [
      "Facturas de proveedor que llegan por correo",
      "Cotizaciones que se arman a mano",
      "Datos que se copian de un correo a una hoja",
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
    pregunta: "Sumando a todas las personas que hoy tocan el proceso, ¿cuántas horas a la semana se van en hacerlo, y qué perfil las hace?",
    respuesta: [
      "Si la respuesta pasa de 40 horas semanales, hay un proyecto.",
      "Si no llegas, te lo decimos en la primera conversación y no te cotizamos nada.",
    ],
    cta: "Cuéntanos tu proceso",
  },
  porQue: {
    titulo: "¿Por qué nosotros y no una agencia?",
    admision: "Somos dos personas y no somos los más baratos. Pero el sistema queda funcionando y tu equipo sabe operarlo.",
    items: [
      { titulo: "Te transferimos la operación", texto: "Tu equipo queda capaz de mantener y ajustar el sistema. No vendemos dependencia." },
      { titulo: "Discovery pagado, no diagnóstico gratis", texto: "Cobramos desde la primera hora porque el levantamiento es el trabajo, no la venta. Si el proyecto no se justifica, te lo decimos." },
      { titulo: "Precio cerrado por el sistema", texto: "Sabes cuánto cuesta antes de arrancar. Sin reloj corriendo ni sorpresas a mitad del proyecto." },
      { titulo: "Los dos socios, en cada proyecto", texto: "Martín y Santiago trabajan juntos en todo lo que sale de Daxlo. No hay un junior aprendiendo con tu operación." },
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
      nombre: "Coaching 1 a 1",
      tono: "cyan",
      preguntas: [
        { p: "¿Necesito saber de tecnología?", r: "No. Arrancamos desde tu nivel, sea cual sea, y con tus propios casos." },
        { p: "¿Cómo son las sesiones?", r: "Por videollamada, uno a uno. Trabajas sobre algo tuyo y sales de la sesión con eso avanzado." },
        { p: "¿Cuántas sesiones necesito?", r: "Depende de lo que quieras lograr. Puede ser una sola o un plan de varias semanas. Lo definimos en la primera llamada." },
        { p: "¿Puedo elegir cualquier tema?", r: "Sí. Claude, ChatGPT, automatizaciones, análisis de datos, contenido, páginas web. Si tu tema no está en la lista, también lo trabajamos." },
        { p: "¿Cómo se paga?", r: "Nequi, Daviplata, transferencia o tarjeta." },
      ],
    },
    {
      nombre: "Consultoría de implementación",
      tono: "blue",
      preguntas: [
        { p: "¿Cuánto cuesta un proyecto?", r: "Depende del proceso. El precio se cierra en el discovery, cuando ya sabemos qué hay que construir, y no se mueve después. Lo conversamos en la primera llamada." },
        { p: "¿Por qué el discovery se paga?", r: "Porque es trabajo, no una visita comercial. Levantamos el proceso real, revisamos tus datos y encontramos las contradicciones entre lo que dice el manual y lo que pasa de verdad. De ahí sale el alcance y el precio cerrado." },
        { p: "¿Cuánto se demora un proyecto?", r: "Semanas, no trimestres. Preferimos entregar un proceso funcionando y después ampliar, que prometer todo y entregar en seis meses." },
        { p: "¿Qué pasa cuando ustedes se van?", r: "Tu equipo opera el sistema. Construimos con ellos al lado justamente para que no queden dependiendo de nosotros. Después acompañamos la operación mientras haga falta." },
        { p: "¿El sistema toma decisiones solo?", r: "Solo si tiene sentido que las tome. Por defecto diseñamos sistemas que producen borradores y una persona revisa antes de que algo salga. Dónde va ese control lo definimos contigo." },
        { p: "¿Y si mi proceso no da para un proyecto?", r: "Te lo decimos en la primera conversación y no te cotizamos nada. En ese caso el coaching 1 a 1 suele resolver más por menos." },
      ],
    },
  ],
};

export const agendar = {
  badge: "Agendar",
  titulo: "Cuéntanos qué te está consumiendo horas.",
  sub: "Una primera conversación sin costo. Te decimos cuál de las dos te sirve. Y si no te sirve ninguna, también te lo decimos.",
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
  },
  enviar: "Agendar la conversación",
  enviando: "Enviando…",
  meta: "Sin costo · Te contactamos por WhatsApp",
  exito: { titulo: "Listo. Nos pondremos en contacto.", texto: "Te escribimos por WhatsApp para coordinar la conversación.", duplicado: "Ya recibimos tus datos. Te escribimos por WhatsApp pronto.", whatsapp: "Escríbenos directo por WhatsApp" },
  errores: {
    linea: "Dinos qué te interesa.",
    nombre: "Cuéntanos tu nombre.",
    whatsapp: "Necesitamos tu WhatsApp para contactarte.",
    correo: "Necesitamos tu correo.",
    correoFormato: "Revisa el formato del correo.",
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
};

// ------------------------------------------------------ ENTRE PÁGINAS

// Al final de cada línea, un puente hacia la otra por si el visitante entró
// por la puerta equivocada.
export const otraLinea = {
  consultoria: {
    etiqueta: "Para tu empresa",
    titulo: "¿El trabajo pasa por varias personas?",
    texto: "Si entre todos los que lo tocan se van más de 40 horas semanales, eso es un proyecto de consultoría. Lo construimos con tu equipo al lado.",
    enlace: "Ver la consultoría de implementación",
  },
  coaching: {
    etiqueta: "Para ti",
    titulo: "¿Es un trabajo que haces tú solo?",
    texto: "Si el proceso no da para un proyecto, el coaching 1 a 1 suele resolver más por menos. Construyes tú, con nosotros en la llamada.",
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
  sub: "Una primera conversación sin costo. Te decimos cuál de las dos te sirve, y si no te sirve ninguna, también.",
  cta: "Agendar una conversación",
};

export const inicioNosotros = {
  enlace: "Conoce a los dos socios",
};

export const franjaEnlace = "Qué hacemos con cada una";

