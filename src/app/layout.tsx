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
const SCRIPT_APARICIONES = `(function(){
var d=document.documentElement;
if(!('IntersectionObserver' in window)){d.classList.remove('js');return;}
var io=new IntersectionObserver(function(es){es.forEach(function(e){
if(!e.isIntersecting)return;var el=e.target;io.unobserve(el);
var p=el.parentElement;
if(p&&p.hasAttribute('data-escalonar')){
var hs=[].filter.call(p.children,function(c){return c.hasAttribute('data-revelar')});
el.style.setProperty('--retraso',(hs.indexOf(el)*(parseFloat(p.getAttribute('data-escalonar'))||0.09))+'s');}
el.setAttribute('data-visible','');
});},{rootMargin:'0px 0px -6% 0px'});
function observar(r){[].forEach.call(r.querySelectorAll('[data-revelar]:not([data-visible])'),function(el){io.observe(el)});}
observar(document);
new MutationObserver(function(ms){ms.forEach(function(m){[].forEach.call(m.addedNodes,function(n){
if(n.nodeType!==1)return;
if(n.hasAttribute('data-revelar')&&!n.hasAttribute('data-visible'))io.observe(n);
observar(n);});});}).observe(document.body,{childList:true,subtree:true});
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* Corre antes de pintar: marca que hay JavaScript (el CSS de las
            apariciones solo oculta contenido bajo .js). Y red de seguridad: lo
            poco que todavía anima Motion espera a React; si React no hidrata
            en 3,5 s, se fuerza visible. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_CABECERA }} />
        <noscript>
          <style>{"[style*=opacity]{opacity:1!important;transform:none!important;filter:none!important}"}</style>
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
