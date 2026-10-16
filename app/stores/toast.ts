import { defineStore } from "pinia";

export type ToastType = "success" | "error" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let nextId = 0;

export const useToastStore = defineStore("toast", {
  state: () => ({
    toasts: [] as Toast[],
  }),

  actions: {
    addToast(message: string, type: ToastType = "success") {
      const id = ++nextId;
      this.toasts.push({ id, message, type });
      setTimeout(() => {
        this.toasts = this.toasts.filter((t) => t.id !== id);
      }, 3000);
    },
  },
});
