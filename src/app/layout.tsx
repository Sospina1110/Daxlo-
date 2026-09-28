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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* Red de seguridad: el contenido animado sale del HTML invisible y lo
            revela JavaScript. Si un archivo JS no carga (red móvil inestable),
            a los 3,5 s se fuerza todo visible para que la página nunca quede en blanco. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "setTimeout(function(){if(!document.documentElement.dataset.hidratado){document.documentElement.classList.add('forzar-visible')}},3500)",
          }}
        />
        <noscript>
          <style>{"[style*=opacity]{opacity:1!important;transform:none!important;filter:none!important}"}</style>
        </noscript>
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
