import { useState, useCallback } from "react";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

let toastId = 0;
const toasts: Toast[] = [];
const listeners: Array<() => void> = [];

export function useToast() {
  const [, setState] = useState(0);

  const notify = useCallback(() => {
    setState((s) => s + 1);
    listeners.forEach((listener) => listener());
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "default" }: Omit<Toast, "id">) => {
      const id = `toast-${toastId++}`;
      toasts.push({ id, title, description, variant });
      notify();
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        const index = toasts.findIndex((t) => t.id === id);
        if (index > -1) {
          toasts.splice(index, 1);
          notify();
        }
      }, 3000);
    },
    [notify]
  );

  return {
    toast,
    toasts,
  };
}

