import { defineStore } from "pinia";

// Формат совпадает с форматом flatpickr ("d M Y" и "H:i"), поэтому дефолт корректно разбирается.
const formatDate = (d: Date): string =>
  d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (d: Date): string =>
  d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

export const useRentalStore = defineStore("rental", {
  state: () => {
    const now = new Date();
    const slot = () => ({
      location: "Moscow",
      date: formatDate(now),
      time: formatTime(now),
    });

    return {
      pickup: slot(),
      dropoff: slot(),
    };
  },
  persist: {
    key: "rental-v2", // смена схемы/формата даты не ломает старые сохранённые данные
  },
});
