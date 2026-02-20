/**
 * Theme configuration derived from blueprint design tokens.
 */

export type ThemeMode = "dark" | "light";

export interface ThemeConfig {
  productName: string;
  defaultMode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  borderRadius: string;
}

export const themeConfig: ThemeConfig = {
  productName: "PantyHub",
  defaultMode: "dark",
  primaryColor: "#660033",
  secondaryColor: "#330033",
  borderRadius: "0.3",
};

/**
 * Resolve the effective mode, respecting system preference if needed.
 */
export function resolveMode(stored: ThemeMode | null): ThemeMode {
  if (stored) return stored;
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "dark";
}
