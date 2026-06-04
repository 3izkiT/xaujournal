import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }> = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/login", priority: 0.5, changeFrequency: "monthly" },
    { path: "/register", priority: 0.7, changeFrequency: "monthly" },
    { path: "/pricing", priority: 0.8, changeFrequency: "weekly" },
    { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
  ];
  const now = new Date();

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
