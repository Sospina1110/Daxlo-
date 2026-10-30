// GLSL de la cinta de luz del hero (WebGL 1, sin librerías).
//
// Un triángulo que cubre todo el lienzo y este fragment shader. Todo se mide
// en px CSS con la y hacia abajo, igual que el DOM: así los rectángulos de
// texto que mide el motor (src/lib/cinta/motor.ts) se usan tal cual.
//
// Capas, de atrás hacia delante:
// 1. Los dos resplandores de esquina del hero (la misma fórmula que glow() en
//    src/lib/utils.ts). Con WebGL los pinta el shader, no el CSS, para que el
//    tope de contraste los cuente.
// 2. Tres láminas de seda: una trasera ancha y tenue, la principal y un
//    filamento fino. Cada una ondula, se tuerce (el pliegue brillante cruza la
//    banda) y respira de ancho.
// 3. La luz del puntero sobre la seda, grano fino y estrellas en lo oscuro.
//
// Zonas de lectura: el motor pasa hasta MAX_ZONAS rectángulos (cada línea de
// texto del hero y la barra; si no caben, líneas vecinas del mismo texto
// fusionadas en una caja) con el tope de luminancia que puede tener el fondo
// detrás. Cerca del texto la cinta pierde los brillos cian y menta (queda en
// azul) y la alfa se recorta por bisección hasta no pasar el tope. El
// recorte es suave (mínimo suave), para que no se vean cajas.
//
// Las fases llegan ya calculadas y reducidas a 0..2π desde la CPU: el bucle
// no tiene costura y la precisión no se degrada con el tiempo.

// Cuántas zonas de lectura recibe el shader. El motor y el GLSL leen este
// mismo valor, así que no se desincronizan. Con 12, el shader usa unos 19
// vectores de uniformes de fragmento; WebGL 1 garantiza 16 y los teléfonos
// reportan 64 o más, así que hay margen, pero no conviene subirlo sin medir.
export const MAX_ZONAS = 12;

export const VERTICE = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

export const FRAGMENTO = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;      // tamaño del lienzo en px CSS
uniform float uEsc;     // px del búfer por px CSS
uniform vec4 uLinea;    // trayectoria: x0, x1, y0, y1 (px CSS)
uniform vec4 uFase;     // lámina principal: onda, onda 2, giro, respiración
uniform vec4 uFaseB;    // lámina trasera
uniform vec4 uPtr;      // puntero: x, y, influencia 0..1, energía 0..1
uniform vec3 uMov;      // amplitud (despertar), scroll 0..1, fase de las estrellas
uniform vec2 uDesp;     // paralaje extra (px) que sigue al puntero
uniform vec4 uR[${MAX_ZONAS}];    // rectángulos de lectura (x0, y0, x1, y1)
uniform float uC[${MAX_ZONAS}];   // tope de luminancia de cada uno (< 0: titular en degradado)
uniform vec4 uGrad;     // caja del titular en degradado (x, y, ancho, alto)
uniform vec4 uGlowA;    // resplandor cian: cx, cy, radio, alfa
uniform vec4 uGlowB;    // resplandor azul
uniform float uFalda;   // ancho del borde suave de las zonas de lectura (px)

const vec3 INK = vec3(13., 14., 20.) / 255.;
// Fondo para calcular el tope: el casi negro con un cruce de la rejilla
// encima (dos líneas de blanco al 3,5 %), el peor caso de lo que queda
// debajo del lienzo.
const vec3 FONDO = vec3(29.7, 30.6, 36.3) / 255.;
const vec3 AZUL = vec3(27., 53., 208.) / 255.;
const vec3 AZULV = vec3(61., 90., 255.) / 255.;
const vec3 CIAN = vec3(41., 196., 245.) / 255.;
const vec3 CIANC = vec3(122., 215., 255.) / 255.;
const vec3 MENTA = vec3(226., 243., 238.) / 255.;
const float TAU = 6.2831853;

float h21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float sdBox(vec2 p, vec4 r) {
  vec2 c = 0.5 * (r.xy + r.zw);
  vec2 b = 0.5 * (r.zw - r.xy);
  vec2 d = abs(p - c) - b;
  return length(max(d, 0.)) + min(max(d.x, d.y), 0.);
}

vec3 lineal(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(vec3(0.04045), c));
}

float lum(vec3 c) {
  return dot(lineal(clamp(c, 0., 1.)), vec3(0.2126, 0.7152, 0.0722));
}

// Tope detrás del titular en degradado: el fondo tiene que dar 3,3:1 contra
// el color del degradado en ese punto (100deg: cian, #7ad7ff al 35 %, azul
// vivo al final). Lo cian aguanta más luz que la punta azul.
float topeDegradado(vec2 p) {
  vec2 dir = vec2(0.98481, 0.17365);
  float largo = uGrad.z * 0.98481 + uGrad.w * 0.17365;
  float t = clamp(dot(p - (uGrad.xy + 0.5 * uGrad.zw), dir) / max(largo, 1.) + 0.5, 0., 1.);
  vec3 col = t < 0.35 ? mix(CIAN, CIANC, t / 0.35) : mix(CIANC, AZULV, (t - 0.35) / 0.65);
  return max(0.004, (lum(col) + 0.05) / 3.3 - 0.05);
}

// Alfa de un resplandor de glow(): radial-gradient(closest-side, a 0%,
// 0,6a 40%, 0,18a 72%, 0 100%).
float resplandor(vec2 p, vec4 g) {
  if (g.z <= 0.) return 0.;
  float r = length(p - g.xy) / g.z;
  float k = r < 0.4 ? mix(1., 0.6, r / 0.4) : (r < 0.72 ? mix(0.6, 0.18, (r - 0.4) / 0.32) : mix(0.18, 0., clamp((r - 0.72) / 0.28, 0., 1.)));
  return g.w * k;
}

// Una lámina de seda. Devuelve (intensidad, cobertura).
vec2 lamina(vec2 p, float ancho, float amp, vec4 f, float brillo, float dy, float desf) {
  float W = uRes.x;
  float H = uRes.y;
  float s = p.x / W;
  float uu = clamp((p.x - uLinea.x) / (uLinea.y - uLinea.x), 0., 1.);
  float base = mix(uLinea.z, uLinea.w, uu * uu * (3. - 2. * uu)) + dy * H - uMov.y * 0.08 * H;
  float pend = (uLinea.w - uLinea.z) * 6. * uu * (1. - uu) / (uLinea.y - uLinea.x);
  float c = base + amp * uMov.x * H * (sin(TAU * 0.75 * s - f.x) + 0.38 * sin(TAU * 1.65 * s + f.y + 1.3) + 0.22 * sin(TAU * 0.31 * s - f.w + desf));
  // Se inclina hacia el puntero, con caída gaussiana a lo largo.
  float sig = max(0.2 * W, 140.);
  float dx = p.x - uPtr.x;
  float g = exp(-dx * dx / (2. * sig * sig));
  c += clamp((uPtr.y - c) * 0.45, -0.16 * H, 0.16 * H) * uPtr.z * g;
  float n = (p.y - c) / sqrt(1. + pend * pend);
  float w = ancho * H * (0.78 + 0.3 * sin(TAU * 0.55 * s + f.w + desf));
  // Giro de la seda; moverse rápido cerca la tuerce más.
  float th = TAU * 0.85 * s + f.z + desf * 2. + uPtr.w * 1.4 * g;
  float ct = cos(th);
  float st = sin(th);
  float wa = w * (0.28 + 0.72 * abs(ct));
  float u = n / wa;
  float cuerpo = smoothstep(1., 0.25, abs(u));
  float pliegue = pow(max(0., 1. - abs(u - 0.55 * st)), 7.) * (0.55 + 0.45 * abs(st));
  float q = (abs(u) - 0.85) / 0.14;
  float borde = exp(-q * q) * 0.25;
  float halo = exp(-abs(n) / (w * 1.6)) * 0.22;
  // Sombreado por lado de la tela. Con sign(ct) cambiaba de golpe donde la
  // seda queda de canto y se veían cortes verticales: va con una rampa suave.
  float lado = 0.55 + 0.45 * (u * 0.5 + 0.5) * clamp(ct * 3., -1., 1.);
  float I = cuerpo * (0.42 * lado + 0.25) + pliegue * (0.9 + 0.5 * uPtr.w * g) + borde + halo;
  float ext = smoothstep(-0.06, 0.04, s) * smoothstep(1.1, 0.96, s);
  return vec2(I * ext * brillo, clamp(cuerpo + halo, 0., 1.) * ext);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uEsc - gl_FragCoord.y) / uEsc;
  float W = uRes.x;
  float H = uRes.y;

  // Paralaje: cada lámina se corre distinto según dónde está el puntero.
  vec2 par = (uPtr.xy - 0.5 * uRes) * uPtr.z;
  vec2 A = lamina(p + par * 0.02 - uDesp * 0.5, 0.30, 0.12, uFaseB, 0.42, 0.05, 2.1);
  vec2 B = lamina(p - par * 0.035 - uDesp, 0.15, 0.10, uFase, 1., 0., 0.);
  vec2 C = lamina(p - par * 0.05 - uDesp * 1.3, 0.022, 0.095, uFase + vec4(0.35, 0.2, 0.5, 0.3), 0.75, -0.035, 0.35);
  float I = A.x * 0.55 + B.x + C.x * 0.8;
  float tela = clamp(A.y + B.y, 0., 1.);

  // Zonas de lectura. El tope baja de forma geométrica (c elevado a w), no
  // lineal: así la seda se oscurece de a poco al acercarse al texto y no
  // queda una caja oscura pegada a las letras.
  float tope = 1.;
  float prox = 0.;
  for (int i = 0; i < ${MAX_ZONAS}; i++) {
    // 6 px de margen plano: el búfer va a menos resolución que la pantalla y
    // al agrandarlo mezcla píxeles vecinos.
    float d = sdBox(p, uR[i]) - 6.;
    float w = 1. - smoothstep(0., uFalda, d);
    if (w > 0.) {
      float c = uC[i] < 0. ? topeDegradado(p) : uC[i];
      tope = min(tope, exp(w * log(c)));
      prox = max(prox, w);
    }
  }

  // Luz del puntero: fuerte sobre la seda, un halo tenue en lo oscuro.
  float dp = length(p - uPtr.xy);
  float r = 0.17 * min(W, H) + 60.;
  float luz = uPtr.z * (0.4 * exp(-dp * dp / (2. * r * r)) * tela + 0.06 * exp(-dp * dp / (8. * r * r)));
  float lejos = 1. - prox;
  I += luz * lejos;
  I *= mix(1., 0.62, prox);

  // Color por intensidad: azul de marca, azul vivo, cian y menta en el pico.
  vec3 col = mix(AZUL, AZULV, smoothstep(0.15, 0.55, I));
  col = mix(col, CIAN, smoothstep(0.5, 0.95, I) * lejos);
  col = mix(col, MENTA, smoothstep(1., 1.45, I) * 0.85 * lejos);
  float a = clamp(I * 1.05, 0., 1.);
  float gr = h21(floor(p));
  a = clamp(a + (gr - 0.5) * 0.08 * a, 0., 1.);
  a *= smoothstep(H * 0.98, H * 0.72, p.y);

  // Pila premultiplicada: resplandores debajo, la seda encima.
  float ga = resplandor(p, uGlowA);
  float gb = resplandor(p, uGlowB);
  vec3 pc = CIAN * ga;
  float pa = ga;
  pc = AZUL * gb + pc * (1. - gb);
  pa = gb + pa * (1. - gb);
  vec3 rc = col * a + pc * (1. - a);
  float ra = a + pa * (1. - a);

  // Tope de contraste: el mayor factor m (hasta 2, virtual) con el que la
  // capa compuesta sobre el fondo no pasa el tope; luego un mínimo suave
  // entre 1 y m, que nunca pasa de m.
  float m = 1.;
  if (tope < 0.999) {
    float lo = 0.;
    float hi = 2.;
    for (int k = 0; k < 9; k++) {
      float mm = 0.5 * (lo + hi);
      if (lum(rc * mm + FONDO * (1. - ra * mm)) > tope) hi = mm; else lo = mm;
    }
    float kk = 0.06;
    m = min(1., lo) - kk * log(1. + exp(-abs(1. - lo) / kk));
    m = clamp(m, 0., 1.);
  }

  // Estrellas fijas que titilan lento, solo en lo oscuro y lejos del texto.
  float est = step(0.9972, h21(floor(p) + 17.)) * (0.22 + 0.22 * sin(uMov.z + gr * 40.));
  est *= (1. - ra * m) * smoothstep(H * 0.95, H * 0.35, p.y) * step(0.995, tope);

  gl_FragColor = vec4(rc * m + vec3(est), min(1., ra * m + est));
}
`;
