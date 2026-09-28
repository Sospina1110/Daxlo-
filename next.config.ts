import type { NextConfig } from "next";

// Exportacion estatica: `next build` deja el sitio listo en `out/`, que es lo
// que Cloudflare Pages publica. Igual que Framer, el HTML sale pre-renderizado
// y React lo hidrata en el navegador.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
