import type { MetadataRoute } from "next";

// Add your public marketing pages here.
// Authenticated app pages should NOT be in the sitemap.
const PUBLIC_PAGES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/auth/login", priority: 0.4, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const now = new Date();

  return PUBLIC_PAGES.map(({ path, priority, changeFrequency }) => ({
    url: `${appUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}

// Metadata for og:image and Twitter card
export const metadata = {
  title: "PantyHub",
  siteName: "PantyHub",
  // Update appUrl in .env.local: NEXT_PUBLIC_APP_URL=https://pantyhub.com
};
