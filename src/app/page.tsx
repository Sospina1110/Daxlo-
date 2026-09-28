import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { Comparacion, DosFormas, FranjaHerramientas } from "@/components/sections/intro";
import { ZonaCoaching } from "@/components/sections/coaching";
import { Herramientas } from "@/components/sections/herramientas";
import { ZonaConsultoria } from "@/components/sections/consultoria";
import { Agendar, Faq, Nosotros } from "@/components/sections/cierre";
import { Footer } from "@/components/sections/footer";

// Orden de la página. Coaching va primero y consultoría después, cada una en
// su propio territorio visual. Las herramientas quedan entre las dos: son lo
// que se enseña en coaching y con lo que se construye en consultoría.
export default function Inicio() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <FranjaHerramientas />
        <DosFormas />
        <Comparacion />
        <ZonaCoaching />
        <Herramientas />
        <ZonaConsultoria />
        <Nosotros />
        <Faq />
        <Agendar />
      </main>
      <Footer />
    </>
  );
}
