"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";

export type ToastVariant = "default" | "success" | "error" | "warning";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, variant?: ToastVariant) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  default: "bg-card border-border text-foreground",
  success: "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400",
  error: "bg-destructive/10 border-destructive/30 text-destructive",
  warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant = "default") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 rounded-none border px-4 py-3 text-sm shadow-md animate-in fade-in duration-300 ${VARIANT_CLASSES[toast.variant]}`}
            role="alert"
          >
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 rounded p-0.5 hover:bg-muted/50"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): Pick<ToastContextValue, "addToast" | "removeToast"> {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return { addToast: ctx.addToast, removeToast: ctx.removeToast };
}
