import type { Metadata } from "next";

const SITE_NAME = "PantyHub";
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

interface SeoOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
  noIndex?: boolean;
}

/**
 * Generate Next.js Metadata object with SEO best practices.
 * Use in page-level `generateMetadata` functions.
 */
export function generateSeoMetadata(options: SeoOptions): Metadata {
  const {
    title,
    description,
    path = "",
    image,
    type = "website",
    article,
    noIndex = false,
  } = options;

  const url = `${SITE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      locale: "en_US",
      ...(image && {
        images: [
          {
            url: image.startsWith("http") ? image : `${SITE_URL}${image}`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
      ...(article && {
        publishedTime: article.publishedTime,
        modifiedTime: article.modifiedTime,
        authors: article.author ? [article.author] : undefined,
        tags: article.tags,
      }),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: fullTitle,
      description,
      ...(image && {
        images: [image.startsWith("http") ? image : `${SITE_URL}${image}`],
      }),
    },
  };

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

/**
 * Generate a simple page title for use with the title template.
 */
export function pageTitle(title: string): string {
  return `${title} | ${SITE_NAME}`;
}

/**
 * Truncate a string for meta descriptions (max 160 chars).
 */
export function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + "...";
}
