import { onMounted, onUnmounted, ref } from "vue";

/** Ширина окна. До монтирования (SSR) равна 0; слушатель снимается автоматически. */
export function useScreenWidth() {
  const screenWidth = ref(0);

  const update = (): void => {
    screenWidth.value = window.innerWidth;
  };

  onMounted(() => {
    update();
    window.addEventListener("resize", update, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener("resize", update);
  });

  return { screenWidth };
}
