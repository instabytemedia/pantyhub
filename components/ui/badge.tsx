import type { HTMLAttributes } from "react";

export type BadgeVariant = "default" | "secondary" | "outline" | "destructive" | "success";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary/10 text-secondary border-secondary/20",
  outline: "bg-transparent text-foreground border-border",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  success: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-normal transition-colors duration-200 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
