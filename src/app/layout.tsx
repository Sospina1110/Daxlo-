import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

// Las dos fuentes de marca. next/font las descarga al compilar y las sirve
// desde el propio sitio: no hay petición a Google en cada visita.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-outfit", display: "swap" });

const titulo = "Daxlo · Implementamos la IA. Transferimos la capacidad.";
const descripcion =
  "Coaching 1 a 1 para resolver tu propio trabajo con IA, y consultoría de implementación para automatizar un proceso de tu empresa. En los dos casos quedas sabiendo cómo funciona.";

export const metadata: Metadata = {
  metadataBase: new URL("https://daxlo.co"),
  title: titulo,
  description: descripcion,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: "Daxlo",
    title: titulo,
    description: "Dos formas de trabajar con nosotros: coaching 1 a 1 para tu propio trabajo, o consultoría de implementación para un proceso de tu empresa.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Daxlo. Implementamos la IA. Transferimos la capacidad." }],
  },
  twitter: { card: "summary_large_image", title: titulo, description: descripcion, images: ["/og.png"] },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0e14",
  colorScheme: "dark",
};

const SCRIPT_CABECERA = [
  "document.documentElement.classList.add('js');",
  "setTimeout(function(){if(!document.documentElement.dataset.hidratado){document.documentElement.classList.add('forzar-visible')}},3500);",
].join("");

// Sin IntersectionObserver (navegadores muy viejos) se quita .js y todo queda
// visible. El MutationObserver cubre nodos que React cree después.
//
// Tres trabajos:
// 1. Revela cada [data-revelar] al entrar en pantalla.
// 2. Respaldo para Safari: con frames lentos y scroll rápido, un bloque puede
//    pasar de abajo a arriba de la pantalla entre dos frames sin contar nunca
//    como visible, y se quedaba oculto. Al hacer scroll se revela todo lo que
//    ya quedó por encima del borde inferior.
// 3. Pausa las animaciones infinitas (.animate-*) fuera de pantalla: marca
//    [data-pausa] y el CSS las detiene. Corriendo todas a la vez mantenían el
//    celular trabajando aunque nadie tocara la página.
const SCRIPT_APARICIONES = `(function(){
var d=document.documentElement;
if(!('IntersectionObserver' in window)){d.classList.remove('js');return;}
function revelar(el){
var p=el.parentElement;
if(p&&p.hasAttribute('data-escalonar')){
var hs=[].filter.call(p.children,function(c){return c.hasAttribute('data-revelar')});
el.style.setProperty('--retraso',(hs.indexOf(el)*(parseFloat(p.getAttribute('data-escalonar'))||0.09))+'s');}
el.setAttribute('data-visible','');}
var io=new IntersectionObserver(function(es){es.forEach(function(e){
if(!e.isIntersecting)return;io.unobserve(e.target);revelar(e.target);
});},{rootMargin:'0px 0px -6% 0px'});
var espera=0;
addEventListener('scroll',function(){if(espera)return;espera=setTimeout(function(){espera=0;var limite=innerHeight*0.94;
[].forEach.call(document.querySelectorAll('[data-revelar]:not([data-visible])'),function(el){
if(el.getBoundingClientRect().top<limite){io.unobserve(el);revelar(el);}});},200);},{passive:true});
var A='.animate-flow,.animate-breathe,.animate-float,.animate-marquee,.animate-marquee-reverse,.animate-ping,.animate-paseo,.animate-caret';
var ia=new IntersectionObserver(function(es){es.forEach(function(e){
if(e.isIntersecting)e.target.removeAttribute('data-pausa');else e.target.setAttribute('data-pausa','');
});},{rootMargin:'100px'});
function observar(r){
[].forEach.call(r.querySelectorAll('[data-revelar]:not([data-visible])'),function(el){io.observe(el)});
[].forEach.call(r.querySelectorAll(A),function(el){ia.observe(el)});}
observar(document);
new MutationObserver(function(ms){ms.forEach(function(m){[].forEach.call(m.addedNodes,function(n){
if(n.nodeType!==1)return;
if(n.hasAttribute('data-revelar')&&!n.hasAttribute('data-visible'))io.observe(n);
if(n.matches(A))ia.observe(n);
observar(n);});});}).observe(document.body,{childList:true,subtree:true});
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* Corre antes de pintar: marca que hay JavaScript (el CSS de las
            apariciones solo oculta contenido bajo .js). Y red de seguridad: lo
            poco que todavía arranca oculto por Motion (marcado con
            data-motion-oculto) espera a React; si React no hidrata en 3,5 s,
            se fuerza visible. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_CABECERA }} />
        <noscript>
          <style>{"[data-motion-oculto] [style*=opacity]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
        {/* Revela cada bloque [data-revelar] al entrar en pantalla. Corre apenas
            se lee el HTML, sin esperar a que cargue React. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_APARICIONES }} />
      </body>
    </html>
  );
}
