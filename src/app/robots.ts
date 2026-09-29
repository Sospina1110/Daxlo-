import type { MetadataRoute } from "next";
import { URL_SITIO } from "@/lib/sitio";

// Se genera como /robots.txt al compilar.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${URL_SITIO}/sitemap.xml`,
  };
}
