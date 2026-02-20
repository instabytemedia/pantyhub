import { type LucideProps } from "lucide-react";
import * as LucideIcons from "lucide-react";

export type IconName = keyof typeof LucideIcons;

export interface IconProps extends Omit<LucideProps, "ref"> {
  /** Lucide icon name, e.g. "FileText", "User", "Settings" */
  name: IconName;
  /** Pixel size (applied to both width and height). Default: 20 */
  size?: number;
}

/**
 * Dynamic icon component — resolves a Lucide icon by name at runtime.
 *
 * Usage:
 *   <Icon name="FileText" size={24} className="text-primary" />
 */
export function Icon({ name, size = 20, ...props }: IconProps) {
  const LucideIcon = (LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>)[name];

  if (!LucideIcon) {
    // Fallback to a generic icon if name is invalid
    const Fallback = LucideIcons.HelpCircle;
    return <Fallback width={size} height={size} {...props} />;
  }

  return <LucideIcon width={size} height={size} {...props} />;
}
