import type { MetadataRoute } from "next";
import { ALL_PAGES } from "@/lib/docs";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://docs.orvyn.cash/", priority: 1 }, ...ALL_PAGES.map((p) => ({ url: `https://docs.orvyn.cash/${p.slug}`, priority: 0.7 }))];
}
